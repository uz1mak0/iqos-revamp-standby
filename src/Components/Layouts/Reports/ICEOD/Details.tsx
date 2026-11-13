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
} from "../../../Elements";
import { Group, Text, Title, Image } from "@mantine/core";
import { IconPdf } from "@tabler/icons-react";
import { Download } from "tabler-icons-react";
import dayjs from "dayjs";

type Props = {
  eod: WMS.EndOfDay | undefined;
  onClose: () => void;
};

export const Details = ({ eod, onClose }: Props) => {
  const [selectedImage, setSelectedImage] =
    useState<string | undefined>(undefined);

  const showImage = () => {
    return (
      <Modal
        centered
        onClose={() => setSelectedImage(undefined)}
        opened={!!selectedImage}
      >
        <Image src={selectedImage} alt="Without placeholder" />
      </Modal>
    );
  };
  const UploadImages = (src: string, type: string) => (
    <Group
      onClick={() =>
        !src.includes(".pdf") ? setSelectedImage(src) : undefined
      }
      grow
    >
      {src.includes(".pdf") ? (
        <Group style={{ height: 100 }}>
          <Button icon={<Download />} onClick={() => window.open(src)}>
            Download PDF
          </Button>
        </Group>
      ) : (
        <Image width={100} height={100} src={src} alt="Without placeholder" />
      )}
      <Text>{type}</Text>
    </Group>
  );
  return (
    <Modal
      title="End of Day Report Details"
      size={1200}
      centered
      opened={!!eod}
      onClose={onClose}
    >
      {showImage()}
      <Paper radius={8}>
        <Stack>
          <Title order={3}>{eod?.invoice_id}</Title>
          <Divider />
          <Text> Store: {eod?.warehouse_id}</Text>
          <Text> Date: {dayjs(Number(eod?.date_created || 0) * 1000).format("MMM-DD-YYYY")}</Text>
          <Text> User: {eod?.created_by}</Text>
        </Stack>
      </Paper>
      <Accordion variant="separated">
        <Accordion.Item value="non-sellable">
          <Accordion.Control>
            Non-Sellable Declarations Details
          </Accordion.Control>
          <Accordion.Panel>
            {eod?.non_sellable_declarations?.map((item, index) => (
              <Paper key={index} radius={8}>
                <Title order={4}>{item?.category}</Title>
                <Grid>
                  {item?.category_items?.map((cat, f) => (
                    <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                      <Text>
                        {cat?.title} : {cat?.value}
                      </Text>
                    </Grid.Col>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Accordion.Panel>
        </Accordion.Item>

      
      </Accordion>
    </Modal>
  );
};
