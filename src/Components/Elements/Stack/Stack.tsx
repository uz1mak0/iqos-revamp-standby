import React from "react";
import { Stack as MantineStack } from "@mantine/core";

type Props = {
  align?: string;
  justify?: string;
  spacing?: number | "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
};
export const Stack = (props: Props) => {
  return <MantineStack {...props}>{props.children}</MantineStack>;
};
