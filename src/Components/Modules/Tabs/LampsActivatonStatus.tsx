import { useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { getInventoryItems } from "../../../GraphQL/CodentifyScannerSchema";
import {
  getVouchers,
  getWarehouseInventory,
} from "../../../GraphQL/InventorySchema";
import { ActionIcon, Button, Modal, Table } from "../../Elements";
import { OutletProps } from "./LampsTab";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { WMS } from "../../../GraphQL";
import { CaretDown, CaretUp } from "tabler-icons-react";
dayjs.extend(isSameOrAfter);

type Props = {
  activation: OutletProps;
};

export const LampsActivatonStatus = (props: Props) => {
  const [expand, setExpand] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const { data: warehouseInventory } = useQuery(getWarehouseInventory, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: `ACTIVATION_${props.activation.activation_id}_${props.activation.id}`,
      type: "ACTIVATION_BATCH",
    },
  });

  const { data: inventoryItems } = useQuery(getInventoryItems, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: `ACTIVATION_${props.activation.activation_id}_${props.activation.id}`,
      status: "PULLOUT",
    },
  });

  const { data: voucherInventoryItems } = useQuery(getVouchers, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: `ACTIVATION_${props.activation.activation_id}_${props.activation.id}`,
      status: "PULLOUT",
    },
  });

  useEffect(() => {
    if (warehouseInventory) {
      const date = props.activation.activation_id.replace("ACTIVATION_", "");
      const formatDate = `${date.slice(0, 3)}-${date.slice(3, 5)}-${date.slice(
        5,
        9,
      )}`;
      const items = warehouseInventory?.batchesPerWarehouse?.items || [];
      const today = dayjs().format("MMM-DD-YYYY");

      if (
        dayjs(formatDate, "MMM-DD-YYYY").isBefore(
          dayjs(today, "MMM-DD-YYYY"),
        ) &&
        items.length > 0
      ) {
        setCurrentStatus("FOR RETURN");
      }
      if (
        dayjs(formatDate, "MMM-DD-YYYY").isSameOrAfter(
          dayjs(today, "MMM-DD-YYYY"),
        ) &&
        items.length == 0
      ) {
        setCurrentStatus("FOR PULLOUT");
      }
      if (
        dayjs(formatDate, "MMM-DD-YYYY").isSame(dayjs(today, "MMM-DD-YYYY")) &&
        items.length > 0
      ) {
        setCurrentStatus("ACTIVE");
      }
      if (
        dayjs(formatDate, "MMM-DD-YYYY").isAfter(dayjs(today, "MMM-DD-YYYY")) &&
        items.length > 0
      ) {
        setCurrentStatus("PENDING");
      }
    }
  }, [warehouseInventory, inventoryItems, voucherInventoryItems]);

  const onClickItem = (item: WMS.BatchItems) => {
    const batchGTIN = `${item.gtin}_${item.batch_id}`;
    if (expand?.some((e) => e == batchGTIN)) {
      setExpand(expand.filter((e) => e !== batchGTIN));
    } else {
      setExpand([...expand, batchGTIN]);
    }
  };

  const rows = () => {
    const serials = inventoryItems?.inventoryItems?.items || [];
    const vouchers = voucherInventoryItems?.voucherInventoryItems?.items || [];
    const batches = warehouseInventory?.batchesPerWarehouse?.items || [];
    const rowList =
      serials.length == 0
        ? batches?.filter((e: WMS.BatchItems) => e.inventory_type !== "DEVICES")
        : batches;
    return rowList?.map((element: WMS.BatchItems, index: number) => (
      <React.Fragment key={`list-${index}`}>
        <tr
          onClick={() =>
            element?.inventory_type === "DEVICES" ||
            element?.inventory_type === "VOUCHER"
              ? onClickItem(element)
              : undefined
          }
        >
          {element.inventory_type === "DEVICES" ||
          element.inventory_type === "VOUCHER" ? (
            <td style={{ width: 10 }}>
              {
                <ActionIcon>
                  {expand?.some(
                    (e) => `${element.gtin}_${element.batch_id}` == e,
                  ) ? (
                    <CaretUp />
                  ) : (
                    <CaretDown />
                  )}
                </ActionIcon>
              }
            </td>
          ) : (
            <td></td>
          )}
          <td>{element?.gtin}</td>
          <td>{element?.sku}</td>
          <td>{element?.batch_id}</td>
          <td>{element?.quantity}</td>
          <td>{element?.description}</td>
          <td>{element?.inventory_type}</td>
        </tr>
        {expand?.some((e) => `${element.gtin}_${element.batch_id}` == e) ? (
          <tr key={`list-expanded=${index}`}>
            {expandedTable(
              element?.inventory_type === "VOUCHER"
                ? vouchers
                : serials.filter(
                    (e: WMS.InventoryItem) => e.gtin == element.gtin,
                  ),
            )}
          </tr>
        ) : undefined}
      </React.Fragment>
    ));
  };

  const expandedTable = (items: WMS.InventoryItem[]) => {
    return (
      <>
        <td colSpan={7}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Serial</th>
                  <th>Charger Serial</th>
                  <th>Holder Serial</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item: WMS.InventoryItem, i) => (
                  <tr key={` batch-${i}`}>
                    <td></td>
                    <td>{item?.serial}</td>
                    <td>{item?.charger_serial}</td>
                    <td>{item?.holder_serial}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  console.log(expand);
  return (
    <div>
      <Modal
        size={1000}
        title={currentStatus}
        onClose={() => {
          setVisible(false);
          setExpand([]);
        }}
        opened={visible}
        centered
      >
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Batch ID</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Inventory Type</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </Modal>
      {currentStatus !== "" &&
      warehouseInventory?.batchesPerWarehouse?.items?.length > 0 ? (
        <Button onClick={() => setVisible(true)}>{`${currentStatus}`}</Button>
      ) : undefined}
    </div>
  );
};
