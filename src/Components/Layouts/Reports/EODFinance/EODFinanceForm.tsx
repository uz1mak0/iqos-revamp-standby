import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import {
  DatePicker,
  Group,
  Input,
  Select,
  Paper as CustomPaper,
  Stack,
  Button,
  LoadingOverlay,
} from "../../../Elements";
import { Title, Paper, Text, NumberInput } from "@mantine/core";
import { useStyles } from "./EOD.styles";
import { CategoryItemsFormProps, getFinanceFormInputs } from "./Config";
import { FinanceForm } from "./FinanceForm";
import { FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { UploadImage } from "./UploadImage";
import { ImagePreview } from "../../../Elements/Uploader/ImagePreview";
import { openConfirmModal } from "@mantine/modals";
import Notification from "../../../Elements/Notification/Notification";
import Amplify, { Storage } from "../../../../Utilities/Backend";
import { createEodOfDayReport } from "../../../../GraphQL/ReportsSchema";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../../Store/StoreAtom";
import { useUploadPortalStore } from "../Store";
import { getTotalDRSales } from "../../../../GraphQL/RecordSalesSchema";
import { getTotalOrders } from "../../../../GraphQL/OrderManagementSchema";
import { BackButton } from "../../../Modules/BackButton/BackButton";
import { Reload } from "tabler-icons-react";
import { SummaryView } from "./SummaryView";

export const EODFinaceForm = () => {
  const [endOfDayReportCreate] = useMutation(createEodOfDayReport, {
    context: { clientName: "warehouse" },
  });
  const { isReportSubmission, setIsReportSubmission, warehouses } =
    useUploadPortalStore();
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  const initialImage: FileWithPath[] = [];
  const { classes } = useStyles();
  const [selectedChannel] = useAtom(channelAtom);
  const [loading, setLoading] = useState(false);
  const [isSummary, setIsSummary] = useState(false);
  const [selectedDeclaration, setSelectedDeclaration] = useState("FINANCE");

  const [fetchRecordSalesTotal] = useLazyQuery(getTotalDRSales, {
    context: { clientName: "warehouse" },
  });
  const [fetchEcommOrdersTotal] = useLazyQuery(getTotalOrders, {
    context: { clientName: "order" },
  });

  const initialValues = {
    store: "",
    date: "",
    transaction_id: "",
    finance: getFinanceFormInputs,
    zReceipt: initialImage,
    xReceipt: initialImage,
    additionalReceipt: initialImage,
    remittanceReceipt: initialImage,
    excess_amount: 0,
    reason: "",
  };

  const form = useForm({
    initialValues: initialValues,
    validate: {
      store: (value) => !value,
      date: (value) => !value,
      transaction_id: (value) => !value,
    },
  });

  const uploadImage = async (file: FileWithPath, type: string) => {
    if (file) {
      var key = `${form.values?.store}/EOD/${
        form.values.transaction_id
      }/${type}.${file.type.split("/")[1]}`; //sig.key;
      return Storage.put(`retail/${key}`, file, {
        level: "public",
        contentType: file.type,
      })
        .then(() => {
          return {
            bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
            key: `public/retail/${key}`,
            region: process.env.NEXT_PUBLIC_REGION,
          };
        })
        .catch((e) => {
          return undefined;
        });
    } else {
      return undefined;
    }
  };

  const onSubmit = async (values: {
    store: string;
    date: string;
    transaction_id: string;
    finance: CategoryItemsFormProps[];
    zReceipt: FileWithPath[];
    xReceipt: FileWithPath[];
    additionalReceipt: FileWithPath[];
    remittanceReceipt: FileWithPath[];
    excess_amount: number;
    reason: string;
  }) => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    setIsSummary(false);
    const zReceiptImage = await uploadImage(values.zReceipt[0], "Z-RECEIPT");
    const xReceiptImage = await uploadImage(values.xReceipt[0], "X-RECEIPT");
    const additionalReceiptImage = await uploadImage(
      values.additionalReceipt[0],
      "ADDITIONAL-RECEIPT",
    );
    const remmitanceReceiptImage = await uploadImage(
      values.remittanceReceipt[0],
      "REMITTANCE-RECEIPT",
    );

    setLoading(true);

    const salesSummary = values.finance
      .filter((e) => e.category === "Sales Summary")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const proofOfPayment = values.finance
      .filter((e) => e.category === "Proof of Payment")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const financeDeclaration = {
      sales_summary: {
        total_cash_sales: salesSummary[0].value || 0,
        total_dc_sales: salesSummary[1].value || 0,
        total_cc_sales: salesSummary[2].value || 0,
        total_gcash_sales: salesSummary[3].value || 0,
        total_sales: salesSummary[4].value || 0,
        x_reading_total_sales: salesSummary[5].value || 0,
        declared_sales_amount: salesSummary[6].value || 0,
        final_sales_amount: salesSummary[7].value || 0,
      },
      uploads: {
        receipt: zReceiptImage,
        x_receipt: xReceiptImage,
        excess_amount: values.excess_amount,
        reason: values.reason,
      },
      proof_of_payment: {
        total_cash_deposit: proofOfPayment[0].value,
        date_of_deposit: proofOfPayment[1].value,
        deposit_reference_number: proofOfPayment[2].value,
      },
      upload_slip: {
        remittance: remmitanceReceiptImage,
        additional: additionalReceiptImage,
        reason: values.reason,
      },
    };

    endOfDayReportCreate({
      variables: {
        input: {
          type: WMS.DeclarationType.EOD_FINANCE,
          warehouse_id: values.store,
          datetime: dayjs(values.date).unix(),
          created_by: user.username ?? " ",
          invoice_id: values.transaction_id,
          finance_declarations: financeDeclaration,
          non_sellable_declarations: null,
        },
      },
    })
      .then((res) => {
        Notification.info({
          message: "Successfully Submit EOD Finance Report",
        });
        setSelectedDeclaration("NON_SELLABLE");
        form.setValues(initialValues);
        setIsReportSubmission(false);
        setLoading(false);
        setIsSummary(false);
      })
      .catch((e) => {
        // Notification.error({ message: e.message });
        Notification.error({ message: "Inoivce ID already exist" });

        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onResetFields = () =>
    openConfirmModal({
      centered: true,
      title: "Clear All Fields",
      children: (
        <Text size="sm">
          Are you sure you want to clear all fields? tThis will remove all
          entered data and reset the form.
        </Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Yes, Clear All Fields", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        form.setValues(initialValues);
        Notification.success({
          message: "All fields have been cleared successfully",
        });
      },
    });

  const onGetFinalAmountValue = (date: Date) => {
    if (selectedChannel === "DIRECT_RETAIL") {
      fetchRecordSalesTotal({
        variables: {
          warehouse_id: form.values.store,
          date_filter: {
            from: dayjs(date).startOf("day").unix(),
            to: dayjs(date).endOf("day").unix(),
          },
        },
      }).then((res) => {
        const totalAmount = res.data.saleTransactions?.items?.reduce(
          (sum: number, item: WMS.SaleTransaction) =>
            sum + (item?.total_price || 0),
          0,
        );

        form.setFieldValue("finance.7.value", totalAmount);
      });
    } else {
      fetchEcommOrdersTotal({
        variables: {
          warehouse_id: form.values.store,
          order_status: ORDER.OrderStatus.Completed,
          date_filter: {
            from: dayjs(date).format("YYYY-MM-DD"),
            to: dayjs(date).format("YYYY-MM-DD"),
          },
        },
      }).then((res) => {
        const totalAmount = res?.data?.orders?.items.reduce(
          (sum: number, item: ORDER.Order) =>
            sum + Number(item?.price?.gross || 0),
          0,
        );
        form.setFieldValue("finance.7.value", totalAmount);
      });
    }
  };
  return (
    <Paper radius={8}>
      <LoadingOverlay visible={loading} />
      <SummaryView
        form={form}
        visible={isSummary}
        onClose={() => setIsSummary(false)}
        onSubmit={() => onSubmit(form.values)}
      />
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Stack>
          <Group position="apart">
            <BackButton
              onClick={() => setIsReportSubmission(false)}
              url={""}
              title={"Operations Record"}
            />

            <Button
              icon={<Reload />}
              onClick={onResetFields}
              customType="danger"
            >
              Clear All Fields
            </Button>
          </Group>
          <Group grow>
            <Select
              {...form.getInputProps("store")}
              label="Store"
              searchable
              placeholder="Select store"
              data={
                warehouses.map((wh) => {
                  return {
                    label: `${wh?.name}`,
                    value: `${wh?.id}`,
                  };
                }) || []
              }
            />
            <DatePicker
              label="Date"
              disabled={!!!form.values.store}
              placeholder="Pick Date"
              maxDate={new Date()}
              {...form.getInputProps("date")}
              onChange={(e) => {
                form.setFieldValue("date", dayjs(e).format("YYYY-MM-DD"));
                onGetFinalAmountValue(e);
              }}
              clearable
            />
            <Input
              label="Transaction ID"
              placeholder="Enter transaction ID"
              {...form.getInputProps("transaction_id")}
            />
          </Group>

          <div>
            <FinanceForm
              form={form}
              category="Sales Summary"
              getFinanceFormInputs={getFinanceFormInputs}
            />
            <CustomPaper radius={8}>
              <Stack>
                <Group position="apart">
                  <Title order={4}>Upload Receipt</Title>
                  <Group>
                    <UploadImage name="zReceipt" type="Z-Receipt" form={form} />
                    <UploadImage name="xReceipt" type="X-Receipt" form={form} />
                  </Group>
                </Group>
                <Group grow>
                  {form.values.zReceipt.length > 0 && (
                    <div>
                      <Text>Z-Receipt</Text>

                      <ImagePreview
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
                        onRemove={() => form.setFieldValue("xReceipt", [])}
                        files={form.values.xReceipt}
                        notImage={false}
                      />
                    </div>
                  )}
                </Group>
              </Stack>
            </CustomPaper>
            <FinanceForm
              form={form}
              category="Proof of Payment"
              getFinanceFormInputs={getFinanceFormInputs}
            />
            <CustomPaper radius={8}>
              <Stack>
                <Group position="apart">
                  <Title order={4}>Upload Slip</Title>
                  <Group>
                    <UploadImage
                      name="additionalReceipt"
                      type="Additional Upload"
                      form={form}
                    />
                    <UploadImage
                      name="remittanceReceipt"
                      type="Upload Remittance"
                      form={form}
                    />
                  </Group>
                </Group>
                <Group grow>
                  {form.values.additionalReceipt.length > 0 && (
                    <div>
                      <Text>Additional Receipt</Text>
                      <ImagePreview
                        onRemove={() =>
                          form.setFieldValue("additionalReceipt", [])
                        }
                        files={form.values.additionalReceipt}
                        notImage={
                          !IMAGE_MIME_TYPE.some((mime) =>
                            form.values.additionalReceipt[0].type.includes(
                              mime,
                            ),
                          )
                        }
                      />
                    </div>
                  )}

                  {form.values.remittanceReceipt.length > 0 && (
                    <div>
                      <Text>Remittance</Text>
                      <ImagePreview
                        onRemove={() =>
                          form.setFieldValue("remittanceReceipt", [])
                        }
                        files={form.values.remittanceReceipt}
                        notImage={false}
                      />
                    </div>
                  )}
                </Group>
                <Group grow>
                  <NumberInput
                    label="Excess or Shortage Amount"
                    placeholder="Enter amount"
                    {...form.getInputProps("excess_amount")}
                  />
                  <Input
                    label="Reason"
                    placeholder="Enter reason"
                    {...form.getInputProps("reason")}
                  />
                </Group>
              </Stack>
            </CustomPaper>
          </div>

          <CustomPaper radius={8}>
            <Group position="right">
              <Button customType="secondary">Cancel</Button>
              <Button
                onClick={() => {
                  if (form.validate().hasErrors) {
                    return Notification.error({
                      message: "Please fill up required fields!",
                    });
                  } else {
                    setIsSummary(true);
                  }
                }}
                // disabled={!form.values.finance.some((e) => e.value)}
              >
                Summary End of Day Report
              </Button>
            </Group>
          </CustomPaper>
        </Stack>
      </form>
    </Paper>
  );
};
