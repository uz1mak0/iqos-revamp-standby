import React from "react";
import { PasswordInput as MantinePasswordInput } from "@mantine/core";

type Props = {
  error?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  required?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "unstyled" | "default" | "filled";
  visible?: boolean;
  onChange?: (event: any) => void;
  placeholder?: string;
  className?: string;
};

export const PasswordInput = (props: Props) => {
  return <MantinePasswordInput {...props} radius={8} />;
};
