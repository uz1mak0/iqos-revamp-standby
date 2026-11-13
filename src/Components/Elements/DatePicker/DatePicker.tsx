import React from "react";
import { DatePicker as MantineDatePicker } from "@mantine/dates";

type Props = {
  value?: Date;
  defaultValue?: Date;
  label?: string;
  onChange?: (event: Date) => void;
  className?: any;
  description?: string;
  disabled?: boolean;
  dropdownType?: "modal" | "popover";
  dropdownPosition?: "flip" | "bottom-start" | "top-start";
  fullWidth?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  clearable?: boolean;
  autoFocus?: boolean;
  initiallyOpened?: boolean;
  onDropdownClose?: () => void;
  icon?: React.ReactNode;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;
  required?: boolean;
  withAsterisk?: boolean;
};

export const DatePicker = (props: Props) => {
  return (
    <MantineDatePicker
      {...props}
      radius={8}
      modalProps={{ centered: true }}
      placeholder={props.placeholder ?? "Filter by date"}
    />
  );
};
