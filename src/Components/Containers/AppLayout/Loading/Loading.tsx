import React from "react";
import { LoadingOverlay } from "../../../Elements";
import { useStyles } from "./Loading.styles";

const Loading = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.loadingMain}>
      {/* <h3>Loading</h3> */}
      <LoadingOverlay visible={true} />
    </div>
  );
};

export default Loading;
