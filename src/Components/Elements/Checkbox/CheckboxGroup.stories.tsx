// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import { CheckboxGroup, Checkbox } from "./Checkbox";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "CheckboxGroup",
  component: CheckboxGroup,
} as ComponentMeta<typeof CheckboxGroup>;

const Template: ComponentStory<typeof CheckboxGroup> = (args) => (
  <CheckboxGroup {...args}></CheckboxGroup>
);

export const Primary = Template.bind({});
Primary.args = {
  defaultValue: ["1"],
  data: [
    { label: "Test 1", value: "1" },
    { label: "Test 2", value: "2" },
    { label: "Test 3", value: "3" },
    { label: "Test 4", value: "4" },
    { label: "Test 5", value: "5" },
  ],
};
