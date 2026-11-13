import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  root: {
    overflow: "auto",
    height: "500px",
    "& li": {
      margin: "5px",
      fontSize: ".9em",
    },
  },
}));
