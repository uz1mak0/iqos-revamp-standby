import React from "react";
import { Button as MantineButton, MantineColor } from "@mantine/core";
import { useStyles } from "../Button/Button.styles";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  children: string;
  loading?: boolean;
  customType?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  styles?: {
    color?: string;
    textColor?: string;
    width?: string | number;
    margin?: string | number;
    marginTop?: string | number;
    maxWidth?: string | number;
    backgroundColor?: string;
  };
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  rightIcon?: React.ReactNode;
  variant?:
    | "outline"
    | "light"
    | "default"
    | "white"
    | "filled"
    | "subtle"
    | "gradient";
  ref?:
    | ((instance: HTMLButtonElement | null) => void)
    | React.RefObject<HTMLButtonElement>
    | null
    | undefined;
  color?: MantineColor;
  component?:
    | "symbol"
    | "object"
    | "clipPath"
    | "filter"
    | "mask"
    | "marker"
    | "label"
    | "big"
    | "link"
    | "small"
    | "sub"
    | "sup"
    | "ruby"
    | "table"
    | "div"
    | "a"
    | "abbr"
    | "address"
    | "area"
    | "menu";
};

export const Button = (props: Props) => {
  const { classes } = useStyles();

  const getButtonTypeStyle = () => {
    switch (props.customType) {
      case "primary":
        return classes.primary;
      case "secondary":
        return classes.secondary;
      case "danger":
        return classes.danger;
      case "orange":
        return classes.orange;
      case "link":
        return undefined;
      default:
        return classes.default;
    }
  };

  return (
    <MantineButton
      className={
        props.customType == "custom" ? undefined : `${getButtonTypeStyle()}`
      }
      disabled={props.disabled}
      ref={props.ref}
      radius={props.radius || "lg"}
      variant={props.variant}
      color={props.color ? props.color : props?.styles?.color}
      onClick={props.onClick}
      leftIcon={props.icon}
      loading={props.loading}
      type={props.type}
      size={props.size}
      style={props.styles && !props.disabled ? props.styles : undefined}
      fullWidth={props.fullWidth}
      rightIcon={props.rightIcon}
    >
      {props.children}
    </MantineButton>
  );
};
