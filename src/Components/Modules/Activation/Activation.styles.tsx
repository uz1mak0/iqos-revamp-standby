import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  listContainer: {
    display: "flex",
    justifyContent: "start",
  },
  listHeaderText: {
    color: "#FD9710",
    marginBottom: "1em",
    fontSize: "0.95em",
    fontWeight: 650,
    textAlign: "center",
  },
  flexContainer: {
    justifyContent: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    // width: "92%"
    width: "90%",
    margin: "auto",
  },
  listText: {
    margin: 5,
    fontWeight: 500,
  },
  whText: {
    margin: 5,
  },
  searchInput: {
    width: 300,
    marginBottom: 10,
  },
  statusContainer: {
    margin: 20,
    justifyContent: "center",
    display: "flex",
    gap: 20,
  },
  tabPanelContainer: {
    margin: 15,
  },
  tabPanelTableContainer: {
    overflow: "scroll",
    height: "350px",
  },
}));
