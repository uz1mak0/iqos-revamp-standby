import { useLazyQuery, useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";
import { QuestionMark, Trash } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { getPromos } from "../../../GraphQL/PromoSchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { rolesAtom, userAtom, channelAtom } from "../../../Store/StoreAtom";
import {
  Checkbox,
  Input,
  Paper,
  Select,
  Table,
  Group,
  Popover,
  ActionIcon,
  NumberInput,
  ScrollArea,
  Text,
  Badge,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { UseFormReturnType } from "@mantine/form";
import { FileWithPath } from "@mantine/dropzone";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { formatCodentify } from "../CodentifyScanner/Config";
import { getPromoGoodsType, RecordSalesFormInputs } from "./RecordSalesConfig";
import { Autocomplete } from "@mantine/core";

export interface RecordSalesItemsProps extends WMS.LineItemInput {
  quantity: number;
  promo_type?: string | undefined;
  promo_selected?: WMS.Maybe<WMS.Promo> | undefined;
  discount?: number;
  inputs?: string[];
  promo_discount?: number;
}

type Props = {
  form: UseFormReturnType<
    RecordSalesFormInputs,
    (values: RecordSalesFormInputs) => RecordSalesFormInputs
  >;
};
export const RecordSaleItems = (props: Props) => {
  const [channel] = useAtom(channelAtom);
  const isIndirect = channel === "INDIRECT_CHANNEL";
  const showPromoColumns =
    !isIndirect || props.form.values.warehouse_id === "PH1204";
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [user] = useAtom(rolesAtom);
  const [userInfo] = useAtom(userAtom);
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });
  const { data: dataPromos } = useQuery(getPromos, {
    context: { clientName: "warehouse" },
  });
  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );

  const serialChecker = async (serial: string) => {
    if (serial.length >= 12 && serial.length <= 16) {
      return refetchSerial({
        variables: { serial: serial },
        fetchPolicy: "no-cache",
      }).then((res) => {
        return res.data.inventoryItem
          ? {
              gtin: res.data.inventoryItem.gtin,
              serial: res.data.inventoryItem.serial,
              sku: res.data.inventoryItem.sku,
            }
          : undefined;
      });
    } else {
      return undefined;
    }
  };

  const onScan = async (value: string) => {
    const isSerial = await serialChecker(value);
    const codentify = isSerial ? isSerial : formatCodentify(value);
    if (codentify) {
      if (!props.form.values.warehouse_id)
        return Notification.error({
          message: "Please select warehouse first!",
        });
      onScanRSDevice(codentify.serial);
    } else {
      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === value)) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      } else {
        onScanNonDevice(value);
      }
    }
  };

  const onScanNonDevice = (gtin: string) => {
    const skus: WMS.Sku[] = dataSKU?.skus?.items;
    const updateList = [...props.form.values.scanned_items];
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
    if (!skus.some((e) => e.gtin === gtin)) {
      return Notification.error({
        title: "Error",
        message: "SKU/GTIN not found",
      });
    } else {
      const item = skus.find((e) => e.gtin === gtin);
      if (item?.type === "DEVICES")
        return Notification.error({
          message: "Cannot scan device using GTIN!",
        });
      if (item?.gtin?.includes("GT_"))
        return Notification.error({
          message: "Cannot scan GT items for record sales",
        });
      if (props.form.values.scanned_items.some((e) => e.gtin === item?.gtin)) {
        const index = updateList?.findIndex((e) => e.gtin === item?.gtin);
        updateList[index] = {
          ...updateList[index],
          quantity: (updateList[index]?.quantity || 0) + 1,
          price: Number((updateList[index]?.price || 0) + (item?.price || 0)),
        };
        props.form.setFieldValue("scanned_items", []);
        setTimeout(() => {
          props.form.setFieldValue("scanned_items", updateList);
        }, 0);
      } else {
        const updateItem = {
          quantity: 1,
          price: props.form.values.type === "Replacement" ? 0 : item?.price,
          gtin: item?.gtin ? item?.gtin : "",
          serials: undefined,
          inputs: undefined,
          menthol_variant:
            item?.gtin == "0001" ? WMS.MentholVariant.Menthol : undefined,
          sku: {
            gtin: item?.gtin ? item?.gtin : "",
            name: item?.description,
            sku: item?.sku ? item?.sku : "",
            type: item?.type,
            unit_of_measure: item?.unit_of_measure,
            description: item?.description,
            channel: WMS.ChannelType.DirectRetail,
            price: item?.price,
          },
        };
        updateList.push(updateItem);
        props.form.setFieldValue("scanned_items", updateList);
      }
    }
  };

  const onScanRSDevice = async (value: string) => {
    if (!value) return Notification.error({ message: "Invalid input" });
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
    refetchSerial({
      variables: {
        serial: value,
      },
      fetchPolicy: "no-cache",
    })
      .then(({ data }) => {
        const rSDevice: WMS.InventoryItem = data.inventoryItem;
        if (!rSDevice)
          return Notification.error({ message: "Codentify/Serial not found" });
        if (rSDevice.item_status !== "AVAILABLE")
          return Notification.error({
            message: "Codentify/Serial status not AVAILABLE",
          });
        if (rSDevice.gtin?.includes("GT_"))
          return Notification.error({
            message: "Cannot scan device used for GT",
          });
        if (
          props.form.values.scanned_items.some((e) =>
            e.serials?.includes(value),
          )
        )
          return Notification.error({ message: "Serial already scanned" });
        if (props.form.values.warehouse_id !== rSDevice.warehouse_id)
          return Notification.error({
            message: "Scanned device not belong to selected warehouse",
          });
        const updateList = [...props.form.values.scanned_items];
        const skuItem: WMS.Sku = dataSKU.skus.items.find(
          (e: WMS.Sku) => e.gtin === rSDevice.gtin,
        );
        updateList.push({
          quantity: 1,
          gtin: rSDevice?.gtin ? rSDevice?.gtin : "",
          serials: [rSDevice?.serial || ""],
          inputs: [rSDevice?.serial || ""],
          price: props.form.values.type === "Replacement" ? 0 : skuItem.price,
          sku: {
            gtin: rSDevice?.gtin ? rSDevice?.gtin : "",
            name: skuItem.name,
            sku: rSDevice.sku ? rSDevice.sku : "",
            type: WMS.SkuType.Devices,
            unit_of_measure: rSDevice.unit_of_measure,
            description: skuItem.description,
            channel: WMS.ChannelType.DirectRetail,
            price: skuItem.price,
          },
        });
        props.form.setFieldValue("scanned_items", updateList);
        Notification.success({ message: "Device scan success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onChangeQuantity = (
    item: RecordSalesItemsProps,
    quantity: number | undefined,
    isQuantity: boolean,
  ) => {
    const updateList = [...props.form.values.scanned_items];
    const index = updateList.findIndex((e) => e.gtin === item.gtin);
    const updateItem = updateList[index];
    updateList[index] = { ...updateItem, quantity: Number(quantity) };
    updateList[index] = {
      ...updateList[index],
      price: calculatePriceWithDiscount(
        updateList[index],
        updateList[index].promo_selected,
        updateItem.promo_discount || 0,
      ),
    };
    props.form.setFieldValue("scanned_items", updateList);
  };

  const calculatePriceWithDiscount = (
    item: RecordSalesItemsProps,
    promo: WMS.Promo | undefined | null,
    discount: number,
  ) => {
    const isLineItemDiscount = promo?.discount_type === "LINE_ITEM";
    switch (item.promo_type) {
      case "PROMO GOODS":
        return (
          Number((item.sku?.price || 0) * item.quantity) -
          (isLineItemDiscount ? Number(promo?.discount || 0) : 0)
        );
      case "PROMO DISCOUNT":
        return (
          Number((item.sku?.price || 0) * item.quantity) - Number(discount)
        );
      case "PROMO GOODS + DISCOUNT":
        if (props.form.values.warehouse_id === "PH1204") {
          return (
            (Number(item.sku?.price || 0) -
              (isLineItemDiscount ? Number(promo?.discount || 0) : 0)) *
            item.quantity
          );
        }

        return (
          Number((item.sku?.price || 0) * item.quantity) -
          (discount + (isLineItemDiscount ? promo?.discount || 0 : 0))
        );
      default:
        return (item.sku?.price || 0) * item.quantity;
    }
  };

  const onSelectPromo = (promo_code: string, item: RecordSalesItemsProps) => {
    const updateList = [...props.form.values.scanned_items];
    const index =
      item.sku?.type !== "DEVICES"
        ? updateList.findIndex((e) => e.gtin === item.gtin)
        : updateList.findIndex((e) => e.serials === item.serials);
    const selectedPromo = dataPromos?.promos?.items?.find(
      (e: WMS.Promo) => e?.code === promo_code,
    );
    updateList[index] = {
      ...updateList[index],
      promo_selected: selectedPromo,
      price: calculatePriceWithDiscount(
        updateList[index],
        selectedPromo,
        item?.promo_discount || 0,
      ),
    };
    props.form.setFieldValue("scanned_items", updateList);
  };

  const onRemoveItem = (item: RecordSalesItemsProps) => {
    if (item.sku?.type === "DEVICES") {
      props.form.setFieldValue(
        "scanned_items",
        props.form.values.scanned_items.filter(
          (e) => e.serials !== item.serials,
        ),
      );
    } else {
      props.form.setFieldValue(
        "scanned_items",
        props.form.values.scanned_items.filter((e) => e.gtin !== item.gtin),
      );
    }
  };

  const getItemPriceDisplay = (item: RecordSalesItemsProps) => {
    if (item.promo_type) {
      return (
        <Group>
          <a>
            {" "}
            {calculatePriceWithDiscount(
              item,
              item.promo_selected,
              item?.promo_discount || 0,
            )}{" "}
          </a>
          <Popover position="left">
            <Popover.Dropdown>
              <div>
                <p>
                  Original Price:{" "}
                  {Number((item?.sku?.price || 0) * item.quantity)}
                </p>
                <p>Price per quantity: {Number(item?.sku?.price)}</p>
                <p>Promo Discount: {item?.promo_discount || 0}</p>
                <p>
                  Promo Goods Discount: {item.promo_selected?.discount || 0}{" "}
                  <Badge>{item?.promo_selected?.discount_type || "-"}</Badge>
                </p>
              </div>
            </Popover.Dropdown>
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
    } else {
      return (
        <a>
          {" "}
          {calculatePriceWithDiscount(
            item,
            item?.promo_selected,
            item?.promo_discount || 0,
          )}{" "}
        </a>
      );
    }
  };
  const onSelectPromoType = (value: string, item: RecordSalesItemsProps) => {
    const updateList = [...props.form.values.scanned_items];
    props.form.setFieldValue("scanned_items", []);
    const index =
      item.sku?.type !== "DEVICES"
        ? updateList.findIndex((e) => e.gtin === item.gtin)
        : updateList.findIndex(
            (e) => e.gtin === item.gtin && e.serials === item.serials,
          );
    updateList[index] = {
      ...updateList[index],
      promo_type: value,
      promo_selected: undefined,
      promo_discount: 0,
      discount: 0,
      price: (updateList[index].sku?.price || 0) * item.quantity,
    };
    setTimeout(() => {
      props.form.setFieldValue("scanned_items", updateList);
    }, 0);
  };

  const onChangeDiscountValue = (
    value: number,
    item: RecordSalesItemsProps,
  ) => {
    const updateList = [...props.form.values.scanned_items];
    const index =
      item.sku?.type !== "DEVICES"
        ? updateList.findIndex((e) => e.gtin === item.gtin)
        : updateList.findIndex(
            (e) => e.gtin === item.gtin && e.serials === item.serials,
          );
    updateList[index] = {
      ...updateList[index],
      promo_discount: value || 0,
      price: calculatePriceWithDiscount(
        updateList[index],
        updateList[index].promo_selected,
        value || 0,
      ),
    };
    props.form.setFieldValue("scanned_items", updateList);
  };

  const onChangeIsPromoGoods = (
    checked: boolean,
    item: RecordSalesItemsProps,
  ) => {
    const updateList = [...props.form.values.scanned_items];
    const index =
      item.sku?.type !== "DEVICES"
        ? updateList.findIndex((e) => e.gtin === item.gtin)
        : updateList.findIndex(
            (e) => e.gtin === item.gtin && e.serials === item.serials,
          );
    updateList[index] = { ...updateList[index], is_promo_good: checked };
    props.form.setFieldValue("scanned_items", updateList);
  };

  const onChangeMentholVariant = (
    value: string,
    item: RecordSalesItemsProps,
  ) => {
    const variant =
      value === "MENTHOL"
        ? WMS.MentholVariant.Menthol
        : WMS.MentholVariant.NonMenthol;
    const updateList = [...props.form.values.scanned_items];
    const index = updateList.findIndex((e) => e.gtin === item.gtin);
    updateList[index] = { ...updateList[index], menthol_variant: variant };
    props.form.setFieldValue("scanned_items", updateList);
  };

  const rows = props.form.values.scanned_items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.gtin}</td>
      <td>
        <div style={{ width: 210 }}>
          <Text lineClamp={2} truncate={true}>
            {element.sku?.description}
          </Text>
        </div>
      </td>
      <td>{element?.sku?.unit_of_measure}</td>

      {!isIndirect && (
        <td>
          {element.gtin === "0001" ? (
            <Select
              defaultValue={
                element.menthol_variant || WMS.MentholVariant.Menthol
              }
              style={{ width: 240 }}
              onChange={(value) => onChangeMentholVariant(value, element)}
              placeholder="Select menthol variant"
              data={["MENTHOL", "NON-MENTHOL"]}
            />
          ) : undefined}
        </td>
      )}

      <td>
        {element.sku?.type === "DEVICES" ? (
          element.quantity
        ) : (
          <NumberInput
            min={0}
            onChange={(e) => onChangeQuantity(element, e || 0, true)}
            style={{ width: 100 }}
            defaultValue={element.quantity}
          />
        )}
      </td>

      {showPromoColumns && (
        <>
          <td>
            <div style={{ width: 130 }}>
              <Checkbox
                defaultChecked={element.is_promo_good || false}
                onChange={(e) =>
                  onChangeIsPromoGoods(e.target.checked, element)
                }
                label={"Promo Goods"}
              />
            </div>
          </td>
          <td>
            <Select
              clearable
              style={{ width: 240 }}
              disabled={
                props.form.values.type === "Replacement" || !element?.sku?.price
              }
              defaultValue={element.promo_type}
              onChange={(e) => onSelectPromoType(e, element)}
              placeholder="Select Promo Type"
              data={getPromoGoodsType.map((e) => ({ label: e, value: e }))}
            />
          </td>
          <td>
            <Select
              searchable
              style={{ width: 240 }}
              disabled={
                element.promo_type === "PROMO DISCOUNT" || !element.promo_type
              }
              defaultValue={element?.promo_selected?.code}
              onChange={(e) => onSelectPromo(e, element)}
              placeholder="Select Promo"
              data={dataPromos?.promos?.items
                ?.filter((e: WMS.Promo) => e.status?.toString() === "ENABLED")
                .map((e: WMS.Promo) => ({ label: e.name, value: e.code }))}
            />
          </td>
          <td>
            <NumberInput
              style={{ width: 150 }}
              defaultValue={element.promo_discount}
              precision={0}
              min={0}
              onChange={(e) => onChangeDiscountValue(e, element)}
              disabled={
                element.promo_type === "PROMO GOODS" || !element.promo_type
              }
            />
          </td>
        </>
      )}

      {!isIndirect && (
        <td>
          {element?.sku?.type !== "VOUCHER" && element?.sku?.type !== "DEVICES"
            ? "-"
            : element.serials}
        </td>
      )}

      {showPromoColumns && (
        <td>
          {element.promo_type
            ? getItemPriceDisplay(element)
            : ((props.form.values.type === "Replacement"
                ? 0
                : element?.sku?.price) || 0) * element.quantity}
        </td>
      )}

      <td>
        <ActionIcon onClick={() => onRemoveItem(element)}>
          <Trash color="red" />
        </ActionIcon>
      </td>
    </tr>
  ));

  const filteredSkus =
    search.length > 0
      ? dataSKU?.skus?.items.filter(
          (e: WMS.Sku) =>
            e.gtin?.includes(search) ||
            e.sku?.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  return (
    <Paper radius={5}>
      <Autocomplete
        value={search}
        onChange={setSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onScan(search);
            setSearch("");
          }
        }}
        data={(props.form.values.warehouse_id === "PH1204"
          ? (dataSKU?.skus?.items || []).filter((sku: WMS.Sku) => {
              console.log(userInfo);

              if (sku.gtin?.includes("PG_") || sku.gtin?.includes("GT_")) {
                return false;
              }

              if (sku.type === WMS.SkuType.Heets) {
                return (
                  sku.unit_of_measure === "PK" || sku.unit_of_measure === "CT"
                );
              }
              if (sku.type === WMS.SkuType.Zyn) {
                return sku.unit_of_measure === "PK";
              }

              return false; // exclude everything else (Accessories, Devices, Voucher)
            })
          : dataSKU?.skus?.items || []
        ).map((sku: WMS.Sku) => ({
          value: sku.gtin,
          label:
            props.form.values.warehouse_id === "PH1204"
              ? `${sku.gtin?.includes("GT") ? "GT - " : ""} ${
                  sku.description
                } - ${sku.unit_of_measure}`
              : `${sku.gtin} - ${sku.description}`,
          description: sku.description,
        }))}
        placeholder={
          channel != "INDIRECT_CHANNEL"
            ? "Scan or Input GTIN/Condentify"
            : "Scan or Input GTIN"
        }
        description="Scan or Search"
        filter={(value, item) =>
          item.value.toLowerCase().includes(value.toLowerCase()) ||
          item.label.toLowerCase().includes(value.toLowerCase())
        }
        limit={dataSKU?.skus?.items.length || 100}
        maxDropdownHeight={200}
      />

      <br />
      {/* <ScrollArea> */}
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>GTIN</th>
            <th>Name</th>
            <th>UOM</th>
            {!isIndirect && <th>Menthol Variant</th>}
            <th>Quantity</th>
            {showPromoColumns && (
              <>
                <th>Is Promo Goods?</th>
                <th>Promo Type</th>
                <th>Promo</th>
                <th>Discount</th>
              </>
            )}
            {!isIndirect && <th>Serial</th>}
            {showPromoColumns && <th>Price</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <br />
      {/* </ScrollArea> */}
      {channel != "INDIRECT_CHANNEL" ? (
        <Paper radius={5}>
          <div style={{ minHeight: 50 }}>
            <h4>{`Cart Discount(s): `}</h4>
            {props.form.values.scanned_items
              .filter((item) => item?.promo_selected?.discount_type === "CART")
              .map((e, index) => (
                <li key={`cart-${index}`}>{`${e?.promo_selected?.name} (-${
                  e?.promo_selected?.discount || ""
                })`}</li>
              ))}
            <h3 style={{ textAlign: "end", marginRight: 15 }}>
              TOTAL:
              {Number(
                props.form.values.scanned_items.reduce(
                  (a, item) => a + (item?.price || 0),
                  0,
                ) -
                  props.form.values.scanned_items
                    .filter(
                      (item) => item?.promo_selected?.discount_type === "CART",
                    )
                    .reduce(
                      (a, item) => a + (item?.promo_selected?.discount || 0),
                      0,
                    ),
              )}
            </h3>
          </div>
        </Paper>
      ) : null}
    </Paper>
  );
};
