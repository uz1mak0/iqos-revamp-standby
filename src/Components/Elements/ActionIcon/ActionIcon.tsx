import React from "react";
import { ActionIcon as MantineActionIcon } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  color?: string;
  loading?: boolean;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
  variant?:
    | "filled"
    | "transparent"
    | "light"
    | "outline"
    | "default"
    | "subtle";
  onClick?: () => void;
  disabled?: boolean;
};

export const ActionIcon = (props: Props) => {
  return <MantineActionIcon {...props}>{props.children}</MantineActionIcon>;
};
