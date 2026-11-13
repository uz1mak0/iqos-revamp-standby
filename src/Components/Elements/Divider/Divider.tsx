import React from "react";
import { Divider as MantineDivider } from "@mantine/core";

type Props = {
  color?: string;
  label?: React.ReactNode;
  labelPosition?: "left" | "right" | "center";
  orientation?: "horizontal" | "vertical";
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "dashed" | "dotted" | "solid";
  my?: string;
};

export const Divider = (props: Props) => {
  return <MantineDivider {...props} />;
};
