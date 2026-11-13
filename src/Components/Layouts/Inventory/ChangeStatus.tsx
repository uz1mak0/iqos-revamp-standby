import React from "react";
import {
  Group,
  Modal,
  ActionIcon,
  Badge,
  Paper,
  Stack,
  Button,
  LoadingOverlay,
} from "../../Elements";
import { IconAlertCircle } from "@tabler/icons-react";
import { ArrowRight } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import Notification from "../../Elements/Notification/Notification";
import { useMutation } from "@apollo/client";
import { updateWarehouse } from "../../../GraphQL/InventorySchema";

type Props = {
  onClose: () => void;
  selectedWarehouse: WMS.Warehouse | undefined;
  isActive: boolean;
  onChangeStatus: (warehouse: WMS.Warehouse) => void;
};

export const WarehouseChangeStatus = ({
  onClose,
  selectedWarehouse,
  isActive,
  onChangeStatus,
}: Props) => {
  const [mutateStatus, { loading }] = useMutation(updateWarehouse, {
    context: { clientName: "warehouse" },
  });

  const getStatusBadge = (active: boolean) => {
    const badgeColor = active ? "green" : "red";
    const label = active ? "ACTIVE" : "INACTIVE";
    return (
      <Badge size="lg" color={badgeColor}>
        {label}
      </Badge>
    );
  };

  const onUpdateStatus = () => {
    if (!selectedWarehouse) return;

    mutateStatus({
      variables: {
        input: {
          id: selectedWarehouse.id,
          status: !isActive,
        },
      },
      optimisticResponse: {
        warehouseUpdate: {
          __typename: "Warehouse",
          id: selectedWarehouse.id,
          status: !isActive,
        },
      },
    })
      .then((res) => {
        Notification.success({ message: "Warehouse status updated" });

        onClose();
      })
      .catch((err) => {
        Notification.error({ message: err.message });
      });
  };

  return (
    <Modal size={500} centered opened={!!selectedWarehouse} onClose={onClose}>
      <LoadingOverlay visible={loading} />
      <Stack>
        <Group>
          <IconAlertCircle color="red" size={30} />
          <div>
            <h4 style={{ margin: 5 }}>Change Warehouse Status</h4>
            <span>Are you sure you want to change this status?</span>
          </div>
        </Group>

        <Paper radius={10}>
          <Group position="center">
            {getStatusBadge(isActive)}
            <ActionIcon variant="transparent">
              <ArrowRight />
            </ActionIcon>
            {getStatusBadge(!isActive)}
          </Group>
        </Paper>

        <Group position="right">
          <Button customType="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="green" customType="custom" onClick={onUpdateStatus}>
            Okay
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
