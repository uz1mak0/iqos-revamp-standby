import React from "react";
import { Accordion as MantineAccordion } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "contained" | "filled" | "separated";
  multiple?: boolean;
  chevronSize?: number;
  chevronPosition?: "left" | "right";
  chevron?: React.ReactNode;
  onChange?: (value: any) => void;
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl";
  defaultValue?: string | string[];
  value?: string | string[];
};
export const Accordion = (props: Props) => {
  return (
    <div>
      <MantineAccordion {...props}>{props.children}</MantineAccordion>
    </div>
  );
};

const { Item, Control, Panel } = MantineAccordion;
Accordion.Item = Item;
Accordion.Control = Control;
Accordion.Panel = Panel;
