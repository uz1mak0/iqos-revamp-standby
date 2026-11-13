import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  main: {
    background: "black",
    position: "relative",
    width: "100vw",
    height: "100vh",
  },
  card: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  logo: {
    width: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },
  form: {
    padding: "50px",
  },
  input: {
    padding: 5,
    textAlign: "center",
    alignItems: "center",
  },
  loginButton: {
    width: 500,
  },
}));
