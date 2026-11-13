import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { Send } from "tabler-icons-react";
import { ORDER } from "../../../GraphQL";
import { sendOrderCustomSMS } from "../../../GraphQL/OrderManagementSchema";
import { Button, Group, Modal, Select, TextArea } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { getCustomOrderSMS } from "./Config";
import { LoadingOverlay } from "@mantine/core";

type Props = {
  onSubmit: () => void;
  orders: ORDER.Maybe<ORDER.Order>[];
};
export const CustomerSMSForm = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [sendCustomSMS, { loading: loadingCreate }] = useMutation(
    sendOrderCustomSMS,
    { context: { clientName: "order" } }
  );
  const [loadingCustomSMS, seTloadingCustomSMS] = useState(false);

  const form = useForm({
    initialValues: {
      custom_sms_option: "DELAY_DUE_TO_TIMING",
      notification_message: getCustomOrderSMS.find(
        (e) => e.value === "DELAY_DUE_TO_TIMING"
      )?.message,
    },
  });

  const onCustomSMSSend = async () => {
    if (!form.values.notification_message) {
      Notification.error({ message: "Please enter a message" });
      return;
    }

    try {
      seTloadingCustomSMS(true);
      const results = await Promise.allSettled(
        props.orders.map((order) =>
          sendCustomSMS({
            variables: {
              message: form.values.notification_message,
              number: order?.shipping_address?.telephone_number,
            },
          })
        )
      );

      const failures = results.filter((result) => result.status === "rejected");

      if (failures.length > 0) {
        Notification.info({
          message: `${failures.length} SMS failed to send. ${
            results.length - failures.length
          } SMS sent successfully.`,
        });
      } else {
        Notification.success({ message: "All SMS sent successfully" });
      }

      props.onSubmit();
      onCancel();
      seTloadingCustomSMS(false);
    } catch (e) {
      Notification.error({
        message: e instanceof Error ? e.message : "Failed to send SMS",
      });
      seTloadingCustomSMS(false);
    }
  };

  const onCancel = () => {
    setVisible(false);
    form.reset();
  };
  return (
    <div>
      <Modal
        size={800}
        title="Customer SMS"
        centered
        onClose={() => onCancel()}
        opened={visible}
      >
        <LoadingOverlay visible={loadingCustomSMS} />
        <form>
          <Select
            {...form.getInputProps("custom_sms_option")}
            placeholder="Select Type"
            label="SMS Type"
            data={getCustomOrderSMS.map((e) => {
              return {
                label: e.label,
                value: e.value,
              };
            })}
            onChange={(value) => {
              form.setValues({
                ...form.values,
                custom_sms_option: value,
                notification_message: getCustomOrderSMS.find(
                  (e) => e.value === value
                )?.message,
              });
            }}
          />
          <TextArea
            {...form.getInputProps("notification_message")}
            minRows={9}
            label="Message"
          />
          <br />
          <Group position="center">
            <Button onClick={() => onCancel()} customType="secondary">
              Cancel
            </Button>
            <Button onClick={() => onCustomSMSSend()} customType="primary">
              Send Message
            </Button>
          </Group>
        </form>
      </Modal>
      <Button
        loading={loadingCreate}
        disabled={(props.orders?.length || 0) < 1}
        onClick={() => setVisible(true)}
        icon={<Send />}
      >
        Send Message
      </Button>
    </div>
  );
};
