import React, { useState } from "react";
import { Button, Text, Modal, Group } from "../../../Elements";
import { useMutation } from "@apollo/client";
import { triggerSFTPStocks } from "../../../../GraphQL/SKUsSchema";
import Notification from "../../../Elements/Notification/Notification";
export const Triggers = () => {
  const [triggerSFTP, { loading: loading }] = useMutation(triggerSFTPStocks, {
    context: { clientName: "warehouse" },
  });
  const [opened, setOpened] = useState(false);

  const onTrigger = () => {
    triggerSFTP().then((res) => {
      setOpened(false);
      Notification.success({ message: res?.data.sftpStocks?.message });
    });
  };

  return (
    <div>
      <Modal
        size={300}
        centered
        opened={opened}
        removeCloseButton={true}
        onClose={() => setOpened(false)}
      >
        <Text size="lg">Trigger SFTP Stocks?</Text>
        <br />
        <Group position="center">
          <Button fullWidth loading={loading} onClick={() => onTrigger()}>
            Yes
          </Button>
          <Button
            fullWidth
            customType="secondary"
            loading={loading}
            onClick={() => {
              setOpened(false);
            }}
          >
            No
          </Button>
        </Group>
      </Modal>
      <Button loading={loading} onClick={() => setOpened(true)}>
        Trigger SFTP
      </Button>
    </div>
  );
};
