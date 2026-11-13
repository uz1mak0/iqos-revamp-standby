import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import {
  DatePicker,
  Group,
  Input,
  Select,
  Paper as CustomPaper,
  Stack,
  Button,
  LoadingOverlay,
  NumberInput,
  Image,
} from "../../../Elements";
import { Title, Paper, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { openConfirmModal } from "@mantine/modals";
import dayjs from "dayjs";
import { Storage } from "../../../../Utilities/Backend";

import Notification from "../../../Elements/Notification/Notification";
import { UploadImage } from "./UploadImage";
import { BackButton } from "../../../Modules/BackButton/BackButton";
import { Reload } from "tabler-icons-react";
import { useUploadPortalStore } from "../Store";
import { useAtom } from "jotai";
import { channelAtom, userAtom } from "../../../../Store/StoreAtom";
import { createPurchaseOrderReport } from "../../../../GraphQL/ReportsSchema";

export const POForm = () => {
  const { setIsReportSubmission, warehouses } = useUploadPortalStore();
  const [selectedChannel] = useAtom(channelAtom);
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    store: "",
    date: "",
    sales_invoice: "",
    order_id: "",
    cust_ref_no: "",
    delivery_note: "",
    receive_by: "",
    remarks: "",
    po_amount: 0,
    attachments: [] as FileWithPath[],
  };

  const form = useForm({
    initialValues,
    validate: {
      store: (v) => (!v ? "Store is required" : null),
      date: (v) => (!v ? "Date is required" : null),
      sales_invoice: (v) => (!v ? "Sales invoice is required" : null),
      order_id: (v) => (!v ? "Order ID is required" : null),
      cust_ref_no: (v) => (!v ? "Customer ref is required" : null),
      po_amount: (v) => (v <= 0 ? "PO amount is required" : null),
      attachments: (files) =>
        !files || files.length === 0
          ? "At least one attachment is required"
          : null,
    },
  });

  const [createPO] = useMutation(createPurchaseOrderReport, {
    context: { clientName: "warehouse" },
  });

  // Upload all attachments
  const uploadAttachments = async (files: FileWithPath[]) => {
    return Promise.all(
      files.map(async (file, i) => {
        const ext = file.type.split("/")[1];
        const key = `${form.values.store}/po/${form.values.sales_invoice}/${i}-${file.name}.${ext}`;
        await Storage.put(`purchaseOrder/${key}`, file, {
          level: "public",
          contentType: file.type,
        });
        return {
          bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
          key: `public/purchaseOrder/${key}`,
          region: process.env.NEXT_PUBLIC_REGION,
        };
      }),
    );
  };

  const onSubmit = async (values: typeof initialValues) => {
    if (form.validate().hasErrors)
      return Notification.error({
        message: "Please fill all required fields!",
      });

    setLoading(true);
    try {
      // Upload attachments to S3
      const attachments = await uploadAttachments(values.attachments);

      // Call GraphQL mutation
      const { data } = await createPO({
        variables: {
          input: {
            warehouse_id: values.store,
            date: dayjs(values.date).unix(),
            sales_invoice: values.sales_invoice,
            amount_in_si: values.po_amount,
            attachments,
            channel: selectedChannel,
            created_by: user.username,
            order_id: values.order_id,
            cust_ref_no: values.cust_ref_no,
            delivery_note: values.delivery_note,
            receive_by: values.receive_by,
            remarks: values.remarks,
          },
        },
      });

      Notification.success({
        message: `PO ${data.POsCreate.sales_invoice} created successfully`,
      });

      form.reset();
    } catch (err) {
      console.error(err);
      Notification.error({ message: "Failed to create PO" });
    } finally {
      setLoading(false);
    }
  };

  const onResetFields = () =>
    openConfirmModal({
      centered: true,
      title: "Clear All Fields",
      children: (
        <Text size="sm">Are you sure you want to clear all fields?</Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Yes", cancel: "Cancel" },
      onConfirm: () => form.reset(),
    });

  return (
    <Paper radius={8}>
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Group position="apart">
            <BackButton
              onClick={() => setIsReportSubmission(false)}
              url=""
              title="Operations Record"
            />
            <Button
              icon={<Reload />}
              onClick={onResetFields}
              customType="danger"
            >
              Clear All Fields
            </Button>
          </Group>

          <CustomPaper radius={8}>
            <Group grow>
              <Select
                placeholder="Select Store"
                {...form.getInputProps("store")}
                label="Store"
                searchable
                data={warehouses
                  .filter((w) => w?.id && w?.name)
                  .map((w) => ({
                    label: w!.name as string,
                    value: w!.id as string,
                  }))}
              />
              <DatePicker
                label="Invoice Date"
                disabled={!form.values.store}
                maxDate={new Date()}
                {...form.getInputProps("date")}
                onChange={(d) =>
                  form.setFieldValue(
                    "date",
                    d ? dayjs(d).format("YYYY-MM-DD") : "",
                  )
                }
              />
              <Input
                label="Sales Invoice"
                placeholder="Enter Sales Invoice"
                {...form.getInputProps("sales_invoice")}
              />
            </Group>
          </CustomPaper>

          <CustomPaper radius={8}>
            <Group grow>
              <Input
                label="Order #"
                {...form.getInputProps("order_id")}
                placeholder="Enter Order #"
              />
              <Input
                label="Customer Ref #"
                placeholder="Enter ref #"
                {...form.getInputProps("cust_ref_no")}
              />
              <Input
                label="Delivery Note"
                placeholder="Enter Notes"
                {...form.getInputProps("delivery_note")}
              />
              <NumberInput
                label="PO Amount"
                placeholder="Enter Amount"
                min={0}
                {...form.getInputProps("po_amount")}
              />
            </Group>
          </CustomPaper>

          <CustomPaper radius={8}>
            <Group grow>
              <Input
                label="Receive By"
                {...form.getInputProps("receive_by")}
                placeholder="Enter Receive By"
              />
              <Input
                label="Remarks/Note"
                placeholder="Remarks/Note"
                {...form.getInputProps("remarks")}
              />
            </Group>
          </CustomPaper>

          <CustomPaper radius={8}>
            <Stack>
              <Group position="apart">
                <Title order={4}>Upload Attachments</Title>
                <UploadImage
                  name="attachments"
                  type="Upload Attachments"
                  form={form}
                />
              </Group>

              {form.values.attachments?.length > 0 && (
                <Stack spacing="xs">
                  <Text>Uploaded Files</Text>
                  {form.values.attachments.map((file: File, index: number) => {
                    const isImage = file.type.startsWith("image/");
                    return (
                      <Group key={index} position="apart" align="center">
                        {isImage ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={80}
                            height={80}
                          />
                        ) : (
                          <Text>{file.name}</Text>
                        )}
                        <Button
                          customType="danger"
                          onClick={() => {
                            const newFiles = [...form.values.attachments];
                            newFiles.splice(index, 1);
                            form.setFieldValue("attachments", newFiles);
                          }}
                        >
                          Remove
                        </Button>
                      </Group>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </CustomPaper>

          <CustomPaper radius={8}>
            <Group position="right">
              {/* <Button customType="secondary">Cancel</Button> */}
              <Button type="submit">Create PO</Button>
            </Group>
          </CustomPaper>
        </Stack>
      </form>
    </Paper>
  );
};
