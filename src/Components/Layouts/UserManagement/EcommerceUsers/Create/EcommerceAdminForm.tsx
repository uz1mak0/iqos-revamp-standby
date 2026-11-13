import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
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
  Checkbox,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Stack,
  Select,
} from "../../../../Elements";
import Notification from "../../../../Elements/Notification/Notification";
import { useUsersStore } from "../../Store";
import { Space, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../Store/StoreAtom";
import { InfoCircle } from "tabler-icons-react";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined;
  channel?: string;
};

export const EcommerceAdminForm = (props: Props) => {
  const {
    ecommerceAdmins,
    setEcommerceAdmins,
    fullAdmins,
    setFullAdmins,
  } = useUsersStore();
  const [userRole] = useAtom(rolesAtom);

  const [loadWarehouses, { data: warehouseData }] = useLazyQuery(
    getWarehouses,
    {
      context: { clientName: "warehouse" },
    }
  );

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
    is_full_admin: boolean;
    user_channel: string;
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
      is_full_admin: false,
      user_channel: "",
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      roles: (value: WMS.Maybe<WMS.Role>[] | string) =>
        !value || value.length < 1 ? "Please add roles!" : null,
      office_ids: (value: WMS.Maybe<string>[] | string) =>
        !value || value.length < 1 ? "Please add office name!" : null,
      phone_number: (value: string | number) =>
        !value ? "Please add phone number!" : null,
      email: (value) => (!value ? "Please add email!" : null),
    },
  });

  const EcomRoles = [
    { name: "AdministratorEC" },
    { name: "EcomAdmin" },
    { name: "Packer" },
    { name: "Dispatch" },
    { name: "CSC" },
    { name: "PMFTCAdministrator" },
  ];

  const currentOfficeId =
    (Array.isArray(form.values.office_ids)
      ? form.values.office_ids[0]
      : form.values.office_ids) || "";

  const rawWarehouses: WMS.Warehouse[] = warehouseData?.warehouses?.items || [];

  const warehouseOptions: { value: string; label: string }[] = rawWarehouses
    .filter((e: WMS.Warehouse) => Boolean(e?.id))
    .map((e: WMS.Warehouse) => ({
      value: e.id || "",
      label: e.name || e.id || "",
    }));

  const selectedWarehouse = rawWarehouses.find(
    (e: WMS.Warehouse) => e?.id === currentOfficeId
  );

  // const isKitchenCity = Boolean(
  //   selectedWarehouse?.name?.toLowerCase().includes("kitchen city")
  // );

  useEffect(() => {
    if (props.profile) {
      setInitialValues();
    }
    loadWarehouses();
  }, [props.profile, props.channel]);

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
      user_channel: props?.profile?.channel || WMS.ChannelType.Ecomm,
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

    const rawOfficeIds = Array.isArray(form.values.office_ids)
      ? form.values.office_ids.flat()
      : [form.values.office_ids];

    const computedOfficeIds = rawOfficeIds
      .filter((id): id is string => Boolean(id))
      .map(String);

    const primaryOfficeId = computedOfficeIds[0] || "";

    const computedChannel = form.values.is_full_admin
      ? WMS.ChannelType.FullAdmin
      : WMS.ChannelType.Ecomm;

    const computedOfficeName =
      selectedWarehouse?.name ||
      warehouseOptions.find(
        (opt: { value: string; label: string }) => opt.value === primaryOfficeId
      )?.label ||
      props.profile?.office_name ||
      "";

    if (props.profile) {
      onUpdateAdmin({
        variables: {
          input: {
            username: form.values.username,
            name: form.values.name,
            roles: form.values.is_full_admin
              ? [WMS.Role.Admin, WMS.Role.EcomAdmin]
              : form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: form.values.is_full_admin ? "PH01" : primaryOfficeId,
            office_name: computedOfficeName,
            channel: computedChannel,
            office_ids: form.values.is_full_admin ? ["PH01"] : computedOfficeIds,
          },
        },
      }).then((res) => {
        const updateList = [...ecommerceAdmins];
        if (form.values.is_full_admin) {
          setEcommerceAdmins(
            updateList.filter((e) => e.username !== form.values.username)
          );
          setFullAdmins([...fullAdmins, { ...res.data.adminUpdate }]);
        } else {
          const index = updateList.findIndex(
            (e) => e.username === form.values.username
          );
          updateList[index] = res.data.adminUpdate;
          setEcommerceAdmins(updateList);
        }
        Notification.success({ message: "User Updated" });
        onCancel();
      });
    } else {
      onCreateAdmin({
        variables: {
          input: {
            username: form.values.username,
            name: form.values.name,
            roles: form.values.is_full_admin
              ? [WMS.Role.Admin, WMS.Role.EcomAdmin]
              : form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: primaryOfficeId,
            office_name: computedOfficeName,
            channel: computedChannel,
            office_ids: computedOfficeIds,
          },
        },
      })
        .then((res) => {
          setEcommerceAdmins([...ecommerceAdmins, res.data?.adminCreate]);
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
      title={!props.profile ? "Create Ecommerce User" : "Update Ecommerce User"}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />
      <form>
        {userRole.isFullAdmin && props.profile && (
          <Stack>
            <div>
              <Text fz={17} fw={700}>
                Granting Full Admin Role Access{" "}
                <Text fw={400} fs="italic" fz={10} c={"dimmed"} span>
                  <span>
                    <InfoCircle color="#3092E8" size={13} />
                  </span>
                  Please note the current type will be replaced.
                </Text>
              </Text>
            </div>

            <Grid align="center">
              <Grid.Col span={6}>
                <Checkbox
                  {...form.getInputProps("is_full_admin")}
                  label="Full Admin"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        )}
        <Space h="xs" />
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
            <MultiSelect
              {...form.getInputProps("office_ids")}
              searchable
              description="Office Name"
              placeholder="Select Warehouse"
              data={warehouseOptions}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              {...form.getInputProps("roles")}
              searchable
              description="Roles"
              placeholder="Select Roles"
              data={EcomRoles.map((e) => ({
                label: e.name,
                value: e.name,
              }))}
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
        <Group position="right">
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
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};