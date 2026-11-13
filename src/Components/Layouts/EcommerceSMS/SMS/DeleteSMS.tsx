import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
} from "../../../Elements";
import { Trash } from "tabler-icons-react";
import { ORDER } from "../../../../GraphQL";
import { Alert } from "@mantine/core";
import { IconTrashOff } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import { deleteSMSTemplate } from "../../../../GraphQL/SMSSettingsSchema";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  onDelete: (template: ORDER.SmsTemplate) => void;
  template?: ORDER.SmsTemplate;
};

export const DeleteSMS = (props: Props) => {
  const [deleteSMSTemplateMutation, { loading: loading }] = useMutation(
    deleteSMSTemplate,
    {
      context: { clientName: "order" },
    },
  );

  const [visible, setVisible] = useState(false);

  const onDeleteSMS = () => {
    deleteSMSTemplateMutation({
      variables: {
        id: props?.template?.id,
      },
    })
      .then((res) => {
        setVisible(false);
        Notification.success({ message: "SMS removed" });
        props.onDelete(res.data.smsTemplateRemove);
      })
      .catch((err) => {
        Notification.error({ message: err.message });
      });
  };
  return (
    <div>
      <Modal
        centered
        onClose={() => setVisible(false)}
        opened={visible}
        removeCloseButton={true}
      >
        <LoadingOverlay visible={loading} />
        <div>
          <Stack>
            <Group>
              <IconTrashOff color="red" size={30} />
              <div>
                <h3 style={{ margin: 5 }}>Delete SMS</h3>
                <div style={{ width: 300 }}>
                  <span>
                    {`Are you sure you want to permanently delete this SMS? This action cannot be undone`}
                  </span>
                </div>
              </div>
            </Group>
            <Group position="right">
              <Button
                loading={loading}
                customType="secondary"
                onClick={() => setVisible(false)}
              >
                Cancel
              </Button>
              <Button
                loading={loading}
                customType="custom"
                color="red"
                onClick={onDeleteSMS}
              >
                Yes, Delete
              </Button>
            </Group>
          </Stack>
        </div>
      </Modal>
      <ActionIcon variant="default" onClick={() => setVisible(true)}>
        <Trash size={20} color="red" />
      </ActionIcon>
    </div>
  );
};
