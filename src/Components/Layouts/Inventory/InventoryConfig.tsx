export const getDeviceFilter = [
  "ALL",
  "LAMPS",
  "TEST DRIVE",
  "RAAS",
  "COACH",
  "MARLBORO",
  "TRY PAGE",
];
import { Center } from "@mantine/core";
import { Box, LayoutGrid, Menu2 } from "tabler-icons-react";

export const getWarehouseLogsFilters = [
  // "ALL",
  "TRANSMITTAL",
  "TRANSFER",
  "PULLOUT",
  "RETURN",
  "RECON",
  "DIRECT_TRANSFER",
  "CONVERSION",
];

export const getWarehouseType = [
  "LENDING",
  "ROADSHOW",
  "STORE",
  "WAREHOUSE",
  "CSC",
];

export const listView = [
  {
    value: "table",
    label: (
      <Center>
        <Menu2 />
      </Center>
    ),
  },
  {
    value: "card",
    label: (
      <Center>
        <LayoutGrid />
      </Center>
    ),
  },
];
