/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CaretDown,
  CaretLeft,
  CaretUp,
  CircleCheck,
  Printer,
  X,
} from "tabler-icons-react";
import { formatCycleCount } from "../../../Utilities/Formatter";
import { ActionIcon } from "../../Elements/ActionIcon";
import { Button } from "../../Elements/Button";
import { Checkbox } from "../../Elements/Checkbox";
import { Group } from "../../Elements/Group";
import { Input } from "../../Elements/Input";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { Modal } from "../../Elements/Modal";
import Notification from "../../Elements/Notification/Notification";
import { Paper } from "../../Elements/Paper";
import { Select } from "../../Elements/Select";
import { Table } from "../../Elements/Table";
import { formatCodentify } from "../../Layouts/CodentifyScanner/Config";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { generatePDF } from "../../../GraphQL/OrderManagementSchema";
import { getDeviceStatus } from "../Tabs/Config";
import { checkUsageHistory } from "../../Layouts/OrderManagement/Config";
// import { checkUsageHistory, formatCycleCount, getDeviceStatus, getReturnSerials } from '../../Layouts/OrderManagement/Config'
import {
  getReturnOrder,
  returnOrderStatusUpdate,
} from "../../../GraphQL/OrderManagementSchema";
import { InventoryItem, Maybe } from "../../../GraphQL/_gql/order/graphql";
import { ORDER, WMS } from "../../../GraphQL";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { updateGTIN } from "./Config";

type Props = {
  isPack?: boolean;
  order?: Maybe<ORDER.Order>;
  skus?: Maybe<WMS.Sku[]>;
  returnOrder: Maybe<ORDER.Order>;
  onUpdate: (order: Maybe<ORDER.Order>, isReturnOrder: boolean) => void;
};

interface ScannedItems extends ORDER.OrderItem {
  gtin: ORDER.Maybe<string> | undefined;
  type: WMS.Maybe<WMS.SkuType> | undefined;
  scanned_quantity: ORDER.Maybe<number> | undefined;
  checked: boolean | undefined;
}

