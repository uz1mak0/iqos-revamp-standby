import React, { useState } from "react";
import { Button, DateRangePicker, Group, Paper } from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { requestWMSReport } from "../../../../GraphQL/ReportsSchema";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";
import dayjs from "dayjs";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  isGeneratingReport: boolean;
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const TransmittalReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestWMSReport,
    { context: { clientName: "warehouse" } }
  );
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);

  const [userRoles] = useAtom(rolesAtom);

  const onDownload = () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);
    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: "TRANSMITTAL",
          date_filter: dates
            ? {
                from: dayjs(dates[0]).format("YYYY-MM-DD"),
                to: dayjs(dates[1]).format("YYYY-MM-DD"),
              }
            : undefined,
          channel: props.channel,
        },
      })
        .then((res) => {
          Notification.info({
            message: "Generating report. please wait...",
            title: "Transmittal Report",
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
      <h3>Transmittal</h3>
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
          disabled={(dates[1] ? false : true) || props.isGeneratingReport}
          icon={<Download />}
          onClick={() => onDownload()}
        >
          Download Transmittal Report
        </Button>
      </Group>
    </Paper>
  );
};
