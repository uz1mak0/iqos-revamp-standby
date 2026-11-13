/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Printer, Search } from "tabler-icons-react";
import { Card } from "../../Elements/Card";
import { DateRangePicker } from "../../Elements/DateRangePicker";
import { Group } from "../../Elements/Group";
import { Input } from "../../Elements/Input";
import { Select } from "../../Elements/Select";
import { Table } from "../../Elements/Table";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { Button } from "../../Elements/Button";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  generatePDF,
  getReturnOrder,
  getReturnOrders,
} from "../../../GraphQL/OrderManagementSchema";
import dayjs from "dayjs";
import Notification from "../../Elements/Notification/Notification";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { Pagination } from "../../Elements/Pagination";
import {
  formatCustomerName,
  formatLendingOrderStatus,
  getReturnSerials,
} from "../../../Utilities/Formatter";
import { getLeadPurchaseStatusType } from "./Config";
import { ORDER } from "../../../GraphQL";
import { InputMaybe, Maybe } from "../../../GraphQL/_gql/order/graphql";
import { ScrollArea } from "../../Elements";
import { usePagination } from "@mantine/hooks";
import { useRouter } from "next/router";

interface ReturnConnection {
  orders?: ORDER.OrderConnection;
  returnOrders?: ORDER.OrderConnection;
}

