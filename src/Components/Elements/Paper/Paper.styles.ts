import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  paper: {
    marginBottom: "16px",
    padding: "15px",
  },

  withIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    transform: "translateY(-40px)",
  },
  noPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // transform: "translateY(-40px)"
  },
}));
