import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { HeaderBar } from "./Header";

export default {
  title: "App Layout/HeaderBar",
  component: HeaderBar,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof HeaderBar>;

const Template: ComponentStory<typeof HeaderBar> = (args) => (
  <HeaderBar {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
