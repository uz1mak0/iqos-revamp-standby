import React, { useState } from "react";
import {
  Button,
  DateRangePicker,
  Group,
  Paper,
  Select,
} from "../../../Elements";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import { requestOMSReport } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { WMS } from "../../../../GraphQL";
import { Download } from "tabler-icons-react";

type Props = {
  isGeneratingReport: boolean;
  warehouseList: WMS.Warehouse[];
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const OrderSummaryReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestOMSReport,
    { context: { clientName: "order" } }
  );
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const onDownload = () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);
    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: "ORDER_SUMMARY",
          date_filter: dates
            ? {
                from: dayjs(dates[0]).format("YYYY-MM-DD"),
                to: dayjs(dates[1]).format("YYYY-MM-DD"),
              }
            : undefined,
          warehouse_id: selectedWarehouse,
        },
      })
        .then((res) => {
          const id = res.data.reportRequest.request_id;
          if (id) {
            Notification.info({
              message: "Generating report. please wait...",
              title: "Order Summary Report",
            });
          }
        })
        .catch((e) => {
          Notification.error({ message: e.message });
          props.onRequestReport(undefined);
        });
    }, 1000);
  };

  return (
    <Paper radius={8}>
      <h3>Order Summary</h3>
      <Group position="apart">
        <div>
          <Group>
            <DateRangePicker
              defaultValue={dates}
              description="Date"
              onChange={(e) => setDates(e)}
              dropdownType="modal"
            />
            <Select
              placeholder="Select Warehouse"
              description="Warehouse"
              searchable
              data={
                props.warehouseList?.map((order: WMS.Warehouse) => {
                  return { label: `${order?.name}`, value: `${order?.id}` };
                }) || []
              }
              onChange={(e) => setSelectedWarehouse(e)}
            />
          </Group>
        </div>
        <Button
          disabled={
            (dates && dates[1] ? false : true) || props.isGeneratingReport
          }
          icon={<Download />}
          onClick={() => onDownload()}
        >
          Download Summary Report
        </Button>
      </Group>
    </Paper>
  );
};
