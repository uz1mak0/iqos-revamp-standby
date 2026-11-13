import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  default: {
    background: "#23C2D7",
    "&:hover": {
      backgroundColor: "#23C2D7",
    },
  },
  primary: {
    background: "#60B664",
    "&:hover": {
      backgroundColor: "#60B664",
    },
  },
  secondary: {
    background: "#E8E8E8",
    color: "black",
    "&:hover": {
      backgroundColor: "#E8E8E8",
    },
  },
  danger: {
    background: "#F5222D",
    color: "white",
    "&:hover": {
      backgroundColor: "#F5222D",
    },
  },
  orange: {
    background: "#fd9710",
    color: "white",
    "&:hover": {
      backgroundColor: "#e98b0e",
    },
  },
}));
