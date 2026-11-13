import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  tableContainer: {
    display: "block",
    overflowX: "auto",
    // whiteSpace: "nowrap",
  },
  table: {
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  },
}));
