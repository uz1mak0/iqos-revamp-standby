import {
  BatchItems,
  InventoryItem,
  Maybe,
  SkuInventory,
} from "../../../GraphQL/_gql/wms/graphql";

export const getDeviceStatus = [
  {
    label: "DAMAGED",
    value: "DAMAGED",
  },
  {
    label: "LOSS",
    value: "LOSS",
  },
  {
    label: "CANCELLED",
    value: "CANCELLED",
  },
];

export const formatInventoryItems = (
  items: Maybe<Maybe<BatchItems>[]> | undefined,
  skuInventory: Maybe<Maybe<SkuInventory>[]> | undefined,
  warehouse: string | undefined
) => {
  const updateItems: Maybe<BatchItems>[] | undefined = [];
  items?.map((item) => {
    if (updateItems?.some((e) => e?.gtin === item?.gtin)) {
      const index = updateItems.findIndex((e) => e?.gtin === item?.gtin);
      updateItems[index] = {
        ...updateItems[index],
        quantity: (item?.quantity || 0) + (updateItems[index]?.quantity || 0),
      };
    } else {
      updateItems.push(item);
    }
  });

  return updateItems.reduce((unique: any, item: any) => {
    const gtinIndex = unique.findIndex((u: any) => u.gtin === item.gtin);
    const committed = skuInventory?.find((u: any) => u.gtin === item.gtin);

    if (gtinIndex < 0)
      return [
        ...unique,
        {
          ...item,
          total_number: item.quantity,
          committed: committed?.committed,
        },
      ];

    unique[gtinIndex].total_number += item.quantity;
    if (warehouse == "PH01") unique[gtinIndex].committed = committed?.committed;

    return unique;
  }, []);
};

export const getDeviceReconFilters = [
  {
    label: "ALL",
    value: "ALL",
  },
  {
    label: "RECONCILLED",
    value: "RECONCILLED",
  },
  {
    label: "FOR RECONCILIATION",
    value: "FOR_RECONCILIATION",
  },
];
