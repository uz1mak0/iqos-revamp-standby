import React, { useState } from "react";
import {
  ActionIcon,
  Badge,
  ScrollArea,
  Switch,
  Table,
  Tabs,
} from "../../Elements";
import { WMS } from "../../../GraphQL";
import { Settings } from "tabler-icons-react";
import { LowStockConfigure } from "./LowStockConfigure";
import { Group } from "@mantine/core";
import { RemoveThreshold } from "./RemoveThreshold";

type Props = {
  warehouses: WMS.Warehouse[];
  thresholds: WMS.ThresholdConfig[];
};

export const Warehouses = ({ warehouses, thresholds }: Props) => {
  const [selectedWareshouse, setSelectedWareshouse] =
    useState<WMS.Warehouse | undefined>(undefined);
  const rows = warehouses?.map((wh: WMS.Warehouse, index: number) => (
    <tr key={`list-${index}`}>
      <td>{wh.name}</td>
      <td>{wh.id}</td>
      <td>
        <Group spacing={"xs"}>
          {thresholds
            ?.find((e) => e.warehouse_id === wh.id)
            ?.recipients?.map((email) => (
              <Badge key={email}>{email}</Badge>
            ))}
        </Group>
      </td>
      <td>
        {thresholds?.some((e) => e.warehouse_id === wh.id)
          ? "ACTIVE"
          : "INACTIVE"}
      </td>
      <td>
        <Group>
          <ActionIcon
            variant="filled"
            onClick={() => setSelectedWareshouse(wh)}
          >
            <Settings />
          </ActionIcon>
          {thresholds?.some((e) => e.warehouse_id === wh.id) && (
            <RemoveThreshold warehouse={wh} />
          )}
        </Group>
      </td>
    </tr>
  ));

  const onClose = () => {
    setSelectedWareshouse(undefined);
  };
  return (
    <div>
      <LowStockConfigure
        config={thresholds.find(
          (e) => e.warehouse_id === selectedWareshouse?.id
        )}
        warehouse={selectedWareshouse}
        onClose={onClose}
      />
      <ScrollArea scrollbarSize={5} style={{ height: "80vh" }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Warehouse Name</th>
              <th>ID</th>
              <th>Email Recipients</th>
              <th>Status</th>
              <th>Configure</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
