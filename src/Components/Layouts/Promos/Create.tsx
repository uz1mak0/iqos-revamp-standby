import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import { cpSync } from "fs";
import React, { useEffect } from "react";
import { WMS } from "../../../GraphQL";
import { createPromo, updatePromo } from "../../../GraphQL/PromoSchema";
import {
  Button,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Select,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { getDiscountTypes, getPromoStatus, getPromoTypes } from "./Config";

type Props = {
  promo?: WMS.Promo | undefined;
  visible: boolean;
  onClose: () => void;
  onSubmit: (promo: WMS.Promo) => void;
};

const Create = (props: Props) => {
  const [promoCreate, { loading: loadingCreate }] = useMutation(createPromo, {
    context: { clientName: "warehouse" },
  });
  const [promoUpdate, { loading: loadingUpdate }] = useMutation(updatePromo, {
    context: { clientName: "warehouse" },
  });

  const values: WMS.PromoInput = {
    code: props.promo ? props.promo?.code : "",
    name: props.promo ? props.promo?.name : "",
    description: props.promo ? props.promo?.description : "",
    type: props.promo ? props.promo?.type : undefined,
    discount: props.promo ? props.promo?.discount : 0,
    discount_type: props.promo ? props.promo?.discount_type : undefined,
    status: props.promo ? props.promo.status : undefined,
  };

  const form = useForm<WMS.PromoInput>({
    initialValues: {
      ...values,
    },
    validate: {
      code: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      name: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      description: (value: WMS.Maybe<string> | undefined) =>
        !value ? "Required!" : null,
      type: (value: WMS.InputMaybe<WMS.PromoType> | undefined) =>
        !value ? "Required!" : null,
      discount: (value: WMS.InputMaybe<number> | undefined) =>
        !value ? "Required!" : null,
      discount_type: (value: WMS.InputMaybe<WMS.DiscountType> | undefined) =>
        !value ? "Required!" : null,
    },
  });

  useEffect(() => {
    if (props.promo) {
      form.setValues({ ...values });
    }
  }, [props.promo]);

  const onSubmit = (values: WMS.PromoInput) => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    if (!props.promo) {
      promoCreate({
        variables: {
          ...values,
        },
      })
        .then((res) => {
          props.onSubmit(res.data.promoCreate);
          onCancel();
          Notification.success({ message: "Promo Created" });
        })
        .catch((e) => {
          Notification.error({
            message: e.message.includes("conditional request")
              ? "Promo code already exist"
              : e.message,
          });
        });
    } else {
      promoUpdate({
        variables: {
          ...values,
        },
      })
        .then((res) => {
          props.onSubmit(res.data.promoUpdate);
          onCancel();
          Notification.success({ message: "Promo Updated" });
        })
        .catch((e) => {
          Notification.error({
            message: e.message.includes("conditional request")
              ? "Promo code already exist"
              : e.message,
          });
        });
    }
  };

  /**
   * The function `onCancel` resets a form and closes a modal.
   */
  const onCancel = () => {
    form.reset();
    props.onClose();
  };

  return (
    <Modal
      size={700}
      title={props.promo ? "Update Promo" : "Create Promo"}
      centered={true}
      onClose={() => props.onClose()}
      opened={props.visible}
    >
      <LoadingOverlay visible={loadingCreate || loadingUpdate} />
      <form>
        <Grid gutter={"lg"}>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("code")}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.code === "Space") e.preventDefault();
              }}
              onBlur={(e) =>
                form.setFieldValue("gtin", e.target.value.replace(/\s/g, ""))
              }
              disabled={props.promo ? true : false}
              label="Code"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input {...form.getInputProps("name")} label="Name" />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input {...form.getInputProps("description")} label="Description" />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              {...form.getInputProps("type")}
              label="Promo Type"
              data={getPromoTypes}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Input
              {...form.getInputProps("discount")}
              type="number"
              label="Discount"
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              {...form.getInputProps("discount_type")}
              label="Discount Type"
              data={getDiscountTypes}
            />
          </Grid.Col>
          {props.promo ? (
            <Grid.Col span={12}>
              <Select
                {...form.getInputProps("status")}
                required
                label="Status"
                data={getPromoStatus}
              />
            </Grid.Col>
          ) : undefined}
        </Grid>
        <Group position="center" my="20px">
          <Button customType="secondary" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button customType="primary" onClick={() => onSubmit(form.values)}>
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default Create;
