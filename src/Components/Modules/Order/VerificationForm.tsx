import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import React from "react";
import { Button } from "../../Elements/Button";
import { Group } from "../../Elements/Group";
import Notification from "../../Elements/Notification/Notification";
import { Select } from "../../Elements/Select";
import { TextArea } from "../../Elements/TextArea";
import { getVerificationStatus } from "../../Layouts/OrderManagement/OrderManagementConfig";
import { orderVerify } from "../../../GraphQL/OrderManagementSchema";
import { ORDER } from "../../../GraphQL";
import { getVerificationReasons } from "./Config";

type Props = {
  order: ORDER.Maybe<ORDER.Order>;
  onClose: () => void;
  onSubmit: (order: { [key: string]: any }) => void;
};

export const VerificationForm = (props: Props) => {
  const [verifyOrder, { loading: loadingVerify }] = useMutation(orderVerify, {
    context: { clientName: "order" },
  });

  const form = useForm({
    initialValues: {
      verification_status: props?.order?.verification_status || "UNVERIFIED",
      note: "",
      verification_reason: "",
    },
    validate: {
      verification_status: (value: string | undefined) =>
        !value ? "Required!" : null,
    },
  });

  const onOrderVerify = () => {
    if (
      (form.values.verification_status === "FLAGGED" ||
        form.values.verification_status === "CANCELLED") &&
      !form.values.verification_reason
    )
      return form.setFieldError("verification_reason", "Please select reason");

    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields!" });
    verifyOrder({
      variables: {
        ...form.values,
        id: props?.order?.id,
      },
    })
      .then((res) => {
        props.onSubmit(res?.data?.orderVerify);
        props.onClose();
        Notification.success({ message: "Status Updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <div>
      <form>
        <Select
          placeholder="Select verification"
          label="Verification"
          withAsterisk
          {...form.getInputProps("verification_status")}
          data={getVerificationStatus}
          onChange={(value) => {
            form.setFieldValue("verification_status", value);
            form.setFieldValue("verification_reason", "");
          }}
        />
        {form.values.verification_status === "FLAGGED" ||
        form.values.verification_status === "CANCELLED" ? (
          <Select
            searchable
            placeholder="Select Reason"
            label="Reason"
            withAsterisk
            {...form.getInputProps("verification_reason")}
            data={getVerificationReasons}
          />
        ) : undefined}
        <TextArea minRows={5} label="Note" {...form.getInputProps("note")} />
        <br />
        <Group position="center">
          <Button
            loading={loadingVerify}
            onClick={() => props.onClose()}
            customType="secondary"
          >
            Cancel
          </Button>
          <Button
            loading={loadingVerify}
            onClick={() => onOrderVerify()}
            customType="primary"
          >
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
};
