import React from "react";
import { Tabs } from "../../../Elements";
import { User } from "tabler-icons-react";
import { Text, Group } from "@mantine/core";
import { Admins } from "./UserTypes/Admins/Admins";
import { Create } from "./Create/Create";

export const FullAdminUsers = () => {
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
        </Tabs.List>
        <Tabs.Panel value="admins" pt="xs">
          <Admins />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
