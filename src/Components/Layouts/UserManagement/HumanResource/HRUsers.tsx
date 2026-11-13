import React from "react";
import { Tabs } from "../../../Elements";
import { Group, Space, Text } from "@mantine/core";
import { Users } from "tabler-icons-react";
import { Admins } from "../HumanResource/UserTypes/Admins";
import { Create } from "../HumanResource/Create/Create";
import { useRouter } from "next/router";
export const HRUsers = () => {
  const router = useRouter();
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
        <Create channel={"HR_CHANNEL"} />
      </Group>
      <Space h="lg" />
      <Tabs variant="outline" defaultValue="users">
        <Tabs.List>
          <Tabs.Tab value="users" icon={<Users size={14} />}>
            Users
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users" pt="xs">
          <Admins />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
