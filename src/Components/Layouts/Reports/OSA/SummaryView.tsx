import React from "react";
import {
  Accordion,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
} from "../../../Elements";
import { UseFormReturnType } from "@mantine/form";
import { CategoryItemsFormProps } from "./Config";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Title, Text } from "@mantine/core";
import { ImagePreview } from "../../../Elements/Uploader/ImagePreview";
import { Check } from "tabler-icons-react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UseFormReturnType<
    {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    },
    (values: {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    }) => {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    }
  >;
};
export const SummaryView = ({ visible, onClose, onSubmit, form }: Props) => {
  return (
    <Modal size={1200} centered opened={visible} onClose={onClose}>
      <Paper radius={8}>
        <Stack>
          <Text> Store: {form.values.store}</Text>
          <Text> Date: {form.values.date}</Text>
        </Stack>
      </Paper>
      <Stack>
        <Paper radius={8}>
          <Title order={4}>{"Device Availability"}</Title>
          <Grid>
            {form.values?.items
              .filter((e) => e.category === "Device Availability")
              .map((cat, f) => (
                <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                  <Text>
                    {cat?.title} : {cat?.value}
                  </Text>
                </Grid.Col>
              ))}
          </Grid>
        </Paper>
        <Paper radius={8}>
          <Title order={4}>{"HTU/TEREA Availability"}</Title>
          <Grid>
            {form.values?.items
              .filter((e) => e.category === "HTU/TEREA Availability")
              .map((cat, f) => (
                <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                  <Text>
                    {cat?.title} : {cat?.value}
                  </Text>
                   <Text>Expiration : {cat?.expiration}</Text>
                </Grid.Col>
              ))}
          </Grid>
        </Paper>
        <Paper radius={8}>
          <Title order={4}>{"ZYN Availability"}</Title>
          <Grid>
            {form.values?.items
              .filter((e) => e.category === "ZYN Availability")
              .map((cat, f) => (
                <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                  <Text>
                    {cat?.title} : {cat?.value}
                  </Text>
                  <Text>Expiration : {cat?.expiration}</Text>
                </Grid.Col>
              ))}
          </Grid>
        </Paper>
        <Paper radius={8}>
          <Title order={4}>{"Additional Items"}</Title>
          <Grid>
            {form.values?.items
              .filter((e) => e.category === "Additional Items")
              .map((cat, f) => (
                <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                  <Text>
                    {cat?.title} : {String(cat?.value)}
                  </Text>
                </Grid.Col>
              ))}
          </Grid>
        </Paper>
      </Stack>

      <Group position="right">
        <Button customType="secondary" onClick={onClose}>
          Close & Review Details
        </Button>
        <Button rightIcon={<Check />} onClick={onSubmit}>
          Submit OSA
        </Button>
      </Group>
    </Modal>
  );
};
