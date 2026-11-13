/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { EcomVerificationDetails } from "../EcomVerificationDetails/EcomVerificationDetails";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { getOrders } from "../../../GraphQL/OrderManagementSchema";
import Notification from "../../Elements/Notification/Notification";
import {
  Pagination,
  LoadingOverlay,
  Modal,
  Button,
  Table,
  Group,
  Card,
  ScrollArea,
  Text,
} from "../../Elements";
import { VerificationForm } from "../../Modules/Order/VerificationForm";
import {
  formatCustomerAddress,
  formatCustomerDiscount,
  formatCustomerName,
} from "../../../Utilities/Formatter";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { ORDER } from "../../../GraphQL";
import { usePagination } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const EcomVerification = () => {
  const [userRoles] = useAtom(rolesAtom);
  const router = useRouter();
  const { classes } = useStyles();
  const [showModal, setShowModal] = useState({
    verification: false,
    details: false,
    order: {},
  });

  const [filters, setFilters] = useState({
    status: "UNVERIFIED",
    warehouse: "",
    date: {
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  });

  const [orders, setOrders] = useState<{
    UNVERIFIED: ORDER.Order[];
    VERIFIED: ORDER.Order[];
    FLAGGED: ORDER.Order[];
    VIP: ORDER.Order[];
    CANCELLED: ORDER.Order[];
    CHANGE_ADDRESS: ORDER.Order[];
  }>({
    UNVERIFIED: [],
    VERIFIED: [],
    FLAGGED: [],
    VIP: [],
    CANCELLED: [],
    CHANGE_ADDRESS: [],
  });

  const {
    data: dataOrders,
    refetch: refetchOrders,
    loading: loadingOrders,
  } = useQuery(getOrders, { context: { clientName: "order" } });

  useEffect(() => {
    if (router.isReady) {
      const warehouse = `${router.query.wh || "PH01"}`;
      const date = router.query.dateFrom
        ? { from: `${router.query.dateFrom}`, to: `${router.query.dateTo}` }
        : {
            from: dayjs().format("YYYY-MM-DD"),
            to: dayjs().format("YYYY-MM-DD"),
          };
      getAllOrders(warehouse, date, [], undefined);
    }
  }, [router.isReady]);

  console.log(filters);

  const filterOrders = () => {
    switch (filters.status) {
      case "VERIFIED":
        return orders.VERIFIED;
      case "FLAGGED":
        return orders.FLAGGED;
      case "VIP":
        return orders.VIP;
      case "CANCELLED":
        return orders.CANCELLED;
      case "CHANGE_ADDRESS":
        return orders.CHANGE_ADDRESS;
      case "UNVERIFIED":
        return orders.UNVERIFIED;
      default:
        return [];
    }
  };

  const pagination = usePagination({
    total: filterOrders().length || 0,
    initialPage: 1,
    page: Number(router.query.page || 1),
  });

  const getAllOrders = (
    warehouse: string | undefined,
    date: { from: string; to: string },
    list: ORDER.Order[],
    next_token: string | undefined
  ) => {
    refetchOrders({
      warehouse_id: warehouse,
      next_token: next_token,
      date_filter: date,
    })
      .then((res) => {
        const verificationOrders = [...list, ...res.data.orders.items];
        if (res.data.orders?.next_token)
          return getAllOrders(
            warehouse,
            date,
            verificationOrders,
            res.data.orders?.next_token
          );
        setOrders({
          ...orders,
          VERIFIED: sortOrders(
            verificationOrders.filter(
              (order) => order.verification_status === "VERIFIED"
            )
          ),
          FLAGGED: sortOrders(
            verificationOrders.filter(
              (order) => order.verification_status === "FLAGGED"
            )
          ),
          VIP: sortOrders(
            verificationOrders.filter(
              (order) => order.verification_status === "VIP"
            )
          ),
          CANCELLED: sortOrders(
            verificationOrders.filter(
              (order) =>
                order?.verification_status === "CANCELLED" ||
                order?.verification_status === "CS_CANCELLED"
            )
          ),
          CHANGE_ADDRESS: sortOrders(
            verificationOrders.filter(
              (order) => order.verification_status === "CHANGE_ADDRESS"
            )
          ),
          UNVERIFIED: sortOrders(
            verificationOrders.filter(
              (order) =>
                order.verification_status === "UNVERIFIED" ||
                order.verification_status == undefined
            )
          ),
        });
        setFilters({
          ...filters,
          warehouse: warehouse || "",
          date: date,
          status: `${router.query.status || "UNVERIFIED"}`,
        });
        pagination.setPage(1);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const sortOrders = (list: ORDER.Order[]) => {
    return list?.sort((a: ORDER.Order, b: ORDER.Order) =>
      a?.order_status && b?.order_status
        ? a?.order_status < b?.order_status
          ? 1
          : -1
        : -1
    );
  };

  const onSelectOrderStatus = (status: string) => {
    if (filterOrders().length > 0) {
      pagination.setPage(1);
    }
    setFilters({ ...filters, status: status });
    router.replace(
      `${router.pathname}?page=${1}&wh=${filters.warehouse}&dateFrom=${
        filters.date.from
      }&dateTo=${filters.date.to}&status=${status}`,
      undefined,
      { shallow: true }
    );
  };

  const onSubmitOrderVerification = (order: ORDER.Order) => {
    const updateList = filterOrders();
    const index = updateList.findIndex((e: any) => e.id == order.id);
    updateList[index] = { ...order };
    setOrders({
      ...orders,
      [filters.status]: updateList,
    });
  };

  const getDiscount = (item: ORDER.Order) => {
    var discounts = formatCustomerDiscount(item?.price?.discounts);
    var itemDiscounts: string[] = [];
    item.items
      ? item?.items.map((item: ORDER.OrderItem | undefined | null) => {
          if (item?.item_discounts) {
            itemDiscounts = itemDiscounts.concat(
              formatCustomerDiscount(item?.item_discounts)
            );
          }
        })
      : undefined;
    return (
      <>
        {discounts.length > 0 ? <div>Cart:</div> : undefined}
        {
          <>
            {discounts.map((discount: string) => (
              <div key={discount}>- {discount}</div>
            ))}
          </>
        }
        {itemDiscounts.length > 0 ? <div>Per item:</div> : undefined}
        {
          <>
            {itemDiscounts.map((discount: string) => (
              <div key={discount}>- {discount}</div>
            ))}
          </>
        }
      </>
    );
  };

  const rows = (list: ORDER.Order[]) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element: ORDER.Order, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() => {
              setShowModal({
                verification: false,
                details: true,
                order: element,
              });
              console.log(element);
            }}
          >
            <td
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Button
                disabled={accessRole()}
                onClick={() =>
                  setShowModal({
                    verification: true,
                    details: false,
                    order: element,
                  })
                }
              >
                {element.verification_status || "UNVERIFED"}
              </Button>
            </td>
            <td>{element.order_id}</td>
            <td>
              <div className={classes.preWrapTextMD}>
                {formatCustomerName(element.billing_address)}
              </div>
            </td>
            <td>
              <div className={classes.preWrapText}>
                {formatCustomerAddress(element.billing_address)}
              </div>
            </td>
            <td>
              <Text size={13}>{element?.shipping_address?.email}</Text>
            </td>
            <td>{element?.shipping_address?.telephone_number}</td>
            <td>
              <Text size={11}> {element.payment_type}</Text>
            </td>
            <td>
              <div className={classes.preWrapTextSM}>
                <Text size={10}>{getDiscount(element)}</Text>
              </div>
            </td>
            <td>
              {element.promo ? (
                <div>
                  {" "}
                  <Text size={10}>
                    {"Promo: " + element.promo?.description}
                  </Text>
                </div>
              ) : undefined}
            </td>
            <td>{element.order_status}</td>
          </tr>
        </React.Fragment>
      ));
  };

  const modalRender = (isTitle: boolean) => {
    if (showModal.verification)
      return isTitle ? (
        "Update Verification"
      ) : (
        <VerificationForm
          onSubmit={onSubmitOrderVerification}
          order={showModal.order}
          onClose={() =>
            setShowModal({ details: false, verification: false, order: {} })
          }
        />
      );
    if (showModal.details)
      return isTitle ? (
        "Details"
      ) : (
        <EcomVerificationDetails order={showModal.order} />
      );
  };

  const accessRole = () => {
    if (
      userRoles.isPacker || // old roles
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      //old roles
      userRoles.isAdmin ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <LoadingOverlay visible={loadingOrders} />
      <Modal
        title={modalRender(true)}
        centered
        size={1100}
        opened={showModal.details || showModal.verification}
        onClose={() =>
          setShowModal({ details: false, verification: false, order: {} })
        }
      >
        {modalRender(false)}
      </Modal>
      {filters.warehouse === "" ? undefined : (
        <div style={{ width: 1000 }}>
          <OrdersFilter
            isLoading={loadingOrders}
            defaultValues={{
              warehouse: filters.warehouse,
              date: filters.date,
            }}
            onFilter={(e: {
              warehouse: string | undefined;
              date: { from: string; to: string };
            }) => {
              setFilters({
                status: "UNVERIFIED",
                warehouse: e.warehouse || "",
                date: e.date,
              });
              router.replace(
                `${router.pathname}?page=${1}&wh=${e.warehouse}&dateFrom=${
                  e.date.from
                }&dateTo=${e.date.to}&status=UNVERIFIED`,
                undefined,
                { shallow: true }
              );
              getAllOrders(e.warehouse, e.date, [], undefined);
            }}
          />
        </div>
      )}

      <div className={classes.statusContainer}>
        <Card
          background="#FD9710"
          title="UNVERIFIED"
          number={orders.UNVERIFIED.length}
          onClick={() => onSelectOrderStatus("UNVERIFIED")}
          removeSelect={filters.status !== "UNVERIFIED"}
          isSelected={filters.status === "UNVERIFIED"}
        />
        <Card
          background="#61B765"
          title="VERIFIED"
          number={orders.VERIFIED.length}
          onClick={() => onSelectOrderStatus("VERIFIED")}
          removeSelect={filters.status !== "VERIFIED"}
          isSelected={filters.status === "VERIFIED"}
        />
        <Card
          background="#A23DB6"
          title="FLAGGED"
          number={orders.FLAGGED.length}
          onClick={() => onSelectOrderStatus("FLAGGED")}
          removeSelect={filters.status !== "FLAGGED"}
          isSelected={filters.status === "FLAGGED"}
        />
        <Card
          background="#61B765"
          title="VIP"
          number={orders.VIP.length}
          onClick={() => onSelectOrderStatus("VIP")}
          removeSelect={filters.status !== "VIP"}
          isSelected={filters.status === "VIP"}
        />
        <Card
          background="#E73F3C"
          title="CANCELLED"
          number={orders.CANCELLED.length}
          onClick={() => onSelectOrderStatus("CANCELLED")}
          removeSelect={filters.status !== "CANCELLED"}
          isSelected={filters.status === "CANCELLED"}
        />
        <Card
          background="#0EB6CA"
          title="CHANGE_ADDRESS"
          number={orders.CHANGE_ADDRESS.length}
          onClick={() => onSelectOrderStatus("CHANGE_ADDRESS")}
          removeSelect={filters.status !== "CHANGE_ADDRESS"}
          isSelected={filters.status === "CHANGE_ADDRESS"}
        />
      </div>
      <ScrollArea style={{ height: 500 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Verification Status</th>
                <th>Order Number</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Payment Type</th>
                <th>Discounts</th>
                <th>Promos</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>{rows(filterOrders() || [])}</tbody>
          </Table>
        </div>
      </ScrollArea>
      <br />
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil((filterOrders()?.length || 0) / 100)}
          page={pagination.active}
          onChange={(page) => {
            router.replace(
              `${router.pathname}?page=${page}&wh=${filters.warehouse}&dateFrom=${filters.date.from}&dateTo=${filters.date.to}&status=${filters.status}`,
              undefined,
              { shallow: true }
            );
            pagination.setPage(page);
          }}
        />
      </Group>
    </div>
  );
};
