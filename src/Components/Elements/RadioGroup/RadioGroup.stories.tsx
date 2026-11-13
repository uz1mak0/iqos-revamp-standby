// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { RadioGroup } from "./RadioGroup";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "RadioGroup",
  component: RadioGroup,
} as ComponentMeta<typeof RadioGroup>;

const Template: ComponentStory<typeof RadioGroup> = (args) => (
  <RadioGroup {...args} />
);
export const Primary = Template.bind({});
Primary.args = {
  defaultValue: "1",
  data: [
    { label: "Test 1", value: "1" },
    { label: "Test 2", value: "2" },
    { label: "Test 3", value: "3" },
    { label: "Test 4", value: "4" },
    { label: "Test 5", value: "5" },
  ],
};
