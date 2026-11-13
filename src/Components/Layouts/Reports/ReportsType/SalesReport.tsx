import React, { useState } from "react";
import {
  Button,
  DateRangePicker,
  Group,
  Paper,
  Select,
} from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import dayjs from "dayjs";
import { rolesAtom } from "../../../../Store/StoreAtom";
import { WMS } from "../../../../GraphQL";
import Notification from "../../../Elements/Notification/Notification";
import { requestWMSReport } from "../../../../GraphQL/ReportsSchema";

type Props = {
  isGeneratingReport: boolean;
  warehouseList: WMS.Warehouse[];
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const SalesReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestWMSReport,
    { context: { clientName: "warehouse" } }
  );
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<string | undefined>(undefined);
  const [userRoles] = useAtom(rolesAtom);

  const onDownload = () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);
    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: "SALES",
          date_filter: dates
            ? {
                from: dayjs(dates[0]).format("YYYY-MM-DD"),
                to: dayjs(dates[1]).format("YYYY-MM-DD"),
              }
            : undefined,
          warehouse_ids: selectedWarehouse ? [selectedWarehouse] : [],
          channel: props.channel,
        },
      })
        .then((res) => {
          Notification.info({
            message: "Generating report. please wait...",
            title: "Sales Report",
          });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
          props.onRequestReport(undefined);
        });
    }, 1000);
  };

  return (
    <Paper radius={8}>
      <h3>Sales</h3>
      <Group position="apart">
        <div>
          <Group>
            <DateRangePicker
              defaultValue={dates}
              description="Date"
              onChange={(e) => setDates(e)}
              dropdownType="modal"
            />
            <div data-testid={"sales-select-wh"}>
              <Select
                placeholder="Select Warehouse"
                searchable
                description="Warehouse"
                data={
                  props.warehouseList?.map((order: WMS.Warehouse) => {
                    return { label: `${order?.name}`, value: `${order?.id}` };
                  }) || []
                }
                onChange={(e) => setSelectedWarehouse(e)}
              />
            </div>
          </Group>
        </div>
        <Button
          disabled={
            (dates && dates[1] ? false : true) || props.isGeneratingReport
          }
          icon={<Download />}
          onClick={() => onDownload()}
        >
          Download Sales Report
        </Button>
      </Group>
    </Paper>
  );
};
