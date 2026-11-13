/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Table, ActionIcon, Popover } from "../../Elements";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { ORDER } from "../../../GraphQL";
import { QuestionMark } from "tabler-icons-react";
import { Group } from "@mantine/core";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  order?: ORDER.Order;
  skus?: ORDER.InventoryItem[];
};

export const EcomVerificationDetails = (props: Props) => {
  const [user] = useAtom(rolesAtom);
  const [scannedItems, setScannedItems] = useState<ORDER.OrderItem[]>();
  const { data: dataSKU, refetch: refetchSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: user.isDirectRetailUser ? "DIRECT_RETAIL" : "ECOMM" },
  });

  useEffect(() => {
    if (dataSKU) {
      setScannedItems(
        props?.order?.items?.map((item: ORDER.OrderItem | null | undefined) => {
          const skuItem = dataSKU.skus?.items.find(
            (sku: ORDER.InventoryItem) =>
              sku.unit_of_measure === item?.quantity_unit &&
              (item?.sku == "PISK001" ? "PISK001 " : item?.sku) === sku.sku,
          );
          if (skuItem)
            return {
              ...item,
              description: skuItem?.description || item?.description,
              scanned_quantity: item?.scanned_quantity || 0,
              unconsumable: skuItem.type === "DEVICES",
              serials: item?.inventory_items?.map(
                (inv: ORDER.InventoryItem | null | undefined) =>
                  inv?.id?.toUpperCase(),
              ),
              gtin: skuItem?.gtin || "",
            };

          return {
            ...item,
            scanned_quantity: item?.scanned_quantity || 0,
            unconsumable: undefined,
            serials: item?.inventory_items?.map(
              (inv: ORDER.InventoryItem | null | undefined) =>
                inv?.id?.toUpperCase(),
            ),
          };
        }),
      );
    }
  }, [dataSKU]);

  const getSubtotal = (record: ORDER.OrderItem) => {
    var total_discount =
      record.item_discounts?.reduce(
        (total: number, item_discount: ORDER.Discount | null) =>
          total + parseFloat(`${item_discount?.discount_gross}`),
        0,
      ) || 0;
    var total =
      parseFloat(`${record?.quantity}`) *
      parseFloat(`${record.price_per_unit_original || record.price_per_unit}`);
    return total - total_discount;
  };

  const getDiscount = (record: ORDER.OrderItem) => {
    var discounts = JSON.parse(JSON.stringify(record.item_discounts || []));

    if (discounts.length == 0) return "-";
    var total_discount = discounts
      .reduce(
        (total: number, item_discount: ORDER.Discount) =>
          total + parseFloat(`${item_discount.discount_gross || 0}`),
        0,
      )
      .toFixed(2);
    return (
      <Group>
        <a> {total_discount} </a>
        <Popover>
          <Popover.Dropdown>{discountBreakdown(discounts)}</Popover.Dropdown>
          <Popover.Target>
            <div>
              <ActionIcon size={"sm"} color="blue" variant="filled">
                <QuestionMark />
              </ActionIcon>
            </div>
          </Popover.Target>
        </Popover>
      </Group>
    );
  };

  const discountBreakdown = (discounts: ORDER.Discount[]) => {
    return discounts.map((discount: ORDER.Discount, i: number) => {
      return (
        <div key={`discount-${i}`}>
          {discount.discount_code + ": " + discount.discount_gross}
        </div>
      );
    });
  };

  const rows = () => {
    return scannedItems?.map((element: ORDER.OrderItem, index: number) => {
      const skuItem = dataSKU.skus?.items.find(
        (sku: ORDER.InventoryItem) =>
          sku.unit_of_measure === element?.quantity_unit &&
          (element?.sku == "PISK001" ? "PISK001 " : element?.sku) === sku.sku,
      );
      return (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{skuItem?.gtin}</td>
            <td>{element?.sku}</td>
            <td>{element?.description}</td>
            <td>{element?.price_per_unit}</td>
            <td>{element?.quantity}</td>
            <td>{getDiscount(element)}</td>
            <td>{getSubtotal(element)}</td>
          </tr>
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <p>
        Verification Status: {props.order?.verification_status || "UNVERIFIED"}
      </p>
      <p>Note: {props.order?.note || "-"} </p>
      <br />
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>GTIN</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Item Discounts</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
        <tfoot>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              {props?.order?.price?.discounts?.map(
                (discount: ORDER.Discount | undefined | null, i: number) => {
                  if (discount?.discount_code == null) return;
                  return (
                    <sub key={`total-${i}`}>
                      {discount.discount_code +
                        " -" +
                        parseFloat(`${discount?.discount_gross || 0}`)}
                    </sub>
                  );
                },
              )}
              Total: {props?.order?.price?.gross}
            </th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};
