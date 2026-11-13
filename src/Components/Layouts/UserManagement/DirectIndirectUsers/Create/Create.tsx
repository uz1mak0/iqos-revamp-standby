import React, { useState } from "react";
import { Button, Menu, Modal } from "../../../../Elements";
import { ChevronDown } from "tabler-icons-react";
import { create } from "domain";
import { SalesExpertForm } from "./SalesExpertForm";
import { DirectIndirectAdminForm } from "./DirectIndirectAdminForm";

interface Props {
  channel: string;
}

export const Create = (props: Props) => {
  const [createType, setCreateType] = useState<string | undefined>(undefined);
  const [opened, setOpened] = useState(false);

  const createTypeForm = () => {
    if (!createType) return <></>;
    switch (createType) {
      case "admin":
        return (
          <DirectIndirectAdminForm
            onClose={() => setOpened(false)}
            visible={opened}
            profile={undefined}
            channel={props.channel}
          />
        );
      case "sales-expert":
        return (
          <SalesExpertForm
            onClose={() => setOpened(false)}
            visible={opened}
            profile={undefined}
          />
        );
      default:
        return <></>;
    }
  };

  const onSelectForm = (type: string) => {
    setCreateType(type);
    setOpened(true);
  };
  return (
    <div>
      {createTypeForm()}
      <Menu width={150} trigger="click">
        <Menu.Target>
          <div>
            <Button rightIcon={<ChevronDown />}>Create User</Button>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => onSelectForm("admin")} key="admin">
            Admin
          </Menu.Item>
          <Menu.Item
            onClick={() => onSelectForm("sales-expert")}
            key="sales-expert"
          >
            Sales Expert
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
