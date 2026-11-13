import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import {
  DatePicker,
  Grid,
  Group,
  Input,
  Select,
  Paper as CustomPaper,
  Stack,
  Button,
  LoadingOverlay,
} from "../../../Elements";
import { getWarehouses } from "../../../../GraphQL/InventorySchema";
import { Title, Paper, Text, NumberInput } from "@mantine/core";
import { useStyles } from "./EOD.styles";
import {
  CategoryItemsFormProps,
  getFinanceFormInputs,
  getNonSellableFormInputs,
} from "./Config";
import { NonSellableForm } from "./NonSellableForm";
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

export const EODForm = () => {
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
  const [selectedDeclaration, setSelectedDeclaration] =
    useState("NON_SELLABLE");

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
    non_sellable: getNonSellableFormInputs,
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
      var key = `${form.values?.store}/EOD/${form.values.transaction_id
        }/${type}.${file.type.split("/")[1]}`;
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
    non_sellable: CategoryItemsFormProps[];
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

    const dailyOverview = values.non_sellable
      .filter((e) => e.category === "Daily Overview")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const tdkVariant = values.non_sellable
      .filter((e) => e.category === "TDK Variant")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const whiteGoodsPaperBags = values.non_sellable
      .filter((e) => e.category === "White Goods: Paper Bags")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const guidedTrialZynItems = values.non_sellable
      .filter((e) => e.category === "Guided Trial - ZYN: (offtake)")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const guidedTrialTereaItems = values.non_sellable
      .filter((e) => e.category === "Guided Trial - Terea: (offtake) Sticks")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

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

    const others = values.non_sellable
      .filter((e) => e.category === "Others")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
        };
      });

    const financeDeclaration = {
      sales_summary: {
        total_cash_sales: salesSummary[0]?.value || 0,
        total_dc_sales: salesSummary[1]?.value || 0,
        total_cc_sales: salesSummary[2]?.value || 0,
        total_gcash_sales: salesSummary[3]?.value || 0,
        total_sales: salesSummary[4]?.value || 0,
        x_reading_total_sales: salesSummary[5]?.value || 0,
        declared_sales_amount: salesSummary[6]?.value || 0,
        final_sales_amount: salesSummary[7]?.value || 0,
      },
      uploads: {
        receipt: zReceiptImage,
        x_receipt: xReceiptImage,
        excess_amount: values.excess_amount,
        reason: values.reason,
      },
      proof_of_payment: {
        total_cash_deposit: proofOfPayment[0]?.value,
        date_of_deposit: proofOfPayment[1]?.value,
        deposit_reference_number: proofOfPayment[2]?.value,
      },
      upload_slip: {
        remittance: remmitanceReceiptImage,
        additional: additionalReceiptImage,
        reason: values.reason,
      },
    };

    const nonSelleble = [
      {
        category: "Daily Overview",
        category_items: dailyOverview,
      },
      {
        category: "Guided Trial - ZYN: (offtake)",
        category_items: guidedTrialZynItems,
      },
      {
        category: "Guided Trial - Terea: (offtake) Sticks",
        category_items: guidedTrialTereaItems,
      },
      {
        category: "TDK Variant",
        category_items: tdkVariant,
      },
      {
        category: "White Goods: Paper Bags",
        category_items: whiteGoodsPaperBags,
      },
      {
        category: "Others",
        category_items: others,
      },
    ];

    endOfDayReportCreate({
      variables: {
        input: {
          type: WMS.DeclarationType.EOD,
          warehouse_id: values.store,
          datetime: dayjs(values.date).unix(),
          created_by: user.username ?? " ",
          invoice_id: values.transaction_id,
          non_sellable_declarations: nonSelleble,
        },
      },
    })
      .then((res) => {
        Notification.info({ message: "Successfully Submit EOD Report" });
        setSelectedDeclaration("NON_SELLABLE");
        form.setValues(initialValues);
        setIsReportSubmission(false);
        setLoading(false);
        setIsSummary(false);
      })
      .catch((e) => {
        Notification.error({ message: "Invoice ID already exists" });
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
          Are you sure you want to clear all fields? This will remove all
          entered data and reset the form.
        </Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Yes, Clear All Fields", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        setSelectedDeclaration("NON_SELLABLE");
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
          0
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
          0
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
              disabled={!form.values.store}
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

          {selectedDeclaration === "NON_SELLABLE" && (
            <div>
              <NonSellableForm
                form={form}
                category="Daily Overview"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
              <NonSellableForm
                form={form}
                category="Guided Trial - ZYN: (offtake)"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
              <NonSellableForm
                form={form}
                category="Guided Trial - Terea: (offtake) Sticks"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
              <NonSellableForm
                form={form}
                category="TDK Variant"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
              <NonSellableForm
                form={form}
                category="White Goods: Paper Bags"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
              <NonSellableForm
                form={form}
                category="Others"
                getNonSellableFormInputs={getNonSellableFormInputs}
              />
            </div>
          )}

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