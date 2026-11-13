import React, { useState } from "react";
import {
  Group,
  Modal,
  ActionIcon,
  Badge,
  Paper,
  Stack,
  Button,
  LoadingOverlay,
} from "../../Elements";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { ORDER } from "../../../GraphQL";
import { ArrowRight } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { updateActiveSMSTemplate } from "../../../GraphQL/SMSSettingsSchema";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  onClose: () => void;
  selectedTemplate: ORDER.SmsTemplate | undefined;
  onChangeStatus: (template: ORDER.SmsTemplate) => void;
  isActive: boolean;
};

export const ChangeStatus = (props: Props) => {
  const [updateActiveSMSTemplateMutation, { loading: loading }] = useMutation(
    updateActiveSMSTemplate,
    {
      context: { clientName: "order" },
    },
  );

  const getStatusByType = (isActive: boolean) => {
    const badgeColor = isActive ? "green" : "red";
    const statusText = isActive ? "ACTIVE" : "INACTIVE";
    return (
      <Badge size="lg" color={badgeColor}>
        {statusText}
      </Badge>
    );
  };

  const onUpdateStatus = () => {
    updateActiveSMSTemplateMutation({
      variables: {
        id: props.isActive ? "DEFAULT" : props?.selectedTemplate?.id,
        input: {
          sms_channel: ORDER.SmsChannel.Marketplace,
          type: props.isActive ? "DEFAULT" : props?.selectedTemplate?.type,
          message: props.isActive ? "" : props?.selectedTemplate?.message,
        },
      },
    })
      .then((res) => {
        props.onChangeStatus(res.data.setSMSTemplate);
        Notification.success({ message: "Status Updated" });
      })
      .catch((err) => {
        Notification.error({ message: err.message });
      });
  };

  return (
    <Modal
      removeCloseButton={true}
      size={500}
      centered
      opened={props.selectedTemplate ? true : false}
      onClose={props.onClose}
    >
      <LoadingOverlay visible={loading} />

      <Stack>
        <Group>
          <IconAlertCircle color="red" size={30} />
          <div>
            <h4 style={{ margin: 5 }}>Change Status</h4>
            <span> Are you sure you want to change this status? </span>
          </div>
        </Group>
        <Paper radius={10}>
          <Group position="center">
            {getStatusByType(props.isActive)}
            <ActionIcon variant="transparent">
              <ArrowRight />
            </ActionIcon>
            {getStatusByType(!props.isActive)}
          </Group>
        </Paper>
        {props.isActive ? (
          <Alert
            color="yellow"
            icon={<IconAlertCircle size={30} />}
            title={"Note"}
          >
            Active Status will automatically change to Inactive if you change
            this status to Active.
          </Alert>
        ) : undefined}
        <Group position="right">
          <Button customType="secondary" onClick={() => props.onClose()}>
            Cancel
          </Button>
          <Button
            customType="custom"
            color="green"
            onClick={() => onUpdateStatus()}
          >
            Okay
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
