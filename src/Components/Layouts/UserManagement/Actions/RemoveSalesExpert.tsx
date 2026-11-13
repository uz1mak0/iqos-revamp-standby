import React from "react";
import { Button, Group, Modal } from "../../../Elements";
import { WMS } from "../../../../GraphQL";
import { deleteSalesExpert } from "../../../../GraphQL/UserSchema";
import { useMutation } from "@apollo/client";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRemove: (user: WMS.SalesExpert | undefined) => void;
  user: WMS.SalesExpert | undefined;
};

export const RemoveSalesExpert = (props: Props) => {
  const [onDeleteUser, { loading }] = useMutation(deleteSalesExpert, {
    context: { clientName: "warehouse" },
  });

  const onRemoveSalesExpert = () => {
    onDeleteUser({
      variables: {
        sales_expert_id: props?.user?.sales_expert_id,
      },
      onCompleted: () => {
        Notification.success({ message: "Sales Expert removed" });
        props.onClose();
        props.onRemove(props?.user);
      },
      onError: () => {
        Notification.error({ message: "Failed to remove sales expert" });
        props.onClose();
      },
    });
  };
  return (
    <Modal
      onClose={props.onClose}
      title="Remove"
      centered
      opened={props.visible}
      removeCloseButton
    >
      <p>Are you sure you want to remove Sales Expert?</p>
      <Group position="right">
        <Button onClick={() => props.onClose()} customType="secondary">
          Cancel
        </Button>
        <Button
          customType="danger"
          onClick={onRemoveSalesExpert}
          loading={loading}
        >
          Remove
        </Button>
      </Group>
    </Modal>
  );
};
