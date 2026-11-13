import { useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Send } from "tabler-icons-react";
import { riderResetPassword } from "../../../GraphQL/RiderSchema";
import { Maybe } from "../../../GraphQL/_gql/store/graphql";
import { rolesAtom } from "../../../Store/StoreAtom";
import { Button, Group, Modal, Popover } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  username: Maybe<string> | undefined;
};

function ResetPassword({ username, ...props }: Props) {
  const [onRiderResetPassword, { loading: resetLoading }] = useMutation(
    riderResetPassword,
    { context: { clientName: "order" } }
  );
  const [userRoles] = useAtom(rolesAtom);
  const [opened, setOpened] = useState(false);

  const onReset = () => {
    onRiderResetPassword({
      variables: {
        input: { username: username },
      },
      onCompleted: (data) => {
        Notification.success({ message: "Reset Password Successs" });
        setOpened(false);
      },
      onError: (error) => {
        Notification.error({ message: "Reset Password Failed" });
        setOpened(false);
      },
    });
  };

  const getDisableCreate = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isDirectRetailAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin
    )
      return false;
    return true;
  };

  return (
    <div>
      <Popover opened={opened} position="left">
        <Popover.Target>
          <div style={{ width: "max-content" }}>
            <Button
              loading={resetLoading}
              onClick={(e) => {
                setOpened(!opened);
                e.stopPropagation();
                e.preventDefault();
              }}
              disabled={getDisableCreate()}
              icon={<Send />}
              customType="orange"
            >
              Reset & Resend Password
            </Button>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <div>
            <h3 style={{ textAlign: "center" }}>Reset {username} password?</h3>
            <Group position="center">
              <Button
                loading={resetLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpened(false);
                }}
                customType="secondary"
              >
                Cancel
              </Button>
              <Button
                customType="primary"
                type="submit"
                loading={resetLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onReset();
                }}
              >
                Okay
              </Button>
            </Group>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

export default ResetPassword;
