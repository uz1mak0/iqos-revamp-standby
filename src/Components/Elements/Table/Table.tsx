import React from "react";
import { Table as MantineTable, Paper } from "@mantine/core";
import { useStyles } from "./Table.styles";
// import { Paper } from '../Paper';

interface Columns {
  title: string;
  dataIndex: string;
  key: string;
  render?: (record: any) => React.ReactNode;
  captionSide?: "bottom" | "top";
}

type Props = {
  onRowClick?: () => void;
  children: React.ReactNode;
  fontSize?: number | "xs" | "sm" | "md" | "lg" | "xl";
  highlightOnHover?: boolean;
  // withColumnBorders?: boolean
  captionSide?: "bottom" | "top";
};

export const Table = (props: Props) => {
  const { classes } = useStyles();

  return (
    <Paper withBorder p={"md"}>
      <div className={classes.tableContainer}>
        <MantineTable {...props} className={classes.table} striped>
          {props.children}
        </MantineTable>
      </div>
    </Paper>
  );
};
