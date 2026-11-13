import React from "react";
import { DownloadTemplate } from "./Upload/DownloadTemplate";
import { UploadTemplate } from "./Upload/UploadTemplate";
import { Flex, Text, Title } from "@mantine/core";
import { Stack } from "../../Elements";

export const ReportUpload = () => {
  return (
    <Stack align="center" justify="center">
      <div style={{ marginTop: 80 }}>
        <Title align="center" order={1}>
          Upload your End of Day Report
        </Title>
        <Text align="center" size="sm" color="dimmed">
          Easily upload daily reports to stay organized and simplify later data
          analysis.
        </Text>
      </div>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <UploadTemplate />
        <DownloadTemplate />
      </Flex>
    </Stack>
  );
};
