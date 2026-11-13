import React from "react";
import { Button, Grid, Group, Modal, Paper, Stack } from "../../../Elements";
import { WMS } from "../../../../GraphQL";
import { Badge, Text } from "@mantine/core";

type Props = {
  warehouse: WMS.Warehouse | undefined;
  onClose: () => void;
};

export const Details = (props: Props) => {
  return (
    <Modal
      centered
      size={700}
      title={"Warehouse/Hub SMS Details"}
      opened={props.warehouse ? true : false}
      onClose={() => props.onClose()}
    >
      <Stack>
        <Paper radius={5}>
          <Stack spacing={"xs"}>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>Warehouse/Hub Name :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.name}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>Type :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.type}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>Area :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.area}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>ID :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.id}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>SMS Type :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.ecomm_sms?.type || "Default"}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>SMS Message :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                <Text> {props.warehouse?.ecomm_sms?.message || "Default"}</Text>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>Message Type :</Text>
              </Grid.Col>
              <Grid.Col span={8}>
                {props.warehouse?.ecomm_sms?.id ? (
                  <Badge>CUSTOM</Badge>
                ) : (
                  <Badge color="gray">DEFAULT</Badge>
                )}
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
        <Group position="right">
          <Button onClick={() => props.onClose()} customType="secondary">
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
