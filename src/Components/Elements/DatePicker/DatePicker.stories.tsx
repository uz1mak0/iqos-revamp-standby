// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePicker } from "./DatePicker";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "DatePicker",
  component: DatePicker,
  argTypes: {
    label: { control: "text" },
    defaultValue: { control: "date" },
  },
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => (
  <DatePicker {...args}></DatePicker>
);

export const Primary = Template.bind({});
Primary.args = {
  defaultValue: new Date(),
};
