import React from "react";
import { Group, Input, Select } from "../../../Elements";

type Props = {
  onFilter: (type: string, value: string | undefined) => void;
};

export const Filters = (props: Props) => {
  return (
    <Group position="left">
      <Input
        onChange={(e) => props.onFilter("SEARCH", e.target.value)}
        description="Search"
        style={{ width: 300 }}
        placeholder="Search by GTIN/SKU/Description"
      />
      <Select
        onChange={(value) => props.onFilter("TYPE", value)}
        placeholder="Filter by type"
        description="Type"
        data={["DEVICES", "ACCESSORIES", "HEETS", "ZYN"]}
        clearable
      />
      <Select
        onChange={(value) => props.onFilter("STATUS", value)}
        placeholder="Filter by status"
        description="Status"
        clearable
        data={["BLOCKED", "LIVE"]}
      />
    </Group>
  );
};
