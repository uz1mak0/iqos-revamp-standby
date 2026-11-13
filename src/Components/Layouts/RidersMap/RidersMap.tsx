import React from "react";
import { Grid } from "../../Elements/Grid";
import { Paper } from "../../Elements/Paper";
import { Map } from "./Map";
import { RiderList } from "./RiderList";

export const RidersMap = () => {
  return (
    <div>
      <Grid>
        <Grid.Col span={8}>
          <Paper radius={8}>
            <Map />
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper radius={8}>
            <RiderList />
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};
