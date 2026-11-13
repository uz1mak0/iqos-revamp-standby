import React from "react";
import { Textarea as MantineTextArea } from "@mantine/core";

type Props = {
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (event: any) => void;
  maxRows?: number;
  minRows?: number;
  description?: string;
  withAsterisk?: boolean;
};

export const TextArea = (props: Props) => {
  return <MantineTextArea {...props} />;
};
