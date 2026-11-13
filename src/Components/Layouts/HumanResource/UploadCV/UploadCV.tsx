// UploadCV.tsx
import React, { useState } from "react";
import { Flex, Title, Image, Card } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { Stack, Button, Text } from "../../../Elements";
import UploadTemplateIcon from "../../../../../assets/reports/upload-template.png";
import { UploadModal, ProcessCompleteData } from "./uploadCVTemplate/UploadModal";
import Notification from "../../../Elements/Notification/Notification";

const buildCompletionMessage = ({ successCount = 0, totalCount = 0 }: ProcessCompleteData = {}) => {
  if (totalCount <= 0) return "CV extraction and screening analysis are complete!";

  const failedCount = Math.max(totalCount - successCount, 0);
  const summary = `${successCount} out of ${totalCount} CVs submitted for screening.`;
  const failedNote = failedCount > 0 ? ` ${failedCount} failed; details have been sent to your email.` : "";

  return `${summary}${failedNote} A summary email will be sent to you once processing finishes.`;
};

export const UploadCV = () => {
  const [visible, setVisible] = useState(false);

  const handleTrackingStart = () => {
    Notification.info({
      title: "Upload Successful!",
      message:
        "CVs are being processed in the background. You can safely leave this page, we'll handle the rest.",
    });
  };

  const handleTrackingComplete = (data?: { successCount?: number; totalCount?: number }) => {
    const { successCount = 0, totalCount = 0 } = data || {};
    const failedCount = totalCount - successCount;

    const message =
      totalCount > 0
        ? `${successCount} out of ${totalCount} CVs uploaded successfully.${failedCount > 0
          ? ` ${failedCount} failed; detailed information has been sent to your email.`
          : ""
        }`
        : "CV extraction and screening analysis are complete!";

    Notification.success({
      title: "Process Completed",
      message: buildCompletionMessage(data),
    });
  };

  const handleTrackingError = (errorMessage?: string) => {
    Notification.error({
      title: "Upload Failed",
      message: errorMessage || "Something went wrong while sending files to the server. Please try again.",
    });
  };

  return (
    <Stack align="center" justify="center">
      <UploadModal
        opened={visible}
        onClose={() => setVisible(false)}
        onProcessStart={handleTrackingStart}
        onProcessComplete={handleTrackingComplete}
        onProcessError={handleTrackingError}
      />

      <div style={{ marginTop: 80 }}>
        <Title align="center" order={1}>
          Upload The Candidate CVs
        </Title>
        <Text align="center" size="sm" color="dimmed">
          Easily upload CVs to the system for screening automation
        </Text>
      </div>

      <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
        <Card style={{ width: 300, height: 300 }} shadow="sm" p="lg" radius="md" withBorder>
          <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
            <Image src={UploadTemplateIcon} alt="Upload CVs" width={63} />
            <Text fw={500}>Upload CVs</Text>
            <Text size="sm" color="dimmed" align="center">
              Upload one or multiple files at a time in PDF or DOCX
            </Text>
            <Button icon={<IconUpload />} onClick={() => setVisible(true)}>
              Upload CVs
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Stack>
  );
};