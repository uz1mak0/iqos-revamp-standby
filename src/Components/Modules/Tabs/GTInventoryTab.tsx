import React from "react";
import { Tabs } from "../../Elements";
import { DeviceTab } from "./DeviceTab";
import { InventoryTab } from "./InventoryTab";

export const GTInventoryTab = () => {
  return (
    <div>
      <br />
      <Tabs defaultValue="inventory" color="blue">
        <Tabs.List>
          <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
          <Tabs.Tab value="device">Devices</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="inventory">
          <InventoryTab isGT />
        </Tabs.Panel>
        <Tabs.Panel value="device">
          <DeviceTab isGT />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
