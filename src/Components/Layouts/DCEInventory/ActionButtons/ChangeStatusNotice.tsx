import React from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Table,
} from "../../../Elements";
import { WMS } from "../../../../GraphQL";
import { ArrowRight } from "tabler-icons-react";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

type Props = {
  onClose: () => void;
  visible: boolean;
  loading: boolean;
  onChangeStatus: (status: string) => void;
  items: WMS.Sku[];
  selectedStatus: string | undefined;
};

export const ChangeStatusNotice = (props: Props) => {
  const onConfirmChangeStatus = () => {
    if (props.selectedStatus) {
      props.onChangeStatus(props.selectedStatus);
    } else {
      const status =
        props.items[0].dce_status === "BLOCKED" ? "UNBLOCKED" : "BLOCKED";
      props.onChangeStatus(status);
    }
  };

  const statusBadge = (status: string, isChange: boolean) => {
    if (isChange) {
      if (status == "BLOCKED") {
        return <Badge color="green">LIVE</Badge>;
      } else {
        return <Badge color="red">BLOCKED</Badge>;
      }
    } else {
      if (status == "BLOCKED") {
        return <Badge color="red">BLOCKED</Badge>;
      } else {
        return <Badge color="green">LIVE</Badge>;
      }
    }
  };

  const selectedStatusBadge = () => {
    if (props.selectedStatus == "BLOCKED") {
      return <Badge color="red">BLOCKED</Badge>;
    } else {
      return <Badge color="green">LIVE</Badge>;
    }
  };

  const alertDisplay = () => {
    if (props.selectedStatus) {
      if (props.selectedStatus === "BLOCKED") {
        return (
          <Alert title="Remove Stock(s)" icon={<IconInfoCircle />} color="red">
            Are you sure you want to remove this item(s)?
          </Alert>
        );
      } else {
        return (
          <Alert title="Add Stock(s)" icon={<IconInfoCircle />} color="green">
            Are you sure you want to add this item(s)?
          </Alert>
        );
      }
    } else {
      return (
        <Alert title="Change Status" icon={<IconInfoCircle />} color="blue">
          Are you sure you want to change DCE status?
        </Alert>
      );
    }
  };

  const rows = () => {
    return props.items.map((element, index) => (
      <React.Fragment key={`list-${index}-${element?.gtin}`}>
        <tr>
          <td>{element?.gtin}</td>
          <td>{element?.sku}</td>
          <td>{element?.description}</td>
          <td>{element?.unit_of_measure}</td>
          <td>{element?.type}</td>
          <td>
            <Group>
              {statusBadge(`${element.dce_status}`, false)}
              <ActionIcon variant="transparent">
                <ArrowRight />
              </ActionIcon>
              {props.selectedStatus
                ? selectedStatusBadge()
                : statusBadge(`${element.dce_status}`, true)}
            </Group>
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <Modal
      size={1500}
      title="Change Status"
      centered
      onClose={() => props.onClose()}
      opened={props.visible}
    >
      {alertDisplay()}
      <br />
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>GTIN</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Unit of Measure</th>
            <th>Inventory Type</th>
            <th>DCE Status</th>
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
      </Table>
      <br />
      <Group position="center">
        <Button
          customType="secondary"
          loading={props.loading}
          onClick={() => props.onClose()}
        >
          Cancel
        </Button>
        <Button loading={props.loading} onClick={() => onConfirmChangeStatus()}>
          Yes
        </Button>
      </Group>
    </Modal>
  );
};
