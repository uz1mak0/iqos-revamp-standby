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
import { CategoryItemsFormProps, items } from "./Config";
import { NonSellableForm } from "./NonSellableForm";
import { InputWithExp } from "./InputWithExp";
import { openConfirmModal } from "@mantine/modals";
import Notification from "../../../Elements/Notification/Notification";
import { onshelfAvailCreate } from "../../../../GraphQL/ReportsSchema";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../../Store/StoreAtom";
import { useUploadPortalStore } from "../Store";
import { getTotalDRSales } from "../../../../GraphQL/RecordSalesSchema";
import { getTotalOrders } from "../../../../GraphQL/OrderManagementSchema";
import { BackButton } from "../../../Modules/BackButton/BackButton";
import { Reload } from "tabler-icons-react";
import { SummaryView } from "./SummaryView";

export const OSAForm = () => {
  const [Create] = useMutation(onshelfAvailCreate, {
    context: { clientName: "warehouse" },
  });
  const { isReportSubmission, setIsReportSubmission, warehouses } =
    useUploadPortalStore();
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();
  const [selectedChannel] = useAtom(channelAtom);
  const [loading, setLoading] = useState(false);
  const [isSummary, setIsSummary] = useState(false);

  const [fetchRecordSalesTotal] = useLazyQuery(getTotalDRSales, {
    context: { clientName: "warehouse" },
  });
  const [fetchEcommOrdersTotal] = useLazyQuery(getTotalOrders, {
    context: { clientName: "order" },
  });

  const initialValues = {
    store: "",
    date: "",
    items: items,
  };

  const form = useForm({
    initialValues: initialValues,
    validate: {
      store: (value) => !value,
      date: (value) => !value,
    },
  });

  const onSubmit = async (values: {
    store: string;
    date: string;
    items: CategoryItemsFormProps[];
  }) => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    setIsSummary(false);

    setLoading(true);

    const devicesAvailability = values.items
      .filter((e) => e.category === "Device Availability")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
          expiration: undefined,
        };
      });

    const HTUTEREAAvailability = values.items
      .filter((e) => e.category === "HTU/TEREA Availability")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
          expiration: e.expiration,
        };
      });

    const ZYNAvailability = values.items
      .filter((e) => e.category === "ZYN Availability")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
          expiration: e.expiration,
        };
      });

    const additionalItems = values.items
      .filter((e) => e.category === "Additional Items")
      .map((e) => {
        return {
          title: e.title,
          type: e.type,
          value: e.value,
          expiration: undefined,
        };
      });

    const nonSelleble = [
      {
        title: "Device Availability",
        items: devicesAvailability,
      },
      {
        title: "HTU/TEREA Availability",
        items: HTUTEREAAvailability,
      },
      {
        title: "ZYN Availability",
        items: ZYNAvailability,
      },
      {
        title: "Additional Items",
        items: additionalItems,
      },
    ];

    Create({
      variables: {
        input: {
          invoice_id: `OSA_${dayjs().unix()}`,
          warehouse_id: values.store,
          datetime: dayjs(values.date).unix(),
          created_by: user.username ?? " ",
          items: nonSelleble,
        },
      },
    })
      .then((res) => {
        Notification.info({ message: "Successfully Submit OSA Report" });
        form.setValues(initialValues);
        setIsReportSubmission(false);
        setLoading(false);
        setIsSummary(false);
      })
      .catch((e) => {
        // Notification.error({ message: e.message });
        Notification.error({ message: "Creating OSA Failed" });
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
          </Group>
          <NonSellableForm
            form={form}
            category="Device Availability"
            getNonSellableFormInputs={items}
          />
          <InputWithExp
            form={form}
            category="HTU/TEREA Availability"
            getNonSellableFormInputs={items}
          />
          <InputWithExp
            form={form}
            category="ZYN Availability"
            getNonSellableFormInputs={items}
          />
          <NonSellableForm
            form={form}
            category="Additional Items"
            getNonSellableFormInputs={items}
          />
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
                Summary OSA
              </Button>
            </Group>
          </CustomPaper>
        </Stack>
      </form>
    </Paper>
  );
};
