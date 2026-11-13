import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { WMS } from "../../../GraphQL";
import {
  createAdmin,
  getEnums,
  getWarehouses,
  updateAdmin,
} from "../../../GraphQL/UserSchema";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import {
  Button,
  Grid,
  Group,
  Input,
  Modal,
  MultiSelect,
  Select,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined;
  onSubmit: (user: WMS.Admin) => void;
};

const Create = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const { data: warehouseData } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });
  const { data: enumsData } = useQuery(getEnums, {
    variables: { name: "Role" },
    context: { clientName: "warehouse" },
  });
  const [onUpdateAdmin, { loading: loadingUpdate }] = useMutation(updateAdmin, {
    context: { clientName: "warehouse" },
  });
  const [onCreateAdmin, { loading: loadingCreate }] = useMutation(createAdmin, {
    context: { clientName: "warehouse" },
  });

  type FormProps = {
    username: string;
    name: string;
    roles: WMS.Maybe<WMS.Role>[] | string;
    office_ids: WMS.Maybe<string>[] | string;
    office_id: string;
    email: string;
    phone_number: string | number;
  };

  const form = useForm<FormProps>({
    initialValues: {
      username: "",
      name: "",
      roles: [],
      office_ids: [],
      office_id: "",
      email: "",
      phone_number: "",
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      roles: (value: WMS.Maybe<WMS.Role>[] | string) =>
        !value || value.length < 1 ? "Please add roles!" : null,
      office_ids: (value: WMS.Maybe<string>[] | string) =>
        (!value || value.length < 1) && userRoles.isDirectRetailUser
          ? "Please add office name!"
          : null,
      office_id: (value) =>
        !value && !userRoles.isDirectRetailUser
          ? "Please add office name!"
          : null,
      phone_number: (value: string | number) =>
        !value ? "Please add phone number!" : null,
      email: (value) => (!value ? "Please add email!" : null),
    },
  });

  useEffect(() => {
    if (props.profile) {
      setInitialValues();
    }
  }, [props.profile]);

  const DRRoles = [
    { name: "AdminDR" },
    { name: "Executive" },
    { name: "Coach" },
    { name: "PMFTCAdministrator" },
  ];

  const setInitialValues = () => {
    form.setValues({
      username: props?.profile?.username || "",
      name: props?.profile?.name || "",
      roles: props?.profile?.roles ? props?.profile?.roles : "",
      office_ids: props?.profile?.office_ids || "",
      office_id: props?.profile?.office_id || "",
      email: props?.profile?.email || "",
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
    if (props.profile) {
      onUpdateAdmin({
        variables: {
          input: {
            username: form.values.username,
            name: form.values.name,
            roles: form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: form.values.office_id,
            office_name: userRoles.isDirectRetailUser
              ? warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === form.values.office_ids[0]
                )?.name
              : warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === form.values.office_id
                )?.name,
            channel: "DIRECT_RETAIL",
            office_ids: userRoles.isDirectRetailUser
              ? form.values.office_ids
              : [form.values.office_id],
          },
        },
      }).then((res) => {
        props.onSubmit(res.data.adminUpdate);
        Notification.success({ message: "User Updated" });
      });
    } else {
      onCreateAdmin({
        variables: {
          input: {
            // ...form.values,
            username: form.values.username,
            name: form.values.name,
            roles: form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: form.values.office_id,
            office_name: userRoles.isDirectRetailUser
              ? warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === form.values.office_ids[0]
                )?.name
              : warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === form.values.office_id
                )?.name,
            channel:
              userRoles.isDirectRetailUser || userRoles.isDirectRetailAdmin
                ? "DIRECT_RETAIL"
                : "ECOMM",
            office_ids: userRoles.isDirectRetailUser
              ? form.values.office_ids
              : [form.values.office_id],
          },
        },
      })
        .then((res) => {
          props.onSubmit(res.data.adminCreate);
          Notification.success({ message: "User Created" });
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
      title={!props.profile ? "Create User" : "Update User"}
    >
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
            {userRoles.isDirectRetailUser ? (
              <MultiSelect
                {...form.getInputProps("office_ids")}
                searchable
                description="Office Name"
                placeholder="Select Warehouse"
                data={
                  warehouseData?.warehouses?.items?.map((e: WMS.Warehouse) => {
                    return {
                      value: e?.id,
                      label: e?.name,
                    };
                  }) || []
                }
              />
            ) : (
              <Select
                {...form.getInputProps("office_id")}
                description="Office Name"
                searchable
                placeholder="Select Warehouse"
                data={
                  warehouseData?.warehouses?.items?.map((e: WMS.Warehouse) => {
                    return {
                      value: e?.id,
                      label: e?.name,
                    };
                  }) || []
                }
              />
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              {...form.getInputProps("roles")}
              description="Roles"
              searchable
              placeholder="Select Roles"
              data={
                userRoles.isDirectRetailUser || userRoles.isDirectRetailAdmin
                  ? DRRoles.map((e) => {
                      return {
                        label: e.name,
                        value: e.name,
                      };
                    })
                  : enumsData?.__type.enumValues
                      .filter(
                        (e: { name: string }) =>
                          !DRRoles.some((dr) => dr.name == e.name)
                      )
                      .map((e: { name: string }) => {
                        return {
                          value: e.name,
                          label: e.name,
                        };
                      })
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("email")}
              placeholder="Enter Email"
              description="Email"
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

export default Create;
