import React from "react";
import { Badge as MantineBadge } from "@mantine/core";

type Props = {
  children?: React.ReactNode;
  color?: string;
  fullWidth?: boolean;
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "outline" | "light" | "filled" | "gradient" | "dot";
  rightSection?: React.ReactNode;
  leftSection?: React.ReactNode;
};

export const Badge = (props: Props) => {
  return <MantineBadge {...props} />;
};
