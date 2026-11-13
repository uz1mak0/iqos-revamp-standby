import React, { useRef } from "react";
import {
  ActionIcon,
  Input,
  NumberInput,
  Paper,
  Table,
  Text,
} from "../../../Elements";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getInventoryItem } from "../../../../GraphQL/CodentifyScannerSchema";
import { formatCodentify } from "../../CodentifyScanner/Config";
import Notification from "../../../Elements/Notification/Notification";
import { WMS } from "../../../../GraphQL";
import { getSKUs } from "../../../../GraphQL/SKUsSchema";
import { UseFormReturnType } from "@mantine/form";
import { RecordSalesFormInputs } from "../../RecordSales/RecordSalesConfig";
import { Trash } from "tabler-icons-react";

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

const IndirectLendingItems = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: WMS.ChannelType.DirectRetail },
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

  const onScan = async (value: string) => {
    if (!props.form.values.warehouse_id)
      return Notification.error({ message: "Please select warehouse first!" });

    const isSerial = await serialChecker(value);
    const codentify = isSerial ? isSerial : formatCodentify(value);
    if (codentify) {
      if (
        props.form.values.scanned_items.some((e) => e.sku?.type === "DEVICES")
      ) {
        Notification.error({
          message: "Can only add one device per lending transaction!",
        });
      } else {
        onScanRSDevice(codentify.serial);
      }
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

  const onChangeQuantity = (
    item: RecordSalesItemsProps,
    quantity: number | undefined,
  ) => {
    const updateList = [...props.form.values.scanned_items];
    const index = updateList.findIndex((e) => e.gtin === item.gtin);
    const updateItem = updateList[index];
    updateList[index] = { ...updateItem, quantity: Number(quantity) };
    props.form.setFieldValue("scanned_items", updateList);
  };

  console.log("scanned items", props.form.values.scanned_items);

  const rows = props.form.values.scanned_items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.gtin}</td>
      <td>{element.sku?.description}</td>
      <td>{element?.sku?.unit_of_measure}</td>
      <td>
        {element.sku?.type === "DEVICES" ? (
          element.quantity
        ) : (
          <NumberInput
            min={0}
            onChange={(e) => onChangeQuantity(element, e || 0)}
            style={{ width: 100 }}
            defaultValue={element.quantity}
          />
        )}
      </td>
      <td>
        {element?.sku?.type !== "VOUCHER" && element?.sku?.type !== "DEVICES"
          ? "-"
          : element.serials}
      </td>
      <td>{(element?.sku?.price || 0) * element.quantity}</td>
      <td>
        <ActionIcon onClick={() => onRemoveItem(element)}>
          <Trash color="red" />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <div>
      <Paper radius={5}>
        <Input
          innerref={inputRef}
          onKeyPress={(e) =>
            e.key === "Enter" ? onScan(e.target.value) : undefined
          }
          description="Scan"
          placeholder="SCAN OR INPUT GTIN/CODENTIFY"
          style={{ width: "100%" }}
        />
        <br />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>GTIN</th>
              <th>Name</th>
              <th>UOM</th>
              <th>Quantity</th>
              <th>Serial</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <br />
      </Paper>
    </div>
  );
};

export default IndirectLendingItems;
