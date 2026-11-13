import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
} from "../../../Elements";
import { IconPlus } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import { Textarea, TextInput, Text } from "@mantine/core";
import { useMutation } from "@apollo/client";
import {
  createSMSTemplate,
  updateSMSTemplate,
} from "../../../../GraphQL/SMSSettingsSchema";
import { ORDER } from "../../../../GraphQL";
import Notification from "../../../Elements/Notification/Notification";
import { Edit } from "tabler-icons-react";
import { CreateCustomSMSFormInput, ECOMM_SMS_LIMIT } from "../config";

type Props = {
  onCreateUpdateCustomSMS: (template: ORDER.SmsTemplate) => void;
  template?: ORDER.SmsTemplate;
};

export const  CreateUpdateSMS = (props: Props) => {
  const [createSMSTemplateMutation, { loading: loadingCreate }] = useMutation(
    createSMSTemplate,
    {
      context: { clientName: "order" },
    },
  );
  const [updateSMSTemplateMutation, { loading: loadingUpdate }] = useMutation(
    updateSMSTemplate,
    {
      context: { clientName: "order" },
    },
  );

  const [opened, setOpened] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCustomSMSFormInput>();

  const defaultValues = {
    type: props?.template?.type || "",
    message: props?.template?.message || "",
  };

  useEffect(() => {
    if (props.template) {
      reset(defaultValues);
    }
  }, [props.template]);
  const onClose = () => {
    setOpened(false);
    reset();
  };

  const onCreateUpdateSMS = (template: ORDER.SmsTemplate) => {
    props.onCreateUpdateCustomSMS(template);
    Notification.success({
      message: `${template.type} ${props.template ? "Updated" : "Created"}`,
    });
    onClose();
  };

  const onSubmit = (input: CreateCustomSMSFormInput) => {
    if (props.template) {
      updateSMSTemplateMutation({
        variables: {
          id: props?.template?.id,
          input: {
            ...input,
            sms_channel: ORDER.SmsChannel.Ecomm,
          },
        },
      }).then((res) => {
        onCreateUpdateSMS(res.data.smsTemplateUpdate);
      });
    } else {
      createSMSTemplateMutation({
        variables: {
          input: {
            ...input,
            sms_channel: ORDER.SmsChannel.Ecomm,
          },
        },
      }).then((res) => {
        onCreateUpdateSMS(res.data.smsTemplateCreate);
      });
    }
  };

  return (
    <div>
      <Modal
        title="Create Custom SMS"
        centered
        size={700}
        opened={opened}
        onClose={onClose}
      >
        <LoadingOverlay visible={loadingCreate || loadingUpdate} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  withAsterisk
                  error={errors.type ? "Required" : undefined}
                  label="SMS Type"
                />
              )}
            />
            <Controller
              name="message"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  withAsterisk
                  autosize
                  minRows={5}
                  error={errors.message ? "Required" : undefined}
                  label="SMS Message"
                  maxLength={ECOMM_SMS_LIMIT}
                />
              )}
            />
            <Text align="right">
              {watch("message")?.length}/{ECOMM_SMS_LIMIT}
            </Text>
            <Group position="right">
              <Button
                type="reset"
                customType="secondary"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleSubmit(onSubmit)}
                customType="custom"
                styles={{ backgroundColor: `#0BCE66` }}
              >
                {"Submit"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      {props.template ? (
        <ActionIcon variant="default" onClick={() => setOpened(true)}>
          <Edit size={20} />
        </ActionIcon>
      ) : (
        <Button
          customType="custom"
          styles={{ backgroundColor: `#0BCE66` }}
          icon={<IconPlus />}
          onClick={() => setOpened(true)}
        >
          Create Custom SMS
        </Button>
      )}
    </div>
  );
};
