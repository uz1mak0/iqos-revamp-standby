import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  statusContainer: {
    margin: 20,
    justifyContent: "center",
    display: "flex",
    gap: 20,
  },
  tableContainer: {
    height: 500,
    overflowX: "auto",
  },
  trackingIconContainer: {
    width: 1000,
  },
}));
