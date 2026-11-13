import React from "react";
import {
  SimpleGrid as MantineSimpleGrid,
  SimpleGridBreakpoint,
} from "@mantine/core";

type Props = {
  cols?: number;
  spacing?: number | "xs" | "sm" | "md" | "lg" | "xl";
  verticalSpacing?: number | "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  breakpoints?: SimpleGridBreakpoint[];
};

export const SimpleGrid = (props: Props) => {
  return <MantineSimpleGrid {...props}>{props.children}</MantineSimpleGrid>;
};
