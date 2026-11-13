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
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    },
    (values: {
      store: string;
      date: string;
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    }) => {
      store: string;
      date: string;
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    }
  >;
};
export const SummaryView = ({ visible, onClose, onSubmit, form }: Props) => {
  return (
    <Modal size={1200} centered opened={visible} onClose={onClose}>
      <Paper radius={8}>
        <Stack>
          <Title order={3}>{form.values?.transaction_id}</Title>
          <Divider />
          <Text> Store: {form.values.store}</Text>
          <Text> Date: {form.values.date}</Text>
          <Text> User: {}</Text>
        </Stack>
      </Paper>
      <Accordion
        multiple
        defaultValue={["non-sellable", "finance"]}
        variant="separated"
      >
        <Accordion.Item value="non-sellable">
          <Accordion.Control>
            Non-Sellable Declarations Details
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Paper radius={8}>
                <Title order={4}>{"Daily Overview"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "Daily Overview")
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
                <Title order={4}>{"Guided Trial - ZYN: (offtake)"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter(
                      (e) => e.category === "Guided Trial - ZYN: (offtake)",
                    )
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
                <Title order={4}>{"Guided Trial - Terea: (offtake)"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter(
                      (e) => e.category === "Guided Trial - Terea: (offtake)",
                    )
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
                <Title order={4}>{"White Goods: Paper Bags"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "White Goods: Paper Bags")
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
                <Title order={4}>{"Others"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "Others")
                    .map((cat, f) => (
                      <Grid.Col key={`${cat?.title}-${f}`} span={6}>
                        <Text>
                          {cat?.title} : {cat?.value}
                        </Text>
                      </Grid.Col>
                    ))}
                </Grid>
              </Paper>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group position="right">
        <Button customType="secondary" onClick={onClose}>
          Close & Review Details
        </Button>
        <Button rightIcon={<Check />} onClick={onSubmit}>
          Submit End of Day Report
        </Button>
      </Group>
    </Modal>
  );
};
