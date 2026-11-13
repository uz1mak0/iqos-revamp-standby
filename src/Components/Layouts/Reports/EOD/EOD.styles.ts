import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  declarationCard: {
    border: "solid 1px gray",
    // backgroundColor: theme.colorScheme === "dark" ? `#24313B` : `#EDF6FD`,
    "& .channel-title": {
      color: theme.colorScheme === "dark" ? "white" : "black",
    },
  },
  declarationCardSelected: {
    border: "solid 1px #228be6",
    backgroundColor: theme.colorScheme === "dark" ? `#24313B` : `#EDF6FD`,
    color: `#228be6`,
  },
}));
