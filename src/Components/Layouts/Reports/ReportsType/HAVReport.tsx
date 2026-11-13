import React, { useState } from "react";
import {
  Button,
  DateRangePicker,
  Group,
  Paper,
  Select,
} from "../../../Elements";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";
import { useLazyQuery } from "@apollo/client";
import { report } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { WMS } from "../../../../GraphQL";
import { Download } from "tabler-icons-react";

type Props = {
  isGeneratingReport: boolean;
  generateReport: (state: boolean) => void;
  warehouseList: WMS.Warehouse[];
};

export const HAVReport = (props: Props) => {
  const [onLoadReport] = useLazyQuery(report, {
    context: { clientName: "order" },
    fetchPolicy: "no-cache",
  });
  const [dates, setDates] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [userRoles] = useAtom(rolesAtom);

  const onDownload = () => {
    props.generateReport(true);
    onLoadReport({
      variables: {
        type: "HAV",
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

  return (
    <Paper radius={8}>
      <Group position="apart">
        <h3>HAV</h3>
        <Button
          disabled={
            (dates && dates[1] ? false : true) || props.isGeneratingReport
          }
          icon={<Download />}
          onClick={() => onDownload()}
        >
          Download HAV Report
        </Button>
      </Group>
    </Paper>
  );
};
