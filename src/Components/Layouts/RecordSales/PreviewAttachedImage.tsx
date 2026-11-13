import { s3Url } from "../../../Utilities/Backend";
import { Paper, Image } from "@mantine/core";
import React, { useState } from "react";
import { Grid, Group, Modal, Stack } from "../../Elements";
import { Text } from "@mantine/core";
import { WMS } from "../../../GraphQL";

type Props = {
  image: WMS.Maybe<WMS.S3Object> | undefined;
};

export const PreviewAttachedImage = (props: Props) => {
  const [openImage, setOpenImage] = useState(false);
  return (
    <div>
      <Paper withBorder shadow="xs" p="md">
        <Grid align="center">
          <Grid.Col span={3}>
            <Modal
              size={1000}
              opened={openImage}
              centered
              onClose={() => setOpenImage(false)}
            >
              <Image
                alt="image"
                src={s3Url(props.image?.bucket, props?.image?.key)}
              />
            </Modal>
            <Image
              width={100}
              height={100}
              onClick={() => setOpenImage(true)}
              alt="image"
              src={s3Url(props.image?.bucket, props?.image?.key)}
            />
          </Grid.Col>
          <Grid.Col span={8}>
            <Text fw={500}>
              {props.image?.key.replace("public/retail/", "")}
            </Text>
            <Text fz="sm" c="dimmed">
              Current image
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
};
