import React, { useState } from "react";
import { Stack, Tabs } from "../../Elements";
import { ORDER } from "../../../GraphQL";
import { List as SMSList } from "./SMS/List";
import { List as WarehouseHub } from "./WarehouseHub/List";
import { Text, Paper, Indicator } from "@mantine/core";

export const EcommerceSMS = () => {
  return (
    <Stack>
      <Paper withBorder={false} radius={5}>
        <Indicator color="teal" inline label="New" size={16}>
          <div style={{ paddingRight: 30 }}>
            <Text fw={700} fz="lg">
              Ecommerce SMS
            </Text>
          </div>
        </Indicator>
        <Text fz="sm" c="dimmed">
          Configure SMS settings to enable or disable SMS services based on your
          needs
        </Text>
      </Paper>
      <Tabs variant="outline" defaultValue="warehousehub">
        <Tabs.List>
          <Tabs.Tab value="warehousehub">Warehouse/Hub</Tabs.Tab>
          <Tabs.Tab value="sms">Created SMS</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="warehousehub" pt="xs">
          <WarehouseHub />
        </Tabs.Panel>
        <Tabs.Panel value="sms" pt="xs">
          <SMSList />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
