import React from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import {
  Badge,
  Button,
  Group,
  Modal,
  Text,
  Stack,
  Table,
  LoadingOverlay,
} from "../../../Elements";
import { ArrowRight, InfoCircle } from "tabler-icons-react";
import { Alert, Textarea } from "@mantine/core";
import { useMutation } from "@apollo/client";
import { unAssignSMSToWarehouses } from "../../../../GraphQL/SMSSettingsSchema";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  opened: boolean;
  warehouses: WMS.Warehouse[];
  onClose: () => void;
  onUnAssignSMSToWarehouses: (warehouses: WMS.Warehouse[]) => void;
};

export const UnAssignSMS = (props: Props) => {
  const [unAssignSMS, { loading: loading }] = useMutation(
    unAssignSMSToWarehouses,
    {
      context: { clientName: "order" },
    },
  );

  const onModalClose = () => {
    props.onClose();
  };

  const onSubmit = () => {
    unAssignSMS({
      variables: {
        warehouse_ids: props.warehouses.map((e) => e.id),
      },
    })
      .then(() => {
        Notification.success({
          message: "SMS unassigned to selected warehouses",
        });
        props.onUnAssignSMSToWarehouses(props.warehouses);
        onModalClose();
      })
      .catch((err) => Notification.error({ message: err.message }));
  };

  const rows = () => {
    return props.warehouses.map((item) => (
      <React.Fragment key={`list-${item.id}`}>
        <tr>
          <td>{item.name}</td>
          <td>{item?.ecomm_sms?.type || "Default"}</td>
          <td>
            <div style={{ width: 500 }}>
              <Text lineClamp={5} size={"xs"}>
                {item.ecomm_sms?.message || "Default"}
              </Text>
            </div>
          </td>
          <td>
            <Group>
              {item.ecomm_sms?.id ? (
                <Badge>Custom</Badge>
              ) : (
                <Badge color="dark">Default</Badge>
              )}
              <ArrowRight />
              <Badge color="dark">Default</Badge>
            </Group>
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <Modal
      title="Change SMS Type"
      centered
      size={1300}
      opened={props.opened}
      onClose={() => onModalClose()}
    >
      <LoadingOverlay visible={loading} />
      <Stack>
        <Alert color="blue" title="Change Status" icon={<InfoCircle />}>
          Are you sure you want to change Custom SMS?
        </Alert>
        <Table highlightOnHover fontSize={"sm"}>
          <thead>
            <tr>
              <th>SMS Type</th>
              <th>SMS Message</th>
              <th>Message Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
        <Group position="right">
          <Button customType="secondary" onClick={() => onModalClose()}>
            Cancel
          </Button>
          <Button
            customType="custom"
            styles={{ backgroundColor: `#0BCE66` }}
            onClick={() => onSubmit()}
          >
            Yes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
