import React, { useState } from "react";
import { Button, Menu, Modal } from "../../../../Elements";
import { ChevronDown } from "tabler-icons-react";
import { create } from "domain";
import { EcommerceAdminForm } from "./EcommerceAdminForm";
import { RiderForm } from "./RiderForm";
import { StoreUserForm } from "./StoreUserForm";

export const Create = () => {
  const [createType, setCreateType] = useState<string | undefined>(undefined);
  const [opened, setOpened] = useState(false);

  const createTypeForm = () => {
    if (!createType) return <></>;
    switch (createType) {
      case "admin":
        return (
          <EcommerceAdminForm
            visible={opened}
            onClose={() => setOpened(false)}
            profile={undefined}
          />
        );
      case "rider":
        return (
          <RiderForm
            visible={opened}
            onClose={() => setOpened(false)}
            profile={undefined}
          />
        );
      case "store-user":
        return (
          <StoreUserForm
            visible={opened}
            onClose={() => setOpened(false)}
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
          <Menu.Item onClick={() => onSelectForm("rider")} key="rider">
            Rider
          </Menu.Item>
          <Menu.Item
            onClick={() => onSelectForm("store-user")}
            key="store-user"
          >
            Store User
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
