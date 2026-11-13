import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  channelSelection: {
    minHeight: "100vh",
    padding: 20,
    backgroundImage:
      theme.colorScheme === "dark"
        ? "linear-gradient(to bottom, #1d2b2d  0%, #004851  50%, #242424 50%)"
        : "linear-gradient(to bottom, #b0eaf4 0%, #f1fbfc 50%, white 50%)",
  },
  channelHeader: {
    color: theme.colorScheme === "dark" ? "white" : "black",
  },

  channelCard: {
    ":hover": {
      border: "solid 2px #228be6",
      backgroundColor: theme.colorScheme === "dark" ? `#24313B` : `#EDF6FD`,
      "& .channel-title": {
        color: theme.colorScheme === "dark" ? "white" : "black",
      },
    },
  },
  channelCardSelected: {
    border: "solid 2px #228be6",
    backgroundColor: theme.colorScheme === "dark" ? `#24313B` : `#EDF6FD`,
  },
  channelSelectedTextWhite: {
    color: `white`,
  },
  channelSelectedText: {
    color: theme.colorScheme === "dark" ? `white` : `black`,
  },
  cardTitle: {
    fontSize: 32,
  },
  cardDescription: {
    fontSize: 20,
  },
  channelMenu: {
    padding: 3,
    borderWidth: 0.5,
    borderRadius: 20,
    border: "solid 1px rgb(222,226,230, 0.25)",
  },
}));
