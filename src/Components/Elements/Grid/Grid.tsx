import React from "react";
import { Grid as MantineGrid } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  columns?: number;
  gutter?: number | "xs" | "sm" | "md" | "lg" | "xl";
  grow?: boolean;
  align?: string;
  justify?: string;
};
export const Grid = (props: Props) => {
  return <MantineGrid {...props}>{props.children}</MantineGrid>;
};

const { Col } = MantineGrid;
Grid.Col = Col;