export const OrderLendingUnpack = (props: Props) => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const [scannedItems, setScannedItems] = useState<ScannedItems[]>([]);
  const [refetchSerial, { data: dataSerial, loading: loadingSerial }] =
    useLazyQuery(getInventoryItem, { context: { clientName: "warehouse" } });
  const [orderReturn, { loading: loadingOrderReturn }] = useMutation(
    returnOrderStatusUpdate,
    { context: { clientName: "order" } }
  );
  const [onGeneratePDF, { loading }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });
  const [confirm, setConfirm] = useState<{
    type: undefined | string;
    visible: boolean;
  }>({
    type: undefined,
    visible: false,
  });
  const [expand, setExpand] = useState<number[]>([]);
  const [serialStatus, setSerialStatus] = useState<{
    charger: boolean;
    holder: boolean;
    status: undefined | string;
  }>({
    charger: false,
    holder: false,
    status: undefined,
  });

  useEffect(() => {
    if (props.returnOrder?.items && props.skus) {
      const updateItems = props?.returnOrder?.items
        .map((item) => {
          return {
            ...item,
            gtin:
              item?.sku === "PISK001"
                ? "0001"
                : updateGTIN(item, props.skus || []),
            type: props.skus?.find((e) => e.sku === item?.sku)?.type,
            scanned_quantity: scannedQuantityByStatus(item),
            checked: item?.scanned_quantity ? true : false,
          };
        })
        .filter((e) => !e?.description?.includes("FEE"));
      setScannedItems(updateItems);
      setExpand([updateItems.findIndex((e) => e.inventory_items)]);
    }
  }, [props?.order, props.skus]);

  const scannedQuantityByStatus = (item: Maybe<ORDER.OrderItem>) => {
    switch (props?.returnOrder?.order_status) {
      case "RECEIVED":
      case "FAILED":
        return 0;
      case "RETURNED":
        return item?.scanned_quantity;
      default:
        break;
    }
  };

  const quantityIcon = (item: ScannedItems) => {
    if (
      item.quantity === item.scanned_quantity ||
      props?.returnOrder?.order_status === "RETURNED"
    ) {
      return <CircleCheck size={15} strokeWidth={2} color={"#40bf89"} />;
    } else {
      return <AlertCircle size={15} strokeWidth={2} color={"#bf4240"} />;
    }
  };

  const serialChecker = async (serial: string) => {
    if (serial.length == 12) {
      return refetchSerial({
        variables: { serial: serial },
        fetchPolicy: "no-cache",
      }).then((res) => {
        return res.data.inventoryItem
          ? {
              gtin: res.data.inventoryItem.gtin,
              serial: res.data.inventoryItem.serial,
              sku: res.data.inventoryItem.sku,
              item_status: res.data.inventoryItem.item_status,
              description: res.data.inventoryItem.description,
              batch_id: res.data.inventoryItem.batch_id,
              unit_of_measure: res.data.inventoryItem.unit_of_measure,
            }
          : undefined;
      });
    } else {
      return undefined;
    }
  };

  const onCheckItems = (checked: boolean, item: ScannedItems) => {
    const updateScannedItems = [...scannedItems];
    const index = scannedItems?.findIndex((e) => item.gtin === e.gtin);
    updateScannedItems[index] = {
      ...updateScannedItems[index],
      checked: checked,
    };
    setScannedItems(updateScannedItems);
  };

  const getItemSerials = (order: ScannedItems) => {
    var set: any[] = [];
    var serials: any[] = [];
    if (order.inventory_items && order.inventory_items.length > 0) {
      order.inventory_items.map((item) => {
        serials.push(item?.serial);
      });
      set.push(serials.join(", "));
    }
    return set.join("| ") || "-";
  };

  const getStatusView = (item: ScannedItems) => {
    if (!item.inventory_items) {
      return (
        <Checkbox
          defaultChecked={item.checked}
          disabled={
            props.returnOrder?.order_status !== "RECEIVED" || accessRole()
          }
          onChange={(e) => onCheckItems(e.target.checked, item)}
          label=""
        />
      );
    } else {
      return quantityIcon(item);
    }
  };

  const rows = () => {
    return scannedItems?.map((element, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td style={{ width: 10 }}>
            {element.type === "DEVICES" ? (
              <ActionIcon>
                {expand?.some((e) => e == index) &&
                element.type === "DEVICES" ? (
                  <CaretUp
                    onClick={() => setExpand(expand.filter((e) => e != index))}
                  />
                ) : (
                  <CaretDown onClick={() => setExpand(expand.concat(index))} />
                )}
              </ActionIcon>
            ) : undefined}
          </td>
          <td>{getStatusView(element)}</td>
          <td>{element.gtin}</td>
          <td>{element.sku}</td>
          <td>{getItemSerials(element)}</td>
          <td>{element.description}</td>
          <td>{formatCycleCount(element)}</td>
          <td>{getDeviceTagging(element)}</td>
          <td>
            {checkUsageHistory(element, props.order) ? (
              <Button disabled={props.returnOrder?.order_status !== "RECEIVED"}>
                Usage History
              </Button>
            ) : undefined}
          </td>
        </tr>
        {expand?.some((e) => e == index) && element.type === "DEVICES" ? (
          <tr key={`list-expanded=${index}`}>
            {expandedTable(element?.inventory_items, element)}
          </tr>
        ) : undefined}
      </React.Fragment>
    ));
  };

  const onSetSerialStatus = (checked: boolean, type: string) => {
    if (type === "Charger") {
      const status =
        checked && serialStatus.holder
          ? "COMPLETED"
          : serialStatus.status === "COMPLETED"
          ? undefined
          : serialStatus.status;
      setSerialStatus({ ...serialStatus, charger: checked, status: status });
    } else {
      const status =
        checked && serialStatus.charger
          ? "COMPLETED"
          : serialStatus.status === "COMPLETED"
          ? undefined
          : serialStatus.status;
      setSerialStatus({ ...serialStatus, holder: checked, status: status });
    }
  };

  const expandedTable = (
    items: Maybe<Maybe<ORDER.InventoryItem>[]> | undefined,
    rootItem: ScannedItems
  ) => {
    const chargerHolder = [
      {
        type: "Charger",
        serial: items![0]?.charger_serial,
        checked: items,
      },
      {
        type: "Holder",
        serial: items![0]?.holder_serial,
      },
    ];
    return (
      <>
        <td colSpan={9}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Serial</th>
                  <th>SKU</th>
                </tr>
              </thead>
              <tbody>
                {chargerHolder?.map((item, i) => (
                  <tr key={` batch-${i}`}>
                    <th>
                      <Checkbox
                        disabled={
                          props.returnOrder?.order_status !== "RECEIVED"
                        }
                        onChange={(e) =>
                          onSetSerialStatus(e.target.checked, item.type)
                        }
                        label=""
                        defaultChecked={
                          item.type === "Charger"
                            ? rootItem?.charger_returned!
                            : rootItem.holder_returned!
                        }
                      />
                    </th>
                    <td>{item?.serial}</td>
                    <td>{item?.type}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  const getDeviceTagging = (item: ScannedItems) => {
    const validateSerial = item.quantity == item.scanned_quantity;
    const device = scannedItems.find((e) => e.gtin === item.gtin);
    return item.inventory_items ? (
      (validateSerial && !item.device_return_status) ||
      (serialStatus.charger && serialStatus.holder) ? (
        <p>COMPLETED</p>
      ) : (
        <Select
          disabled={
            props.returnOrder?.order_status !== "RECEIVED" || accessRole()
          }
          onChange={(value: string) =>
            setSerialStatus({ ...serialStatus, status: value })
          }
          defaultValue={item?.device_return_status || serialStatus.status}
          placeholder="Select Device Status"
          description="Device Status"
          data={getDeviceStatus || []}
        />
      )
    ) : undefined;
  };

  const onReturn = () => {
    if (
      serialStatus.status === undefined &&
      scannedItems.some((e) => e.type === "DEVICES")
    )
      return Notification.error({ message: "Please select device tagging" });
    const items = scannedItems.map((item) => {
      return {
        quantity: item.quantity,
        scanned_quantity: item.inventory_items
          ? 1
          : item.checked
          ? item.quantity
          : 0,
        holder_returned: item.inventory_items ? serialStatus.holder : undefined,
        charger_returned: item.inventory_items
          ? serialStatus.charger
          : undefined,
        device_return_status: item.inventory_items
          ? serialStatus.status === "COMPLETED"
            ? undefined
            : serialStatus.status
          : undefined,
      };
    });
    orderReturn({
      variables: {
        order_status: "RETURNED",
        id: props.returnOrder?.id,
        scanned_items: items,
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.returnOrderStatusUpdate, true);
        setConfirm({ type: undefined, visible: false });
        Notification.success({ message: "Return success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onFail = () => {
    orderReturn({
      variables: {
        order_status: "FAILED",
        id: props.returnOrder?.id,
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.returnOrderStatusUpdate, true);
        Notification.success({ message: "Return success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
        setConfirm({
          type: undefined,
          visible: false,
        });
      });
  };

  const printReturn = () => {
    onGeneratePDF({
      variables: {
        type: "LENDING_RETURN",
        order_id: router.query.returnID,
      },
      onCompleted: (response) => {
        window.open(response.generatePDF, "_blank");
      },
      onError: (err) => {
        console.error(err);
        Notification.error({ message: err.message });
      },
    });
  };

  const confirmFailModal = () => (
    <Modal
      centered
      onClose={() => setConfirm({ type: undefined, visible: false })}
      opened={confirm.visible}
    >
      <div style={{ textAlign: "center" }}>
        <AlertCircle
          size={40}
          strokeWidth={3}
          color={confirm.type === "RETURNED" ? "#FAAD14" : "#bf4240"}
        />
        {confirm.type === "RETURNED" ? (
          <h2>Do you want to return these items?</h2>
        ) : (
          <h2>Set the status to fail?</h2>
        )}
      </div>
      <Group position="center">
        <Button
          onClick={() => setConfirm({ type: undefined, visible: false })}
          customType="secondary"
        >
          Back
        </Button>
        <Button
          onClick={() => (confirm.type === "RETURNED" ? onReturn() : onFail())}
          customType="primary"
        >
          Okay
        </Button>
      </Group>
    </Modal>
  );

  const accessRole = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      {confirmFailModal()}
      <LoadingOverlay visible={loadingOrderReturn} />
      <Paper radius={8}>
        <Group position="apart">
          <h2>Unpack</h2>
          <Button
            disabled={accessRole()}
            icon={<Printer />}
            onClick={() => printReturn()}
          >
            Print
          </Button>
        </Group>
        <Paper radius={8}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                <th>Status</th>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Serial</th>
                <th>Description</th>
                <th>Cycle Count</th>
                <th>Device Tagging</th>
                <th>Usage History</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
          </Table>
          <br />
          {props.returnOrder?.order_status === "RECEIVED" &&
          (props.returnOrder?.items?.length || 0) > 0 ? (
            <Group direction="column" position="center">
              <Button
                disabled={accessRole()}
                icon={<CaretLeft />}
                onClick={() =>
                  setConfirm({
                    type: "RETURNED",
                    visible: true,
                  })
                }
              >
                Return
              </Button>
              <Button
                disabled={accessRole()}
                customType="danger"
                icon={<X />}
                onClick={() =>
                  setConfirm({
                    type: "FAILED",
                    visible: true,
                  })
                }
              >
                Fail
              </Button>
            </Group>
          ) : undefined}
        </Paper>
      </Paper>
    </div>
  );
};
