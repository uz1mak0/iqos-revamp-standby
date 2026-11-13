import { s3Url } from "../../../../Utilities/Backend";
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

        {/* <Accordion.Item value="finance">
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
                        eod?.finance_declarations?.sales_summary
                          ?.total_cash_sales
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total DC Sales:</Text>
                    <Text>
                      {eod?.finance_declarations?.sales_summary?.total_dc_sales}
                    </Text>
                  </Group>
                </Group>
                <Group grow>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total CC Sales:</Text>
                    <Text>
                      {eod?.finance_declarations?.sales_summary?.total_cc_sales}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>Total GCash Sales:</Text>
                    <Text>
                      {
                        eod?.finance_declarations?.sales_summary
                          ?.total_gcash_sales
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
                      {eod?.finance_declarations?.sales_summary?.total_sales}
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text c={"dimmed"}>X-Reading Total Sales:</Text>
                    <Text>
                      {
                        eod?.finance_declarations?.sales_summary
                          ?.x_reading_total_sales
                      }
                    </Text>
                  </Group>
                </Group>
                <Group grow>
                  <Group position="apart">
                    <Text fw={700}>DECLARED SALES AMOUNT:</Text>
                    <Text fw={700}>
                      {
                        eod?.finance_declarations?.sales_summary
                          ?.declared_sales_amount
                      }
                    </Text>
                  </Group>
                  <Group position="apart">
                    <Text fw={700}>FINAL SALES AMOUNT:</Text>
                    <Text fw={700}>
                      {
                        eod?.finance_declarations?.sales_summary
                          ?.final_sales_amount
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
                  <Paper radius={8}>
                    {eod?.finance_declarations?.uploads?.receipt?.key &&
                      UploadImages(
                        s3Url(eod?.finance_declarations?.uploads?.receipt?.bucket, eod?.finance_declarations?.uploads?.receipt?.key),
                        "Z-Receipt"
                      )}
                  </Paper>
                  {eod?.finance_declarations?.uploads?.x_receipt?.key && (
                    <Paper radius={8}>
                      {UploadImages(
                        s3Url(eod?.finance_declarations?.uploads?.x_receipt?.bucket, eod?.finance_declarations?.uploads?.x_receipt?.key),
                        "X-Receipt"
                      )}
                    </Paper>
                  )}
                </Group>
                <Group grow>
                  <Text>
                    Excess or Shortage Amount:{" "}
                    {eod?.finance_declarations?.uploads?.excess_amount}
                  </Text>
                  <Text>
                    Reason: {eod?.finance_declarations?.uploads?.reason}
                  </Text>
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
                      eod?.finance_declarations?.proof_of_payment
                        ?.total_cash_deposit
                    }
                  </Text>
                  <Text>
                    Date of Deposit:{" "}
                    {
                      eod?.finance_declarations?.proof_of_payment
                        ?.date_of_deposit
                    }
                  </Text>
                </Group>
                <Group position="apart">
                  <Text>
                    Deposit Reference Number:{" "}
                    {
                      eod?.finance_declarations?.proof_of_payment
                        ?.deposit_reference_number
                    }
                  </Text>
                </Group>
              </Stack>
            </Paper>
            <Paper radius={8}>
              <Stack>
                <Title order={4}>Uploaded Slip</Title>

                <Group grow>
                  {eod?.finance_declarations?.upload_slip?.remittance?.key && (
                    <Paper radius={8}>
                      {UploadImages(
                        s3Url(eod?.finance_declarations?.upload_slip?.remittance?.bucket, eod?.finance_declarations?.upload_slip?.remittance?.key),
                        "Remittance"
                      )}
                    </Paper>
                  )}
                  {eod?.finance_declarations?.upload_slip?.additional?.key && (
                    <Paper radius={8}>
                      {UploadImages(
                        s3Url(eod?.finance_declarations?.upload_slip?.additional?.bucket, eod?.finance_declarations?.upload_slip?.additional?.key),
                        "Additional"
                      )}
                    </Paper>
                  )}
                </Group>
              </Stack>
            </Paper>
          </Accordion.Panel>
        </Accordion.Item> */}
      </Accordion>
    </Modal>
  );
};
