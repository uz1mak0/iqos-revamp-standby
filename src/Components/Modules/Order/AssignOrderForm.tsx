import { useMutation, useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { UserPlus } from "tabler-icons-react";
import { ORDER, WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { assignOrderToWarehouse } from "../../../GraphQL/OrderManagementSchema";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import { Switch, Table, Button, Group, Modal } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { LoadingOverlay } from "@mantine/core";
import { set } from "react-hook-form";
type Props = {
  onSubmit: () => void;
  orders: ORDER.Maybe<ORDER.Order>[];
};

export const AssignOrderForm = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const { loading, data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });
  const [assignOrder, { loading: loadingCreate }] = useMutation(
    assignOrderToWarehouse,
    { context: { clientName: "order" } }
  );
  const [selected, setSelected] = useState<WMS.Warehouse>();
  const [visible, setVisible] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);

  const onAssignOrders = async () => {
    if (!selected?.id) {
      Notification.error({ message: "Please select a warehouse" });
      return;
    }

    try {
      setLoadingAssign(true);
      const results = await Promise.allSettled(
        props.orders.map((order) =>
          assignOrder({
            variables: {
              id: order?.id,
              warehouse_id: selected.id,
            },
          })
        )
      );

      const failures = results.filter((result) => result.status === "rejected");

      if (failures.length > 0) {
        Notification.info({
          message: `${failures.length} orders failed to assign. ${
            results.length - failures.length
          } orders assigned successfully.`,
        });
      } else {
        Notification.success({ message: "All orders assigned successfully" });
      }

      onCancel();
      props.onSubmit();
      setLoadingAssign(false);
    } catch (e) {
      Notification.error({
        message: e instanceof Error ? e.message : "Failed to assign orders",
      });
      setLoadingAssign(false);
    }
  };

  const onCancel = () => {
    setSelected(undefined);
    setVisible(false);
  };

  const accessRole = () => {
    if (
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
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

  const rows = data?.warehouses?.items
    ?.filter((element: WMS.Warehouse) => element.status === true)
    ?.map((element: WMS.Warehouse) => (
      <tr key={element.id}>
        <td>
          <Switch
            onChange={(e) => {
              if (e.target.checked) {
                setSelected(element);
              } else {
                setSelected(undefined);
              }
            }}
            disabled={selected && selected.id !== element.id}
          />
        </td>
        <td>{element?.name}</td>
        <td>{element?.area}</td>
      </tr>
    ));

  return (
    <div>
      <Modal
        size={1000}
        centered
        title={"Assign Order"}
        onClose={() => onCancel()}
        opened={visible}
      >
        <LoadingOverlay visible={loadingAssign} />
        <h4>Total Orders: {props.orders?.length || 0}</h4>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Assign</th>
              <th>Store/Warehouse</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <br />
        <Group position="center">
          <Button onClick={() => onCancel()} customType="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => onAssignOrders()}
            disabled={!selected}
            customType="primary"
          >
            Assign
          </Button>
        </Group>
      </Modal>
      <Button
        disabled={(props.orders?.length || 0) < 1 || accessRole()}
        onClick={() => setVisible(true)}
        icon={<UserPlus />}
      >
        Assign To
      </Button>
    </div>
  );
};
