import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  sider: {
    background: "#191A1C",
    paddingBlock: 20,
  },

  menuItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    margin: "5px",
    cursor: "pointer",

    "&:hover, &.selected": {
      backgroundColor: "white",
      borderRadius: "20px",
      color: "#00bacf",
    },
  },
}));
