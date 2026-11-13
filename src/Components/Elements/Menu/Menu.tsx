import React from "react";
import { Menu as MantineMenu } from "@mantine/core";

type Props = {
  arrowDistance?: number;
  arrowSize?: number;
  children?: React.ReactNode;
  clickOutsideEvents?: string[];
  closeOnItemClick?: boolean;
  closeOnScroll?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  placement?: "center" | "end" | "start";
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
  trigger?: "hover" | "click";
  control?: any;
  opened?: boolean;
  width?: number;
  disabled?: boolean;
  closeOnClickOutside?: boolean;
};

export const Menu = (props: Props) => {
  return <MantineMenu {...props}>{props.children}</MantineMenu>;
};

const { Item, Label, Dropdown, Target, Divider } = MantineMenu;
Menu.Item = Item;
Menu.Label = Label;
Menu.Target = Target;
Menu.Dropdown = Dropdown;
Menu.Divider = Divider;
