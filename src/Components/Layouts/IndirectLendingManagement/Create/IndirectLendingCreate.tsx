import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  DatePicker,
  Input,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
} from "../../../Elements";
import { Plus } from "tabler-icons-react";
import { Grid, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  RecordSaleItems,
  RecordSalesItemsProps,
} from "../../RecordSales/RecordSaleItems";
import { useAtom } from "jotai";
import { rolesAtom, userAtom, channelAtom } from "../../../../Store/StoreAtom";
import { RecordSalesFormInputs } from "../../RecordSales/RecordSalesConfig";
import { WMS } from "../../../../GraphQL";
import { useMutation, useQuery } from "@apollo/client";
import { getWarehouses } from "../../../../GraphQL/InventorySchema";
import Notification from "../../../Elements/Notification/Notification";
import IndirectLendingItems from "./IndirectLendingItems";
import dayjs from "dayjs";
import { recordSalesTransaction } from "../../../../GraphQL/RecordSalesSchema";

export const IndirectLendingCreate = () => {
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  const [opened, setOpened] = useState(false);
  const [channel] = useAtom(channelAtom);
  const initialItems: RecordSalesItemsProps[] = [];

  const { loading: loadingDirect, data: directData } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const { loading: loadingIndirect, data: indirectData } = useQuery(
    getWarehouses,
    {
      context: { clientName: "warehouse" },
      variables: { channel: "INDIRECT_CHANNEL" },
    },
  );

  const loadingWarehouses = loadingDirect || loadingIndirect;

  const warehouses: WMS.Warehouse[] = useMemo(() => {
    return Array.from(
      new Map(
        [
          ...(directData?.warehouses?.items || []),
          ...(indirectData?.warehouses?.items || []),
        ].map((wh) => [wh.id, wh]),
      ).values(),
    );
  }, [directData, indirectData]);

  const [onRecordSale, { loading: loadingRecordSale }] = useMutation(
    recordSalesTransaction,
    { context: { clientName: "warehouse" } },
  );
  const form = useForm<RecordSalesFormInputs>({
    initialValues: {
      warehouse_id: "",
      date_created: new Date(),
      transaction_number: "",
      cegid_no: "",
      type: "Lending",
      remarks: "",
      created_by: "",
      sales_expert: "",
      payment_type: "",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      scanned_items: initialItems,
      scanner: "",
      receipt: [],
      remittance: [],
      additional_attachment: [],
      return_notes: "",
      lead_source: "",
      club_status: "",
      link_tags: [] as string[],
      ir_error_tags: [] as string[],
      incident_report_id: "",
    },
    validate: {
      warehouse_id: (value) => (!value ? "Please select Warehouse!" : null),
      date_created: (value) => (!value ? "Please select Date!" : null),
    },
  });

  useEffect(() => {
    if (user.username) {
      form.setFieldValue("created_by", user.username);
    }
  }, [user]);

  const onClose = () => {
    setOpened(false);
    form.reset();
  };

  const onSaveLending = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });

    if (form.values.scanned_items.length === 0)
      return Notification.error({ message: "Please add scanned items!" });

    if (form.values.scanned_items.some((e) => !e.quantity || e.quantity <= 0))
      return Notification.error({
        message: "Quantity cannot be less than or equal to zero!",
      });

    if (
      form.values.scanned_items.some(
        (e) => !e.inputs && e?.sku?.type === "DEVICES",
      )
    )
      return Notification.error({
        message: "Scanned item(s) has empty input!",
      });

    const salesTransactionInputs = {
      transaction_no: form.values.transaction_number,
      warehouse_id: form.values.warehouse_id,
      remarks: form.values.remarks,
      created_by: form.values.created_by,
      type: "LENDING",
      channel: channel,
      date_created:
        dayjs().unix() -
        dayjs().startOf("day").unix() +
        dayjs(form.values.date_created).startOf("day").unix(),
      total_price: Number(
        form.values.scanned_items.reduce(
          (a, item) => a + (item?.price || 0),
          0,
        ),
      ),
      items: form.values.scanned_items.map((item) => ({
        gtin: item.gtin,
        quantity: item.quantity,
        price: item.price,
        inputs: item?.sku?.type === "DEVICES" ? item.inputs : [],
        serials: item?.sku?.type === "DEVICES" ? item.inputs : [],
        sku: {
          name: item?.sku?.description,
          description: item.sku?.description,
          gtin: item.gtin,
          sku: item.sku?.sku,
          unit_of_measure: item?.sku?.unit_of_measure,
          type: item?.sku?.type,
          price: item.sku?.price,
        },
      })),
    };

    onRecordSale({ variables: { input: salesTransactionInputs } })
      .then(() => {
        Notification.success({ message: "Lending Order Created" });
        form.setFieldValue("created_by", user?.username || "");
        onClose();
      })
      .catch((e) => {
        const gqlError = e?.graphQLErrors?.[0];
        Notification.error({
          message: gqlError?.message || e.message || "Something went wrong",
        });
      });
  };

  const disableLendingSubmit = () => {
    if (!form.values.transaction_number) return true;
    if (form.values.scanned_items.length < 1) return true;
    if (!form.values.scanned_items.some((e) => e.sku?.type === "DEVICES"))
      return true;
    return false;
  };

  return (
    <div>
      <Modal
        title="Create Lending"
        opened={opened}
        size={1900}
        onClose={onClose}
        centered
      >
        <form>
          <LoadingOverlay visible={loadingRecordSale || loadingWarehouses} />
          <Paper radius={15}>
            <h4>Lending Order Details</h4>
            <Grid>
              <Grid.Col md={3} lg={4}>
                <Input
                  withAsterisk
                  description="Order ID"
                  placeholder="Enter Order ID"
                  onChange={(e) =>
                    form.setFieldValue("transaction_number", e.target.value)
                  }
                />
              </Grid.Col>

              <Grid.Col md={3} lg={4}>
                <Select
                  searchable
                  {...form.getInputProps("warehouse_id")}
                  required
                  description="Warehouse"
                  placeholder="Select Warehouse"
                  disabled={form.values.scanned_items.length > 0}
                  onChange={(e) => {
                    form.setFieldValue("sales_expert", "");
                    form.setFieldValue("warehouse_id", e);
                  }}
                  data={warehouses
                    .filter((e) =>
                      userRoles.isFullAdmin || userRoles.isDirectRetailAdmin
                        ? true
                        : user?.office_ids?.some((o) => o === e.id),
                    )
                    .map((wh) => ({
                      value: wh.id as string,
                      label: wh.name as string,
                    }))}
                />
              </Grid.Col>

              <Grid.Col md={3} lg={4}>
                <DatePicker
                  {...form.getInputProps("date_created")}
                  description="Date"
                  dropdownType="modal"
                />
              </Grid.Col>
            </Grid>
          </Paper>

          <IndirectLendingItems form={form} />
        </form>

        <Group position="right">
          <Button customType="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={disableLendingSubmit()}
            onClick={onSaveLending}
            customType="primary"
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Button onClick={() => setOpened(true)} icon={<Plus />}>
        Create Lending
      </Button>
    </div>
  );
};
