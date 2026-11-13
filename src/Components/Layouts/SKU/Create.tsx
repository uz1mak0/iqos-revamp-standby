import { ApolloQueryResult, useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { WMS } from "../../../GraphQL";
import { createSku, getSKUs, updateSku } from "../../../GraphQL/SKUsSchema";
import { getEnums } from "../../../GraphQL/UserSchema";
import { Button, Grid, Group, Input, Modal, Select } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { getDRTags } from "../Transaction/TransactionConfig";

type Props = {
  visible: boolean;
  isUpdate?: boolean;
  onClose: () => void;
  onSubmit: (item: WMS.Sku, isUpdate: boolean) => void;
  profile?: WMS.Sku;
};

export const Create = (props: Props) => {
  const { data: enumsData } = useQuery(getEnums, {
    variables: { name: "SKUType" },
    context: { clientName: "warehouse" },
  });
  const [onCreateSku, { loading: createLoading }] = useMutation(createSku, {
    context: { clientName: "warehouse" },
  });
  const [onUpdateSku, { loading: updateLoading }] = useMutation(updateSku, {
    context: { clientName: "warehouse" },
  });
  const { refetch } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const getInitialTag = (gtin: string | undefined, isTag: boolean) => {
    if (isTag) {
      if (gtin?.includes("GT_")) return "GUIDED TRIAL";
      if (gtin?.includes("PG_")) return "PROMO GOODS";
      return undefined;
    } else {
      if (gtin?.includes("GT_")) return gtin.replace("GT_", "");
      if (gtin?.includes("PG_")) return gtin.replace("PG_", "");
      return gtin;
    }
  };

  const values = {
    gtin: props.isUpdate ? getInitialTag(`${props.profile?.gtin}`, false) : "",
    sku: props.isUpdate ? props.profile?.sku : "",
    description: props.isUpdate ? props.profile?.description : "",
    unit_of_measure: props.isUpdate ? props.profile?.unit_of_measure : "",
    type: props.isUpdate ? props.profile?.type : ("" as WMS.SkuType),
    price: props.isUpdate ? props.profile?.price : 0,
    price_gross: props.isUpdate ? props.profile?.price_gross : 0,
    tag: props.isUpdate ? getInitialTag(`${props.profile?.gtin}`, true) : "",
    status: props.isUpdate ? props.profile?.status : "",

  };

  const form = useForm({
    initialValues: {
      ...values,
    },
    validate: {
      gtin: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      sku: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      description: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      unit_of_measure: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      type: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
    },
  });

  useEffect(() => {
    if (props.profile) {
      form.setValues({ ...values });
    }
  }, [props.profile]);

  const onChangePrice = (val: number) => {
    form.setValues({
      price: val,
      price_gross: Number(Number(val) - Number(Number(val * 0.12))),
    });
  };

  const onCancel = () => {
    props.onClose();
    // form.reset()
  };

  const updateSKUGTIN = (
    tag: string | undefined | unknown,
    gtin: WMS.Maybe<string> | undefined | unknown,
  ) => {
    console.log(tag, gtin);
    if (tag) {
      if (tag === "PROMO GOODS") return `PG_${gtin}`;
      if (tag === "GUIDED TRIAL") return `GT_${gtin}`;
    } else {
      return gtin;
    }
  };

  const onSubmit = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    const newValues = { ...form.values };
    delete newValues["tag"];
    if (props.isUpdate) {
      return onUpdateSku({
        variables: {
          input: {
            ...newValues,
            channel: "DIRECT_RETAIL",
          },
        },
        onCompleted: (data) => {
          props.onSubmit(data.skuUpdate, true);
          Notification.success({ message: "SKU Successfully Updated" });
          props.onClose();
        },
        onError: (e) => {
          Notification.error({
            message: e.message.includes("conditional request")
              ? "GTIN already exist"
              : e.message,
          });
        },
      });
    }

    return onCreateSku({
      variables: {
        input: {
          ...newValues,
          gtin: updateSKUGTIN(form?.values?.tag, form?.values?.gtin),
          channel: "DIRECT_RETAIL",
        },
      },
      onCompleted: (data) => {
        props.onSubmit(data.skuCreate, false);
        Notification.success({ message: "SKU Successfully Created" });
        props.onClose();
      },
      onError: (e) => {
        Notification.error({
          message: e.message.includes("conditional request")
            ? "GTIN already exist"
            : e.message,
        });
      },
    });
  };

  return (
    <Modal
      title={props.isUpdate ? "Update SKU" : "Create SKU"}
      centered
      size={700}
      opened={props.visible}
      onClose={() => onCancel()}
    >
      <form>
        <Grid gutter={"lg"}>
          <Grid.Col span={3}>
            <Select
              {...form.getInputProps("tag")}
              label="Tag"
              clearable
              disabled={props.isUpdate}
              placeholder="Select Tag"
              data={getDRTags.map((tag: string) => {
                return {
                  label: tag,
                  value: tag,
                };
              })}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <Input
              {...form.getInputProps("gtin")}
              disabled={props.isUpdate}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.code === "Space") e.preventDefault();
              }}
              onBlur={(e) =>
                form.setFieldValue("gtin", e.target.value.replace(/\s/g, ""))
              }
              label="GTIN"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("sku")}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.code === "Space") e.preventDefault();
              }}
              onBlur={(e) =>
                form.setFieldValue("sku", e.target.value.replace(/\s/g, ""))
              }
              label="SKU"
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Select
              label="Status"
              placeholder="Select Status"
              clearable
              data={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" },
              ]}
              value={form.values.status ?? "ACTIVE"}
              onChange={(val) => {
                form.setFieldValue(
                  "status",
                  val === "ACTIVE" || !val ? null : val,
                );
              }}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Input {...form.getInputProps("description")} label="Description" />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("unit_of_measure")}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.code === "Space") e.preventDefault();
              }}
              label="Unit Of Measure"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              {...form.getInputProps("type")}
              label="Select Type"
              data={enumsData?.__type?.enumValues?.map(
                (e: { name: string }) => {
                  return { label: e.name, value: e.name };
                },
              )}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("price")}
              label="Price"
              type="number"
              onChange={(e) => onChangePrice(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("price_gross")}
              disabled
              label="Price Gross"
              type="number"
            />
          </Grid.Col>
        </Grid>
        <Group position="center" my="20px">
          <Button customType="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            customType="primary"
            onClick={() => onSubmit()}
            loading={props.isUpdate ? updateLoading : createLoading}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
