import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Paper } from "./Paper";
import { Box, Home, Printer } from "tabler-icons-react";

export default {
  title: "Paper",
  component: Paper,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
    width: { control: "number" },
    height: { control: "number" },
  },
} as ComponentMeta<typeof Paper>;

const Template: ComponentStory<typeof Paper> = (args) => <Paper {...args} />;

export const Primary = Template.bind({});
export const withIcon = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: "TEST HEADING",
};

withIcon.args = {
  icon: {
    avatar: <Home size={30} strokeWidth={1} className="icon" color="#fff" />,
    color: "#fc9811",
    title: "Inventory",
  },
};
