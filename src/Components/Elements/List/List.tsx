import React from "react";
import { List as MantineList } from "@mantine/core";
type Props = {
  center?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  spacing?: number | "xs" | "sm" | "md" | "lg" | "xl";
  type?: "ordered" | "unordered";
  withPadding?: boolean;
};
export const List = (props: Props) => {
  return <MantineList {...props}>{props.children}</MantineList>;
};

const { Item } = MantineList;
List.Item = Item;
