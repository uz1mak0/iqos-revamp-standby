import React from "react";
import { Tabs } from "../../../Elements";
import { Group, Space, Text } from "@mantine/core";
import { User, UserCheck, Users } from "tabler-icons-react";
import { Admins } from "./UserTypes/Admins";
import { FOMLogs } from "./UserTypes/FomLogs";
import { SalesExpert } from "./UserTypes/SalesExpert";
import { Create } from "./Create/Create";
import { useRouter } from "next/router";
export const DirectIndirectUsers = () => {
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
        <Create
          channel={
            router.route.includes("/users/direct")
              ? "DIRECT_RETAIL"
              : "INDIRECT_CHANNEL"
          }
        />
      </Group>
      <Space h="lg" />
      <Tabs variant="outline" defaultValue="admins">
        <Tabs.List>
          <Tabs.Tab value="admins" icon={<Users size={14} />}>
            Admins
          </Tabs.Tab>
          <Tabs.Tab value="sales-expert" icon={<UserCheck size={14} />}>
            Sales Expert
          </Tabs.Tab>

          {router.route.includes("/users/direct") ? undefined : (
            <Tabs.Tab value="fom-logs" icon={<UserCheck size={14} />}>
              FOM Logs
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="admins" pt="xs">
          <Admins />
        </Tabs.Panel>

        <Tabs.Panel value="sales-expert" pt="xs">
          <SalesExpert />
        </Tabs.Panel>

        <Tabs.Panel value="fom-logs" pt="xs">
          <FOMLogs />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
