import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { WMS } from "../../../../../GraphQL";
import {
  createSalesExpert,
  getWarehouses,
  updateSalesExpert,
  createFOMLogs,
} from "../../../../../GraphQL/UserSchema";
import { rolesAtom, userAtom } from "../../../../../Store/StoreAtom";
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
import { useRouter } from "next/router";
type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.SalesExpert | undefined;
  // onSubmit: (user: WMS.SalesExpert) => void;
};

export const SalesExpertForm = (props: Props) => {
  const router = useRouter();
  const [roles] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const { salesExpert, setSalesExpert } = useUsersStore();
  const { data: warehouseData } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: router.route.includes("/users/direct")
        ? "DIRECT_RETAIL"
        : "INDIRECT_CHANNEL",
    },
  });
  const [onCreateSalesExpert, { loading: loadingCreate }] = useMutation(
    createSalesExpert,
    { context: { clientName: "warehouse" } },
  );
  const [onUpdateSalesExpert, { loading: loadingUpdate }] = useMutation(
    updateSalesExpert,
    { context: { clientName: "warehouse" } },
  );

  const [onCreateLogs, { loading: loadingCreateLogs }] = useMutation(
    createFOMLogs,
    {
      context: { clientName: "warehouse" },
    },
  );

  type FormProps = {
    sales_expert_id: string;
    name: string;
    office_ids: WMS.Maybe<string>[] | string;
    email: string;
    phone_number: string | number;
    user_status?: string;
  };

  const form = useForm<FormProps>({
    initialValues: {
      sales_expert_id: "",
      name: "",
      office_ids: [],
      email: "",
      phone_number: "",
      user_status: "",
    },
    validate: {
      sales_expert_id: (value) => (!value ? "Please add ID!" : null),
      name: (value) => (!value ? "Please add name!" : null),
      office_ids: (value: WMS.Maybe<string>[] | string) =>
        !value || value.length < 1 ? "Please add office name!" : null,
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

  const setInitialValues = () => {
    setPreviousWarehouse(props?.profile?.office_ids?.[0] || undefined);
    form.setValues({
      sales_expert_id: props?.profile?.sales_expert_id || "",
      name: props?.profile?.name || "",
      office_ids: props?.profile?.office_ids || "",
      email: props?.profile?.email || "",
      phone_number:
        Number(props?.profile?.phone_number?.replace("+63", "")) || "",
      user_status: !props.profile?.user_status
        ? "ACTIVE"
        : props.profile?.user_status,
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

  const onCreate = (createdSalesExpert: WMS.SalesExpert) => {
    form.reset();
    setSalesExpert([...salesExpert, { ...createdSalesExpert }]);
    props.onClose();
    Notification.success({ message: "Sales Expert Created" });
  };

  const onUpdate = (updatedSalesExpert: WMS.SalesExpert) => {
    const updateList = [...salesExpert];
    const index = updateList.findIndex(
      (e) => e.sales_expert_id === props.profile?.sales_expert_id,
    );
    updateList[index] = { ...updatedSalesExpert };
    setSalesExpert(updateList);
    Notification.success({ message: "Sales Expert Updated" });
    props.onClose();
  };

  const onSubmit = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    if (props.profile) {
      onUpdateSalesExpert({
        variables: {
          input: {
            ...form.values,
            phone_number: `+63${form.values.phone_number}`,
          },
        },
      })
        .then((res) => {
          createLog();
          onUpdate(res.data.salesExpertUpdate);
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
      const updateForm = { ...form.values };
      delete updateForm.user_status;
      onCreateSalesExpert({
        variables: {
          input: {
            ...updateForm,
            phone_number: `+63${form.values.phone_number}`,
          },
        },
      })
        .then((res) => {
          onCreate(res.data.salesExpertCreate);
        })
        .catch((e) => {
          Notification.error({
            message: e.message.includes("The conditional request failed")
              ? "Sales Expert ID already exist"
              : e.message,
          });
        });
    }
  };

  const [previousWarehouse, setPreviousWarehouse] = useState<
    string | undefined
  >(props?.profile?.office_ids?.[0] || undefined);

  const createLog = () => {
    if (roles.isFOM && previousWarehouse != form.values.office_ids[0]) {
      try {
        onCreateLogs({
          variables: {
            input: {
              action: "Update SE's warehouse/record ",
              description: `Updated SE's warehouse/record sale destation ${form.values.name}`,
              fom_username: userDetails.username,
              se_username: form.values.name,
              from_warehouse: {
                id: previousWarehouse,
                warehouse_name: warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === previousWarehouse,
                )?.name,
              },
              to_warehouse: {
                id: form.values.office_ids[0],
                warehouse_name: warehouseData?.warehouses?.items?.find(
                  (e: WMS.Warehouse) => e.id === form.values.office_ids[0],
                )?.name,
              },
            },
          },
        });
        console.log("Created logs successfully");
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
      title={!props.profile ? "Create Sales Expert" : "Update Sales Expert"}
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
              {...form.getInputProps("sales_expert_id")}
              disabled={props.profile ? true : false}
              placeholder="Enter ID"
              description="Sales Expert ID"
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
          <Grid.Col span={6}>
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
          </Grid.Col>
          <Grid.Col span={6}>
            {props.profile ? (
              <Select
                {...form.getInputProps("user_status")}
                searchable
                description="User Status"
                placeholder="Select status"
                data={["ACTIVE", "INACTIVE"].map((status) => {
                  return {
                    label: status,
                    value: status,
                  };
                })}
              />
            ) : undefined}
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
