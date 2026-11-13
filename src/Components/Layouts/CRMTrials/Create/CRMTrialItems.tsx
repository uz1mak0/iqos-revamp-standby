import React, { useRef, useState } from "react";
import {
  Control,
  UseFormSetValue,
  UseFormGetValues,
  UseFormWatch,
  FieldErrors,
  Controller,
  UseFormReset,
} from "react-hook-form";
import { Select } from "@mantine/core";
import {
  ActionIcon,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Table,
} from "../../../Elements";
import { IFormInput, VariantItems } from "./Create";
import { DeviceFloppy, Pencil, Trash, X } from "tabler-icons-react";
import {
  HypercareFormInput,
  HypercareOrders,
} from "../../../Modules/CRM/Config";
import { getZynVariants } from "../Config";
import { useQuery } from "@apollo/client";
import { getSKUs } from "../../../../GraphQL/SKUsSchema";
import { Sku, SkuType } from "../../../../GraphQL/_gql/wms/graphql";
import { SKU } from "../../SKU";

type Props = {
  control: Control<IFormInput, any>;
  setValue: UseFormSetValue<IFormInput>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  errors: FieldErrors<IFormInput>;
  reset: UseFormReset<IFormInput>;
  isUpdate?: boolean;
  isEdit?: boolean;
};

export const CRMTrialItems = (props: Props) => {
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const ref = useRef<HTMLInputElement>(null);

  const onChangeVariant = (value: string) => {
    const items = [...props.getValues("orders")];
    const skus = dataSKU.skus.items.filter((e: Sku) => e?.type === SkuType.Zyn);
    if (items.some((e) => e.sku === value)) {
      const index = items.findIndex((e) => e.sku == value);
      items[index] = {
        ...items[index],
        quantity: `${Number(items[index].quantity || 0) + 1}`,
      };
    } else {
      const sku: Sku = skus.find((e: Sku) => e.sku === value);
      if (sku) {
        items.push({
          sku: `${sku.sku}`,
          variant: `${sku.description}`,
          uom: `${sku.unit_of_measure}`,
          description: `${sku.description}`,
          quantity: "1",
        });
      }
    }
    props.setValue("orders", items);
  };

  const onRemove = (sku: string | undefined) => {
    const items = [...(props.getValues("orders") || [])];
    props.setValue(
      "orders",
      items.filter((e) => e.sku !== sku),
    );
  };

  const rows = props.watch("orders")?.map((item, index) => (
    <tr key={`list-${index}`}>
      <td>{item.sku}</td>
      <td>{item.variant}</td>
      <td>{item.description}</td>
      <td>{item.uom}</td>
      <td>{item.quantity}</td>
      <td>
        {props.getValues("status") === "COMPLETED" ? undefined : (
          <ActionIcon onClick={() => onRemove(item.sku)} color="red">
            <Trash />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <Grid align="center" justify="space-between">
        <Grid.Col span={10}>
          <Group align="center">
            <Divider label={<h2>{"Preferred Zyn Variant"}</h2>}></Divider>
            {props.getValues("status") === "PENDING" || !props.isUpdate ? (
              <Select
                radius={8}
                ref={ref}
                onChange={onChangeVariant}
                data={
                  dataSKU?.skus?.items
                    ?.filter((e: Sku) => e?.type === SkuType.Zyn)
                    ?.map((item: Sku) => {
                      return {
                        label: `${item.description}`,
                        value: `${item.sku}`,
                      };
                    }) || []
                }
                placeholder="Choose Variant"
              />
            ) : undefined}
          </Group>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
      </Grid>
      <br />
      <ScrollArea style={{ height: 300 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Variant</th>
              <th>Description</th>
              <th>UOM</th>
              <th>Qty</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
