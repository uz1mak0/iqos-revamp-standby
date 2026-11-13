import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  statusContainer: {
    margin: 20,
    justifyContent: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
  },
  trackingIconContainer: {
    width: 1000,
  },
  desktopView: {
    "@media (max-width: 800px)": {
      display: "none",
    },
  },
  mobileView: {
    "@media (min-width: 800px)": {
      display: "none",
    },
  },
}));
