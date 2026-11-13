import React from "react";
import { ORDER, STORE, WMS } from "../../../../GraphQL";
import { Button, Group, LoadingOverlay, Modal } from "../../../Elements";
import { Text } from "@mantine/core";
import { riderResetPassword } from "../../../../GraphQL/RiderSchema";
import { useMutation } from "@apollo/client";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined | ORDER.Rider | STORE.StoreUser;
};

export const ResetUserPassword = (props: Props) => {
  const [onRiderResetPassword, { loading: resetLoading }] = useMutation(
    riderResetPassword,
    { context: { clientName: "order" } }
  );

  const onReset = () => {
    onRiderResetPassword({
      variables: {
        input: { username: props.profile?.username },
      },
      onCompleted: (data) => {
        Notification.success({ message: "Reset Password Successs" });
        props.onClose();
      },
      onError: (error) => {
        Notification.error({ message: "Reset Password Failed" });
      },
    });
  };

  return (
    <Modal
      onClose={props.onClose}
      centered
      removeCloseButton
      title="Resend & Resend Password "
      opened={props.visible}
    >
      <LoadingOverlay visible={resetLoading} />
      <Text>
        Are you sure you want to reset & resend password of {""}
        <Text fw={500} span c="blue" inherit>
          {props.profile?.username}
        </Text>
        ?
      </Text>

      <Group position="right">
        <Button onClick={() => props.onClose()} customType="secondary">
          Close
        </Button>
        <Button onClick={() => onReset()} customType="primary">
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
