import React, { useState } from "react";
import {
  Button,
  DateRangePicker,
  Group,
  Paper,
  MultiSelect,
} from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { requestWMSReport } from "../../../../GraphQL/ReportsSchema";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";
import { WMS } from "../../../../GraphQL";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  isGeneratingReport: boolean;
  warehouseList: WMS.Warehouse[];
  onRequestReport: (id: string) => void;
  channel: string | undefined;
};

export const OSAReport = ({
  isGeneratingReport,
  warehouseList,
  onRequestReport,
  channel,
}: Props) => {
  const [requestReport, { loading }] = useMutation(requestWMSReport, {
    context: { clientName: "warehouse" },
  });

  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);

  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [userRoles] = useAtom(rolesAtom);

  const onDownload = async () => {
    const requestID = `REQUEST_${dayjs().unix()}`;

    const warehouseIds = [...new Set(selectedWarehouses.filter(Boolean))];

    const variables = {
      request_id: requestID,
      type: WMS.ReportType.osa,
      date_filter: {
        from: dayjs(dates[0]).format("YYYY-MM-DD"),
        to: dayjs(dates[1]).format("YYYY-MM-DD"),
      },
      warehouse_ids:
        warehouseIds.length > 0 ? warehouseIds : undefined,
      channel,
    };

    // Debug logs
    console.group("OSA Report Request");
    console.log("Selected Warehouses:", selectedWarehouses);
    console.log("Normalized Warehouse IDs:", warehouseIds);
    console.log(
      "Mutation Variables:",
      JSON.parse(JSON.stringify(variables))
    );
    console.groupEnd();

    onRequestReport(requestID);

    try {
      await requestReport({
        variables,
      });

      Notification.info({
        title: "On Shelf Availability Report",
        message: "Generating report. Please wait...",
      });
    } catch (error: any) {
      console.error("OSA Report Error:", error);

      Notification.error({
        message: error.message,
      });
    }
  };

  return (
    <Paper radius={8}>
      <h3>On Shelf Availability</h3>

      <Group position="apart">
        <Group>
          <DateRangePicker
            description="Date"
            defaultValue={dates}
            dropdownType="modal"
            onChange={(value) => setDates(value)}
          />

          <div
            data-testid="eod-select-wh"
            style={{ width: 260, minWidth: 260 }}
          >
            <MultiSelect
              searchable
              clearable
              description="Warehouse"
              placeholder="Select warehouse(s)"
              data={warehouseList.map((warehouse) => ({
                label: warehouse.name ?? "",
                value: warehouse.id ?? "",
              }))}
              value={selectedWarehouses}
              onChange={(values) => {
                const uniqueValues = [...new Set(values.filter(Boolean))];

                console.log(
                  "Warehouse Selection Changed:",
                  uniqueValues
                );

                setSelectedWarehouses(uniqueValues);
              }}
            />
          </div>
        </Group>

        <Button
          icon={<Download />}
          disabled={
            loading ||
            isGeneratingReport ||
            !dates ||
            !dates[0] ||
            !dates[1]
          }
          onClick={onDownload}
        >
          Download OSA Report
        </Button>
      </Group>
    </Paper>
  );
};