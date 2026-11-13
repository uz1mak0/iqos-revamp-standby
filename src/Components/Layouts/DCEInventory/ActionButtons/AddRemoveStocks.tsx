import { Group } from "@mantine/core";
import React, { useState } from "react";
import { Button, Modal } from "../../../Elements";

type Props = {
  isEnabled: boolean;
  onSelectStatus: (status: string) => void;
};

export const AddRemoveStocks = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState("ADD");
  return (
    <Group position="right">
      <Modal
        centered
        title={`${action === "ADD" ? "Add" : "Remove"} Stocks`}
        opened={visible}
        onClose={() => setVisible(false)}
      ></Modal>
      <Button
        onClick={() => props.onSelectStatus("BLOCKED")}
        disabled={!props.isEnabled}
        customType="danger"
      >
        Remove Stocks
      </Button>
      <Button
        onClick={() => props.onSelectStatus("UNBLOCKED")}
        disabled={!props.isEnabled}
      >
        Add Stocks
      </Button>
    </Group>
  );
};
