import React from "react";
import { DateRangePicker as MantineDateRangePicker } from "@mantine/dates";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";

type Props = {
  value?: [Date, Date];
  defaultValue?: [Date, Date];
  label?: string;
  onChange?: (event: [Date, Date]) => void;
  description?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  allowSingleDateInRange?: boolean;
  dropdownPosition?: "flip" | "bottom-start" | "top-start";
  dropdownType?: "modal" | "popover";
};

export const DateRangePicker = (props: Props) => {
  const { height, width } = useViewportSize();

  return (
    <MantineDateRangePicker
      style={props.fullWidth ? undefined : { width: 300 }}
      radius={8}
      modalProps={{ centered: true }}
      amountOfMonths={width <= isTabletMobileView ? 1 : 2}
      placeholder="Pick date range"
      {...props}
    />
  );
};
