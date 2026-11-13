import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { NavList } from "./NavList";
import { Box, Home, Printer } from "tabler-icons-react";

export default {
  title: "NavList",
  component: NavList,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof NavList>;

const Template: ComponentStory<typeof NavList> = (args) => (
  <NavList {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  list: [
    {
      icon: <Home size={30} strokeWidth={1} className="icon" color="#000" />,
      title: "Home",
      color: "#000",
    },
    {
      icon: <Box size={30} strokeWidth={1} className="icon" color="#000" />,
      title: "Inventory",
      color: "#000",
    },
    {
      icon: <Box size={30} strokeWidth={1} className="icon" color="#000" />,
      title: "SKU",
      color: "#000",
    },
    {
      icon: <Printer size={30} strokeWidth={1} className="icon" color="#000" />,
      title: "Codentify Scanner",
      color: "#000",
    },
  ],
};
