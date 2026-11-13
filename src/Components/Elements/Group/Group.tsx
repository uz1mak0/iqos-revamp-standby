import React from "react";
import { Group as MantineGroup } from "@mantine/core";

type Props = {
  align?: string;
  direction?: "row" | "column";
  grow?: boolean;
  noWrap?: boolean;
  position?: "right" | "center" | "left" | "apart";
  spacing?: number | "xs" | "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  justify?: string;
  mx?: string;
  my?: string;
};

export const Group = (props: Props) => {
  return <MantineGroup {...props}>{props.children}</MantineGroup>;
};
