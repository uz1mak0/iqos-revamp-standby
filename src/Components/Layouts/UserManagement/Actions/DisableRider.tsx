import React, { useState } from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import { Button, Group, LoadingOverlay, Modal } from "../../../Elements";
import { useMutation } from "@apollo/client";
import { riderDisable, riderEnable } from "../../../../GraphQL/UserSchema";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: ORDER.Rider | undefined;
  users: ORDER.Rider[];
  setUsers: (users: ORDER.Rider[]) => void;
};

export const DisableRider = (props: Props) => {
  const [onDisableRider] = useMutation(riderDisable);
  const [onEnableRider] = useMutation(riderEnable);
  const [loading, setLoading] = useState(false);

  const onErrorChangeStatus = () => {
    setLoading(false);
    Notification.error({
      message: `Failed to update rider status`,
    });
    props.onClose();
  };

  const onUpdateUserStatus = (status: WMS.UserStatus) => {
    const updateList = [...props.users];
    const index = updateList.findIndex(
      (e) => e.username === props.profile?.username
    );
    updateList[index] = { ...updateList[index], user_status: status };
    props.setUsers(updateList);
    setLoading(false);
    Notification.success({
      message: `${props.profile?.username} status is now ${status}`,
    });
    props.onClose();
  };

  const onChangeStatus = () => {
    setLoading(true);
    if (props.profile?.user_status == "ACTIVE") {
      onDisableRider({
        variables: { username: props.profile.username },
        onCompleted: () => {
          setLoading(false);

          onUpdateUserStatus(WMS.UserStatus.Inactive);
        },
        onError: (error) => {
          onErrorChangeStatus();
        },
        context: { clientName: "warehouse" },
      });
    } else {
      onEnableRider({
        variables: { username: props?.profile?.username },
        onCompleted: () => {
          onUpdateUserStatus(WMS.UserStatus.Active);
        },
        onError: (error) => {
          onErrorChangeStatus();
        },
        context: { clientName: "warehouse" },
      });
    }
  };
  return (
    <Modal
      centered
      title={`${
        props.profile?.user_status == "ACTIVE" ? "Disable" : "Enable"
      } User`}
      opened={props.visible}
      removeCloseButton
      onClose={() => props.onClose()}
    >
      <LoadingOverlay visible={loading} />
      <p>Are you sure you want to change this user status?</p>
      <Group position="right">
        <Button onClick={() => props.onClose()} customType="secondary">
          Cancel
        </Button>
        <Button customType="primary" onClick={() => onChangeStatus()}>
          Submit
        </Button>
      </Group>
    </Modal>
  );
};
