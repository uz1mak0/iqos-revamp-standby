import React, { useEffect, useState } from "react";
import { ORDER, WMS } from "../../../GraphQL";
import { Paper, Table } from "../../Elements";

type Props = {
  order?: ORDER.Order;
  skus?: WMS.Sku[];
};

interface PromoItems extends ORDER.OrderItem {
  gtin?: string | null;
}

export const OrderPromoItems = (props: Props) => {
  const [promos, setPromos] = useState<PromoItems[]>([]);
  useEffect(() => {
    if (props.order && props.skus) {
      const list =
        props.order?.promo_items?.map((item) => {
          const skuItem = props?.skus?.find(
            (sku) =>
              sku.unit_of_measure === item?.quantity_unit &&
              (item?.sku == "PISK001" ? "PISK001 " : item?.sku) === sku.sku
          );
          if (skuItem)
            return {
              ...item,
              description: skuItem?.description || item?.description,
              scanned_quantity: item?.scanned_quantity || 0,
              unconsumable: skuItem.type === "DEVICES",
              serials: item?.inventory_items?.map((inv) =>
                inv?.id?.toUpperCase()
              ),
              gtin: skuItem?.gtin || "",
            };

          return {
            ...item,
            scanned_quantity: item?.scanned_quantity || 0,
            unconsumable: undefined,
            serials: item?.inventory_items?.map((inv) =>
              inv?.id?.toUpperCase()
            ),
          };
        }) || [];
      setPromos(list);
    }
  }, [props.order, props.skus]);

  const getPrice = (record: PromoItems) => {
    var total_discount =
      record.item_discounts?.reduce(
        (total, item_discount) =>
          total + parseFloat(`${item_discount?.discount_gross}`),
        0
      ) || 0;
    if (record.price_per_unit_original == undefined) {
      var header_discount =
        props.order?.price?.discounts?.reduce(
          (total, discount) =>
            total + parseFloat(`${discount?.discount_gross}`),
          0
        ) || 0;
      var per_item_discount =
        header_discount / (props?.order?.items?.length || 0);
      return (
        (record?.price_per_unit || 0) +
        total_discount +
        per_item_discount
      ).toFixed(2);
    }
    return record.price_per_unit_original.toFixed(2);
  };

  const rows = () => {
    return promos?.map((element, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td>{element.gtin}</td>
          <td>{element.sku}</td>
          <td>{element.description}</td>
          <td>{getPrice(element)}</td>
          <td>{element.quantity}</td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <Paper>
      <h2>Promo Items</h2>
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>GTIN</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
      </Table>
    </Paper>
  );
};
