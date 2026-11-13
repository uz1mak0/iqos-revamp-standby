import { from, useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { guidedTrialCreate } from "../../../GraphQL/RecordSalesSchema";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import {
  Button,
  Divider,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { RecordSale } from "../RecordSales";
import { GuidedTrialItems } from "./GuidedTrialItems";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { ArrowRight, Send } from "tabler-icons-react";
import { BackButton } from "../../Modules/BackButton/BackButton";

export const GuidedTrial = () => {
  const { height, width } = useViewportSize();
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);

  const [recordSale, setRecordSale] = useState(false);
  const initialItems: WMS.LineItemInput[] = [];
  const [onGuidedTrial, { loading: loading }] = useMutation(guidedTrialCreate, {
    context: { clientName: "warehouse" },
  });
  const { loading: loadingWh, data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      scanned_items: initialItems,
      warehouse_id: "",
      device: "",
      gt_type: "FTGT",
    },
    validate: {
      // last_name: (value) => (!value ? "Required!" : null),
      // first_name: (value) => (!value ? "Required!" : null),
      warehouse_id: (value) => (!value ? "Required!" : null),
    },
  });

  const checkErrors = async () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    if (form.values.scanned_items.length == 0)
      return Notification.error({ message: "Please add scanned items!" });
    if (form.values.scanned_items.some((e) => (e?.quantity || 0) < 0))
      return Notification.error({
        message: "Scanned item(s) has invalid qty!",
      });
    return true;
  };

  const onSave = async () => {
    const noError = await checkErrors();
    if (noError) {
      onGuidedTrial({
        variables: {
          input: {
            type: "GT",
            date_created: dayjs().unix(),
            sgt: form.values.gt_type === "SGT" ? true : false,
            first_time_gt: form.values.gt_type === "FTGT" ? false : true,
            warehouse_id: form.values.warehouse_id,
            created_by: user.username,
            device: form.values.device,
            items: form.values.scanned_items.map((e) => ({
              ...e,
              sku: { ...e.sku, channel: "DIRECT_RETAIL" },
            })),
          },
        },
      })
        .then((res) => {
          form.reset();
          Notification.success({ message: "Guided trial created" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  const onProceedToRecordSale = async () => {
    const noError = await checkErrors();
    if (noError) {
      setRecordSale(true);
    }
  };

  return (
    <Stack>
      <BackButton title="Home" url="/" />
      <LoadingOverlay visible={loading} />
      <Paper radius={10}>
        <h4>LAC Information</h4>
        <Grid>
          <Grid.Col md={4} lg={3}>
            <Select
              searchable
              {...form.getInputProps("warehouse_id")}
              description="Warehouse"
              placeholder="Select Warehouse"
              data={
                data?.warehouses?.items
                  ?.filter((e: WMS.Warehouse) =>
                    roles.isFullAdmin || roles.isDirectRetailAdmin
                      ? e
                      : user?.office_ids?.some((o) => o == e.id)
                  )
                  .map((wh: WMS.Warehouse) => {
                    return {
                      value: wh.id,
                      label: wh.name,
                    };
                  }) || []
              }
              isPullUpSelect={width <= isTabletMobileView}
              onSelectFromPullUp={(value) =>
                form.setFieldValue("warehouse_id", value)
              }
            />
          </Grid.Col>
        </Grid>
      </Paper>
      <GuidedTrialItems isRecordSale={recordSale} form={form} />
      {recordSale ? (
        <div>
          <Divider />
          <RecordSale
            isGT
            onSubmitGTRS={() => form.reset()}
            gtFormValues={
              recordSale
                ? {
                    // last_name: form.values.last_name,
                    // first_name: form.values.first_name,
                    phone_number: form.values.phone_number,
                    scanned_items: form.values.scanned_items,
                    warehouse_id: form.values.warehouse_id,
                    device: form.values.device,
                    gt_type: form.values.gt_type,
                  }
                : undefined
            }
            onCancelRecordSale={() => setRecordSale(false)}
          />
        </div>
      ) : (
        <Paper radius={10}>
          <Group position="right">
            <Button
              icon={<Send />}
              fullWidth={width <= isTabletMobileView}
              loading={loading}
              onClick={() => onSave()}
            >
              Submit Lead
            </Button>
            <Button
              icon={<ArrowRight />}
              customType="primary"
              fullWidth={width <= isTabletMobileView}
              loading={loading}
              onClick={() => onProceedToRecordSale()}
            >
              Proceed to Record Sale
            </Button>
          </Group>
        </Paper>
      )}
    </Stack>
  );
};
