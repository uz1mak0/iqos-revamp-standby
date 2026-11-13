import React from "react";
import { SegmentedControl as MantineSegmentedControl } from "@mantine/core";

type SegmentedControlItem = {
  value: string;
  label: string | React.ReactNode;
};

type Props = {
  data: SegmentedControlItem[];
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  defaultValue?: string;
};

export const SegmentedControl = (props: Props) => {
  return <MantineSegmentedControl {...props} />;
};
