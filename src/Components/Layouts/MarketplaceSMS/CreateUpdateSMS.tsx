import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Group,
  Stack,
  ActionIcon,
  LoadingOverlay,
} from "../../Elements";
import { Textarea, TextInput, Text } from "@mantine/core";
import { Plus, Edit } from "tabler-icons-react";
import { ORDER } from "../../../GraphQL";

import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
  createSMSTemplate,
  updateSMSTemplate,
  updateActiveSMSTemplate,
} from "../../../GraphQL/SMSSettingsSchema";
import Notification from "../../Elements/Notification/Notification";
import { useDebouncedValue } from "@mantine/hooks";

export interface FormInput {
  type: string;
  message: string;
}

type Props = {
  onCreateUpdateSMS: (template: ORDER.SmsTemplate, isActive: boolean) => void;
  template?: ORDER.SmsTemplate;
  isUpdate?: boolean;
  isActive: boolean;
};

export const CreateUpdateSMS = (props: Props) => {
  const [visible, setVisible] = useState(false);
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
  const [updateActiveSMSTemplateMutation, { loading: loadingStatus }] =
    useMutation(updateActiveSMSTemplate, {
      context: { clientName: "order" },
    });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInput>();
  const [smsCharacterCount, setSmsCharacterCount] = useState(0);

  const defaultValues = {
    type: props?.template?.type || "",
    message: props?.template?.message || "",
  };

  useEffect(() => {
    if (props.isUpdate && props.template) {
      reset(defaultValues);
    }
  }, []);

  const onClose = () => {
    setVisible(false);
  };

  const onUpdateSMSStatus = (template: ORDER.SmsTemplate) => {
    updateActiveSMSTemplateMutation({
      variables: {
        id: template?.id,
        input: {
          type: template.type,
          message: template.message,
          sms_channel: ORDER.SmsChannel.Marketplace,
        },
      },
    })
      .then((res) => {
        onCreateUpdateSMS(res.data.setSMSTemplate);
      })
      .catch((err) => {
        Notification.error({ message: err.message });
      });
  };

  const onCreateUpdateSMS = (template: ORDER.SmsTemplate) => {
    props.onCreateUpdateSMS(template, props?.isActive);
    if (props.isUpdate) {
      Notification.success({ message: `${template.type} Updated` });
    } else {
      Notification.success({ message: `${template.type} Created` });
    }
    setVisible(false);
  };

  const onSubmit = (input: FormInput) => {
    if (props.isUpdate) {
      updateSMSTemplateMutation({
        variables: {
          id: props?.template?.id,
          input: {
            ...input,
            sms_channel: ORDER.SmsChannel.Marketplace,
          },
        },
      }).then((res) => {
        if (props.isActive) {
          onUpdateSMSStatus(res.data.smsTemplateUpdate);
        } else {
          onCreateUpdateSMS(res.data.smsTemplateUpdate);
        }
      });
    } else {
      createSMSTemplateMutation({
        variables: {
          input: {
            ...input,
            sms_channel: ORDER.SmsChannel.Marketplace,
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
        size={1000}
        centered
        title={props.isUpdate ? "Update SMS" : "Create SMS"}
        onClose={() => onClose()}
        opened={visible}
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
                  maxLength={160}
                />
              )}
            />
            <Text align="right">{watch("message")?.length}/160</Text>
            <Group position="center">
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
                customType="primary"
              >
                {props.isUpdate ? "Update" : "Create"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      {props.isUpdate ? (
        <ActionIcon
          disabled={props?.template?.id === "DEFAULT"}
          variant="default"
          onClick={() => setVisible(true)}
        >
          <Edit size={20} />
        </ActionIcon>
      ) : (
        <Button onClick={() => setVisible(true)} icon={<Plus />}>
          Create SMS
        </Button>
      )}
    </div>
  );
};
