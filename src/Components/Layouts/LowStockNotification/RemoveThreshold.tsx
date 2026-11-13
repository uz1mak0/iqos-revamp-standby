import React from "react";
import { WMS } from "../../../GraphQL";
import { ActionIcon } from "../../Elements";
import { IconTrash } from "@tabler/icons-react";
import { openConfirmModal } from "@mantine/modals";
import { useLowStockNotificationStore } from "./Store";
import { useMutation } from "@apollo/client";
import { removeThresholdConfig } from "../../../GraphQL/SKUsSchema";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  warehouse: WMS.Warehouse;
};
export const RemoveThreshold = ({ warehouse }: Props) => {
  const { thresholds, setThresholds } = useLowStockNotificationStore();
  const [onRemoveThresholdConfig, { loading: createLoading }] = useMutation(
    removeThresholdConfig,
    {
      context: { clientName: "warehouse" },
    }
  );

  const onConfirm = () => {
    onRemoveThresholdConfig({
      variables: {
        warehouse_id: warehouse.id,
      },
    })
      .then((res) => {
        setThresholds(
          thresholds.filter((e) => e.warehouse_id !== warehouse.id)
        );
        Notification.success({
          message: `${warehouse.id} configuration removed`,
        });
      })
      .catch((error) => {
        Notification.error({ message: error.message });
      });
  };
  const openModal = () =>
    openConfirmModal({
      title: "Remove configuration",
      centered: true,
      children: (
        <p>Remove {warehouse.name} low stock notification configuration?</p>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => onConfirm(),
    });

  return (
    <ActionIcon onClick={openModal} variant="filled" color="red">
      <IconTrash />
    </ActionIcon>
  );
};
