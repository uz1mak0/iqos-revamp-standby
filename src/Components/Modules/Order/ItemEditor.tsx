import { useMutation } from "@apollo/client";
import { LoadingOverlay } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { CircleX, CaretUp, CaretDown } from "tabler-icons-react";
import Notification from "../../Elements/Notification/Notification";
import { orderUpdate } from "../../../GraphQL/OrderManagementSchema";
import { Sku } from "../../../GraphQL/_gql/wms/graphql";
import { Order } from "../../../GraphQL/_gql/order/graphql";
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Modal,
  Select,
  Table,
  Input,
} from "../../Elements";
import { ORDER, WMS } from "../../../GraphQL";

interface ScannedItems extends ORDER.OrderItem {
  gtin: ORDER.Maybe<string> | undefined;
  type: WMS.Maybe<WMS.SkuType> | undefined;
  scanned_quantity: ORDER.Maybe<number> | undefined;
}

type Props = {
  opened: boolean;
  onClose: () => void;
  list?: ScannedItems[];
  onUpdate: (order: ORDER.Order) => void;
  skus: Sku[];
  order: Order | undefined;
};

export const ItemEditor = (props: Props) => {
  const [editedItems, setEditedItems] = useState<ScannedItems[]>([]);
  const [expand, setExpand] = useState<number[]>([]);
  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });

  useEffect(() => {
    if (props.list) {
      setEditedItems(props?.list);
    }
  }, [props.list]);

  const onSelectFreeItem = (parentIndex: number, gtin: string) => {
    const skuItem = props.skus?.find((e) => e.gtin === gtin);
    const parent = editedItems[parentIndex];
    if (!skuItem || !parent) return;

    const existingFreeItems = parent.free_items || [];
    const currentTotal = getFreeItemsTotal(existingFreeItems);
    const remaining = (parent.quantity || 0) - currentTotal;

    if (remaining <= 0) {
      return Notification.error({
        message: "Free item quantity limit reached for this product",
      });
    }

    const alreadyAdded = existingFreeItems.some((f) => f?.gtin === gtin);
    const updatedFreeItems = alreadyAdded
      ? existingFreeItems.map((f) =>
          f?.gtin === gtin ? { ...f, qty: (f?.qty || 0) + 1 } : f,
        )
      : [
          ...existingFreeItems,
          {
            gtin: skuItem.gtin,
            sku: skuItem.sku,
            description: skuItem.description,
            qty: 1,
          },
        ];

    setEditedItems((prev) => {
      const updateList = [...prev];
      updateList[parentIndex] = { ...parent, free_items: updatedFreeItems };
      return updateList;
    });
  };

  const onRemoveFreeItem = (parentIndex: number, gtin: string) => {
    setEditedItems((prev) => {
      const updateList = [...prev];
      const parent = updateList[parentIndex];
      updateList[parentIndex] = {
        ...parent,
        free_items: (parent.free_items || []).filter((f) => f?.gtin !== gtin),
      };
      return updateList;
    });
  };

  const onChangeFreeItemQty = (
    parentIndex: number,
    gtin: string,
    value: string,
  ) => {
    const parsed = value === "" ? undefined : Number(value);
    if (parsed !== undefined && (Number.isNaN(parsed) || parsed < 0)) return;

    const parent = editedItems[parentIndex];
    if (!parent) return;

    const otherItemsTotal = (parent.free_items || [])
      .filter((f) => f?.gtin !== gtin)
      .reduce((acc, f) => acc + (f?.qty || 0), 0);

    const maxAllowed = (parent.quantity || 0) - otherItemsTotal;

    if (parsed !== undefined && parsed > maxAllowed) {
      return Notification.error({
        message: `Free item quantity cannot exceed ${maxAllowed} for this product`,
      });
    }

    setEditedItems((prev) => {
      const updateList = [...prev];
      const p = updateList[parentIndex];
      updateList[parentIndex] = {
        ...p,
        free_items: (p.free_items || []).map((f) =>
          f?.gtin === gtin ? { ...f, qty: parsed } : f,
        ),
      };
      return updateList;
    });
  };

  const onChangeQuantity = (index: number, value: string) => {
    const parsed = value === "" ? undefined : Number(value);
    if (parsed !== undefined && (Number.isNaN(parsed) || parsed < 0)) return;

    setEditedItems((prev) => {
      const updateList = [...prev];
      updateList[index] = {
        ...updateList[index],
        quantity: parsed,
      };
      return updateList;
    });
  };

  const freeItemsTable = (
    parentIndex: number,
    freeItems: ORDER.Maybe<ORDER.Maybe<ORDER.FreeItem>[]> = [],
    parentQuantity: number | null | undefined,
    readOnly?: boolean,
  ) => {
    const items = freeItems || [];
    const currentTotal = getFreeItemsTotal(items);
    const remaining = (parentQuantity || 0) - currentTotal;
    const isMaxed = remaining <= 0;

    return (
      <td colSpan={8} style={{ padding: "12px 24px" }}>
        {!readOnly && (
          <Select
            searchable
            disabled={isMaxed}
            placeholder="Select free product"
            description={`Add free item (${Math.max(remaining, 0)} remaining)`}
            onChange={(e: string) => onSelectFreeItem(parentIndex, e)}
            data={
              props.skus
                ?.filter((item) =>
                  [
                    "48044448",
                    "48044455",
                    "48044462",
                    "48044646",
                    "48044653",
                    "48044479",
                    "48044493",
                    "48044486",
                    "48044592",
                  ].includes(String(item.gtin)),
                )
                .map((item) => ({
                  label: `${item.gtin?.replace("_PMI", "")} - ${
                    item.description
                  }`,
                  value: `${item.gtin}`,
                })) || []
            }
          />
        )}
        {items.length > 0 && (
          <Table fontSize="sm">
            <thead>
              <tr>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Description</th>
                <th>Qty</th>
                {!readOnly && <th></th>}
              </tr>
            </thead>
            <tbody>
              {items.map((f, i) => {
                const otherTotal = currentTotal - (f?.qty || 0);
                const maxForThisRow = (parentQuantity || 0) - otherTotal;
                const rowMaxed = (f?.qty || 0) >= maxForThisRow;

                return (
                  <tr key={`free-${parentIndex}-${i}`}>
                    <td>{f?.gtin}</td>
                    <td>{f?.sku}</td>
                    <td>{f?.description}</td>
                    <td>
                      {readOnly ? (
                        f?.qty
                      ) : (
                        <Input
                          type="number"
                          min={0}
                          max={maxForThisRow}
                          disabled={rowMaxed}
                          value={f?.qty ?? ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChangeFreeItemQty(
                              parentIndex,
                              `${f?.gtin}`,
                              e.target.value,
                            )
                          }
                          style={{ width: 70 }}
                        />
                      )}
                    </td>
                    {!readOnly && (
                      <td>
                        <ActionIcon
                          onClick={() =>
                            onRemoveFreeItem(parentIndex, `${f?.gtin}`)
                          }
                        >
                          <CircleX color="red" />
                        </ActionIcon>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </td>
    );
  };

  const getFreeItemsTotal = (freeItems: ORDER.Maybe<ORDER.FreeItem>[] = []) =>
    freeItems.reduce((acc, f) => acc + (f?.qty || 0), 0);

  const rows = () => {
    return editedItems?.map((element: ScannedItems, index: number) => {
      const isExisting = props.list?.some((e) => e.gtin === element.gtin);
      const isEditableExisting = element.gtin === "HP00001";
      const hasFreeItems = (element.free_items?.length || 0) > 0;
      const isExpandable = !isExisting || isEditableExisting || hasFreeItems;
      const isExpanded = expand.includes(index);
      const readOnly = isExisting && !isEditableExisting;

      return (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td style={{ width: 10 }}>
              {isExpandable ? (
                <ActionIcon>
                  {isExpanded ? (
                    <CaretUp
                      onClick={() =>
                        setExpand(expand.filter((e) => e !== index))
                      }
                    />
                  ) : (
                    <CaretDown
                      onClick={() => setExpand(expand.concat(index))}
                    />
                  )}
                </ActionIcon>
              ) : undefined}
            </td>
            <td>{element?.gtin}</td>
            <td>{element?.sku}</td>
            <td>{element?.description}</td>
            <td>{element?.price_per_unit}</td>
            <td>
              <Input
                type="number"
                min={0}
                disabled={isExisting && !isEditableExisting}
                value={element?.quantity ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeQuantity(index, e.target.value)
                }
                style={{ width: 80 }}
              />
            </td>
            <td>{(element?.price_per_unit || 0) * (element?.quantity || 0)}</td>
            <td>
              {element?.sku != "HP00001"? undefined : (
                <ActionIcon
                  onClick={() => onRemoveItem(`${element?.gtin}`)}
                >
                  <CircleX color="red" />
                </ActionIcon>
              )}
            </td>
          </tr>
          {isExpanded && isExpandable ? (
            <tr key={`list-expanded-${index}`}>
              {freeItemsTable(
                index,
                element.free_items || [],
                element.quantity,
                readOnly,
              )}
            </tr>
          ) : undefined}
        </React.Fragment>
      );
    });
  };

  const onRemoveItem = (gtin: string) => {
    setEditedItems(editedItems.filter((e) => e.gtin !== gtin));
  };

  const onCloseModal = () => {
    setEditedItems(props?.list || []);
    props.onClose();
  };

  const onChangeLendingFee = (gtin: string) => {
    const updateList: ScannedItems[] = [...editedItems];
    const index = updateList.findIndex((e) => e?.gtin?.includes("LP0"));
    const item = props.skus?.find((e) => e.gtin === gtin);
    if (index > -1) {
      updateList[index] = {
        description: item?.description,
        gtin: gtin,
        type: item?.type,
        price_per_unit: item?.price_gross,
        quantity: 1,
        quantity_unit: item?.unit_of_measure,
        scanned_quantity: 0,
        sku: item?.sku,
      };
    } else {
      updateList.push({
        description: item?.description,
        gtin: gtin,
        type: item?.type,
        price_per_unit: item?.price_gross,
        quantity: 1,
        quantity_unit: item?.unit_of_measure,
        scanned_quantity: 0,
        sku: item?.sku,
      });
    }

    setEditedItems(updateList);
  };

  const onSelectSKUs = (gtin: string) => {
    const updateList: ScannedItems[] = [...editedItems];
    const skuItem = props.skus?.find((e: WMS.Sku) => e.gtin === gtin);
    const item = updateList.find((e) => e.gtin === gtin);
    if (
      skuItem?.type === "DEVICES" &&
      editedItems.some((e) => e.type === "DEVICES" && e.gtin !== gtin)
    )
      return Notification.error({ message: "Max device limit reached" });
    if (item) {
      const index = updateList.findIndex((e) => e.gtin === gtin);
      updateList[index] = {
        ...item,
        quantity: (item?.quantity || 0) + 1,
        price_per_unit: 0,
      };
    } else {
      updateList.push({
        sku: skuItem?.sku,
        description: skuItem?.description,
        gtin: skuItem?.gtin,
        type: skuItem?.type,
        price_per_unit: 0,
        quantity: 1,
        quantity_unit: skuItem?.unit_of_measure,
        scanned_quantity: 0,
      });
    }
    setEditedItems(updateList);
  };

  const onSave = () => {
    updateOrder({
      variables: {
        id: props?.order?.id,
        input: {
          items: editedItems.map((item) => ({
            sku: item?.sku,
            quantity: item?.quantity,
            price_per_unit: item?.price_per_unit,
            total: (item.quantity || 0) * (item.price_per_unit || 0),
            description: item?.description,
            quantity_unit: item?.quantity_unit,
            is_freebies: item?.sku == "HP00001",
            free_items: item.free_items?.map((f) => ({
              gtin: f?.gtin,
              sku: f?.sku,
              description: f?.description,
              qty: f?.qty,
            })),
          })),
        },
      },
    })
      .then((res) => {
        props?.onUpdate(res.data.orderUpdate);
        onCloseModal();
        Notification.success({ message: "Items updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <Modal
      size={1100}
      title="Item Editor"
      opened={props.opened}
      centered
      onClose={() => onCloseModal()}
    >
      <Grid>
        {/* <Grid.Col span={6}> */}
        {/* <Select
            disabled={
              props.order?.lead_source === "GLIFE" ||
              props?.order?.id?.includes("ZYN-")
            }
            onChange={(e: string) => onChangeLendingFee(e)}
            placeholder="Select lending fee"
            description="Lending Fee"
            defaultValue={
              `${
                props?.list?.find(
                  (e) =>
                    e.gtin?.includes("LP0") &&
                    e.sku?.includes("LP0") &&
                    e.type === WMS.SkuType.Accessories,
                )?.gtin
              }` || undefined
            }
            data={
              props?.skus
                ?.filter(
                  (e) =>
                    e.gtin?.includes("LP0") &&
                    e.sku?.includes("LP0") &&
                    e.type === WMS.SkuType.Accessories,
                )
                .map((item) => {
                  return {
                    label: `${item.gtin} - ${item.description}`,
                    value: `${item.gtin}`,
                  };
                }) || []
            }
          /> */}
        {/* </Grid.Col> */}
        <Grid.Col span={12}>
          <Select
            searchable
            placeholder="Select product name"
            description="Product Name"
            onChange={(e: string) => onSelectSKUs(e)}
            data={
              props?.skus
                ?.filter((sku) =>
                  props?.order?.id?.includes("ZYN-")
                    ? sku?.gtin?.includes("ZYN")
                    : sku?.sku == "HP00001"
                )
                .filter((e) =>
                  props?.order?.lead_source === "GLIFE"
                    ? !(
                        e?.type === "DEVICES" &&
                        !e?.description?.includes("BONDS")
                      )
                    : e,
                )
                .map((item) => {
                  return {
                    label: `${item.gtin?.replace("_PMI", "")} - ${
                      item.description
                    }`,
                    value: `${item.gtin}`,
                  };
                }) || []
            }
          />
        </Grid.Col>
      </Grid>
      <LoadingOverlay visible={loadingOrder} />
      <Table highlightOnHover fontSize={"sm"}>
        <thead>
          <tr>
            <th style={{ width: 10 }}></th>
            <th>GTIN</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              Total:{" "}
              {editedItems.reduce(
                (acc, curr) =>
                  acc +
                  (curr?.quantity || 0) *
                    (curr.price_per_unit_original || curr.price_per_unit || 0),
                0,
              )}
            </th>
          </tr>
        </tfoot>
        <tbody>{rows()}</tbody>
      </Table>
      <br />
      <Group position="center">
        <Button onClick={() => onCloseModal()} customType="secondary">
          Back
        </Button>
        <Button onClick={() => onSave()} customType="primary">
          Save
        </Button>
      </Group>
    </Modal>
  );
};
