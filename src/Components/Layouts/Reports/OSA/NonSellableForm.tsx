import React from "react";
import { Input, Paper, Select, DatePicker } from "../../../Elements";
import { Grid, NumberInput, Radio, Title } from "@mantine/core";
import { CategoryItemsFormProps } from "./Config";
import { UseFormReturnType } from "@mantine/form";
import { FileWithPath } from "@mantine/dropzone";

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

export const NonSellableForm = ({
  category,
  getNonSellableFormInputs,
  form,
}: Props) => {
  const tdskReleaseValue = form.values.items.find(
    (e) => e.title === "TDSK/TDK Release",
  )?.value;

  const FormElement = (item: CategoryItemsFormProps) => {
    const index = getNonSellableFormInputs.findIndex(
      (e) => e.title === item.title,
    );
    switch (item.type) {
      case "NumberInput":
        return (
          <NumberInput
            min={0}
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
            disabled={
              tdskReleaseValue === "NO" &&
              ["T001 (TDK Non-menthol)", "M001 (TDK Menthol)"].includes(
                item.title,
              )
            }
            placeholder={`Input ${item.title}`}
          />
        );
      case "Radio":
        return (
          <Radio.Group
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
            defaultValue={"NO"}
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
      case "SelectFOM":
        return (
          <Select
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
            placeholder="Select FOM"
            data={[
              "Ella Garcia",
              "John Antolin",
              "Jerome Olidana",
              "Ronald Madrideo",
              "Arlene Palaruan",
              "Celine Amalia Ramos",
              "Charise Jane Delica",
              "Richard Felix Bautista",
              "Ed Mar Aludo",
            ]}
          />
        );
      case "Input":
        return (
          <Input
            {...form.getInputProps(`items.${index}.value`)}
            label={item.title}
            placeholder={`${item.placeholder}`}
          />
        );
      case "DateInput":
        return (
          <DatePicker
            label={item.title}
            placeholder={item.placeholder}
            maxDate={new Date()}
            onChange={(date) => {
              form.setFieldValue(
                `items.${index}.value`,
                date ? date.toLocaleDateString() : undefined,
              );
            }}
            clearable
          />
        );

      default:
        return <div></div>;
    }
  };
  return (
    <Paper radius={8}>
      <Title order={4}>{category}</Title>
      <Grid>
        {(() => {
          const filteredInputs = getNonSellableFormInputs.filter(
            (e) => e.category === category,
          );

          if (filteredInputs.length === 3) {
            return (
              <>
                <Grid.Col span={12}>{FormElement(filteredInputs[0])}</Grid.Col>
                <Grid.Col span={6}>{FormElement(filteredInputs[1])}</Grid.Col>
                <Grid.Col span={6}>{FormElement(filteredInputs[2])}</Grid.Col>
              </>
            );
          }

          return filteredInputs.map((item, f) => (
            <Grid.Col key={`${item.title}-${f}`} span={6}>
              {FormElement(item)}
            </Grid.Col>
          ));
        })()}
      </Grid>
    </Paper>
  );
};
