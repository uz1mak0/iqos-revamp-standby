import React from "react";
import { Button, Group, Paper } from "../../../Elements";
import { Download } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { requestWMSReport } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";
import dayjs from "dayjs";

type Props = {
  isGeneratingReport: boolean;
  onRequestReport: (id: string | undefined) => void;
  channel: string | undefined;
};

export const InventorySnapShotReport = (props: Props) => {
  const [requestReportID, { loading: loadingRequest }] = useMutation(
    requestWMSReport,
    { context: { clientName: "warehouse" } }
  );
  const [userRoles] = useAtom(rolesAtom);

  const onDownload = () => {
    const requestID = `REQUEST_${dayjs().unix()}`;
    props.onRequestReport(requestID);
    setTimeout(() => {
      requestReportID({
        variables: {
          request_id: requestID,
          type: "INVENTORY",
          channel: props.channel,
        },
      })
        .then(() => {
          Notification.info({
            message: "Generating report. please wait...",
            title: "Inventory Snapshot Report",
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
      <Group position="apart">
        <h3>Inventory Snapshot</h3>
        <Button
          icon={<Download />}
          onClick={() => onDownload()}
          disabled={props.isGeneratingReport}
        >
          Download Inventory Snapshot
        </Button>
      </Group>
    </Paper>
  );
};
