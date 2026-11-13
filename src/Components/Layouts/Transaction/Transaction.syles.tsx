import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  transactionCard: {
    padding: 10,
  },
  inputQty: {
    width: 100,
  },
  datePicker: {
    // width: 200
  },
  tabPanelTableContainer: {
    overflow: "scroll",
    height: "500px",
  },
  editableContent: {
    padding: 5,
    width: 100,
    "&:hover": {
      cursor: "pointer",
      background: "#F7F9FC",
      border: "1px solid grey",
      borderRadius: 5,
    },
  },
  editableContentDate: {
    padding: 5,
    width: 200,
    "&:hover": {
      cursor: "pointer",
      background: "#F7F9FC",
      border: "1px solid grey",
      borderRadius: 5,
    },
  },
  searchInput: {
    width: 300,
    marginLeft: 20,
    marginBottom: 10,
  },
}));
