import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { WMS } from "../../../../../GraphQL";
import {
  createAdmin,
  getEnums,
  getWarehouses,
  updateAdmin,
} from "../../../../../GraphQL/UserSchema";
import {
  Button,
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

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined;
};

export const FullAdminForm = (props: Props) => {
  const { fullAdmins, setFullAdmins } = useUsersStore();
  const [onUpdateAdmin, { loading: loadingUpdate }] = useMutation(updateAdmin, {
    context: { clientName: "warehouse" },
  });
  const [onCreateAdmin, { loading: loadingCreate }] = useMutation(createAdmin, {
    context: { clientName: "warehouse" },
  });

  type FormProps = {
    username: string;
    name: string;
    email: string;
    phone_number: string | number;
    admin_type: string;
  };

  const fullAdminTypes = [
    { value: "FULL_ADMIN", label: "Full Admin" },
    { value: "WHFullAdmin", label: "Warehouse Full Admin" },
    { value: "SCFullAdmin", label: "Supply Chain Full Admin" },
  ];

  const getAdminType = (roles: WMS.Maybe<WMS.Role>[] | string) => {
    const roleList = Array.isArray(roles) ? roles.map((r) => `${r}`) : [];
    if (roleList.includes("WHFullAdmin") || roleList.includes("WarehouseFullAdmin"))
      return "WHFullAdmin";
    if (roleList.includes("SCFullAdmin") || roleList.includes("SupplyChainFullAdmin"))
      return "SCFullAdmin";
    return "FULL_ADMIN";
  };

  const form = useForm<FormProps>({
    initialValues: {
      username: "",
      name: "",
      email: "",
      phone_number: "",
      admin_type: "FULL_ADMIN",
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
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
      email: props?.profile?.email || "",
      phone_number:
        Number(props?.profile?.phone_number?.replace("+63", "")) || "",
      admin_type: getAdminType(props?.profile?.roles || []),
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

  const getRolesForAdminType = (adminType: string) => {
    switch (adminType) {
      case "WHFullAdmin":
        return [WMS.Role.WHFullAdmin];
      case "SCFullAdmin":
        return [WMS.Role.SCFullAdmin];
      default:
        return [WMS.Role.Admin, WMS.Role.AdminDR];
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
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            channel: WMS.ChannelType.FullAdmin,
            roles: getRolesForAdminType(form.values.admin_type),
          },
        },
      }).then((res) => {
        const updateList = [...fullAdmins];
        const index = updateList.findIndex(
          (e) => e.username === form.values.username
        );
        updateList[index] = res.data.adminUpdate;
        setFullAdmins(updateList);
        Notification.success({ message: "User Updated" });
        onCancel();
      });
    } else {
      onCreateAdmin({
        variables: {
          input: {
            username: form.values.username,
            name: form.values.name,
            roles: getRolesForAdminType(form.values.admin_type),
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: "PH01",
            office_name: "Main Pasig",
            channel: WMS.ChannelType.FullAdmin,
            office_ids: ["PH01"],
          },
        },
      })
        .then((res) => {
          setFullAdmins([...fullAdmins, res.data?.adminCreate]);
          onCancel();
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
            <Select
              {...form.getInputProps("admin_type")}
              searchable
              description="Admin User Type"
              placeholder="Select Admin Type"
              data={fullAdminTypes}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Input
              {...form.getInputProps("email")}
              placeholder="Enter Email"
              description="Email"
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
