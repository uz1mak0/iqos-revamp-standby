import React from "react";
import { Checkbox as MantineCheckbox } from "@mantine/core";

type Props = {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  value?: string | number;
  defaultChecked?: boolean;
  onChange?: (event: { [key: string]: any }) => void;
};

type GroupProps = {
  value?: string[];
  data: CheckboxData[];
  defaultValue?: string[];
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onChange?: (event: { [key: string]: any }) => void;
  orientation?: "horizontal" | "vertical";
  required?: boolean;
};

type CheckboxData = {
  label?: string;
  value?: string;
};

export const Checkbox = (props: Props) => {
  return <MantineCheckbox {...props} />;
};

export const CheckboxGroup = (props: GroupProps) => {
  const MantineCheckboxGroup = MantineCheckbox.Group;
  return (
    <MantineCheckboxGroup {...props}>
      {props.data?.map((item, i) => (
        <MantineCheckbox
          key={`${item.value}-${i}`}
          value={item.value || ""}
          label={item.label}
        />
      ))}
    </MantineCheckboxGroup>
  );
};
