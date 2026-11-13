import { s3Url } from "../../../../Utilities/Backend";
import React from "react";
import { Card, Flex, Image, Text } from "@mantine/core";
import { Button } from "../../../Elements";
import { IconDownload, IconFileSpreadsheet } from "@tabler/icons-react";
import DownloadTemplateIcon from "../../../../../assets/reports/download-template.png";

export const DownloadTemplate = () => {
  //Download CSV file template link
  const onDownloadTemplate = () => {
    let url;

    const stage = process.env.NEXT_PUBLIC_PLATFORM;
    if (!stage) {
      console.error("STAGE is not defined");
      return;
    }

    if (stage == "production") {
      url =
        s3Url("data.pre.iqos.activasia.com", "uploads/template/template.csv");
    } else {
      url =
        s3Url("data.pre.iqos.activasia.com", "uploads/template/template_pre.csv");
    }
    window.open(url, "_blank");
  };

  return (
    <Card
      style={{ width: 300, height: 300 }}
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
    >
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Image src={DownloadTemplateIcon} alt="LOGO" width={65} />
        <Text weight={500}>Download Template</Text>
        <Text size="sm" color="dimmed">
          You can download the attached template example and use them as a
          starting point for your own file
        </Text>

        <Button
          onClick={onDownloadTemplate}
          color="teal"
          customType="custom"
          rightIcon={<IconDownload />}
        >
          Download Template
        </Button>
      </Flex>
    </Card>
  );
};
