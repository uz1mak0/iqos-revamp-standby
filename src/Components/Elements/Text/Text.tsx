import React from "react";
import { Text as MantineText } from "@mantine/core";

type Props = {
  align?:
    | "left"
    | "right"
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "center"
    | "end"
    | "start"
    | "justify"
    | "match-parent";
  children: React.ReactNode;
  color?: string;
  inherit?: boolean;
  inline?: boolean;
  italic?: boolean;
  lineClamp?: number;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  span?: boolean;
  strikethrough?: boolean;
  transform?:
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "unset"
    | "none"
    | "capitalize"
    | "full-size-kana"
    | "full-width"
    | "lowercase"
    | "uppercase";
  truncate?: true | "end" | "start";
  underline?: boolean;
  variant?: "link" | "text" | "gradient";
  weight?: string;
  fw?: string | number;
  fz?: string;
};
export const Text = (props: Props) => {
  return <MantineText {...props} />;
};
