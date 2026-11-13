import React, { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  NumberInput,
  Paper,
  Stack,
} from "../../Elements";
import { WMS } from "../../../GraphQL";
import { Title, Text, Select } from "@mantine/core";
import { Check, Trash } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { convertByBatch } from "../../../GraphQL/TransactionSchema";
import Notification from "../../Elements/Notification/Notification";

export type ValuesProps = {
  selectedSKU: WMS.Sku | undefined;
  convertQty: number;
  multiplier: number;
};

type Props = {
  username: WMS.Maybe<string> | undefined;
  transaction: WMS.Conversion | undefined;
  channel: string | undefined;
  scannedGTIN: { item: WMS.Sku | undefined; quantity: number };
  onConvertUOM: (transaction: WMS.Conversion) => void;
  onClose: () => void;
  skus: WMS.Sku[];
  conversionType: string | undefined;
};

export const UOMDetails = (props: Props) => {
  const calcMultiplier = (
    uom?: string | null,
    type?: string | null
  ): number => {
    if (props.conversionType == "bundling") {
      if (!uom || !type) return 1;
      if (uom === "PK") return type === "HEETS" ? 0.1 : 0.2;
      if (uom === "CT") return type === "HEETS" ? 10 : 5;
      return 1;
    } else {
      return 1;
    }
  };
  const uom = props.scannedGTIN?.item?.unit_of_measure ?? null;
  const type = props.scannedGTIN?.item?.type ?? null;
  const gtin = props.scannedGTIN?.item?.gtin ?? null;

  // Derive up-to-date base multiplier from current props
  const baseMultiplier = useMemo(() => calcMultiplier(uom, type), [uom, type]);

  const [values, setValues] = useState<ValuesProps>({
    selectedSKU: undefined,
    convertQty: 0,
    multiplier: baseMultiplier,
  });

  // When a new item is scanned (gtin changes) or uom/type change, reset form defaults
  useEffect(() => {
    setValues({
      selectedSKU: undefined,
      convertQty: 0,
      multiplier: baseMultiplier,
    });
  }, [gtin, baseMultiplier]);

  const [isSearch, setIsSearch] = useState(false);
  const [loadiing, setLoadiing] = useState(false);

  const onSelectSKU = (id: string | null) => {
    if (!id) {
      setValues((v) => ({ ...v, selectedSKU: undefined }));
      return;
    }
    setValues((v) => ({
      ...v,
      selectedSKU: props.skus.find((e) => e.id === id),
    }));
  };

  const onRemoveSelectedSKU = () => {
    setValues((v) => ({ ...v, selectedSKU: undefined }));
  };

  const [convertSKU] = useMutation(convertByBatch, {
    context: { clientName: "warehouse" },
  });

  const onModalClose = () => {
    // clean reset; next open will re-initialize via useEffect
    setValues({
      selectedSKU: undefined,
      convertQty: 0,
      multiplier: baseMultiplier,
    });
    setIsSearch(false);
    setLoadiing(false);
    props.onClose();
  };

  const disableConversion = (): boolean => {
    if (!values.convertQty || values.convertQty < 0) return true;
    if (values.convertQty > props.scannedGTIN.quantity) return true;
    if (!values.selectedSKU) return true;
    return false;
  };

  const onApplyConversion = () => {
    let qty = values.convertQty * values.multiplier;

    if (!Number.isInteger(qty)) {
      return Notification.error({
        message: "Quantity should be a whole number",
      });
    }

    setLoadiing(true);

    convertSKU({
      variables: {
        conversion_id: props.transaction?.id,
        input: {
          channel: props.channel,
          gtin: props.scannedGTIN.item?.gtin,
          quantity: values.convertQty,
          // Use the current state multiplier (respects user edits)
          multiplier: values.multiplier,
          destination_gtin: values.selectedSKU?.gtin,
          input_by: props.username,
        },
      },
    })
      .then((res) => {
        props.onConvertUOM(res.data.convertByBatch);
        onModalClose();
        Notification.success({ message: "UOM Successfully converted" });
      })
      .catch((error) => {
        onModalClose();

        Notification.error({ message: error.message });
      });
  };

  return (
    <Modal
      // key forces a fresh internal tree when switching scanned items (extra safety)
      key={gtin ?? "uom-modal"}
      size={900}
      title="ITEM UOM Conversion"
      opened={!!props.scannedGTIN.item}
      centered
      onClose={onModalClose}
    >
      <LoadingOverlay visible={loadiing} />
      <Stack>
        <Title order={4}>Item Details</Title>
        <Paper radius={8}>
          <Group position="apart">
            <div>
              <Text fz="xs">GTIN: {props.scannedGTIN?.item?.gtin}</Text>
              <Text fz="xs">SKU: {props.scannedGTIN?.item?.sku}</Text>
              <Text fz="xs">
                Description: {props.scannedGTIN?.item?.description}
              </Text>
            </div>
            <div>
              <div>
                <Text fz="xs">
                  {props.conversionType === "bundling"
                    ? `Inventory Type: ${props.scannedGTIN?.item?.type}`
                    : `Class Type: ${
                        props.scannedGTIN?.item?.gtin?.startsWith("GT")
                          ? "Guided Trial"
                          : props.scannedGTIN?.item?.gtin?.startsWith("PG")
                          ? "Promo Goods"
                          : "Sellable"
                      }`}
                </Text>
              </div>
            </div>
          </Group>
        </Paper>

        <Paper radius={8}>
          <Stack>
            <Title order={4}>UOM Converter Details</Title>

            <Grid>
              <Grid.Col span={8}>
                {props.conversionType === "bundling" ? (
                  <Input
                    disabled
                    description="From UOM"
                    // use value, not defaultValue, so it updates with new scans
                    value={props.scannedGTIN?.item?.unit_of_measure ?? ""}
                  />
                ) : (
                  <Input
                    disabled
                    description="From Class"
                    value={
                      props.scannedGTIN?.item?.gtin?.startsWith("GT")
                        ? "Guided Trial"
                        : props.scannedGTIN?.item?.gtin?.startsWith("PG")
                        ? "Promo Goods"
                        : "Sellable"
                    }
                  />
                )}
              </Grid.Col>

              <Grid.Col span={4}>
                <NumberInput
                  disabled
                  description="Available Qty"
                  value={props.scannedGTIN.quantity - (values.convertQty || 0)}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={8}>
                <NumberInput
                  value={values.convertQty}
                  onChange={(val) =>
                    setValues((v) => ({
                      ...v,
                      convertQty: typeof val === "number" ? val : 0,
                    }))
                  }
                  description={
                    props.conversionType === "bundling"
                      ? "Convert Qty Value"
                      : "Transfer Qty Value"
                  }
                  max={props.scannedGTIN.quantity}
                  min={0}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  value={values.multiplier}
                  onChange={(val) =>
                    setValues((v) => ({
                      ...v,
                      multiplier: typeof val === "number" ? val : 0,
                    }))
                  }
                  description="Multiplier Value"
                  min={0.1}
                  precision={2}
                  disabled={true}
                />
              </Grid.Col>
            </Grid>

            <Divider labelPosition="center" label="Convert UOM" />
            <Select
              searchable
              clearable
              value={"SELECTED_SKU"}
              onSearchChange={(e) => setIsSearch(e !== "")}
              data={
                props.conversionType === "bundling"
                  ? (isSearch
                      ? props.skus
                      : props.skus.filter((e) =>
                          e.sku?.includes(
                            `${props.scannedGTIN?.item?.sku?.split(".")[0]}`
                          )
                        )
                    ).map((e: WMS.Sku) => ({
                      label: `${e.gtin} - ${e.sku} - ${e?.description} - ${e.unit_of_measure}`,
                      value: `${e?.id}`,
                    })) || []
                  : (isSearch
                      ? props.skus
                      : props.skus.filter(
                          (e) =>
                            e.sku?.includes(
                              `${props.scannedGTIN?.item?.sku?.split(".")[0]}`
                            ) &&
                            e.unit_of_measure ===
                              props.scannedGTIN?.item?.unit_of_measure
                        )
                    ).map((e: WMS.Sku) => ({
                      label: `${e.gtin} - ${e.sku} - ${e?.description} - ${e.unit_of_measure}`,
                      value: `${e?.id}`,
                    })) || []
              }
              onChange={onSelectSKU}
              placeholder={"GTIN / SKU / Description / UOM / Converted Qty"}
              description={"Select or enter an item to convert"}
            />

            {values.selectedSKU && (
              <Paper radius={8}>
                <Group position="apart">
                  <Text fz="xs">GTIN: {values?.selectedSKU?.gtin}</Text>
                  <ActionIcon onClick={onRemoveSelectedSKU} variant="filled">
                    <Trash color="red" />
                  </ActionIcon>
                </Group>

                <Text fz="xs">SKU: {values.selectedSKU?.sku}</Text>
                <Text fz="xs">
                  Description: {values.selectedSKU?.description}
                </Text>
                <Text fz="xs">
                  To UOM: {values.selectedSKU?.unit_of_measure}
                </Text>
                <Text fz="xs">
                  Converted Qty: {values.convertQty * values.multiplier}
                </Text>
              </Paper>
            )}

            <Group position="right">
              <Button onClick={onModalClose} customType="secondary">
                Cancel
              </Button>
              <Button
                onClick={onApplyConversion}
                disabled={disableConversion()}
                icon={<Check />}
              >
                Apply Conversion
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Modal>
  );
};
