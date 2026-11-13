import React, { useState } from "react";
import { Button, Group, Paper, Select } from "../../../Elements";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import { requestOMSReport } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { ORDER, WMS } from "../../../../GraphQL";
import { Download } from "tabler-icons-react";
import { Calendar, DatePicker, DateRangePicker } from "@mantine/dates";
import { MonthPicker } from "../../../Elements/MonthPicker/MonthPicker";

type Props = {
  isGeneratingReport: boolean;
  warehouseList: WMS.Warehouse[];
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const IMSReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestOMSReport,
    { context: { clientName: "order" } }
  );
  const [dates, setDates] = useState<{ from: string; to: string }>();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");

  const checkHasError = async () => {
    if (frequency === ORDER.Frequency.Monthly) {
      if (dayjs(dates?.from, "YYYY-MM-DD").isAfter(dayjs().startOf("day"))) {
        Notification.error({
          message: "Start date cannot be in the future",
          title: "Inventory Monitoring Report",
        });
        return true;
      }
    }
  };

  const onDownload = async () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);

    const hasError = await checkHasError();

    if (hasError) {
      props.onRequestReport(undefined);
      return;
    }

    const adjustDates = {
      ...dates,
      to:
        dayjs(dates?.to).isAfter(dayjs().startOf("day")) ||
        dayjs(dates?.to).isSame(dayjs().startOf("day"))
          ? dayjs().format("YYYY-MM-DD")
          : dates?.to,
    };

    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: ORDER.ReportType.ImsReport,
          date_filter: adjustDates ?? undefined,
          frequency: frequency,
          warehouse_id: selectedWarehouse,
        },
      })
        .then((res) => {
          const id = res.data.reportRequest.request_id;
          if (id) {
            Notification.info({
              message: "Generating report. please wait...",
              title: "Inventory Monitoring Report",
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
      <h3>Inventory Monitoring Report</h3>
      <Group position="apart">
        <div>
          <Group>
            <Select
              defaultValue={frequency}
              onChange={(e) => {
                setFrequency(e);
                setDates(undefined);
              }}
              description="Frequency"
              data={[ORDER.Frequency.Monthly, ORDER.Frequency.Weekly]}
            />
            {frequency === ORDER.Frequency.Weekly && (
              <Group>
                <DatePicker
                  clearable={false}
                  firstDayOfWeek="sunday"
                  excludeDate={(e) =>
                    dayjs(e).format("ddd") !== "Sun" ||
                    dayjs(e).isAfter(dayjs())
                  }
                  modalProps={{ centered: true }}
                  dropdownType="modal"
                  description="Start Date"
                  placeholder="Select start date"
                  onChange={(e) => {
                    setDates({
                      from: dayjs(e).format("YYYY-MM-DD"),
                      to:
                        dayjs(e).isAfter(dayjs().startOf("day")) ||
                        dayjs(e).isSame(dayjs().startOf("day"))
                          ? dayjs().format("YYYY-MM-DD")
                          : dayjs(e).add(6, "day").format("YYYY-MM-DD"),
                    });
                  }}
                />
                <DatePicker
                  value={
                    dates?.to
                      ? dayjs(dates?.to).isAfter(dayjs().startOf("day")) ||
                        dayjs(dates?.to).isSame(dayjs().startOf("day"))
                        ? dayjs().toDate()
                        : dayjs(dates?.to).toDate()
                      : undefined
                  }
                  disabled
                  description="End Date"
                  placeholder=" Select start date first"
                />
              </Group>
            )}
            {frequency === ORDER.Frequency.Monthly && (
              <MonthPicker
                onChange={(date) => {
                  setDates({
                    from: dayjs(date).startOf("month").format("YYYY-MM-DD"),
                    to: dayjs(date).endOf("month").format("YYYY-MM-DD"),
                  });
                }}
              />
            )}
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
          disabled={!dates || props.isGeneratingReport || !selectedWarehouse}
          icon={<Download />}
          onClick={() => onDownload()}
        >
          Download IMS Report
        </Button>
      </Group>
    </Paper>
  );
};
