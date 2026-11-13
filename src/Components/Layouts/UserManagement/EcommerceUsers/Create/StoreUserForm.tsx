import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { ORDER, STORE, WMS } from "../../../../../GraphQL";
import {
  createAdmin,
  getEnums,
  getWarehouses,
  storeUserCreate,
  storeUserUpdate,
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
import { Maybe } from "graphql/jsutils/Maybe";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: STORE.StoreUser | undefined;
};

export const StoreUserForm = (props: Props) => {
  const { storeUsers, setStoreUsers } = useUsersStore();
  const [onCreateStoreUser, { loading: loadingCreate }] = useMutation(
    storeUserCreate,
    { context: { clientName: "store" } }
  );
  const [onUpdateStoreUser, { loading: loadingUpdate }] = useMutation(
    storeUserUpdate,
    { context: { clientName: "store" } }
  );
  type FormProps = {
    username: string;
    name: string;
    roles: Maybe<STORE.Role>[];
    email: string;
    phone_number: string | number;
  };

  const form = useForm<FormProps>({
    initialValues: {
      username: "",
      name: "",
      email: "",
      roles: [],
      phone_number: "",
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      email: (value) => (!value ? "Please add email!" : null),
      roles: (value) => (!value ? "Please add role!" : null),
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
      roles: props.profile?.roles || [],
      email: props.profile?.email || "",
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
    };
    if (props.profile) {
      onUpdateStoreUser({
        variables: {
          input,
        },
      })
        .then((res) => {
          const updateList = [...storeUsers];
          const index = updateList.findIndex(
            (e) => e.username === form.values.username
          );
          updateList[index] = res.data.storeUserUpdate;
          setStoreUsers(updateList);
          Notification.success({ message: "Rider Updated" });
          onCancel();
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
      console.log(form.values, "TEST");
      onCreateStoreUser({
        variables: {
          input,
        },
      })
        .then((res) => {
          setStoreUsers([...storeUsers, res.data?.storeUserCreate]);
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
      title={!props.profile ? "Create Store User" : "Update Store User"}
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
              {...form.getInputProps("phone_number")}
              type="number"
              icon={<p style={{ fontSize: 14 }}>+63</p>}
              placeholder="Contact Number"
              description="Enter contact number"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("email")}
              placeholder="Email"
              description="Enter email"
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <MultiSelect
              {...form.getInputProps("roles")}
              description="Roles"
              placeholder="Select Roles"
              data={[
                {
                  label: "Sales Executive",
                  value: STORE.Role.SalesExecutive,
                },
                {
                  label: "Sales Expert",
                  value: STORE.Role.SalesExpert,
                },
              ]}
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
