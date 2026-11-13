import React, { useRef } from "react";
import {
  Button,
  DatePicker,
  Grid,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
} from "../../../Elements";
import { Radio, Title } from "@mantine/core";
import { CategoryItemsFormProps } from "./Config";
import { UseFormReturnType } from "@mantine/form";
import { FileWithPath } from "@mantine/dropzone";
import dayjs from "dayjs";

type Props = {
  category: string;
  getFinanceFormInputs: CategoryItemsFormProps[];
  form: UseFormReturnType<
    {
      store: string;
      date: string;
      sales_invoice: string;
      order_id: string;
      cust_ref_no: string;
      delivery_note: string;
      xReceipt: FileWithPath[];
      po_amount: number;
    },
    (values: {
      store: string;
      date: string;
      sales_invoice: string;
      order_id: string;
      cust_ref_no: string;
      delivery_note: string;
      xReceipt: FileWithPath[];
      po_amount: number;
    }) => {
      store: string;
      date: string;
      sales_invoice: string;
      order_id: string;
      cust_ref_no: string;
      delivery_note: string;
      xReceipt: FileWithPath[];
      po_amount: number;
    }
  >;
};

export const PODetailsForm = ({
  category,
  getFinanceFormInputs,
  form,
}: Props) => {


  const FormElement = (item: CategoryItemsFormProps) => {
    const index = getFinanceFormInputs.findIndex((e) => e.title === item.title);
    switch (item.type) {
      case "NumberInput":
        return (
          <NumberInput
            min={0}
            {...form.getInputProps(`finance.${index}.value`)}
            label={item.title}
            onChange={(value) => {
              form.setFieldValue(`finance.${index}.value`, value);
            }}
            placeholder={`Input ${item.title}`}
          />
        );
      case "Input":
        return (
          <Input
            {...form.getInputProps(`finance.${index}.value`)}
            label={item.title}
            placeholder={`Input ${item.title}`}
          />
        );
      case "DatePicker":
        return (
          <DatePicker
            {...form.getInputProps(`finance.${index}.value`)}
            onChange={(date) =>
              form.setFieldValue(
                `finance.${index}.value`,
                dayjs(date).format("YYYY-MM-DD"),
              )
            }
            label={item.title}
            placeholder={`Input ${item.title}`}
          />
        );
      case "Radio":
        return (
          <Radio.Group
            {...form.getInputProps(`finance.${index}.value`)}
            label={item.title}
          >
            <Radio value="YES" label="YES" />
            <Radio value="NO" label="NO" />
          </Radio.Group>
        );
      case "Select":
        return (
          <Select
            {...form.getInputProps(`finance.${index}.value`)}
            description={item.title}
            data={["Option 1", "Option 2", "Option 3"]}
          />
        );
      case "Display":
        return (
          <Input
            {...form.getInputProps(`finance.${index}.value`)}
            // value={index === 4 ? getFinanceCompuationValue(index) : undefined}
            label={item.title}
            disabled
            placeholder={`Input ${item.title}`}
          />
        );

      default:
        return <div></div>;
    }
  };

  return (
    <div>
      <Paper radius={8}>
        <Title order={4}>{category}</Title>
        <Grid>
          {getFinanceFormInputs
            .filter((e) => e.category === category)
            .map((item, f) => (
              <Grid.Col key={`${item.title}-${f}`} span={6}>
                {FormElement(item)}
              </Grid.Col>
            ))}
        </Grid>
      </Paper>
    </div>
  );
};
