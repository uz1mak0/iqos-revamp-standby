import React, { useEffect, useState } from "react";
import {
  Grid,
  Input,
  Modal,
  Select,
  LoadingOverlay,
  Button,
  Group,
} from "../../Elements";
import { useForm } from "@mantine/form";
import { useMutation } from "@apollo/client";
import { createCoach, updateCoach } from "../../../GraphQL/CoachesSchema";
import { WMS } from "../../../GraphQL";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  profileData?: WMS.Coach;
  onSubmit: (coach: WMS.Coach) => void;
};

type FormProps = {
  name: string;
  coach_id: string;
  email: string;
  phone_number: string;
  user_status?: string;
};

const Create = (props: Props) => {
  const [onUpdateCoach, { loading: loadingUpdate }] = useMutation(updateCoach, {
    context: { clientName: "warehouse" },
  });
  const [onCreateCoach, { loading: loadingCreate }] = useMutation(createCoach, {
    context: { clientName: "warehouse" },
  });
  const statuses = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  const form = useForm({
    initialValues: {
      name: "",
      coach_id: "",
      email: "",
      phone_number: "",
      user_status: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    if (!props.profileData) return;
    setInitialValues();
  }, [props.profileData]);

  const onCancel = () => {
    if (props.profileData) {
      setInitialValues();
    } else {
      form.reset();
    }
    props.onClose();
  };

  const setInitialValues = () => {
    form.setValues({
      name: props.profileData?.name || "",
      coach_id: props.profileData?.coach_id || "",
      email: props.profileData?.email || "",
      phone_number: props.profileData?.phone_number?.substring(3) || "",
      user_status: props.profileData?.user_status || "",
    });
  };

  const onSubmit = (values: FormProps) => {
    const configValues = {
      ...values,
      phone_number: "+63" + values.phone_number,
    };

    if (props.profileData) {
      return onUpdateCoach({
        variables: { input: configValues },
        onCompleted: (data) => {
          props.onSubmit(data?.coachUpdate);
          onCancel();
        },
        onError: (error) => {
          Notification.error({ message: error.message });
        },
      });
    }
    delete configValues.user_status;
    return onCreateCoach({
      variables: { input: configValues },
      onCompleted: (data) => {
        props.onSubmit(data.coachCreate);
        onCancel();
      },
      onError: (error) => {
        Notification.error({ message: error.message });
      },
    });
  };

  return (
    <Modal
      size={800}
      centered
      title={props.profileData ? "Update Coach" : "Create Coach"}
      opened={props.visible}
      onClose={onCancel}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
        <Grid gutter={"lg"}>
          <Grid.Col span={6}>
            <Input
              required
              label="Name"
              placeholder="Enter name"
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              disabled={props.profileData ? true : false}
              required
              label="Coach ID"
              placeholder="Enter coach id"
              {...form.getInputProps("coach_id")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              required
              type="email"
              label="Email"
              placeholder="Enter email"
              {...form.getInputProps("email")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              required
              type="number"
              label="Contact Number"
              placeholder="Enter contact number"
              {...form.getInputProps("phone_number")}
            />
          </Grid.Col>
          {props.profileData ? (
            <Grid.Col span={12}>
              <Select
                required
                data={statuses}
                label="Status"
                {...form.getInputProps("user_status")}
              />
            </Grid.Col>
          ) : undefined}
        </Grid>
        <br />
        <Group position="center">
          <Button onClick={() => onCancel()} customType="secondary">
            Cancel
          </Button>
          <Button customType="primary" type="submit">
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Create;
