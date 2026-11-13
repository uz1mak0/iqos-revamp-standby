import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AppLayout } from "./AppLayout";

export default {
  title: "App Layout/AppLayout",
  component: AppLayout,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof AppLayout>;

const Template: ComponentStory<typeof AppLayout> = (args) => (
  <AppLayout {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
