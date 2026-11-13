import React, { useState } from "react";
import { Card, Flex, Text, Image } from "@mantine/core";
import { Button } from "../../../Elements";
import { IconBookUpload, IconUpload } from "@tabler/icons-react";
import { TemplateForm } from "./TemplateForm/TemplateForm";
import UploadTemplateIcon from "../../../../../assets/reports/upload-template.png";

export const UploadTemplate = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <TemplateForm opened={visible} onClose={() => setVisible(false)} />
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
          <Image src={UploadTemplateIcon} alt="LOGO" width={63} />
          <Text weight={500}>Upload Template</Text>
          <Text size="sm" color="dimmed">
            You can upload one at a time in CSV formats.{" "}
            <span style={{ visibility: "hidden" }}>
              upload one or multiple files at a time in CSV
            </span>
          </Text>
          <Button icon={<IconUpload />} onClick={() => setVisible(true)}>
            Upload Template
          </Button>
        </Flex>
      </Card>
    </div>
  );
};
