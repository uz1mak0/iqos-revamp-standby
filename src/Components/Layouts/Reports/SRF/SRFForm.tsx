import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useState, useRef, useEffect } from "react";
import {
  DatePicker,
  Group,
  Input,
  Select,
  Paper as CustomPaper,
  Stack,
  Button,
  LoadingOverlay,
  Image,
  Table,
} from "../../../Elements";
import { createSRF } from "../../../../GraphQL/TransactionSchema";
import { Autocomplete } from "@mantine/core";
import { Title, Paper, Text } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { openConfirmModal } from "@mantine/modals";
import dayjs from "dayjs";
import { Storage } from "../../../../Utilities/Backend";
import { getSKUs } from "../../../../GraphQL/SKUsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { BackButton } from "../../../Modules/BackButton/BackButton";
import { Reload, Trash, Check } from "tabler-icons-react";
import { useUploadPortalStore } from "../Store";
import { useAtom } from "jotai";
import { channelAtom, userAtom } from "../../../../Store/StoreAtom";

import { WMS } from "../../../../GraphQL";
import { ActionIcon } from "../../../Elements/ActionIcon";

export const SRFForm = () => {
  const { setIsReportSubmission, warehouses } = useUploadPortalStore();
  const [selectedChannel] = useAtom(channelAtom);
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [channel] = useAtom(channelAtom);
  const [scannedItems, setScannedItems] = useState<WMS.StockRequestItemInput[]>(
    [],
  );
  const [fetchSKUs] = useLazyQuery(getSKUs, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
  });

  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel === "INDIRECT_CHANNEL" ? "DIRECT_RETAIL" : channel,
    },
  });

  const initialValues = {
    store: "",
    date: "",
    codentify: "",
  };

  const form = useForm({
    initialValues,
    validate: {
      store: (v) => (!v ? "Store is required" : null),
      date: (v) => (!v ? "Date is required" : null),
    },
  });

  const [createStockRequest] = useMutation(createSRF, {
    context: { clientName: "warehouse" },
  });

  const onSubmit = async () => {
    if (form.validate().hasErrors)
      return Notification.error({
        message: "Please fill Store and Date input",
      });

    if (scannedItems.length == 0) {
      return Notification.error({
        message: "Please Add request Gtin/Skus",
      });
    }

    const hasZeroQty = scannedItems.some(
      (item) => !item.req_qty || item.req_qty <= 0,
    );

    if (hasZeroQty) {
      return Notification.error({
        message: "All requested quantities must be greater than 0",
      });
    }

    setLoading(true);
    try {
      const reasonCount: Record<WMS.Reason, number> = {
        [WMS.Reason.CRITICAL]: 0,
        [WMS.Reason.OOS]: 0,
        [WMS.Reason.LOW_STOCK]: 0,
        [WMS.Reason.NEW_REQUEST]: 0,
      };

      scannedItems
        .filter((item): item is WMS.StockRequestItemInput => !!item)
        .forEach((item) => {
          const reason: WMS.Reason = item.reason ?? WMS.Reason.NEW_REQUEST;
          reasonCount[reason]++;
        });

      const mostCommonReason = (
        Object.keys(reasonCount) as WMS.Reason[]
      ).reduce((prev, curr) => {
        return reasonCount[curr] > reasonCount[prev] ? curr : prev;
      }, WMS.Reason.NEW_REQUEST);

      await createStockRequest({
        variables: {
          input: {
            channel: selectedChannel,
            reason: mostCommonReason,
            warehouse_id: form.values.store,
            date_input: dayjs(form.values.date).unix(),
            items: scannedItems,
          },
        },
      });

      Notification.success({
        message: `SRF created successfully`,
      });

      form.reset();
      setScannedItems([]);
    } catch (err) {
      console.error(err);
      Notification.error({ message: "Failed to create SRF" });
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
      onConfirm: () => {
        form.reset();
        setScannedItems([]);
      },
    });

  const onScanGTIN = async (gtin: string) => {
    const sku = dataSKU.skus?.items?.find((e: WMS.Sku) => e.gtin === gtin);

    if (!sku) {
      return Notification.error({
        message: "GTIN not found",
      });
    }

    setScannedItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.gtin === sku.gtin);

      if (existingIndex !== -1) {
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, req_qty: (item.req_qty ?? 0) + 1 }
            : item,
        );
      }

      const data: WMS.StockRequestItemInput = {
        description: sku.description,
        batch_id: "",
        gtin: sku.gtin,
        sku: sku.sku,
        req_qty: 1,
        curr_qty: 0,
        sc_qty: 0,
        wh_qty: 0,
        reason: WMS.Reason.NEW_REQUEST,
        inventory_type: sku.type,
      };

      return [...prev, data];
    });
  };

  const onScan = async () => {
    if (loading)
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });

    let gtin = form.values.codentify;

    if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
      console.log("first check");
      gtin = gtin + "_PMI";
      console.log(gtin);

      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      } else {
        onScanGTIN(gtin);
      }
    } else {
      onScanGTIN(gtin);
    }
  };

  const rows = () =>
    scannedItems.map((item, index) => (
      <tr key={index}>
        <td>{item.gtin?.replace("_PMI", "")}</td>
        <td>{item.description}</td>
        <td>{item.inventory_type}</td>

        <td>
          <Input
            value={item.req_qty ?? 0}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setScannedItems((prev) =>
                prev.map((row, i) =>
                  i === index ? { ...row, req_qty: value } : row,
                ),
              );
            }}
          />
        </td>

        <td>
          <Input
            value={item.curr_qty ?? 0}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              setScannedItems((prev) =>
                prev.map((row, i) =>
                  i === index ? { ...row, curr_qty: value } : row,
                ),
              );
            }}
          />
        </td>

        <td>
          <Select
            value={item.reason || ""}
            onChange={(value) =>
              setScannedItems((prev) =>
                prev.map((row, i) =>
                  i === index ? { ...row, reason: value as WMS.Reason } : row,
                ),
              )
            }
            data={[
              { label: "OOS", value: WMS.Reason.OOS },
              { label: "CRITICAL", value: WMS.Reason.CRITICAL },
              { label: "LOW_STOCK", value: WMS.Reason.LOW_STOCK },
              { label: "NEW_REQUEST", value: WMS.Reason.NEW_REQUEST },
            ]}
          />
        </td>
        <td>
          <ActionIcon color="red">
            <Trash
              onClick={() =>
                setScannedItems((prev) => prev.filter((_, i) => i !== index))
              }
            />
          </ActionIcon>
        </td>
      </tr>
    ));

  return (
    <Paper radius={8}>
      <LoadingOverlay visible={loading} />
      <Stack>
        <Group position="apart">
          <BackButton
            onClick={() => setIsReportSubmission(false)}
            url=""
            title="Stock Request Form"
          />
          <Button icon={<Reload />} onClick={onResetFields} customType="danger">
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
              label="Expected date of delivery"
              disabled={!form.values.store}
              minDate={new Date()}
              {...form.getInputProps("date")}
              onChange={(d) =>
                form.setFieldValue(
                  "date",
                  d ? dayjs(d).format("YYYY-MM-DD") : "",
                )
              }
            />
          </Group>
        </CustomPaper>

        <CustomPaper radius={8}>
          <Autocomplete
            style={{ width: "400px" }}
            {...form.getInputProps("codentify")}
            onChange={(value) => form.setFieldValue("codentify", value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onScan();
                form.setFieldValue("codentify", "");
              }
            }}
            data={
              dataSKU?.skus?.items
                .filter((sku: WMS.Sku) => sku.status !== "INACTIVE")
                .map((sku: WMS.Sku) => ({
                  value: `${sku.gtin}`,
                  label: `${sku.gtin?.replace("_PMI", "")} - ${
                    sku.description
                  } - ${sku.unit_of_measure}`,
                  description: sku.description,
                })) || []
            }
            placeholder="Scan or Input GTIN"
            description="Scan or Search"
            filter={(value, item) =>
              item.label.toLowerCase().includes(value.toLowerCase())
            }
            limit={dataSKU?.skus?.items.length || 100}
            maxDropdownHeight={200}
          />
          <br />
          <Table>
            <thead>
              <tr>
                <th>GTIN</th>
                <th>Description</th>
                <th>Type</th>
                <th>Request Qty</th>
                <th>Current Qty</th>
                <th>Reason</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>{rows()}</tbody>
          </Table>
        </CustomPaper>

        {/* create a table here with inputs edit for req_qty, curr_qty and reason (select dropdown) the 2 is number input*/}
        <Group position="center">
          {/* <Button customType="secondary">Cancel</Button> */}
          <Button
            type="submit"
            onClick={onSubmit}
            icon={<Check />}
            loading={loading}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
