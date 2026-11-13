import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { WMS } from "../../../../../../GraphQL";
import {
  createSalesExpert,
  getWarehouses,
  updateSalesExpert,
} from "../../../../../../GraphQL/UserSchema";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import {
  Button,
  Grid,
  Group,
  Input,
  Modal,
  MultiSelect,
  Select,
} from "../../../../../Elements";
import Notification from "../../../../../Elements/Notification/Notification";

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: WMS.SalesExpert | undefined;
  onSubmit: (user: WMS.SalesExpert) => void;
};

const Create = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const { data: warehouseData } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: "DIRECT_RETAIL",
    },
  });
  const [onCreateSalesExpert, { loading: loadingCreate }] = useMutation(
    createSalesExpert,
    { context: { clientName: "warehouse" } }
  );
  const [onUpdateSalesExpert, { loading: loadingUpdate }] = useMutation(
    updateSalesExpert,
    { context: { clientName: "warehouse" } }
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
        (!value || value.length < 1) && userRoles.isDirectRetailUser
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

  const setInitialValues = () => {
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
          Notification.success({ message: "Sales Expert Updated" });
          props.onSubmit(res.data.salesExpertUpdate);
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
          form.reset();
          Notification.success({ message: "Sales Expert Created" });
          props.onSubmit(res.data.salesExpertCreate);
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

  return (
    <Modal
      opened={props.visible}
      onClose={onCancel}
      centered
      size={700}
      title={!props.profile ? "Create Sales Expert" : "Update Sales Expert"}
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

export default Create;
