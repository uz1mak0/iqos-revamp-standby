import React from "react";
import { Switch as MantineSwitch } from "@mantine/core";

type CustomSize = "xs" | "sm" | "md" | "lg" | "xl";

type Props = {
  checked?: boolean;
  onLabel?: string;
  offLabel?: string;
  onChange?: (element: any) => void;
  disabled?: boolean;
  defaultChecked?: boolean;
  size?: CustomSize;
  label?: React.ReactNode;
  color?: string;
};

export const Switch = (props: Props) => {
  return <MantineSwitch {...props} />;
};
