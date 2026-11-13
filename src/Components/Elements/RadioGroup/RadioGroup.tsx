import React, { ReactNode } from "react";
import { Radio as MantineRadio } from "@mantine/core";

type RadioData = {
  label?: string;
  value?: string;
};
type RadioGroupProps = {
  defaultValue?: string;
  label?: string;
  description?: string;
  required?: boolean;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  data: RadioData[];
  orientation?: "vertical" | "horizontal";
  onChange?: (value: string) => void;
};

type RadioProps = {
  value: string;
  label: React.ReactNode;
};

export const RadioGroup = (props: RadioGroupProps) => {
  const MantineRadioGroup = MantineRadio.Group;
  return (
    <MantineRadioGroup {...props}>
      {props.data?.map((item, i) => (
        <MantineRadio
          key={`${item.value}-${i}`}
          value={item.value || ""}
          label={item.label}
        />
      ))}
    </MantineRadioGroup>
  );
};
