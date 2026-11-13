import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Card } from "./Card";
import { BuildingWarehouse, Home } from "tabler-icons-react";

export default {
  title: "Card",
  component: Card,
  argTypes: {
    background: { control: "color" },
    width: { control: "number" },
    height: { control: "number" },
    number: { control: "text" },
    title: { control: "text" },
    icon: { control: false },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Statistics = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Statistics.args = {
  background: "#61b765",
  number: 9000,
  title: "Backlog",
};

export const WithIcon = Template.bind({});

WithIcon.args = {
  icon: <Home size={30} strokeWidth={1} className="icon" color="#fff" />,
  background: "#61b765",
};
