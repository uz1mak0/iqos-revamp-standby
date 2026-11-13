import React from "react";
import { ActionIcon, Menu } from "../../../Elements";
import { IconDotsVertical } from "@tabler/icons-react";
import { Edit, Trash, UserCheck, UserOff } from "tabler-icons-react";
import { ORDER, WMS } from "../../../../GraphQL";

type Props = {
  onSelectAction: (
    user: ORDER.Rider | undefined,
    type: string | undefined
  ) => void;
  user: ORDER.Rider | undefined;
};

export const RiderActions = (props: Props) => {
  return (
    <div>
      <Menu position="bottom-end">
        <Menu.Target>
          <div>
            <ActionIcon radius={20} variant="default">
              <IconDotsVertical />
            </ActionIcon>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => props.onSelectAction(props.user, "EDIT")}
            icon={<Edit />}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            onClick={() => props.onSelectAction(props.user, "RESET")}
            icon={<Trash />}
          >
            Reset & Resend Password
          </Menu.Item>
          <Menu.Item
            color={props.user?.user_status == "ACTIVE" ? "red" : "green"}
            onClick={() => props.onSelectAction(props.user, "DISABLE")}
            icon={
              props.user?.user_status == "ACTIVE" ? <UserOff /> : <UserCheck />
            }
          >
            {props.user?.user_status == "ACTIVE" ? "Disable" : "Enable"} User
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
