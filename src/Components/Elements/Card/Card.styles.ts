import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  card: {
    borderRadius: "0 20px 0 20px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: "5px",
    border: "5px solid transparent",
  },

  selected: {
    border: "5px solid yellow !important",
  },

  text: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));
