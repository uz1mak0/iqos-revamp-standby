import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  header: {
    background: "#191A1C",
    color: "#fff",
  },

  mobileHeader: {
    background: "#191A1C",
    margin: 0,
  },

  actionBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menu: {
    width: "100%",
  },
}));
