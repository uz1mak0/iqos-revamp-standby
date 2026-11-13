import React, { useState } from "react";
import { Button, DateRangePicker, Group, Paper } from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useLazyQuery } from "@apollo/client";
import { getGLifeReports } from "../../../../GraphQL/ReportsSchema";
import dayjs from "dayjs";
import Notification from "../../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";

type Props = {
  isGeneratingReport: boolean;
  generateReport: (state: boolean) => void;
  channel: string | undefined;
};

export const GLifeReports = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [onLoadGlifeReport, { loading: loadingGLifeReport }] = useLazyQuery(
    getGLifeReports,
    { context: { clientName: "glife" }, fetchPolicy: "no-cache" }
  );
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);

  const onDownload = () => {
    props.generateReport(true);
    onLoadGlifeReport({
      variables: {
        type: "ORDERS",
        filter: dates
          ? { from: dayjs(dates[0]).unix(), to: dayjs(dates[1]).unix() }
          : undefined,
      },
    })
      .then((res) => {
        if (res.data.report) {
          Notification.success({
            title: "Download Reports",
            message: "Success",
          });
          window.open(res.data.report, "_blank");
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      })
      .finally(() => props.generateReport(false));
  };

  const accessRole = () => {
    if (userRoles.isFullAdmin || userRoles.isPMFTCAdmin) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Paper radius={8}>
      <h3>GLife</h3>
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
          onClick={() => onDownload()}
        >
          Download GLife Report
        </Button>
      </Group>
    </Paper>
  );
};
