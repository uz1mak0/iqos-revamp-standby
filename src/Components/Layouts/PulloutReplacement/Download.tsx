import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Download as DownloadIcon } from "tabler-icons-react";
import { getReport } from "../../../GraphQL/OrderManagementSchema";
import {
  Button,
  LoadingOverlay,
  DateRangePicker,
  Group,
  Modal,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  disabled: boolean;
};

export const Download = (props: Props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [pullOutReplacementReport, { loading: loadingReport }] = useLazyQuery(
    getReport,
    { context: { clientName: "order" } },
  );
  const [date, setDate] = useState<[string, string]>();

  const onDownload = () => {
    if (!date)
      return Notification.error({ message: "Please select date range" });
    pullOutReplacementReport({
      variables: {
        type: "REPLACEMENT_ORDERS",
        date_filter: {
          from: date[0],
          to: date[1],
        },
      },
    })
      .then((res) => {
        window.open(res?.data?.report);
        Notification.success({ message: "Report Downloaded" });
        setVisible(false);
        setDate(undefined);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const modalView = () => (
    <Modal
      title={"Pullout Replacement Report Download"}
      centered
      size={620}
      opened={visible}
      onClose={() => setVisible(false)}
    >
      <DateRangePicker
        description="Date Range"
        onChange={(e: [Date, Date]) =>
          e[1]
            ? setDate([
                dayjs(e[0])?.format("YYYY-MM-DD"),
                dayjs(e[1])?.format("YYYY-MM-DD"),
              ])
            : undefined
        }
        fullWidth
      />
      <br />
      <Group position="center">
        <Button
          disabled={props.disabled}
          onClick={() => onDownload()}
          customType="primary"
          icon={<DownloadIcon />}
        >
          Download Report
        </Button>
      </Group>
    </Modal>
  );
  return (
    <div>
      <LoadingOverlay visible={loadingReport} />
      {modalView()}
      <Button
        disabled={props.disabled}
        onClick={() => setVisible(true)}
        icon={<DownloadIcon />}
      >
        Download
      </Button>
    </div>
  );
};
