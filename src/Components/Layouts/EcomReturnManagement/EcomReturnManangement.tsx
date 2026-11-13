/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Search } from "tabler-icons-react";
import { Button, Card, Group, Input, ScrollArea, Table } from "../../Elements";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { useQuery } from "@apollo/client";
import {
  getReturnOrder,
  getReturnOrders,
} from "../../../GraphQL/OrderManagementSchema";
import Notification from "../../Elements/Notification/Notification";
import dayjs from "dayjs";
import { Pagination } from "../../Elements/Pagination";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import {
  formatCustomerAddress,
  formatCustomerName,
  getReturnSerials,
} from "../../../Utilities/Formatter";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import { ORDER } from "../../../GraphQL";
import { usePagination } from "@mantine/hooks";
import { useRouter } from "next/router";

type FetchType = (fetch: { variables: ORDER.QueryOrdersArgs }) => void;

export const EcomReturnManangement = () => {
  const { classes } = useStyles();
  const router = useRouter();

  // const {data: dataReturnOrders, refetch: refetchReturnOrders, loading: loadingReturnOrders } = useQuery(getReturnOrders, { context: { clientName: 'order'}});
  const { refetch: refetchReturnOrder } = useQuery(getReturnOrder, {
    skip: true,
    context: { clientName: "order" },
  });

  const { data, fetchMore, refetch, loading, networkStatus } = useQuery<{
    returnOrders: ORDER.OrderConnection;
  }>(getReturnOrders, {
    variables: {
      date_filter: {
        from: dayjs().subtract(1, "week").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      },
    },
    notifyOnNetworkStatusChange: true,
    context: { clientName: "order" },
  });

  const FetchMore = (fetch: FetchType, date?: ORDER.DateFilter) => {
    fetch({
      variables: {
        date_filter: date,
        next_token: data?.returnOrders?.next_token,
      },
    });
  };

  if (data?.returnOrders?.next_token) FetchMore(fetchMore);

  // const [loading, setLoading] = useState(false)
  // const [returnOrders, setReturnOrders] = useState<{
  //     RECEIVED: { [key: string]: any }[],
  //     FAILED: { [key: string]: any }[],
  //     RETURNED: { [key: string]: any }[]
  // }>({
  //     RECEIVED: [],
  //     FAILED: [],
  //     RETURNED: []
  // })

  const [filters, setFilters] = useState({ status: "RECEIVED" });

  const formatOrderToday = (
    list: ORDER.Maybe<ORDER.Maybe<ORDER.Order>[]> | undefined,
  ) => {
    return list?.filter(
      (e) =>
        dayjs(Number(e?.date_created)).format("MM-DD-YYYY") ===
        dayjs().format("MM-DD-YYYY"),
    );
  };

  const filterOrders = () => {
    switch (filters.status) {
      case "FAILED":
        return (formatOrderToday(data?.returnOrders?.items) || []).filter(
          (item) => item?.order_status === "FAILED",
        );
      case "RETURNED":
        return (data?.returnOrders?.items || []).filter(
          (item) => item?.order_status === "RETURNED",
        );
      case "RECEIVED":
        return (formatOrderToday(data?.returnOrders?.items) || []).filter(
          (item) => item?.order_status === "RECEIVED",
        );
      default:
        return formatOrderToday(data?.returnOrders?.items) || [];
    }
  };

  const pagination = usePagination({
    total: filterOrders().length || 0,
    initialPage: 1,
  });

  // useEffect(() => {
  //     getAllReturnOrders(undefined,{from: dayjs().subtract(1, "week").format("YYYY-MM-DD"),to: dayjs().format("YYYY-MM-DD")});
  // }, [])

  // const getAllReturnOrders = (warehouse: string | undefined, date: {[key: string]: any}) => {
  //     setLoading(true)
  //     Promise.all([
  //         getReturnOrderByStatus(warehouse, date, [], undefined, "RECEIVED"),
  //         getReturnOrderByStatus(warehouse, date,[], undefined, "FAILED"),
  //         getReturnOrderByStatus(warehouse, date,[], undefined, "RETURNED"),

  //     ])
  //     .then(([orderRecieved, orderFailed, orderReturned]) => {
  //         setReturnOrders({
  //             FAILED: sortOrder([...orderFailed]),
  //             RECEIVED: sortOrder([...orderRecieved]),
  //             RETURNED: sortOrder([...orderReturned])
  //         })
  //         setLoading(false)
  //         setFilters({...filters,  page: {from: 0, to: 99, activePage: 1}})
  //     })
  //  }

  //  const sortOrder = (list: {[key: string]: any}[]) => {
  //     return list.sort((a: any, b: any) => {return b.date_created - a.date_created})
  //   }

  // const getReturnOrderByStatus : any = (warehouse: string, date: {[key: string]: any}, list: {[key: string]: any}[], next_token: string | undefined, status: string) => {
  //     return refetchReturnOrders({
  //         order_status: status,
  //         warehouse_id: warehouse,
  //         next_token: next_token,
  //         date_filter: date
  //     }).then(({data}) => {
  //          if(data.orders?.next_token) return getReturnOrderByStatus(warehouse, date,  data.returnOrders.items, data.returnOrders?.next_token, status)
  //          return [...list, ...data.returnOrders.items.filter((e: any) => e.order_type !== "MANUAL")]
  //       })
  //       .catch((e) => {
  //           Notification.error({message: e.message})
  //       })
  // }

  const getReturnTags = (order: ORDER.Maybe<ORDER.Order>) => {
    var hasMultiple = false;
    order?.items?.map((item) => {
      if (item?.sku == "DR000056.02") {
        hasMultiple = true;
      }
      if (item?.inventory_items && item?.inventory_items.length > 0) {
        if (item.inventory_items) {
          if (item?.quantity || 0 > 1) {
            hasMultiple = true;
          }
        }
      }
    });

    return hasMultiple ? "has multiple serials in one sku" : "-";
  };

  const rows = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>
              <div className={classes.preWrapTextLG}>
                {formatCustomerAddress(element?.shipping_address)}
              </div>
            </td>
            <td>{formatCustomerName(element?.shipping_address)}</td>
            <td>
              <Button
                onClick={() => {
                  console.log(
                    `/order-management/return/return-details/returnID/?returnID=${element?.id}`,
                  );
                  router.push(
                    `/order-management/return/return-details/returnID/?returnID=${element?.id}`,
                  );
                }}
              >
                {element?.order_id || ""}
              </Button>
            </td>
            <td>
              <Button
                onClick={() =>
                  router.push(
                    `/order-management/order-details/orderID/?orderID=${element?.order_reference_number}`,
                  )
                }
              >
                {element?.order_reference_number || ""}
              </Button>
            </td>
            <td>
              {dayjs(Number(element?.date_created)).format("MMM-DD-YYYY")}
            </td>
            <td>{element?.order_status}</td>
            <td>{getReturnSerials(element)}</td>
            <td>{getReturnTags(element)}</td>
          </tr>
        </React.Fragment>
      ));
  };

  const onSelectOrderStatus = (status: string) => {
    if (filterOrders().length > 0) {
      pagination.setPage(1);
    }
    if (filters.status === status)
      return setFilters({ ...filters, status: "" });
    return setFilters({ ...filters, status: status });
  };

  const onSeachReturnOrder = (orderID: string) => {
    refetchReturnOrder({
      id: `RETURN_${orderID}`,
    })
      .then(({ data }) => {
        if (data.returnOrder) {
          router.push(
            `/order-management/return/return-details/returnID/?returnID=RETURN_${orderID}`,
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
      <LoadingOverlay visible={loading || networkStatus < 7} />
      <div style={{ width: 1100 }}>
        <OrdersFilter
          isDateRange
          defaultValues={{
            warehouse: undefined,
            date: {
              from: dayjs().subtract(1, "week").format("YYYY-MM-DD"),
              to: dayjs().format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) =>
            refetch({ warehouse_id: warehouse, date_filter: date })
          }
        />
      </div>

      <div className={classes.statusContainer}>
        <Card
          background="#A23DB6"
          title="RECEIVED"
          number={
            (formatOrderToday(data?.returnOrders?.items) || []).filter(
              (item) => item?.order_status === "RECEIVED",
            ).length
          }
          onClick={() => onSelectOrderStatus("RECEIVED")}
          removeSelect={filters.status !== "RECEIVED"}
          isSelected={filters.status === "RECEIVED"}
        />
        <Card
          background="#E73F3C"
          title="FAILED"
          number={
            (formatOrderToday(data?.returnOrders?.items) || []).filter(
              (item) => item?.order_status === "FAILED",
            ).length
          }
          onClick={() => onSelectOrderStatus("FAILED")}
          removeSelect={filters.status !== "FAILED"}
          isSelected={filters.status === "FAILED"}
        />
        <Card
          background="#61B765"
          title="RETURNED"
          number={
            (data?.returnOrders?.items || []).filter(
              (item) => item?.order_status === "RETURNED",
            ).length
          }
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
          e.key === "Enter" ? onSeachReturnOrder(e.target.value) : undefined
        }
      />
      <h2>List of Returned Orders</h2>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Pickup Location</th>
                <th>Customer Name</th>
                <th>Order Tracking No.</th>
                <th>Order Reference No.</th>
                <th>Date of Order</th>
                <th>Status</th>
                <th>Serials</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>{rows(filterOrders() || [])}</tbody>
          </Table>
          <br />
        </div>
      </ScrollArea>
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil((filterOrders()?.length || 0) / 100)}
          page={pagination.active}
          onChange={pagination.setPage}
        />
      </Group>
      <br />
    </div>
  );
};
