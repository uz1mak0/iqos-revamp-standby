import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { WMS } from "../../../../../GraphQL";
import {
  createAdmin,
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
import { rolesAtom, userAtom } from "../../../../../Store/StoreAtom";
import { InfoCircle } from "tabler-icons-react";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.Admin | undefined;
  channel?: string;
};

export const HRForm = (props: Props) => {
  const [roles] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const {
    directIndirectAdmins,
    setDirectIndirectAdmins,
    fullAdmins,
    setFullAdmins,
  } = useUsersStore();
  const [userRole] = useAtom(rolesAtom);


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
      office_ids: ["PH01"],
      office_id: "PH01",
      email: "",
      phone_number: "",
      is_full_admin: false,
      user_channel: WMS.ChannelType.HRChannel,
    },
    validate: {
      username: (value) => (!value ? "Please add username!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      roles: (value: WMS.Maybe<WMS.Role>[] | string) =>
        !value || value.length < 1 ? "Please add roles!" : null,

      phone_number: (value: string | number) =>
        !value ? "Please add phone number!" : null,
      email: (value) => (!value ? "Please add email!" : null),
    },
  });

  const [previousWarehouse, setPreviousWarehouse] = useState<
    string | undefined
  >(props?.profile?.office_ids?.[0] || undefined);

  useEffect(() => {
    if (props.profile) {
      setInitialValues();
    }

    console.log("Channel:", props.channel);
  }, [props.profile, props.channel]);

  const HRRoles = [{ name: "HR" }];

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
      user_channel: props.channel,
    });
  };

  console.log(props.profile);
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
            roles: form.values.is_full_admin
              ? [WMS.Role.Admin, WMS.Role.AdminDC]
              : form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id: form.values.is_full_admin
              ? "PH01"
              : form.values.office_id,
            office_name: "HR",
            channel: form.values.user_channel,
            office_ids: form.values.is_full_admin
              ? ["PH01"]
              : form.values.office_ids,
          },
        },
      }).then((res) => {

        const updateList = [...directIndirectAdmins];
        if (form.values.is_full_admin) {
          setDirectIndirectAdmins(
            updateList.filter((e) => e.username !== form.values.username),
          );
          setFullAdmins([...fullAdmins, { ...res.data.adminUpdate }]);
        } else {
          const index = updateList.findIndex(
            (e) => e.username === form.values.username,
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
            roles: form.values.roles,
            email: form.values.email,
            phone_number: `+63${form.values.phone_number}`,
            office_id:
              props.channel == "HR_CHANNEL" ? "PH01" : form.values.office_id,
            office_name: "HR",
            channel: props.channel,
            office_ids:
              props.channel == "HR_CHANNEL" ? "PH01" : form.values.office_id,
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
          <>
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
          </>
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
        <Grid>
          <Grid.Col span={12}>
            <MultiSelect
              {...form.getInputProps("roles")}
              searchable
              disabled={roles.isFOM}
              description="Roles"
              placeholder="Select Roles"
              data={HRRoles.map((e) => {
                return {
                  label: e.name,
                  value: e.name,
                };
              })}
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
