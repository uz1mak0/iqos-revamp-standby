import React, { Dispatch, SetStateAction } from "react";
import { ActionIcon, Menu } from "../../../Elements";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { Circle, CircleOff, Edit, Send, Trash } from "tabler-icons-react";
import { WMS } from "../../../../GraphQL";

type Props = {
  onSelectAction: (
    user: WMS.SalesExpert | undefined,
    type: string | undefined
  ) => void;
  user: WMS.SalesExpert | undefined;
};

export const SalesExpertActions = (props: Props) => {
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
          <Menu.Divider />
          <Menu.Item
            color="red"
            onClick={() => props.onSelectAction(props.user, "REMOVE")}
            icon={<Trash />}
          >
            Remove User
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
