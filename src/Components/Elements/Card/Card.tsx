import { Avatar, Card as MantineCard, Paper, Text } from "@mantine/core";
import React, { useState } from "react";
import { useStyles } from "./Card.styles";

type Props = {
  key?: string;
  background?: string;
  width?: string | number;
  height?: string | number;
  icon?: React.ReactNode;
  title?: string;
  number?: string | number;
  removeSelect?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  color?: string;
  bold?: boolean;
};

export const Card = (props: Props) => {
  const { classes } = useStyles();

  return (
    <div
      className={`${classes.card} ${
        props.isSelected ? classes.selected : undefined
      }`}
      style={{
        background: props.background,
        width: props.width ? props.width : props.icon ? 80 : 160,
        height: props.height ? props.height : props.icon ? 75 : 150,
      }}
      onClick={props.onClick}
    >
      {props.icon ? (
        props.icon
      ) : (
        <>
          <Text
            size="xl"
            color={props.color || "#fff"}
            weight={500}
            style={{ marginBlock: 28, fontSize: "28px" }}
            className={classes.text}
          >
            {props.number}
          </Text>
          <Text
            size="sm"
            color={props.color || "#fff"}
            style={{ marginBottom: 8, fontSize: "17px" }}
            className={classes.text}
            weight={props.bold ? 700 : 0}
          >
            {props.title}
          </Text>
        </>
      )}
    </div>
  );
};
