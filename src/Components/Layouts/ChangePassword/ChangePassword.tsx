import React, { useState } from "react";
import { Auth } from "../../../Utilities/Backend";
import { Button, Group, Modal, PasswordInput, Stack } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const ChangePassword = (props: Props) => {
  const [passwords, setPasswords] = useState({
    old: undefined,
    new: undefined,
    confirm: undefined,
  });
  const onClose = () => {
    setPasswords({
      old: undefined,
      new: undefined,
      confirm: undefined,
    });
    props.onClose();
  };

  const onChangePassword = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(
          user,
          `${passwords.old}`,
          `${passwords.new}`,
        );
      })
      .then((data) => {
        onClose();
        Notification.success({ message: "Password Changed" });
      })
      .catch((err) => Notification.error({ message: err.message }));
  };
  return (
    <Modal
      centered
      title="Change Password"
      onClose={onClose}
      opened={props.visible}
    >
      <Stack>
        <PasswordInput
          onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
          description="Old Password"
        />
        <PasswordInput
          disabled={!passwords.old}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          description="New Password"
        />
        <PasswordInput
          disabled={!passwords.new}
          error={
            passwords.new
              ? passwords.new === passwords.confirm
                ? undefined
                : "Password do not match"
              : undefined
          }
          onChange={(e) =>
            setPasswords({ ...passwords, confirm: e.target.value })
          }
          description="Confirm Password"
        />
        <Group position="center">
          <Button customType="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            disabled={
              !(
                passwords.old &&
                passwords.new &&
                passwords.new === passwords.confirm
              )
            }
            onClick={() => onChangePassword()}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
