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
                <Title order={4}>{"TDSK/TDK Release"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "TDSK/TDK")
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
                <Title order={4}>{"ZYN Items"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "ZYN Items")
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
                <Title order={4}>{"Guided Trial: ZYN"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "Guided Trial: ZYN")
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
                <Title order={4}>{"Guided Trial: TEREA"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "Guided Trial: TEREA")
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
                <Title order={4}>{"TDK Variant"}</Title>
                <Grid>
                  {form.values?.non_sellable
                    .filter((e) => e.category === "TDK Variant")
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
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="finance">
          <Accordion.Control>Finance Declarations Details</Accordion.Control>
          <Accordion.Panel>
            <Paper radius={8}>
              <Stack>
                <Title order={4}>Sales Summary</Title>
                <Group grow>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total Cash Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[0]?.value
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total DC Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[1]?.value
                      }
                    </Text>
                  </Group>
                </Group>
                <Group grow>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total CC Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[2]?.value
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total GCash Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[3]?.value
                      }
                    </Text>
                  </Group>
                </Group>
                <Group grow>
                  <Divider />
                  <Divider />
                </Group>
                <Group grow>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[4]?.value
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>X-Reading Total Sales:</Text>
                    <Text>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[5]?.value
                      }
                    </Text>
                  </Group>
                </Group>
                <Group grow>
                  <Group position="apart">
                    <Text fw={700}>DECLARED SALES AMOUNT:</Text>
                    <Text fw={700}>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[6]?.value
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text fw={700}>FINAL SALES AMOUNT:</Text>
                    <Text fw={700}>
                      {
                        form.values.finance?.filter(
                          (e) => e.category === "Sales Summary"
                        )[7]?.value
                      }
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Paper>
            <Paper radius={8}>
              <Stack>
                <Title order={4}>Upload Receipt</Title>
                <Group grow position="apart">
                  <Group grow>
                    {form.values.zReceipt.length > 0 && (
                      <div>
                        <Text>Z-Receipt</Text>

                        <ImagePreview
                          view={true}
                          onRemove={() => form.setFieldValue("zReceipt", [])}
                          files={form.values.zReceipt}
                          notImage={false}
                        />
                      </div>
                    )}

                    {form.values.xReceipt.length > 0 && (
                      <div>
                        <Text>X-Receipt</Text>
                        <ImagePreview
                          view={true}
                          onRemove={() => form.setFieldValue("xReceipt", [])}
                          files={form.values.xReceipt}
                          notImage={false}
                        />
                      </div>
                    )}
                  </Group>
                </Group>
                <Group grow>
                  <Text>
                    Excess or Shortage Amount: {form.values.excess_amount}
                  </Text>
                  <Text>Reason: {form.values.reason}</Text>
                </Group>
              </Stack>
            </Paper>
            <Paper radius={8}>
              <Stack>
                <Title order={4}>Proof of Payment</Title>
                <Group grow>
                  <Text>
                    Total Cash Deposit:{" "}
                    {
                      form.values.finance?.filter(
                        (e) => e.category === "Proof of Payment"
                      )[0]?.value
                    }
                  </Text>
                  <Text>
                    Date of Deposit:{" "}
                    {
                      form.values.finance?.filter(
                        (e) => e.category === "Proof of Payment"
                      )[1]?.value
                    }
                  </Text>
                </Group>
                <Group position="apart">
                  <Text>
                    Deposit Reference Number:{" "}
                    {
                      form.values.finance?.filter(
                        (e) => e.category === "Proof of Payment"
                      )[2]?.value
                    }
                  </Text>
                </Group>
              </Stack>
            </Paper>
            <Paper radius={8}>
              <Stack>
                <Title order={4}>Uploaded Slip</Title>

                <Group grow>
                  {form.values.additionalReceipt.length > 0 && (
                    <div>
                      <Text>Additional Receipt</Text>
                      <ImagePreview
                        view={true}
                        onRemove={() =>
                          form.setFieldValue("additionalReceipt", [])
                        }
                        files={form.values.additionalReceipt}
                        notImage={
                          !IMAGE_MIME_TYPE.some((mime) =>
                            form.values.additionalReceipt[0].type.includes(mime)
                          )
                        }
                      />
                    </div>
                  )}

                  {form.values.remittanceReceipt.length > 0 && (
                    <div>
                      <Text>Remittance</Text>
                      <ImagePreview
                        view={true}
                        onRemove={() =>
                          form.setFieldValue("remittanceReceipt", [])
                        }
                        files={form.values.remittanceReceipt}
                        notImage={false}
                      />
                    </div>
                  )}
                </Group>
              </Stack>
            </Paper>
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
