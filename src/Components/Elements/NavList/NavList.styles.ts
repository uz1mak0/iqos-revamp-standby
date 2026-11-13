import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  menuItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "14px",
    margin: "14px",
    cursor: "pointer",
    textAlign: "center",

    "&:hover, &.selected": {
      backgroundColor: "white",
      borderRadius: "0 20px 0 20px",
      color: "#00bacf",

      "& .icon": {
        color: "#00bacf",
      },
    },
  },
  selected: {
    backgroundColor: "white",
    borderRadius: "0 20px 0 20px",
    color: "#00bacf",

    "& .icon": {
      color: "#00bacf",
    },
  },
}));
