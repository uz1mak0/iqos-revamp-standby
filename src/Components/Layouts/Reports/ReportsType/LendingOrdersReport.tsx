import React, { useState } from "react";
import { Button, DateRangePicker, Group, Paper } from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { requestOMSReport } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
type Props = {
  isGeneratingReport: boolean;
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const LendingOrdersReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestOMSReport,
    { context: { clientName: "order" } }
  );

  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);

  const onRequestReportID = () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);
    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: "LENDING",
          date_filter: dates
            ? {
                from: dayjs(dates[0]).format("YYYY-MM-DD"),
                to: dayjs(dates[1]).format("YYYY-MM-DD"),
              }
            : undefined,
        },
      })
        .then((res) => {
          Notification.info({
            message: "Generating report. please wait...",
            title: "Lending Orders Report",
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
      <h3>Lending Orders</h3>
      <Group position="apart">
        <div>
          <Group>
            <DateRangePicker
              defaultValue={dates}
              description="Date"
              onChange={(e) => setDates(e)}
              dropdownType="modal"
            />
          </Group>
        </div>
        <Button
          disabled={
            (dates && dates[1] ? false : true) || props.isGeneratingReport
          }
          icon={<Download />}
          onClick={() => onRequestReportID()}
        >
          Lending Data
        </Button>
      </Group>
    </Paper>
  );
};
