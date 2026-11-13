import React from "react";
import {
  NumberInput as MantineNumberInput,
  PasswordInput,
} from "@mantine/core";

type Props = {
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: number;
  value?: number;
  className?: string;
  onChange?: (event: any) => void;
  icon?: React.ReactNode;
  sx?: any;
  onBlur?: (e: any) => void;
  onKeyPress?: (e: any) => void;
  style?: { [key: string]: any };
  autoFocus?: boolean;
  maxLength?: number;
  max?: number;
  min?: number;
  // isDecimal?:boolean,
  precision?: number;
};

export const NumberInput = (props: Props) => {
  return (
    <MantineNumberInput
      // parser={(value) => props.isDecimal ? value?.replace(/\$\s?|(,*)/g, '') : undefined}
      type="number"
      // formatter={(value) => !Number.isNaN(parseFloat(`${value}`)) ? `${Math.abs(Number(value))}` : `0`}
      {...props}
    />
  );
};
