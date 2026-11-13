import { useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import {
  DateRangePicker,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
} from "../../Elements";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import {
  getFailedOrders,
  getOrders,
} from "../../../GraphQL/OrderManagementSchema";
import { ORDER } from "../../../GraphQL";

export const FailedOrders = () => {
  const { classes } = useStyles();

  const {
    data: dataFailedOrder,
    refetch: refetchFailedOrder,
    loading: loadingFailedOrder,
  } = useQuery(getFailedOrders, {
    context: { clientName: "order" },
    variables: {
      date_filter: {
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().endOf("month").format("YYYY-MM-DD"),
      },
    },
  });

  const rows = () => {
    return dataFailedOrder?.ordersFailed?.items?.map(
      (e: ORDER.FailedOrder, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>
              {dayjs(Number(e.date_created)).format("MMMM-DD-YYYY hh:mm A")}
            </td>
            <td>{e.file_name}</td>
            <td>{e.process_status}</td>
            <td>
              <div style={{ whiteSpace: "pre-wrap", width: 500 }}>
                <span>{e.error_log}</span>
              </div>
            </td>
            <td>{e.url}</td>
          </tr>
        </React.Fragment>
      ),
    );
  };

  return (
    <div>
      <LoadingOverlay visible={loadingFailedOrder} />
      <Group align="center">
        <DateRangePicker
          defaultValue={[
            dayjs().startOf("month").toDate(),
            dayjs().endOf("month").toDate(),
          ]}
          onChange={(date: [Date, Date]) => {
            if (!date[1]) return;
            refetchFailedOrder({
              date_filter: {
                from: dayjs(date[0]).format("YYYY-MM-DD"),
                to: dayjs(date[1]).format("YYYY-MM-DD"),
              },
            });
          }}
          description="Date"
        />
      </Group>
      <h2>List of Failed Orders</h2>
      <ScrollArea style={{ height: 700 }}>
        <div>
          <Table>
            <thead>
              <tr>
                <th>Date of Order</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Error Log</th>
                <th>Url</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
