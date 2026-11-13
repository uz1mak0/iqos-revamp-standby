import React from "react";
import { Tabs as MantineTabs } from "@mantine/core";

type Props = {
  children?: React.ReactNode;
  activTab?: number;
  variant?: "default" | "outline" | "pills";
  orientation?: "horizontal" | "vertical";
  color?: string;
  defaultValue?: string;
  value?: string;
  onTabChange?: (value: string) => void;
  keepMounted?: boolean;
};

export const Tabs = (props: Props) => {
  return <MantineTabs {...props}>{props.children}</MantineTabs>;
};

const { Tab, List, Panel } = MantineTabs;
Tabs.Tab = Tab;
Tabs.List = List;
Tabs.Panel = Panel;
