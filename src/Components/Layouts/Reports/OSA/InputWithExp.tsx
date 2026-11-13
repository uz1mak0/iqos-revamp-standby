import React from "react";
import { Input, Paper, Select, DatePicker } from "../../../Elements";
import { Grid, Group, NumberInput, Radio, Title } from "@mantine/core";
import { CategoryItemsFormProps } from "./Config";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  category: string;
  getNonSellableFormInputs: CategoryItemsFormProps[];
  form: UseFormReturnType<
    {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    },
    (values: {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    }) => {
      store: string;
      date: string;
      items: CategoryItemsFormProps[];
    }
  >;
};

export const InputWithExp = ({
  category,
  getNonSellableFormInputs,
  form,
}: Props) => {
  const tdskReleaseValue =
    form.values.items.find((e) => e.title === "TDSK/TDK Release")?.value ||
    "NO";

  const isDisabled = (title: string) =>
    tdskReleaseValue === "NO" &&
    ["T001 (TDK Non-menthol)", "M001 (TDK Menthol)"].includes(title);

  const FormElement = (item: CategoryItemsFormProps) => {
    const index = getNonSellableFormInputs.findIndex(
      (e) => e.title === item.title,
    );

    switch (item.type) {
      case "NumberInput":
        return (
          <Group grow align="flex-end">
            <NumberInput
              min={0}
              {...form.getInputProps(`items.${index}.value`)}
              label={item.title}
              disabled={isDisabled(item.title)}
              placeholder={`Input ${item.title}`}
            />

            <DatePicker
              label={`Expiration for ${item.title}`}
              placeholder={item.placeholder}
              maxDate={new Date()}
              onChange={(date) => {
                form.setFieldValue(
                  `items.${index}.expiration`,
                  date ? date.toLocaleDateString() : undefined,
                );
              }}
              clearable
            />
          </Group>
        );

      case "Radio":
        return (
          <Radio.Group
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
            defaultValue="NO"
          >
            <Radio value="YES" label="YES" />
            <Radio value="NO" label="NO" />
          </Radio.Group>
        );

      case "Select":
        return (
          <Select
            {...form.getInputProps(`items.${index}.value`)}
            description={item.title}
            data={["Option 1", "Option 2", "Option 3"]}
          />
        );

      case "Input":
        return (
          <Input
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
          />
        );

      default:
        return null;
    }
  };

  const filteredInputs = getNonSellableFormInputs.filter(
    (e) => e.category === category,
  );

  return (
    <Paper radius={8}>
      <Title order={4} mb="sm">
        {category}
      </Title>

      <Grid>
        {filteredInputs.map((item, i) => (
          <Grid.Col key={`${item.title}-${i}`} span={12}>
            {FormElement(item)}
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
};
