import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  statusContainer: {
    paddingTop: 15,
    gap: 20,
    justifyContent: "center",
    display: "flex",
    flexWrap: "wrap",
    margin: "auto",
  },
  tableContainer: {
    // height: 500,
    // overflowX: 'auto'
  },
  trackingIconContainer: {
    width: 1000,
  },
  failedTableContainer: {
    height: 700,
    overflowX: "auto",
  },
  preWrapText: {
    whiteSpace: "pre-wrap",
    width: 250,
  },
  preWrapTextSM: {
    whiteSpace: "pre-wrap",
    width: 150,
  },
  preWrapTextMD: {
    whiteSpace: "pre-wrap",
    width: 200,
  },
  preWrapTextLG: {
    whiteSpace: "pre-wrap",
    width: 400,
  },
}));
