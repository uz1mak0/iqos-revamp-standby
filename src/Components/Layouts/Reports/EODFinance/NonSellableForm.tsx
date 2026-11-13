import React from "react";
import { Paper, Select } from "../../../Elements";
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
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    },
    (values: {
      store: string;
      date: string;
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    }) => {
      store: string;
      date: string;
      transaction_id: string;
      non_sellable: CategoryItemsFormProps[];
      finance: CategoryItemsFormProps[];
      zReceipt: FileWithPath[];
      xReceipt: FileWithPath[];
      additionalReceipt: FileWithPath[];
      remittanceReceipt: FileWithPath[];
      excess_amount: number;
      reason: string;
    }
  >;
};

export const NonSellableForm = ({
  category,
  getNonSellableFormInputs,
  form,
}: Props) => {
  const tdskReleaseValue = form.values.non_sellable.find(
    (e) => e.title === "TDSK/TDK Release"
  )?.value;

  const FormElement = (item: CategoryItemsFormProps) => {
    const index = getNonSellableFormInputs.findIndex(
      (e) => e.title === item.title
    );
    switch (item.type) {
      case "NumberInput":
        return (
          <NumberInput
            min={0}
            {...form.getInputProps(`non_sellable.${index}.value`)}
            label={item.title}
            disabled={
              tdskReleaseValue === "NO" &&
              ["T001 (TDK Non-menthol)", "M001 (TDK Menthol)"].includes(
                item.title
              )
            }
            placeholder={`Input ${item.title}`}
          />
        );
      case "Radio":
        return (
          <Radio.Group
            {...form.getInputProps(`non_sellable.${index}.value`)}
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
            {...form.getInputProps(`non_sellable.${index}.value`)}
            description={item.title}
            data={["Option 1", "Option 2", "Option 3"]}
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
            (e) => e.category === category
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
