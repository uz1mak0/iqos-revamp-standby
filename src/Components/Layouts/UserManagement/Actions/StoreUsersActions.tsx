import React from "react";
import { ActionIcon, Menu } from "../../../Elements";
import { IconDotsVertical } from "@tabler/icons-react";
import { Edit, Trash } from "tabler-icons-react";
import { STORE } from "../../../../GraphQL";

type Props = {
  onSelectAction: (
    user: STORE.StoreUser | undefined,
    type: string | undefined
  ) => void;
  user: STORE.StoreUser | undefined;
};

export const StoreUserActions = (props: Props) => {
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
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
