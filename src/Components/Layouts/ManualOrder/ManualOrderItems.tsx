import { useQuery } from "@apollo/client";
import { NumberInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { Trash } from "tabler-icons-react";
import { ORDER, WMS } from "../../../GraphQL";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { ActionIcon, Group, ScrollArea, Select, Table } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { ManualOrderForm, ManualOrderItemsProps } from "./config";

type Props = {
  isCSCOrder: boolean;
  form: UseFormReturnType<
    ManualOrderForm,
    (values: ManualOrderForm) => ManualOrderForm
  >;
};

export const ManualOrderItems = (props: Props) => {
  const { loading, data } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [skus, setSkus] = useState<WMS.Sku[]>([]);

  useEffect(() => {
    if (data) {
      // CSC orders can only select SKU type "DEVICES" and ids with 48044
      if (props.isCSCOrder)
        setSkus(
          data?.skus?.items.filter(
            (e: WMS.Sku) => e?.id?.includes("48044") || e.type === "DEVICES"
          )
        );
      // Ecomm orders can select all types of SKUs.
      return setSkus(data?.skus?.items);
    }
  }, [data]);

  const rows = props?.form?.values?.items.map(
    (element: ManualOrderItemsProps, index: number) => (
      <tr key={`sku-${index}`}>
        <td data-testid={`TEST-ITEM-GTIN-${element.gtin}`}>{element.gtin?.replace("_PMI", "")}</td>
        <td data-testid={`TEST-ITEM-SKU-${element.sku}`}>{element.sku}</td>
        <td data-testid={`TEST-ITEM-DESC-${element.description}`}>
          {element.description}
        </td>
        <td>
          <NumberInput
            data-testid={`TEST-ITEM-PRICE-${element.gtin}`}
            onChange={(e) => onChangePrice(element.gtin, e || 0)}
            style={{ width: 100 }}
            precision={2}
            defaultValue={Number(element.price_per_unit)}
            min={0}
          />
        </td>
        <td>
          <NumberInput
            data-testid={`TEST-ITEM-QTY-${element.gtin}`}
            onChange={(e) => onChangeQty(element.gtin, e || 0)}
            style={{ width: 100 }}
            defaultValue={Number(element.quantity)}
            min={0}
          />
        </td>
        <td>
          {Number(element.quantity || 0) * Number(element.price_per_unit || 0)}
        </td>
        <td>
          <div data-testid={`TEST-ITEM-REMOVE-${element.gtin}`}>
            <ActionIcon onClick={() => onRemove(element.gtin)}>
              <Trash color="red" />
            </ActionIcon>
          </div>
        </td>
      </tr>
    )
  );

  const onRemove = (gtin: string | undefined) => {
    const list = [...props.form.values.items];
    props.form.setFieldValue("items", []);
    setTimeout(() => {
      props.form.setFieldValue(
        "items",
        list.filter((e) => e.gtin !== gtin)
      );
    }, 0);
  };

  const onUpdateList = (gtin: string) => {
    if (gtin) {
      const list = [...props.form.values.items];
      props.form.setFieldValue("items", []);
      if (list.some((e) => e.gtin === gtin)) {
        const index = list.findIndex((e) => e.gtin === gtin);
        list[index] = {
          ...list[index],
          quantity: (list[index]?.quantity || 0) + 1,
        };
      } else {
        const item = skus.find((e) => e.gtin === gtin);
        list.push({
          ...item,
          quantity: 1,
          gtin: gtin,
          price_per_unit: item?.price_gross || 0,
          unit_of_measure: item?.unit_of_measure,
        });
      }
      setTimeout(() => {
        props.form.setFieldValue("items", list);
      }, 0);
    }
  };

  const onChangeQty = (gtin: string | undefined, value: number) => {
    if (value < 0) {
      Notification.error({ message: "Invalid Quantity" });
    }
    const list = [...props.form.values.items];
    const index = list.findIndex((e) => e.gtin === gtin);
    list[index] = { ...list[index], quantity: value };
    props.form.setFieldValue("items", list);
  };

  const onChangePrice = (gtin: string | undefined, value: number) => {
    if (value < 0) {
      Notification.error({ message: "Invalid Price" });
    }
    const list = [...props.form.values.items];
    const index = list.findIndex((e) => e.gtin === gtin);
    list[index] = { ...list[index], price_per_unit: value };
    props.form.setFieldValue("items", list);
  };

  return (
    <div>
      <Select
        searchable
        clearable
        onChange={(e) => onUpdateList(e)}
        data-testid={`TEST-SELECT-SKU`}
        data={
          skus.map((e: WMS.Sku) => {
            return {
              label: `${e.gtin?.replace("_PMI", "")} - ${e?.description}`,
              value: `${e?.id}`,
            };
          }) || []
        }
        placeholder={"Select Items"}
        description={"Product Name"}
      />
      <ScrollArea>
        <Table captionSide="bottom" highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <caption>
            <Group position="right">
              <h3>
                {" "}
                TOTAL:{" "}
                {props.form.values.items.reduce(
                  (acc, curr) =>
                    acc + (curr?.quantity || 0) * (curr.price_per_unit || 0),
                  0
                )}
              </h3>
            </Group>
          </caption>
        </Table>
      </ScrollArea>
    </div>
  );
};
