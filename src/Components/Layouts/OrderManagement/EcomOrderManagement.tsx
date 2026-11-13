/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Printer,
  Search,
  Send,
  UserPlus,
} from "tabler-icons-react";
import dayjs from "dayjs";
import {
  ApolloQueryResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Button,
  Card,
  Checkbox,
  Group,
  Input,
  Modal,
  Table,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Text,
  Grid,
  ActionIcon,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { AssignOrderForm } from "../../Modules/Order/AssignOrderForm";
import {
  generatePDF,
  getOrder,
  getOrders,
  GetSubWarehouseTagging,
} from "../../../GraphQL/OrderManagementSchema";
import { CustomerSMSForm } from "../../Modules/Order/CustomerSMSForm";
import { VerificationForm } from "../../Modules/Order/VerificationForm";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import {
  formatCustomerAddress,
  formatCustomerDiscount,
  formatCustomerName,
  isRiderForCancel,
} from "../../../Utilities/Formatter";
import { ORDER, WMS } from "../../../GraphQL";
import { useStyles } from "./OrderManagement.styles";
import { usePagination } from "@mantine/hooks";
import { useRouter } from "next/router";
import { ManualOrder } from "../ManualOrder/Create";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { useAtom } from "jotai";
import { ActiveSMS } from "../MarketplaceSMS/ActiveSMS";
import { set } from "react-hook-form";

type FetchType = (fetch: { variables: ORDER.QueryOrdersArgs }) => void;
type ShowModalType = {
  assign: boolean;
  sms: boolean;
  verification: boolean;
  order: ORDER.Maybe<ORDER.Order>;
};

export const EcomOrderManagement = () => {
  const [userRoles] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const router = useRouter();
  // Classes
  const { classes } = useStyles();

  // Constants
  const BacklogStatuses = ["RECEIVED", "PROCESSED", "SHIPPED"];
  const dateFrom2020 = {
    from: dayjs().month(0).year(2020).format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  };
  const dateToday = {
    from: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  };
  const [isPaginate, setIsPaginate] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // References
  // const Backlogs = useRef<ORDER.Maybe<ORDER.Order>[]>([]);
  const Mounted = useRef(false);

  // States
  const [showModal, setShowModal] = useState<ShowModalType>({
    assign: false,
    sms: false,
    verification: false,
    order: {},
  });
  const [filters, setFilters] = useState({
    status: "BACKLOGS",
    date: dateToday,
  });
  const [Backlogs, setBacklogs] = useState<ORDER.Maybe<ORDER.Order>[]>([]);
  const [BacklogLoading, setBacklogLoading] = useState(false);
  const [warehouse, setWarehouse] = useState<string | undefined>();

  // Queries
  const {
    data: TaggingData,
    loading: TaggingLoading,
    error: TaggingError,
  } = useQuery(GetSubWarehouseTagging, {
    variables: {
      id: "SUB_WAREHOUSE_TAGGING",
      sort: "SWT",
    },
    context: { clientName: "order" },
  });
  const { refetch: BacklogQuery } = useQuery<{ orders: ORDER.OrderConnection }>(
    getOrders,
    { skip: true, context: { clientName: "order" } }
  );
  const { refetch: OrderQuery } = useQuery<{ order: ORDER.Order }>(getOrder, {
    skip: true,
    context: { clientName: "order" },
  });
  const [loadDays, { data: DayData, fetchMore, refetch: RefetchDay, loading }] =
    useLazyQuery<{ orders: ORDER.OrderConnection }>(getOrders, {
      context: { clientName: "order" },
    });
  const [selectedOrders, setSelectedOrders] = useState<
    ORDER.Maybe<ORDER.Order>[]
  >([]);
  const [generateInvoice, { loading: loadingPDF }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });

  useEffect(() => {
    if (router.isReady) {
      const wh =
        userRoles.isCSC ||
        // old roles
        userRoles.isEcomCSC
          ? `${userDetails.office_id}`
          : `${router.query.wh || "PH01"}`;
      setWarehouse(wh);
      setFilters({
        status: `${router.query.status || "BACKLOGS"}`,
        date: router.query.dateFrom
          ? { from: `${router.query.dateFrom}`, to: `${router.query.dateTo}` }
          : dateToday,
      });
      const date = router.query.dateFrom
        ? { from: `${router.query.dateFrom}`, to: `${router.query.dateTo}` }
        : dateToday;
      loadBackLogs(wh);
      loadDays({
        variables: {
          warehouse_id: wh,
          date_filter: date,
        },
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    // If new value of next token, fetch more orders
    if (DayData?.orders?.next_token) {
      fetchMore({
        variables: {
          warehouse_id: warehouse,
          date_filter: router.query.dateFrom
            ? { from: `${router.query.dateFrom}`, to: `${router.query.dateTo}` }
            : dateToday,
          next_token: DayData.orders.next_token,
        },
      });
    }
  }, [DayData?.orders?.next_token, warehouse, fetchMore]);

  const loadBackLogs = (warehouse: string | undefined) => {
    setBacklogLoading(true);
    Promise.all(
      BacklogStatuses.map((status) => {
        return BacklogQuery({
          order_status: status,
          warehouse_id: warehouse,
          date_filter: dateFrom2020,
          next_token: "",
        });
      })
    )
      .then((dataLogs) => {
        setBacklogs(() => []);
        dataLogs.forEach(({ data }, i) => {
          setBacklogs((prev) => [
            ...(prev || []),
            ...(data?.orders?.items || []),
          ]);
          if (data?.orders?.next_token)
            getNextOrders(
              BacklogStatuses[i],
              warehouse,
              data.orders.next_token
            );
        });
        if (dataLogs.findIndex(({ data }) => data?.orders?.next_token) < 0)
          setBacklogLoading(false);
      })
      .catch(console.error);
  };

  const getNextOrders = async (
    order_status: string,
    warehouse_id: string | undefined,
    next_token: string
  ) => {
    const { data } = await BacklogQuery({
      order_status,
      warehouse_id,
      date_filter: dateFrom2020,
      next_token,
    });
    setBacklogs((prev) => [...(prev || []), ...(data?.orders?.items || [])]);
    if (data?.orders?.next_token)
      getNextOrders(order_status, warehouse_id, data.orders.next_token);
    setBacklogLoading(false);
  };

  // Functions

  const formatOrderToday = (
    list: ORDER.Maybe<ORDER.Maybe<ORDER.Order>[]> | undefined
  ) => {
    return list;
    // ?.filter((e) => dayjs(Number(e?.date_updated ?  e?.date_updated : e?.date_created)).format("MM-DD-YYYY") === dayjs().format("MM-DD-YYYY"))
  };

  const filterOrders = () => {
    switch (filters.status) {
      case "BACKLOGS":
        return Backlogs.filter(
          (e) =>
            dayjs(Number(e?.date_created)).format("MM-DD-YYYY") !==
            dayjs().format("MM-DD-YYYY")
        );
      case "RECEIVED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) => item?.order_status === "RECEIVED"
        );
      case "PROCESSED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) => item?.order_status === "PROCESSED"
        );
      case "SHIPPED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) => item?.order_status === "SHIPPED"
        );
      case "COMPLETED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) => item?.order_status === "COMPLETED"
        );
      case "UNDELIVERED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) =>
            item?.order_status === "UNDELIVERED" && !isRiderForCancel(item)
        );
      case "CANCELLED":
        return (formatOrderToday(DayData?.orders?.items) || []).filter(
          (item) =>
            item?.order_status === "UNDELIVERED" && isRiderForCancel(item)
        );
      default:
        return formatOrderToday(DayData?.orders?.items) || [];
    }
  };

  const pagination = usePagination({
    total: filterOrders().length || 0,
    initialPage: 1,
    page: Number(router.query.page || 1),
  });

  const onSeachOrder = (orderID: string) => {
    OrderQuery({
      id: orderID,
    })
      .then(({ data }) => {
        if (data.order) {
          router.push(
            `/order-management/order-details/orderID/?orderID=${orderID}`
          );
        } else {
          Notification.error({ message: "Order ID not found" });
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onSubmitOrderVerification = (order: ORDER.Maybe<ORDER.Order>) => {
    const updateList = [...Backlogs];
    const index = updateList.findIndex((e) => e?.id === order?.id);

    updateList.splice(index, 1, order);
    setBacklogs(updateList);
  };

  const getDiscount = (record: any) => {
    var discounts = formatCustomerDiscount(record);
    return (
      <>
        {discounts.length > 0 ? <div>Cart:</div> : undefined}
        {
          <>
            {discounts.map((discount: any) => (
              <div key={discount}>- {discount}</div>
            ))}
          </>
        }
      </>
    );
  };

  const onSelectOrders = (isAdd: boolean, order: ORDER.Maybe<ORDER.Order>) => {
    const list = [...selectedOrders];
    if (isAdd) {
      list.push(order);
      setSelectedOrders(list);
    } else {
      setSelectedOrders(list.filter((e) => e?.id !== order?.id));
    }
  };

  const onSelectAllOrders = (isSelectAll: boolean) => {
    if (isSelectAll) {
      setSelectedOrders([
        ...filterOrders()?.slice(
          (pagination.active - 1) * 100,
          pagination.active * 100
        ),
      ]);
    } else {
      setSelectedOrders([]);
    }
    setIsSelectAll(isSelectAll);
  };

  console.log(selectedOrders.length);

  const [openSI, setOpenSI] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ORDER.Order | null>(null);
  const [salesInvoiceType, setSalesInvoiceType] = useState<boolean>(true);

  const onInvoicePrint = (order: ORDER.Order, salesInvoiceType: boolean) => {
    generateInvoice({
      variables: {
        type: "INVOICE",
        order_id: order.order_id,
        salesInvoiceType: salesInvoiceType,
      },
    }).then((resPDF) => {
      window?.open(resPDF?.data?.generatePDF, "_blank");
    });
  };

  const accessRole = () => {
    return (
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatcher
    );
  };

  // Render functions
  const rows = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return (isPaginate ? [] : list)
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <tr key={`list-${index}`}>
          <td>
            <Checkbox
              disabled={!accessRole()}
              checked={selectedOrders.some((e) => e?.id === element?.id)}
              defaultChecked={selectedOrders.some((e) => e?.id === element?.id)}
              onChange={(e) => onSelectOrders(e.target.checked, element)}
              label=""
            />
          </td>
          <td
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Button
              disabled={!accessRole()}
              onClick={() =>
                setShowModal({
                  sms: false,
                  assign: false,
                  verification: true,
                  order: element,
                })
              }
            >
              {element?.verification_status || "UNVERIFIED"}
            </Button>
          </td>
          <td>
            <Button
              onClick={() =>
                router.push(
                  `/order-management/order-details/orderID/?orderID=${element?.id}`
                )
              }
            >
              {element?.id || "N/A"}
            </Button>
          </td>
          <td>
            <div className={classes.preWrapTextMD}>
              {formatCustomerName(element?.shipping_address)}
            </div>
          </td>
          <td>
            <div className={classes.preWrapText}>
              <Text size={"xs"}>
                {formatCustomerAddress(element?.shipping_address)}
              </Text>
            </div>
          </td>
          <td>
            <div className={classes.preWrapTextSM}>
              <Text size={12}>
                {dayjs(Number(element?.date_created)).format(
                  "MMM-DD-YYYY hh:mm A"
                )}
              </Text>
            </div>
          </td>
          <td>{element?.sub_warehouse_tag ?? "-"}</td>
          <td>
            <div className={classes.preWrapTextSM}>
              <Text size={10}>{getDiscount(element?.price?.discounts)}</Text>
            </div>
          </td>
          <td>
            {element?.promo ? (
              <div className={classes.preWrapTextSM}>
                <Text size={10}>{"Promo: " + element?.promo?.description}</Text>
              </div>
            ) : undefined}
          </td>
          <td>{element?.price?.gross}</td>
          <td>{element?.order_status}</td>
          <td>
            {element?.order_status === "RECEIVED" && (
              <ActionIcon
                disabled={!accessRole()}
                loading={loadingPDF}
                variant="filled"
                onClick={() => {
                  setOpenSI(true);
                  setSelectedOrder(element);
                }}
              >
                <Printer />
              </ActionIcon>
            )}
          </td>

          <td>
            {
              element?.delivery_status_logs?.[
                element?.delivery_status_logs?.length - 1
              ]?.status
            }
          </td>
        </tr>
      ));
  };

  const modalRender = (isTitle: boolean) => {
    if (showModal.verification)
      return isTitle ? (
        "Update Verification"
      ) : (
        <VerificationForm
          order={showModal.order}
          onSubmit={onSubmitOrderVerification}
          onClose={() =>
            setShowModal({
              order: {},
              sms: false,
              assign: false,
              verification: false,
            })
          }
        />
      );
  };

  const onSelectOrderStatus = (status: string) => {
    setFilters({ ...filters, status: status });
    if (filterOrders().length > 0) {
      pagination.setPage(1);
    }
    router.replace(
      `${router.pathname}?page=1&wh=${warehouse}&dateFrom=${filters.date.from}&dateTo=${filters.date.to}&status=${status}`
    );
    setIsSelectAll(false);
    setSelectedOrders([]);
  };

  function SIprintModal() {
    return (
      <Modal
        opened={openSI}
        centered
        onClose={() => setOpenSI(false)}
        title="Sales Invoice Print"
      >
        <Group>
          <AlertCircle size={20} />
          <Text>Please Select Sales invoice type to print </Text>
        </Group>

        <Group position="right">
          <Button
            customType="orange"
            onClick={() => {
              if (selectedOrder) {
                onInvoicePrint(selectedOrder, true);
              }
              setOpenSI(false);
            }}
          >
            Old
          </Button>
          <Button
            customType="primary"
            onClick={() => {
              if (selectedOrder) {
                onInvoicePrint(selectedOrder, false);
              }
              setOpenSI(false);
            }}
          >
            New
          </Button>
        </Group>
      </Modal>
    );
  }

  return (
    <div>
      <LoadingOverlay visible={loading || isPaginate} />
      {SIprintModal()}
      <Modal
        title={modalRender(true)}
        centered
        size={1000}
        opened={showModal.assign || showModal.sms || showModal.verification}
        onClose={() =>
          setShowModal({
            sms: false,
            assign: false,
            verification: false,
            order: {},
          })
        }
      >
        {modalRender(false)}
      </Modal>
      {!warehouse ? undefined : (
        <div style={{ width: 1000 }}>
          <OrdersFilter
            isLoading={BacklogLoading}
            defaultValues={{
              warehouse: warehouse,
              date: filters.date,
            }}
            onFilter={({ warehouse, date }) => {
              setWarehouse(warehouse);
              router.replace(
                `${router.pathname}?page=1&wh=${warehouse}&dateFrom=${date.from}&dateTo=${date.to}&status=BACKLOGS`
              );
              setFilters({
                status: "BACKLOGS",
                date: date,
              });
              loadBackLogs(warehouse);
              RefetchDay({
                warehouse_id: warehouse,
                date_filter: date,
              });
              setIsSelectAll(false);
              setSelectedOrders([]);
            }}
            customField={<ActiveSMS />}
          />
        </div>
      )}
      <div className={classes.statusContainer}>
        <Card
          background="#808080"
          title="BACKLOGS"
          number={
            BacklogLoading
              ? "--"
              : Backlogs.filter(
                  (e) =>
                    dayjs(Number(e?.date_created)).format("MM-DD-YYYY") !==
                    dayjs().format("MM-DD-YYYY")
                ).length
          }
          onClick={() => onSelectOrderStatus("BACKLOGS")}
          removeSelect={filters.status !== "BACKLOGS"}
          isSelected={filters.status === "BACKLOGS"}
        />
        <Card
          background="#FD9710"
          title="RECEIVED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) => item?.order_status === "RECEIVED"
            ).length
          }
          onClick={() => onSelectOrderStatus("RECEIVED")}
          removeSelect={filters.status !== "RECEIVED"}
          isSelected={filters.status === "RECEIVED"}
        />
        <Card
          background="#61B765"
          title="PROCESSED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) => item?.order_status === "PROCESSED"
            ).length
          }
          onClick={() => onSelectOrderStatus("PROCESSED")}
          removeSelect={filters.status !== "PROCESSED"}
          isSelected={filters.status === "PROCESSED"}
        />
        <Card
          background="#A23DB6"
          title="SHIPPED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) => item?.order_status === "SHIPPED"
            ).length
          }
          onClick={() => onSelectOrderStatus("SHIPPED")}
          removeSelect={filters.status !== "SHIPPED"}
          isSelected={filters.status === "SHIPPED"}
        />
        <Card
          background="#61B765"
          title="COMPLETED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) => item?.order_status === "COMPLETED"
            ).length
          }
          onClick={() => onSelectOrderStatus("COMPLETED")}
          removeSelect={filters.status !== "COMPLETED"}
          isSelected={filters.status === "COMPLETED"}
        />
        <Card
          background="#E73F3C"
          title="UNDELIVERED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) =>
                item?.order_status === "UNDELIVERED" && !isRiderForCancel(item)
            ).length
          }
          onClick={() => onSelectOrderStatus("UNDELIVERED")}
          removeSelect={filters.status !== "UNDELIVERED"}
          isSelected={filters.status === "UNDELIVERED"}
        />
        <Card
          background="#0EB6CA"
          title="CANCELLED"
          number={
            (formatOrderToday(DayData?.orders?.items) || []).filter(
              (item) =>
                item?.order_status === "UNDELIVERED" && isRiderForCancel(item)
            ).length
          }
          onClick={() => onSelectOrderStatus("CANCELLED")}
          removeSelect={filters.status !== "CANCELLED"}
          isSelected={filters.status === "CANCELLED"}
        />
      </div>
      <br />
      <Input
        icon={<Search />}
        // description='Search'
        type="search"
        onKeyPress={(e) =>
          e.key === "Enter" ? onSeachOrder(e.target.value) : undefined
        }
        data-testid={`TEST-SEARCH-ORDER`}
        placeholder="Search by Order ID"
      />
      <Group position="apart">
        <h2>List of Orders</h2>
        <ManualOrder />
      </Group>
      <ScrollArea scrollbarSize={20} style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={isSelectAll}
                    onChange={(e) => onSelectAllOrders(e.target.checked)}
                    label=""
                  />
                </th>
                <th>Verification Status</th>
                <th>Order Tracking No.</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Date of Order</th>
                <th>Order Tag</th>
                <th>Discount</th>
                <th>Promos</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Print</th>
                <th>Last Delivery Status</th>
              </tr>
            </thead>
            <tbody>{rows(filterOrders())}</tbody>
          </Table>
        </div>
      </ScrollArea>

      <br />
      <Group position="right">
        <Pagination
          disabled={isSelectAll}
          position="center"
          total={Math.ceil((filterOrders()?.length || 0) / 100)}
          page={pagination.active}
          onChange={(page) => {
            setIsPaginate(true);
            pagination.setPage(page);
            router.replace(
              `${router.pathname}?page=${page}&wh=${
                router.query.wh || "PH01"
              }&dateFrom=${filters.date.from}&dateTo=${
                filters.date.to
              }&status=${filters.status}`,
              undefined,
              { shallow: true }
            );
            setTimeout(() => {
              setIsPaginate(false);
            }, 0);
          }}
        />
      </Group>
      <br />

      <Group position="apart">
        <AssignOrderForm
          onSubmit={() => {
            setSelectedOrders([]);
            setIsSelectAll(false);
          }}
          orders={selectedOrders}
        />
        <CustomerSMSForm
          onSubmit={() => {
            setIsSelectAll(false);
            setSelectedOrders([]);
          }}
          orders={selectedOrders}
        />
      </Group>
    </div>
  );
};
