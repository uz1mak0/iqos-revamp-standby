import React from "react";
import { TextInput as MantineTextInput, PasswordInput } from "@mantine/core";

type Props = {
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  value?: string | number;
  className?: string;
  type?: "number" | "search" | "text" | "tel" | "url" | "email" | "password";
  onChange?: (event: any) => void;
  icon?: React.ReactNode;
  sx?: any;
  onBlur?: (e: any) => void;
  // ref?: any,
  onKeyPress?: (e: any) => void;
  style?: { [key: string]: any };
  innerref?:
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
  autoFocus?: boolean;
  rightSection?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  withAsterisk?: boolean;
  iconWidth?: string | number;
  min?: number;
  max?: number;
};

export const Input = (props: Props) => {
  if (props.type === "password") {
    return <PasswordInput {...props} ref={props.innerref} radius={8} />;
  } else {
    return <MantineTextInput {...props} ref={props.innerref} radius={8} />;
  }
};
