import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { ORDER, WMS } from "../../../../../GraphQL";
import {
  createAdmin,
  getEnums,
  getWarehouses,
  updateAdmin,
} from "../../../../../GraphQL/UserSchema";
import {
  Button,
  DatePicker,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
} from "../../../../Elements";
import Notification from "../../../../Elements/Notification/Notification";
import { useUsersStore } from "../../Store";
import { riderCreate, riderUpdate } from "../../../../../GraphQL/RiderSchema";
import dayjs from "dayjs";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: ORDER.Rider | undefined;
};

export const RiderForm = (props: Props) => {
  const { riders, setRiders } = useUsersStore();
  const [onRiderCreate, { loading: loadingCreate }] = useMutation(riderCreate, {
    context: { clientName: "order" },
  });
  const [onRiderUpdate, { loading: loadingUpdate }] = useMutation(riderUpdate, {
    context: { clientName: "order" },
  });
  type FormProps = {
    username: string;
    name: string;
    license_number: string;
    license_expiration_date: Date | undefined;
    address: string;
    phone_number: string | number;
  };

  const form = useForm<FormProps>({
    initialValues: {
      username: "",
      name: "",
      license_number: "",
      license_expiration_date: undefined,
      address: "",
      phone_number: "",
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      license_number: (value) => (!value ? "Please add license number!" : null),
      license_expiration_date: (value) =>
        !value ? "Please add expiration date!" : null,
      address: (value) => (!value ? "Please add address!" : null),
      phone_number: (value: string | number) =>
        !value ? "Please add phone number!" : null,
    },
  });

  useEffect(() => {
    if (props.profile) {
      setInitialValues();
    }
  }, [props.profile]);

  const setInitialValues = () => {
    form.setValues({
      username: props?.profile?.username || "",
      name: props?.profile?.name || "",
      license_number: props?.profile?.license_number || "",
      license_expiration_date: dayjs(
        props?.profile?.license_expiration_date,
        "MMMM DD YYYY"
      ).toDate(),
      address: props.profile?.address || "",
      phone_number:
        Number(props?.profile?.phone_number?.replace("+63", "")) || "",
    });
  };

  const onCancel = () => {
    props.onClose();
    if (props.profile) {
      setInitialValues();
    } else {
      form.reset();
    }
  };

  const onSubmit = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    const input = {
      ...form.values,
      phone_number: "+63" + form.values.phone_number,
      license_expiration_date: dayjs(
        form.values.license_expiration_date
      ).format("MMMM DD YYYY"),
    };
    if (props.profile) {
      onRiderUpdate({
        variables: {
          input,
        },
      })
        .then((res) => {
          const updateList = [...riders];
          const index = updateList.findIndex(
            (e) => e.username === form.values.username
          );
          updateList[index] = res.data.riderUpdate;
          setRiders(updateList);
          Notification.success({ message: "Rider Updated" });
          onCancel();
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
      console.log(form.values, "TEST");
      onRiderCreate({
        variables: {
          input,
        },
      })
        .then((res) => {
          setRiders([...riders, res.data?.riderCreate]);
          onCancel();
          Notification.success({ message: "Rider Created" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  return (
    <Modal
      opened={props.visible}
      onClose={onCancel}
      centered
      size={700}
      title={!props.profile ? "Create Rider" : "Update Rider"}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />
      <form>
        <Grid>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("name")}
              placeholder="Enter Name"
              description="Name"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("username")}
              disabled={props?.profile ? true : false}
              placeholder="Username"
              description="Enter Username"
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("license_number")}
              disabled={props?.profile ? true : false}
              placeholder="Enter license number"
              description="License Number"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              description="License expiration date"
              placeholder="Select expiration date"
              {...form.getInputProps("license_expiration_date")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("address")}
              placeholder="Enter address"
              description="Address"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("phone_number")}
              type="number"
              icon={<p style={{ fontSize: 14 }}>+63</p>}
              placeholder="Contact Number"
              description="Enter contact number"
            />
          </Grid.Col>
        </Grid>
        <br />
        <Group position="center">
          <Button
            loading={loadingUpdate || loadingCreate}
            customType="secondary"
            onClick={() => onCancel()}
          >
            Back
          </Button>
          <Button
            loading={loadingUpdate || loadingCreate}
            onClick={() => onSubmit()}
            customType="primary"
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
