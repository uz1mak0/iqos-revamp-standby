import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  Button,
  DatePicker,
  Grid,
  Group,
  Input,
  Modal,
  MultiSelect,
  Select,
} from "../../Elements";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isUpdate?: boolean;
  formElements: Object[];
  formValues?: Record<string, unknown>;
  profileData?: Object;
  loading: boolean;
  type: string;
};

const Create = (props: Props) => {
  const form = useForm({});

  useEffect(() => {
    if (!props.isUpdate) return;
    form.setValues(props?.formValues || {});
  }, [props.isUpdate, props.visible]);

  const onCancel = () => {
    form.reset();
    props.onClose();
  };

  const renderInputs = (input: any) => {
    switch (input.inputType) {
      case "Input":
        return (
          <Input
            required
            icon={
              input.name == "phone_number" ? (
                <p style={{ fontSize: 14 }}>+63</p>
              ) : (
                ""
              )
            }
            label={input.label}
            type={input.type}
            placeholder={input.placeholder}
            {...form.getInputProps(input.name)}
          />
        );
      case "Select":
        return (
          <Select
            required
            data={input.dropdown?.map((value: { name: string; id: string }) => {
              return { label: value.name, value: value.id };
            })}
            searchable
            label={input.label}
            {...form.getInputProps(input.name)}
          />
        );
      case "Multiselect":
        return (
          <MultiSelect
            data={input.dropdown?.map((value: { name: string; id: string }) => {
              return { label: value.name, value: value.id };
            })}
            label={input.label}
            {...form.getInputProps(input.name)}
          />
        );
      case "Datepicker":
        return (
          <DatePicker
            placeholder={input.placeholder}
            label={input.label}
            {...form.getInputProps(input.name)}
          />
        );
      default:
        return;
    }
  };

  return (
    <Modal
      size={800}
      centered
      title={`${props.isUpdate ? "Update" : "Create"} ${props.type}`}
      opened={props.visible}
      onClose={onCancel}
    >
      <form onSubmit={form.onSubmit(props.onSubmit)}>
        <Grid gutter={"lg"}>
          {props.formElements?.map((element, i) => (
            <Grid.Col span={6} key={`form-${i}`}>
              {renderInputs(element)}
            </Grid.Col>
          ))}
        </Grid>
        <br />
        <Group position="center">
          <Button onClick={() => onCancel()} customType="secondary">
            Cancel
          </Button>
          <Button customType="primary" type="submit" loading={props.loading}>
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Create;
