import {
  Avatar,
  List,
  Paper as MantinePaper,
  ScrollArea,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import { BuildingWarehouse } from "tabler-icons-react";
import { Card } from "../Card";
import { useStyles } from "./Paper.styles";

type Props = {
  icon?: {
    avatar?: React.ReactNode;
    title?: string | React.ReactNode;
    color?: string;
  };
  width?: string | number;
  height?: string | number;
  children?: any;
  style?: any;
  onClick?: () => void;
  withBorder?: boolean;
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
  noPaper?: boolean;
};

export const Paper = (props: Props) => {
  const { classes } = useStyles();
  if (props.noPaper && props.icon)
    return (
      <div className={classes.noPaper}>
        <Card background={props.icon.color} icon={props.icon.avatar} />
        <Text size="xl" color={props.icon.color} style={{ marginTop: 10 }}>
          {props.icon.title}
        </Text>
      </div>
    );
  return (
    <MantinePaper
      radius={props?.radius ? props.radius : props.withBorder ? "md" : "xl"}
      className={classes.paper}
      withBorder={true}
      style={{
        width: props.width ? props.width : props.icon ? 275 : "auto",
        height: props.height ? props.height : props.icon ? 160 : "auto",
        boxShadow: props.withBorder
          ? undefined
          : "0px 0px 20px 1px rgb(0 0 0 / 10%)",
        ...props.style,
      }}
      onClick={props.onClick ? props.onClick : () => {}}
    >
      {props.icon ? (
        <div className={classes.withIcon}>
          <Card background={props.icon.color} icon={props.icon.avatar} />
          <Text size="xl" color={props.icon.color} style={{ marginTop: 10 }}>
            {props.icon.title}
          </Text>
        </div>
      ) : (
        props.children
      )}
    </MantinePaper>
  );
};
