import React, { useState } from "react";
import {
  Input,
  Table,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Group,
  ActionIcon,
} from "../../Elements";
import { useForm } from "@mantine/form";
import Notification from "../../Elements/Notification/Notification";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { formatCodentify } from "./Config";
import { RETAIL, WMS } from "../../../GraphQL";
import { getActivations } from "../../../GraphQL/TransactionSchema";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { ArrowUpRightCircle } from "tabler-icons-react";

type CodentifyProps =
  | {
      gtin: string;
      serial: string;
      sku: string;
    }
  | boolean;

export const CodentifyScanner = () => {
  const form = useForm({ initialValues: { codentify: "" } });
  const [codentifyScanned, setCodentifyScanned] = useState<WMS.InventoryItem[]>(
    [],
  );
  const [refetchSerial, { data, loading: loading }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" }, fetchPolicy: "no-cache" },
  );
  const { data: dataActivations } = useQuery(getActivations, {
    context: { clientName: "retail" },
  });

  const { data: dataDRWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const { data: dataICWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "INDIRECT_CHANNEL" },
  });

  const { data: dataEcomWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });

  /**
   * The function onSubmit checks if a CODENTIFY/Serial value is provided and formats it before making a
   * GraphQL query to fetch data related to the serial.
   * @param values - an object containing the value of the input field with the name "codentify"
   */
  const onSubmit = (values: { codentify: string }) => {
    if (!values.codentify) {
      setCodentifyScanned([]);
      Notification.error({
        title: "Error",
        message: "Please add CODENTIFY/Serial",
      });
    } else {
      const codentify: CodentifyProps = formatCodentify(values.codentify);
      var value: string;
      if (!codentify) {
        value = values.codentify;
      } else {
        value = codentify.serial;
      }
      refetchSerial({
        variables: {
          serial: value,
        },
        fetchPolicy: "no-cache",
      }).then((res) => {
        if (!res.data.inventoryItem) {
          Notification.error({ message: `${value} not found` });
        }
      });
      form.reset();
    }
  };

  /**
   * The function formats scanned Codentify data into an array of objects with attribute and value
   * properties.
   * @returns The function `formatCodentifyScanned` returns an array of objects with two properties:
   * `attribute` and `value`. The `attribute` property is a string that represents the name of an
   * attribute of an inventory item, and the `value` property is a string that represents the value of
   * that attribute. If the attribute name starts with "date", the value is converted to a `Date
   */
  const formatCodentifyScanned = () => {
    var info: { attribute: string | null; value: string }[] = [];
    if (data?.inventoryItem || !loading) {
      info = Object.keys(data?.inventoryItem || []).map(function (key) {
        return {
          attribute: key,
          value:
            key.indexOf("date") == 0
              ? new Date(parseInt(data.inventoryItem[key])).toString()
              : data.inventoryItem[key] || "",
        };
      });
    }
    return info;
  };

  const getTransactionLink = (element: {
    attribute: string | null;
    value: string;
  }) => {
    const warehouse_id = formatCodentifyScanned().find(
      (e) => e.attribute === "warehouse_id",
    )?.value;

    let transactionType;

    if (element.value.startsWith("DIRECT_TRANSFER_")) {
      transactionType = "transfer";
    } else {
      transactionType = element.value.split("_")[0].toLowerCase();
    }

    return window.open(
      `/inventory/warehouse/transaction/?transactionId=${element.value}&warehouse=${warehouse_id}&transaction=${transactionType}`,
    );
  };

  const getCustomAttributeValue = (element: {
    attribute: string | null;
    value: string;
  }) => {
    switch (element.attribute) {
      case "warehouse_id":
        return getWarehouseName(element.value);
      case "transmittal_id":
      case "transfer_id":
      case "pullout_id":
      case "transfer_id":
      case "return_id":
        return element.value ? (
          <Group>
            <span>{element.value}</span>
            <ActionIcon onClick={() => getTransactionLink(element)}>
              <ArrowUpRightCircle />
            </ActionIcon>
          </Group>
        ) : undefined;
      default:
        return element.value;
    }
  };

  const orderedAttributes = [
    "id",
    "serial",
    "item_status",
    "description",
    "batch_id",
    "gtin",
    "sku",
    "warehouse_id",
    "unit_of_measure",
    "date_created",
    "date_updated",
    "transmittal_id",
    "transfer_id",
    "order_id",
    "pullout_id",
    "return_id",
    "__typename",
    "holder_serial",
    "charger_serial",
    "tag",
    "expiration_date",
    "manufacturing_date",
    "issue_date",
    "location",
    "status_date",
    "cycle",
  ];

  const rows = () => {
    if (!data?.inventoryItem) {
      return null;
    }
    const scannedMap = Object.fromEntries(
      formatCodentifyScanned()?.map((item) => [item.attribute, item.value]) ||
        [],
    );

    return orderedAttributes.map((key, index) => {
      const element = {
        attribute: key,
        value: scannedMap[key] || "",
      };
      return (
        <tr key={`list-${index}`}>
          <td>{element.attribute}</td>
          <td>{getCustomAttributeValue(element)}</td>
        </tr>
      );
    });
  };

  const getWarehouseName = (warehouse: string) => {
    if (warehouse?.includes("ACTIVATION_")) {
      const activation = dataActivations?.activations?.items?.find(
        (e: RETAIL.Activation) =>
          data.inventoryItem.warehouse_id.includes(e.id),
      );
      const outlet = activation?.outlets?.find((e: RETAIL.Outlet) =>
        data.inventoryItem.warehouse_id.includes(e.id),
      );
      return `(${warehouse}) ${activation?.id}: ${outlet?.name} ${outlet?.location}`;
    } else {
      const drWarehouseName: WMS.Warehouse =
        dataDRWarehouses.warehouses.items.find(
          (e: WMS.Warehouse) => e.id == warehouse,
        );
      const ecomWarehouseName: WMS.Warehouse =
        dataEcomWarehouses.warehouses.items.find(
          (e: WMS.Warehouse) => e.id == warehouse,
        );
      const dataICWarehouseName: WMS.Warehouse =
        dataICWarehouses.warehouses.items.find(
          (e: WMS.Warehouse) => e.id == warehouse,
        );
      return `${
        ecomWarehouseName?.name ||
        drWarehouseName?.name ||
        dataICWarehouseName?.name
      } (${warehouse})`;
    }
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Input
          {...form.getInputProps("codentify")}
          description="CODENTIFY/Serial"
          placeholder="Enter CODENTIFY or Serial"
        />
      </form>
      <div>
        <br />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </div>
    </div>
  );
};
