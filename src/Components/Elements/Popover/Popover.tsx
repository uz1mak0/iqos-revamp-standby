import React from "react";
import {
  Popover as MantinePopOver,
  ActionIcon as MantineActionIcon,
} from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating";

type Props = {
  target?: React.ReactNode;
  icon?: React.ReactNode;
  opened?: boolean;
  closeOnClickOutside?: boolean;
  children?: React.ReactNode;
  onChange?: (opened: boolean) => void;
  position?:
    | "bottom"
    | "left"
    | "right"
    | "top"
    | "bottom-end"
    | "bottom-start"
    | "left-end"
    | "left-start"
    | "right-end"
    | "right-start"
    | "top-end"
    | "top-start";
};

export const Popover = (props: Props) => {
  return <MantinePopOver {...props}>{props.children}</MantinePopOver>;
};

const { Target, Dropdown } = MantinePopOver;
Popover.Target = Target;
Popover.Dropdown = Dropdown;
