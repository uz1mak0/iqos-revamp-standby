import React, { useState } from "react";
import { WMS } from "../../../../GraphQL";
import { Divider, Grid, Modal, Paper, Stack } from "../../../Elements";
import { Text, Title, Image } from "@mantine/core";
import dayjs from "dayjs";

type Props = {
  osa: WMS.OSA | undefined;
  onClose: () => void;
};

export const Details = ({ osa, onClose }: Props) => {
  console.log(osa);
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

  return (
    <Modal
      title="OSA Details"
      size={1200}
      centered
      opened={!!osa}
      onClose={onClose}
    >
      {showImage()}
      <Paper radius={8}>
        <Stack>
          <Title order={3}>{osa?.id}</Title>
          <Divider />
          <Text> Store: {osa?.warehouse_id}</Text>
          <Text>
            {" "}
            Date:{" "}
            {dayjs(Number(osa?.date_created || 0) * 1000).format("MMM-DD-YYYY")}
          </Text>
          <Text> User: {osa?.created_by}</Text>
        </Stack>
      </Paper>

      {osa?.items?.map((item, index) => (
        <Paper key={index} radius={8}>
          <Title order={4}>{item?.title}</Title>

          <Grid>
            {item?.items?.map((cat, f) => (
              <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                <Text>
                  {cat?.title} : {cat?.value}
                </Text>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      ))}
    </Modal>
  );
};