export const LendingReturnManagement = () => {
  const router = useRouter();
  const { classes } = useStyles();

  const {
    data: dataReturnOrders,
    refetch: refetchReturnOrders,
    loading: loadingReturnOrders,
  } = useQuery(getReturnOrders, { context: { clientName: "order" } });
  const [onGeneratePDF] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });
  const [refetchReturnOrder, { loading: loadingReturnOrder }] = useLazyQuery(
    getReturnOrder,
    { context: { clientName: "order" } }
  );

  const [loading, setLoading] = useState(false);
  const [returnOrders, setReturnOrders] = useState<{
    RECEIVED: Maybe<ORDER.Order[]> | undefined;
    FAILED: Maybe<ORDER.Order[]> | undefined;
    RETURNED: Maybe<ORDER.Order[]> | undefined;
  }>({
    RECEIVED: [],
    FAILED: [],
    RETURNED: [],
  });

  const [filters, setFilters] = useState<{
    status: string | undefined;
    warehouse: string | undefined;
    date: {
      from: Date | string;
      to: Date | string;
    };
    purchase_status: string;
  }>({
    status: "",
    warehouse: "RS50",
    date: {
      from: dayjs().subtract(3, "months").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
    purchase_status: "ALL",
  });

  useEffect(() => {
    if (router.isReady) {
      const status = `${router.query.status || "RECEIVED"}`;
      const lendingStatus = `${router.query.lendingStatus || "ALL"}`;
      const date = router.query.dateFrom
        ? { from: `${router.query.dateFrom}`, to: `${router.query.dateTo}` }
        : {
            from: dayjs().subtract(3, "months").format("YYYY-MM-DD"),
            to: dayjs().format("YYYY-MM-DD"),
          };
      setFilters({
        ...filters,
        status: status,
        date: date,
        purchase_status: lendingStatus,
      });
      getAllReturnOrders(filters?.warehouse, date);
    }
  }, [router.isReady]);

  const getAllReturnOrders = (
    warehouse: string | undefined,
    date: { from: Date | string; to: Date | string }
  ) => {
    setLoading(true);
    Promise.all([
      getReturnOrderByStatus(warehouse, date, [], undefined, "RECEIVED"),
      getReturnOrderByStatus(warehouse, date, [], undefined, "FAILED"),
      getReturnOrderByStatus(warehouse, date, [], undefined, "RETURNED"),
    ]).then(([orderRecieved, orderFailed, orderReturned]) => {
      console.log(orderRecieved, orderFailed, orderReturned);
      setReturnOrders({
        FAILED: sortOrder([...orderFailed]),
        RECEIVED: sortOrder([...orderRecieved]),
        RETURNED: sortOrder([...orderReturned]),
      });
      setLoading(false);
    });
  };

  const sortOrder = (list: Maybe<ORDER.Order[]>) => {
    return list?.sort((a, b) => {
      if (a.return_date && b.return_date) return b.return_date - a.return_date;
      return (
        parseInt(b?.date_created || "0") - parseInt(a?.date_created || "0")
      );
    });
  };

  const filterOrdersByPurchaseStatus = (
    list: Maybe<ORDER.Order[]> | undefined
  ) => {
    if (filters.purchase_status == "OPEN")
      return list?.filter(
        (e) =>
          e.lending_purchase_status === "OPEN" || !e.lending_purchase_status
      );
    if (filters.purchase_status == "CANCELLED")
      return list?.filter((e) =>
        e.lending_purchase_status?.includes("CANCELLED")
      );
    return list?.filter((e) =>
      filters.purchase_status === "ALL"
        ? e
        : e.lending_purchase_status === filters.purchase_status
    );
  };

  const filterOrders = (): Maybe<ORDER.Order[]> | undefined => {
    switch (filters.status) {
      case "FAILED":
        return returnOrders.FAILED;
      case "RETURNED":
        return returnOrders.RETURNED;
      case "RECEIVED":
        return returnOrders.RECEIVED;
      default:
        return [];
    }
  };

  const getReturnOrderByStatus = (
    warehouse: string | undefined,
    date: { from: Date | string; to: Date | string },
    list: ORDER.Order[],
    next_token: string | undefined | null,
    status: string
  ): any => {
    return refetchReturnOrders({
      order_status: status,
      warehouse_id: warehouse ? warehouse : filters.warehouse,
      next_token: next_token,
      date_filter: {
        from: date ? date?.from : filters.date.from,
        to: date ? date.to : filters.date.to,
      },
    })
      .then((res) => {
        const updateList: ORDER.Order[] = [
          ...list,
          ...res.data.returnOrders?.items,
        ];
        if (res.data.returnOrders?.next_token)
          return getReturnOrderByStatus(
            warehouse,
            date,
            updateList,
            res.data.returnOrders?.next_token,
            status
          );
        //  setFilters({...filters, warehouse: warehouse, date:{from: date.from, to: date.to}})
        return updateList.filter((e) => e.order_type === "MANUAL");
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };
  const pagination = usePagination({
    total: filterOrdersByPurchaseStatus(filterOrders())?.length || 0,
    initialPage: 1,
    page: Number(router.query.page || 1),
  });

  const print = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    id: ORDER.Maybe<string> | undefined
  ): void => {
    onGeneratePDF({
      variables: {
        type: "LENDING_RETURN",
        order_id: id,
      },
      onCompleted: (response) => {
        window.open(response.generatePDF, "_blank");
      },
      onError: (err) => {
        console.error(err);
        Notification.error({ message: err.message });
      },
    });
  };

  const rows = (list: Maybe<ORDER.Order[]> | undefined) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element?.shipping_address?.city}</td>
            <td>{formatCustomerName(element.shipping_address)}</td>
            <td>
              <Button
                onClick={() =>
                  router.push(
                    `/order-management/return/return-details/returnID/?returnID=${element?.id}`
                  )
                }
              >
                {element?.order_id?.includes("ACTIVATION_")
                  ? "OPEN RETURN"
                  : element?.order_id || ""}
              </Button>
            </td>
            <td>
              <Button
                onClick={() =>
                  router.push(
                    `/order-management/order-details/orderID/?orderID=${element?.order_reference_number}`
                  )
                }
              >
                {element?.order_reference_number?.includes("ACTIVATION_")
                  ? "OPEN ORDER"
                  : element?.order_reference_number || ""}
              </Button>
            </td>
            <td>
              {dayjs(
                Number(
                  element?.return_date
                    ? element?.return_date
                    : element?.date_created
                )
              ).format("MMM-DD-YYYY")}
            </td>
            <td>{element?.lending_purchase_status}</td>
            <td>
              {dayjs(
                Number(
                  element?.date_updated
                    ? element?.date_updated
                    : element?.date_created
                )
              ).format("MMM-DD-YYYY")}
            </td>
            <td>{formatLendingOrderStatus(element)}</td>
            <td>
              <Printer onClick={(e) => print(e, element?.id)} />
            </td>
            <td>{getReturnSerials(element)}</td>
          </tr>
        </React.Fragment>
      ));
  };

  const onSelectOrderStatus = (status: string) => {
    if ((filterOrdersByPurchaseStatus(filterOrders())?.length || 0) > 0) {
      pagination.setPage(1);
    }
    setFilters({ ...filters, status: status });
    router.replace(
      `${router.pathname}?page=${1}&dateFrom=${filters.date.from}&dateTo=${
        filters.date.to
      }&lendingStatus=${filters.purchase_status}&status=${status}`,
      undefined,
      { shallow: true }
    );
  };

  const onSearchReturnOrder = (orderID: string) => {
    refetchReturnOrder({
      variables: {
        id: `RETURN_${orderID}`,
      },
    })
      .then((res) => {
        if (res.data.returnOrder) {
          router.push(
            `/order-management/return/return-details/returnID/?returnID=RETURN_${orderID}`
          );
        } else {
          Notification.error({ message: "Return order ID not found" });
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      {filters.status === "" ? undefined : (
        <Group align="center">
          <DateRangePicker
            defaultValue={[
              dayjs(filters.date.from).toDate(),
              dayjs(filters.date.to).toDate(),
            ]}
            onChange={(date) => {
              if (!date[1]) return;
              const dateFormat = {
                from: dayjs(date[0]).format("YYYY-MM-DD"),
                to: dayjs(date[1]).format("YYYY-MM-DD"),
              };
              router.replace(
                `${router.pathname}?page=${1}&dateFrom=${
                  dateFormat.from
                }&dateTo=${dateFormat.to}&lendingStatus=${
                  filters.purchase_status
                }&status=${"RECEIVED"}`,
                undefined,
                { shallow: true }
              );
              getAllReturnOrders(filters.warehouse, dateFormat);
            }}
            description="Date"
          />
          <Select
            searchable
            defaultValue={filters.purchase_status}
            placeholder="Select Purchase Status"
            description="Lending Purchase Status"
            onChange={(e) => {
              setFilters({ ...filters, purchase_status: e });
              router.replace(
                `${router.pathname}?page=${1}&dateFrom=${
                  filters.date.from
                }&dateTo=${filters.date.to}&lendingStatus=${e}&status=${
                  filters.status
                }`,
                undefined,
                { shallow: true }
              );
            }}
            data={getLeadPurchaseStatusType}
          />
        </Group>
      )}
      <div className={classes.statusContainer}>
        <Card
          background="#A23DB6"
          title="RECEIVED"
          number={filterOrdersByPurchaseStatus(returnOrders?.RECEIVED)?.length}
          onClick={() => onSelectOrderStatus("RECEIVED")}
          removeSelect={filters.status !== "RECEIVED"}
          isSelected={filters.status === "RECEIVED"}
        />
        <Card
          background="#E73F3C"
          title="FAILED"
          number={filterOrdersByPurchaseStatus(returnOrders.FAILED)?.length}
          onClick={() => onSelectOrderStatus("FAILED")}
          removeSelect={filters.status !== "FAILED"}
          isSelected={filters.status === "FAILED"}
        />
        <Card
          background="#61B765"
          title="RETURNED"
          number={filterOrdersByPurchaseStatus(returnOrders.RETURNED)?.length}
          onClick={() => onSelectOrderStatus("RETURNED")}
          removeSelect={filters.status !== "RETURNED"}
          isSelected={filters.status === "RETURNED"}
        />
      </div>
      <Input
        icon={<Search />}
        description="Search"
        type="search"
        placeholder="Search by Reference order ID"
        onKeyPress={(e) =>
          e.key === "Enter" ? onSearchReturnOrder(e.target.value) : undefined
        }
      />
      <h2>List of Lending Returned Orders</h2>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Pickup Location</th>
                <th>Customer Name</th>
                <th>Order Tracking No.</th>
                <th>Order Reference No.</th>
                <th>Return Schedule</th>
                <th>Lending Purchase Status</th>
                <th>Datetime Updated</th>
                <th>Status</th>
                <th>Print</th>
                <th>Serials</th>
              </tr>
            </thead>
            <tbody>
              {rows(filterOrdersByPurchaseStatus(filterOrders()) || [])}
            </tbody>
          </Table>
        </div>
      </ScrollArea>
      <br />
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil(
            (filterOrdersByPurchaseStatus(filterOrders())?.length || 0) / 100
          )}
          page={pagination.active}
          onChange={(page) => {
            pagination.setPage(page);
            router.replace(
              `${router.pathname}?page=${page}&dateFrom=${filters.date.from}&dateTo=${filters.date.to}&lendingStatus=${filters.purchase_status}&status=${filters.status}`,
              undefined,
              { shallow: true }
            );
          }}
        />
      </Group>
    </div>
  );
};
