import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Group,
  Input,
  NumberInput,
  ScrollArea,
  Select,
  Switch,
  Table,
} from "../../Elements";
import { Search } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { useQuery } from "@apollo/client";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { UseFormReturnType } from "@mantine/form";
import { LoadingOverlay } from "@mantine/core";

type Props = {
  channel: string | undefined;
  form: UseFormReturnType<
    {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    },
    (values: {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }) => {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }
  >;
};
export const SKUThresholds = ({ channel, form }: Props) => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { loading, data: skuData } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });

  const [showThresholds, setShowThresholds] = useState(false);

  const SKUTYPE = ["ACCESSORIES", "HEETS", "DEVICES", "VOUCHER", "ZYN"];

  const filterSKU = (value: string | undefined) => {
    const list: WMS.Sku[] = skuData?.skus?.items || [];

    if (showThresholds) {
      return list.filter((e) =>
        form.values.thresholds?.some((f) => f?.gtin === e.gtin)
      );
    } else {
      if (!value) return list;
      return list.filter(
        (e: WMS.Sku) =>
          e.description?.toLowerCase()?.includes(value?.toLocaleLowerCase()) ||
          e.gtin?.toLowerCase()?.includes(value?.toLocaleLowerCase()) ||
          e?.sku?.toLowerCase().includes(value.toLowerCase()) ||
          e.type?.toLowerCase()?.includes(value?.toLowerCase())
      );
    }
  };

  const onChangeThresholds = (sku: WMS.Sku, value: number | undefined) => {
    console.log(sku, value);
    const currentThresholds = form.values.thresholds;
    const exists = currentThresholds?.find((e) => e?.gtin === sku.gtin);
    form.setFieldValue(
      "thresholds",
      exists
        ? currentThresholds?.map((e) =>
            e?.gtin === sku.gtin ? { ...e, value } : e
          )
        : [
            ...(currentThresholds || []),
            { gtin: sku.gtin, sku: sku.sku, value },
          ]
    );
  };

  const onFilterWithThresholds = (checked: boolean) => {
    if (checked) {
      setFilter(undefined);
    }
    setShowThresholds(checked);
  };

  const rows = filterSKU(filter).map((element: WMS.Sku, index: number) => (
    <tr key={`sku-${index}`}>
      <td>{element.gtin}</td>
      <td>{element.sku}</td>
      <td>{element.description}</td>
      <td>{element.unit_of_measure}</td>
      <td>{element.type}</td>
      <td>
        <NumberInput
          value={
            form.values.thresholds?.find((e) => e?.gtin === element.gtin)
              ?.value ?? undefined
          }
          onChange={(value) => onChangeThresholds(element, value)}
          min={0}
          precision={0}
        />
      </td>
    </tr>
  ));

  return (
    <div>
      <Group position="apart" mx="15">
        <Group>
          <h3>List of SKU</h3>
          <Input
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 250 }}
            icon={<Search />}
            disabled={showThresholds}
            placeholder="Search by SKU"
          />
          <Select
            clearable
            onChange={(e) => setFilter(e)}
            disabled={showThresholds}
            data={SKUTYPE.map((e: string) => {
              return {
                label: e,
                value: e,
              };
            })}
            placeholder="Filter by SKU type"
          />
          <Switch
            onChange={(e) => onFilterWithThresholds(e.target.checked)}
            size="xl"
            onLabel="With Threshold"
            offLabel="ALL"
          />
        </Group>
      </Group>

      <ScrollArea style={{ height: 600 }}>
        <LoadingOverlay visible={loading} />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Unit of Measure</th>
              <th>Type</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
