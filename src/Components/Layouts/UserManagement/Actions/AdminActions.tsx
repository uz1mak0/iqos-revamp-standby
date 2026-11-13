import React, { Dispatch, SetStateAction } from "react";
import { ActionIcon, Menu } from "../../../Elements";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import {
  Circle,
  CircleOff,
  Edit,
  Send,
  User,
  UserCheck,
  UserOff,
} from "tabler-icons-react";
import { WMS } from "../../../../GraphQL";

type Props = {
  onSelectAction: (
    user: WMS.Admin | undefined,
    type: string | undefined
  ) => void;
  user: WMS.Admin | undefined;
};

export const AdminActions = (props: Props) => {
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
            icon={<Send />}
          >
            Reset & Resend Password
          </Menu.Item>
          <Menu.Divider />
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
