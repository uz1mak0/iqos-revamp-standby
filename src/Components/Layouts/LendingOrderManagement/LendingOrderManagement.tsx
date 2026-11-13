/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Search } from "tabler-icons-react";
import {
  Card,
  DatePicker,
  Group,
  Input,
  ScrollArea,
  Select,
  Table,
  Text,
} from "../../Elements";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import router from "next/router";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { getOrder, getOrders } from "../../../GraphQL/OrderManagementSchema";
import Notification from "../../Elements/Notification/Notification";
import { LoadingOverlay } from "@mantine/core";
import { Pagination } from "../../Elements/Pagination";
import {
  formatCustomerAddress,
  formatCustomerName,
  formatGuidedTrialSchedule,
  formatLastDeliveryReason,
  formatOriginalGuidedTrialSchedule,
  isRiderForCancel,
} from "../../../Utilities/Formatter";
import { getLeadType } from "./Config";
import { usePagination } from "@mantine/hooks";

import { ORDER } from "../../../GraphQL";

type FetchType = (fetch: { variables: ORDER.QueryOrdersArgs }) => void;

export const LendingOrderManagement = () => {
  const { classes } = useStyles();

  const [filters, setFilters] = useState({
    status: "BACKLOGS",
    warehouse: "RS50",
    date: {
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
    type: "BACKLOGS",
  });

  // Queries
  const BacklogDate = {
    from: dayjs().subtract(6, "month").startOf("month").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  };

  const { data: BacklogData, fetchMore: fetchMoreBacklog } = useQuery<{
    orders: ORDER.OrderConnection;
  }>(getOrders, {
    variables: {
      warehouse_id: filters.warehouse,
      date_filter: BacklogDate,
    },
    context: { clientName: "order" },
  });
  const { refetch: OrderQuery } = useQuery<{ order: ORDER.Order }>(getOrder, {
    skip: true,
    context: { clientName: "order" },
  });
  const {
    data: DayData,
    fetchMore: fetchMoreDay,
    refetch: RefetchDay,
    loading,
    networkStatus,
  } = useQuery<{ orders: ORDER.OrderConnection }>(getOrders, {
    variables: {
      warehouse_id: filters.warehouse,
      date_filter: filters.date,
    },
    context: { clientName: "order" },
    notifyOnNetworkStatusChange: true,
  });

  const FetchMore = (
    fetch: FetchType,
    date?: ORDER.DateFilter,
    isBackLog?: boolean
  ) => {
    fetch({
      variables: {
        warehouse_id: filters.warehouse,
        date_filter: date || filters.date,
        next_token: isBackLog
          ? BacklogData?.orders?.next_token
          : DayData?.orders?.next_token,
      },
    });
  };

  if (BacklogData?.orders?.next_token)
    FetchMore(fetchMoreBacklog, BacklogDate, true);
  if (DayData?.orders?.next_token) FetchMore(fetchMoreDay, undefined, false);

  const formatBackLogs = (
    list: ORDER.Maybe<ORDER.Maybe<ORDER.Order>[]> | undefined
  ) => {
    return list?.filter((order) => {
      return (
        dayjs(Number(order?.delivery_date)).isBefore(
          dayjs(filters?.date.from)
        ) &&
        (order?.order_status == "RECEIVED" ||
          order?.order_status == "PROCESSED" ||
          order?.order_status == "SHIPPED")
      );
    });
  };

  const filterOrdersByType = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return list?.filter((e) =>
      filters.type === "BACKLOGS" ? e : e?.lead_type === filters.type
    );
  };

  const filterOrders = () => {
    switch (filters.status) {
      case "BACKLOGS":
        return BacklogData?.orders?.next_token
          ? []
          : formatBackLogs(BacklogData?.orders?.items) || [];
      case "RECEIVED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "RECEIVED"
        );
      case "PROCESSED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "PROCESSED"
        );
      case "SHIPPED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "SHIPPED"
        );
      case "COMPLETED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "COMPLETED"
        );
      case "UNDELIVERED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "UNDELIVERED"
        );
      case "CANCELLED":
        return (DayData?.orders?.items || []).filter(
          (item) => item?.order_status === "CANCELLED"
        );
      default:
        return DayData?.orders?.items || [];
    }
  };

  const pagination = usePagination({
    total: filterOrdersByType(filterOrders()).length || 0,
    initialPage: 1,
  });

  const onSeachOrder = (orderID: string) => {
    OrderQuery({
      id: orderID,
    })
      .then((res) => {
        if (res.data.order) {
          window.open(
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

  const onSelectOrderStatus = (status: string) => {
    if (filterOrders().length > 0) {
      pagination.setPage(1);
    }
    if (filters.status === status)
      return setFilters({ ...filters, status: "" });
    return setFilters({ ...filters, status: status });
  };

  const rows = (list: ORDER.Maybe<ORDER.Maybe<ORDER.Order>[]>) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() =>
              router.push(
                `/order-management/order-details/orderID/?orderID=${element?.id}`
              )
            }
          >
            <td>{element?.id}</td>
            <td>{formatCustomerName(element?.billing_address)}</td>
            <td>
              <div className={classes.preWrapText}>
                <Text size={"xs"}>
                  {formatCustomerAddress(element?.shipping_address)}
                </Text>
              </div>
            </td>
            <td>{formatOriginalGuidedTrialSchedule(element)}</td>
            <td>{formatGuidedTrialSchedule(element)}</td>
            <td>
              {dayjs(Number(element?.delivery_date)).format("MMM-DD-YYYY")}
            </td>
            <td>{element?.lead_source}</td>
            <td>{element?.order_status}</td>
            <td>{formatLastDeliveryReason(element)}</td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      <LoadingOverlay visible={loading || networkStatus < 7} />
      <Group align="center">
        <DatePicker
          defaultValue={dayjs(filters.date.to).toDate()}
          onChange={(e) => {
            const newDate = {
              from: dayjs(e).format("YYYY-MM-DD"),
              to: dayjs(e).format("YYYY-MM-DD"),
            };
            setFilters((prev) => ({
              ...prev,
              date: newDate,
            }));
            // RefetchDay({
            //     warehouse_id: filters.warehouse,
            //     date_filter: {from: dayjs(e).format("YYYY-MM-DD"), to: dayjs(e).format("YYYY-MM-DD")}
            // })
          }}
          description="Date"
        />
        <Select
          searchable
          defaultValue="BACKLOGS"
          placeholder="Select lead type"
          description="Lead Type"
          onChange={(e) => setFilters({ ...filters, type: e })}
          data={getLeadType}
        />
      </Group>
      <div className={classes.statusContainer}>
        <Card
          background="#808080"
          title="BACKLOGS"
          number={
            BacklogData?.orders?.next_token
              ? "-"
              : filterOrdersByType(
                  formatBackLogs(BacklogData?.orders?.items) || []
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
              (item) => item?.order_status === "UNDELIVERED"
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
            filterOrdersByType(DayData?.orders?.items || []).filter(
              (item) => item?.order_status === "CANCELLED"
            ).length
          }
          onClick={() => onSelectOrderStatus("CANCELLED")}
          removeSelect={filters.status !== "CANCELLED"}
          isSelected={filters.status === "CANCELLED"}
        />
      </div>
      <Input
        icon={<Search />}
        description="Search"
        type="search"
        onKeyPress={(e) =>
          e.key === "Enter" ? onSeachOrder(e.target.value) : undefined
        }
        placeholder="Search by Order ID"
      />
      <h2>List of Lending Orders</h2>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Order Tracking No.</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Original Guided Trial Schedule</th>
                <th>Guided Trial Schedule</th>
                <th>Delivery Date</th>
                <th>Lead Source</th>
                <th>Status</th>
                <th>Last Undeliverable Reason</th>
              </tr>
            </thead>
            <tbody>{rows(filterOrdersByType(filterOrders()) || [])}</tbody>
          </Table>
        </div>
      </ScrollArea>
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil(
            (filterOrdersByType(filterOrders())?.length || 0) / 100
          )}
          page={pagination.active}
          onChange={pagination.setPage}
        />
      </Group>
      <br />
    </div>
  );
};
