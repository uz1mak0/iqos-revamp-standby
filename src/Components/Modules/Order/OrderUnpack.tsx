/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CaretLeft,
  CircleCheck,
  Printer,
  X,
} from "tabler-icons-react";
import { Button } from "../../Elements/Button";
import { Group } from "../../Elements/Group";
import { Input } from "../../Elements/Input";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { Modal } from "../../Elements/Modal";
import Notification from "../../Elements/Notification/Notification";
import { Paper } from "../../Elements/Paper";
import { Table } from "../../Elements/Table";
import { formatCodentify } from "../../Layouts/CodentifyScanner/Config";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
// import { getReturnSerials } from '../../Layouts/OrderManagement/Config'
import {
  generatePDF,
  getReturnOrder,
  returnOrderStatusUpdate,
} from "../../../GraphQL/OrderManagementSchema";
import { Maybe } from "../../../GraphQL/_gql/order/graphql";
import { ORDER, WMS } from "../../../GraphQL";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { updateGTIN } from "./Config";

type Props = {
  isPack?: boolean;
  order?: Maybe<ORDER.Order>;
  skus?: Maybe<WMS.Sku[]>;
  returnOrder: Maybe<ORDER.Order> | undefined;
  onUpdate: (order: Maybe<ORDER.Order>, isReturnOrder: boolean) => void;
};
interface ScannedItems extends ORDER.OrderItem {
  gtin: ORDER.Maybe<string> | undefined;
  type: WMS.Maybe<WMS.SkuType> | undefined;
  scanned_quantity: ORDER.Maybe<number> | undefined;
}
interface ReturnItemSerial extends ORDER.InventoryItem {
  scanned?: boolean | undefined;
}

export const OrderUnpack = (props: Props) => {
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
  const [confirmFail, setConfirmFail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.order?.items) {
      const updateItems = props?.order?.items.map((item) => {
        return {
          ...item,
          gtin:
            item?.sku === "PISK001"
              ? "0001"
              : updateGTIN(item, props.skus || []),
          type: props.skus?.find((e) => e.sku === item?.sku)?.type,
          scanned_quantity: scannedQuantityByStatus(item),
        };
      });
      setScannedItems(updateItems);
    }
  }, [props?.order]);

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
              warehouse_id: res.data.inventoryItem.warehouse_id,
            }
          : undefined;
      });
    } else {
      return undefined;
    }
  };

  const onScan = async (value: string) => {
    const updateScannedItems = [...scannedItems];
    const isSerial = await serialChecker(value);
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
    const codentify = isSerial ? isSerial : formatCodentify(value);
    if (!updateScannedItems.some((e) => e.gtin === value) && !codentify)
      return Notification.error({ message: "Invalid GTIN/Codentify" });
    if (
      updateScannedItems?.find((e) => e.gtin === value)?.type === "DEVICES" &&
      updateScannedItems?.find((e) => e.gtin === value)?.inventory_items
    )
      return Notification.info({ message: "Cannot scan device using GTIN" });
    if (codentify) {
      const data = await serialChecker(codentify.serial);
      const index = updateScannedItems.findIndex(
        (e) => e.gtin === codentify.gtin
      );
      if (index < 0)
        return Notification.error({ message: "Wrong scanned item" });
      if (data?.warehouse_id !== props.order?.assigned_warehouse)
        return Notification.error({
          message: "Serial is not from this warehouse",
        });
      if (
        updateScannedItems[index]?.quantity ===
        updateScannedItems[index]?.scanned_quantity
      )
        return Notification.info({
          message: "Scanned quantity already exceeded",
        });
      const returnItemSerial: ReturnItemSerial | undefined | null =
        updateScannedItems[index]?.inventory_items?.find(
          (item) => item?.serial === data?.serial
        );
      if (returnItemSerial) {
        if (returnItemSerial?.scanned)
          return Notification.info({
            message: `${returnItemSerial.serial} already scanned`,
          });
        updateScannedItems[index] = {
          ...updateScannedItems[index],
          scanned_quantity: updateScannedItems[index]?.quantity,
          inventory_items: updateScannedItems[index]?.inventory_items?.map(
            (item) => {
              return {
                ...item,
                scanned:
                  returnItemSerial?.serial === item?.serial ? true : false,
              };
            }
          ),
        };
        setScannedItems(updateScannedItems);
        Notification.success({ message: "Item scan success" });
      } else {
        Notification.error({ message: "Wrong scanned item" });
      }
    } else {
      if (!props.skus?.some((e) => e.gtin === value))
        return Notification.error({ message: `SKU/GTIN not found` });
      const index = updateScannedItems.findIndex((e) => e.gtin === value);
      if (
        updateScannedItems[index].quantity ===
        updateScannedItems[index].scanned_quantity
      )
        return Notification.info({
          message: "Scanned quantity already exceeded",
        });
      updateScannedItems[index] = {
        ...updateScannedItems[index],
        scanned_quantity: updateScannedItems[index].quantity,
      };
      setScannedItems(updateScannedItems);
      Notification.success({ message: "Item scan success" });
    }
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

  const accessRole = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = () => {
    return scannedItems?.map((element, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td>{quantityIcon(element)}</td>
          <td>{element.gtin}</td>
          <td>{element.sku}</td>
          <td>{getItemSerials(element)}</td>
          <td>{element.description}</td>
          <td>{element.price_per_unit}</td>
          <td>{element.quantity}</td>
          <td>{element.scanned_quantity}</td>
          <td>{element.price_per_unit! * element.quantity!}</td>
        </tr>
      </React.Fragment>
    ));
  };

  const onReturn = () => {
    orderReturn({
      variables: {
        order_status: "RETURNED",
        id: props.returnOrder?.id,
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.returnOrderStatusUpdate, true);
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
        setConfirmFail(false);
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
    <Modal centered onClose={() => setConfirmFail(false)} opened={confirmFail}>
      <div style={{ textAlign: "center" }}>
        <AlertCircle size={40} strokeWidth={3} color={"#bf4240"} />
        <h2>Set the status to fail?</h2>
      </div>
      <Group position="center">
        <Button onClick={() => setConfirmFail(false)} customType="secondary">
          Back
        </Button>
        <Button onClick={() => onFail()} customType="danger">
          Okay
        </Button>
      </Group>
    </Modal>
  );

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
          <Input
            innerref={inputRef}
            disabled={
              props.returnOrder?.order_status !== "RECEIVED" || accessRole()
            }
            placeholder="Scan GTIN or CODENTIFY"
            description="Scan GTIN/CODENTIFY"
            onKeyPress={(e) =>
              e.key === "Enter" ? onScan(e.target.value) : undefined
            }
          />
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Status</th>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Serial</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Scanned Quantity</th>
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
                <th></th>
                <th></th>
                <th>{`Total: ${props.returnOrder?.price?.gross || 0}`}</th>
              </tr>
            </tfoot>
          </Table>
          {props.returnOrder?.order_status === "RECEIVED" ? (
            <Group direction="column" position="center">
              <Button
                disabled={
                  scannedItems.some((e) => e.scanned_quantity !== e.quantity) ||
                  accessRole()
                }
                icon={<CaretLeft />}
                onClick={() => onReturn()}
              >
                Return
              </Button>
              <Button
                disabled={accessRole()}
                customType="danger"
                icon={<X />}
                onClick={() => setConfirmFail(true)}
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
