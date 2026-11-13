import { s3Url } from "../../../../Utilities/Backend";
import React, { useState } from "react";
import { WMS } from "../../../../GraphQL";
import {
  Accordion,
  Button,
  Divider,
  Grid,
  Modal,
  Paper,
  Stack,
  Badge,
} from "../../../Elements";
import { Group, Text, Title, Image } from "@mantine/core";
import { Download } from "tabler-icons-react";
import dayjs from "dayjs";
import { useMutation } from "@apollo/client";
import { updatePOStatus } from "../../../../GraphQL/ReportsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { channelAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";
type Props = {
  po: WMS.POs | undefined;
  onClose: () => void;
};

export const Details = ({ po, onClose }: Props) => {
  const [selectedImage, setSelectedImage] =
    useState<string | undefined>(undefined);
  const [currentPO, setCurrentPO] = useState<WMS.POs | undefined>(po);
  const [selectedChannel] = useAtom(channelAtom);
  React.useEffect(() => {
    setCurrentPO(po);
  }, [po]);

  const [updateStatus] = useMutation(updatePOStatus, {
    context: { clientName: "warehouse" },
  });

  const handleClosePO = async () => {
    if (!currentPO?.id) return;
    try {
      await updateStatus({
        variables: {
          id: currentPO.id,
          update_by: "test",
          channel: selectedChannel,
        },
      });

      Notification.success({ message: "PO status updated to Close" });

      setCurrentPO((prev) =>
        prev
          ? {
              ...prev,
              status: "Close" as WMS.POStatus,
            }
          : prev,
      );
    } catch (err) {
      console.error(err);
      Notification.error({ message: "Failed to update PO status" });
    }
  };

  const showImage = () => (
    <Modal
      centered
      onClose={() => setSelectedImage(undefined)}
      opened={!!selectedImage}
      size="lg"
    >
      <Image src={selectedImage!} alt="Preview" />
    </Modal>
  );

  const downloadAllAttachments = async () => {
    if (!currentPO?.attachments?.length) return;

    for (const file of currentPO.attachments) {
      if (!file) continue;
      const url = s3Url(file.bucket, file.key, file.region);
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);

        const parts = file.key.split("/");
        const filename = parts[parts.length - 1];
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      } catch (err) {
        console.error("Download failed for", file.key, err);
      }
    }
  };

  const renderAttachment = (file: WMS.S3Object, type: string) => {
    const url = s3Url(file.bucket, file.key, file.region);

    return (
      <Group
        key={file.key}
        onClick={() => {
          if (!file.key.endsWith(".pdf")) setSelectedImage(url);
        }}
        grow
        spacing="sm"
      >
        <Text>{type}</Text>
        {file.key.endsWith(".pdf") ? (
          <Button
            icon={<Download />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank");
            }}
          >
            Download
          </Button>
        ) : (
          <Image width={100} height={100} src={url} alt="Attachment" />
        )}
      </Group>
    );
  };

  return (
    <Modal
      title="PO Details"
      size={1200}
      centered
      opened={!!currentPO}
      onClose={onClose}
    >
      {showImage()}

      <Paper radius={8}>
        <Stack spacing="sm">
          <Group position="apart">
            <Group>
              <Text size="xl" weight="bold">
                {currentPO?.sales_invoice}{" "}
              </Text>
              <Badge color={currentPO?.status === "Close" ? "red" : "green"}>
                {currentPO?.status}
              </Badge>
            </Group>
{/* 
            <Button
              customType="danger"
              disabled={currentPO?.status === "Close"}
              onClick={handleClosePO}
            >
              Close
            </Button> */}
          </Group>

          <Divider />
          <Text>Store: {currentPO?.warehouse_id}</Text>
          <Text>
            Date:{" "}
            {dayjs(Number(currentPO?.date_created || 0) * 1000).format(
              "MMM DD YYYY",
            )}
          </Text>
          <Text>Created by: {currentPO?.created_by}</Text>
          <Text>Updated by: {currentPO?.updated_by}</Text>
          <Text>Order ID: {currentPO?.order_id ?? "-"}</Text>
          <Text>Customer Ref No.: {currentPO?.cust_ref_no ?? "-"}</Text>
          <Text>Delivery Note: {currentPO?.delivery_note ?? "-"}</Text>
          <Text>Receive By: {currentPO?.receive_by ?? "-"}</Text>
          <Text>Remarks: {currentPO?.remarks ?? "-"}</Text>
        </Stack>

        <br />

        <Paper radius={8}>
          <Stack spacing="sm">
            {currentPO?.attachments && currentPO.attachments.length > 0 ? (
              <>
                <Button onClick={downloadAllAttachments} icon={<Download />}>
                  Download All Attachments
                </Button>

                {/* {currentPO.attachments.map((file, i) =>
                  renderAttachment(file, `Attachment ${i + 1}`)
                )} */}
              </>
            ) : (
              <Text>No attachments</Text>
            )}
          </Stack>
        </Paper>
      </Paper>
    </Modal>
  );
};
