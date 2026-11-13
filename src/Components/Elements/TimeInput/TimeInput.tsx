import React from "react";

import { TimeInput as MantineTimeInput, TimeRangeInput } from "@mantine/dates";

type Props = {
  defaultValue?: Date;
  clearable?: boolean;
  disabled?: boolean;
  description?: React.ReactNode;
  format?: "12" | "24";
  label?: React.ReactNode;
  onChange?: (value: Date) => void;
  required?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  value?: Date;
  withSeconds?: boolean;
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
};

export const TimeInput = (props: Props) => {
  return <MantineTimeInput {...props} radius={8} />;
};
