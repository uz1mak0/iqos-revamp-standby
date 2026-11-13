import React from "react";
import { Tabs } from "../../../Elements";
import { Home, Motorbike, User } from "tabler-icons-react";
import { Text, Group } from "@mantine/core";
import { Admins } from "./UserTypes/Admins/Admins";
import { Riders } from "./UserTypes/Riders/Riders";
import { StoreUsers } from "./UserTypes/StoreUsers/StoreUsers";
import { Create } from "./Create/Create";

export const EcommerceUsers = () => {
  return (
    <div>
      <Group p={10} align="center" position="apart">
        <div>
          <Text fw={700} fz="lg">
            Manage Users Roles
          </Text>
          <Text fz="sm" c="dimmed">
            A role grants access to specific menus and features, enabling users
            to use only the tools necessary for their assigned role.
          </Text>
        </div>
        <Create />
      </Group>
      <Tabs variant="outline" defaultValue="admins">
        <Tabs.List>
          <Tabs.Tab value="admins" icon={<User size={14} />}>
            Admins
          </Tabs.Tab>
          <Tabs.Tab value="riders" icon={<Motorbike size={14} />}>
            Riders
          </Tabs.Tab>
          <Tabs.Tab value="store-users" icon={<Home size={14} />}>
            Store Users
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="admins" pt="xs">
          <Admins />
        </Tabs.Panel>

        <Tabs.Panel value="riders" pt="xs">
          <Riders />
        </Tabs.Panel>
        <Tabs.Panel value="store-users" pt="xs">
          <StoreUsers />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
