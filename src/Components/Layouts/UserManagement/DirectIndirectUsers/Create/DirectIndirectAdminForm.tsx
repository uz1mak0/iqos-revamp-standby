import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { WMS } from "../../../../../GraphQL";
import {
  createAdmin,
  getEnums,
  getWarehouses,
  updateAdmin,
  createFOMLogs,
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
import { rolesAtom, userAtom } from "../../../../../Store/StoreAtom";
import { InfoCircle } from "tabler-icons-react";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined;
  channel?: string;
};

export const DirectIndirectAdminForm = (props: Props) => {
  const [roles] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const {
    directIndirectAdmins,
    setDirectIndirectAdmins,
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

  const [onCreateLogs] = useMutation(createFOMLogs, {
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

  const [previousWarehouse, setPreviousWarehouse] = useState<
    string | undefined
  >(props?.profile?.office_ids?.[0] || undefined);

  const DRRoles = [
    { name: "AdminDC" },
    { name: "PMFTCAdministrator" },
    { name: "ASM" },
    { name: "StoreManager" },
    { name: "SE" },
    { name: "StoreAdmin" },
  ];

  const ICRoles = [
    { name: "AdminIC" },
    { name: "PMFTCAdministrator" },
    { name: "FOM" },
    { name: "SE" },
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

  const isKitchenCity = Boolean(
    selectedWarehouse?.name?.toLowerCase().includes("kitchen city")
  );

  useEffect(() => {
    if (props.profile) {
      setInitialValues();
    }
    loadWarehouses();
  }, [props.profile, props.channel]);

  const setInitialValues = () => {
    setPreviousWarehouse(props?.profile?.office_ids?.[0] || undefined);

    form.setValues({
      username: props?.profile?.username || "",
      name: props?.profile?.name || "",
      roles: props?.profile?.roles ? props?.profile?.roles : "",
      office_ids: props?.profile?.office_ids || "",
      office_id: props?.profile?.office_id || "",
      email: props?.profile?.email || "",
      phone_number:
        Number(props?.profile?.phone_number?.replace("+63", "")) || "",
      user_channel: props?.profile?.channel || props.channel || "",
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
      : form.values.user_channel || props.channel || WMS.ChannelType.DirectRetail;

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
              ? [WMS.Role.Admin, WMS.Role.AdminDC]
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
        createLog();

        const updateList = [...directIndirectAdmins];
        if (form.values.is_full_admin) {
          setDirectIndirectAdmins(
            updateList.filter((e) => e.username !== form.values.username)
          );
          setFullAdmins([...fullAdmins, { ...res.data.adminUpdate }]);
        } else {
          const index = updateList.findIndex(
            (e) => e.username === form.values.username
          );
          updateList[index] = res.data.adminUpdate;
          setDirectIndirectAdmins(updateList);
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
              ? [WMS.Role.Admin, WMS.Role.AdminDC]
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
          setDirectIndirectAdmins([
            ...directIndirectAdmins,
            res.data?.adminCreate,
          ]);
          onCancel();
          Notification.success({ message: "User Created" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  const createLog = () => {
    if (roles.isFOM && previousWarehouse !== currentOfficeId) {
      try {
        onCreateLogs({
          variables: {
            input: {
              action: "Update SE's Warehouse",
              description: `Updated SE's warehouse ${form.values.name}`,
              fom_username: userDetails.username,
              se_username: form.values.name,
              from_warehouse: {
                id: previousWarehouse,
                warehouse_name: warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === previousWarehouse
                )?.name,
              },
              to_warehouse: {
                id: currentOfficeId,
                warehouse_name: selectedWarehouse?.name || "",
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
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
              {!props.profile ? null : (
                <Grid.Col span={6}>
                  <Select
                    {...form.getInputProps("user_channel")}
                    searchable
                    description="Channel"
                    placeholder="Select Channel"
                    data={["DIRECT_RETAIL", "INDIRECT_CHANNEL"]}
                  />
                </Grid.Col>
              )}
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
              disabled={props.channel === "HR_CHANNEL"}
              description="Office Name"
              placeholder="Select Warehouse"
              data={
                warehouseData?.warehouses?.items
                  ?.filter((e: WMS.Warehouse) => {
                    if (props.channel === "DIRECT_RETAIL") {
                      return !e?.name?.toLowerCase().includes("kitchen city");
                    }
                    return true;
                  })
                  ?.map((e: WMS.Warehouse) => {
                    return {
                      value: e?.id,
                      label: e?.name,
                    };
                  }) || []
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              {...form.getInputProps("roles")}
              searchable
              disabled={roles.isFOM}
              description="Roles"
              placeholder="Select Roles"
              data={
                props.channel === "DIRECT_RETAIL"
                  ? DRRoles.map((e) => {
                    return {
                      label: e.name,
                      value: e.name,
                    };
                  })
                  : ICRoles.map((e) => {
                    return {
                      label: e.name,
                      value: e.name,
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