// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DateRangePicker } from "./DateRangePicker";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "DateRangePicker",
  component: DateRangePicker,
  argTypes: {
    label: { control: "text" },
    defaultValue: { control: "date" },
  },
} as ComponentMeta<typeof DateRangePicker>;

const Template: ComponentStory<typeof DateRangePicker> = (args) => (
  <DateRangePicker {...args} />
);
export const Primary = Template.bind({});
Primary.args = {
  defaultValue: [new Date(), new Date()],
};
