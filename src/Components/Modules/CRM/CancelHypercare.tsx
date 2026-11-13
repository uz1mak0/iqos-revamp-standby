import React from "react";
import { Button, Text } from "../../Elements";
import { openConfirmModal } from "@mantine/modals";
import { X } from "tabler-icons-react";

type Props = {
  onCancel: () => void;
};

export const CancelHypercare = (props: Props) => {
  const openModal = () =>
    openConfirmModal({
      title: "",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to cancel? Information that you entered will be
          reset.
        </Text>
      ),
      labels: { confirm: "Continue", cancel: "Back" },
      confirmProps: { color: "green" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => props.onCancel(),
    });

  return (
    <Button customType="secondary" icon={<X />} onClick={openModal}>
      Cancel
    </Button>
  );
};
