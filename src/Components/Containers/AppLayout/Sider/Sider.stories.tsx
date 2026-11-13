import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Sider } from "./Sider";

export default {
  title: "App Layout/Sider",
  component: Sider,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Sider>;

const Template: ComponentStory<typeof Sider> = (args) => (
  <Sider onClose={() => console.log("test")} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
