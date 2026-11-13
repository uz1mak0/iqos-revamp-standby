import React, { useEffect, useState } from "react";
import {
  Button,
  DateRangePicker,
  Group,
  Paper,
  Select,
} from "../../../Elements";
import dayjs from "dayjs";
import { Download } from "tabler-icons-react";
import { useLazyQuery } from "@apollo/client";
import { getCLSReport } from "../../../../GraphQL/CRMSchema";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  isGeneratingReport: boolean;
  generateReport: (state: boolean) => void;
  channel: string | undefined;
};

export const CLSReport = (props: Props) => {
  const [onLoadCLSReport, { loading }] = useLazyQuery(getCLSReport, {
    context: { clientName: "crm" },
    fetchPolicy: "no-cache",
  });
  const [type, setType] = useState("TRIAL");
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);

  const onDownload = () => {
    props.generateReport(true);
    onLoadCLSReport({
      variables: {
        type: type,
        from: dayjs(dates[0]).format("YYYY-MM-DD"),
        to: dayjs(dates[1]).format("YYYY-MM-DD"),
      },
    })
      .then((res) => {
        if (res.data.reports) {
          Notification.success({
            title: "Download Reports",
            message: "Success",
          });
          window.open(res.data.reports, "_blank");
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      })
      .finally(() => props.generateReport(false));
  };
  return (
    <Paper radius={8}>
      <h3>CLS</h3>
      <Group position="apart">
        <div>
          <Group>
            <Select
              description="Type"
              defaultValue={"TRIAL"}
              placeholder="Select Type"
              onChange={(value) => setType(value)}
              data={["HYPERCARE", "TRIAL"]}
            />
            <DateRangePicker
              value={dates}
              allowSingleDateInRange={true}
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
          onClick={() => onDownload()}
        >
          Download CLS Report
        </Button>
      </Group>
    </Paper>
  );
};
