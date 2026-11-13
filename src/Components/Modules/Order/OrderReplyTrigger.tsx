import React, { useState } from "react";
import { ORDER } from "../../../GraphQL";
import { Button, Select, Modal } from "../../Elements";
import { dceUsersAtom, userAtom } from "../../../Store/StoreAtom";
import { useAtom } from "jotai";
import { useMutation } from "@apollo/client";
import { triggerOrderReply } from "../../../GraphQL/SKUsSchema";
import Notification from "../../Elements/Notification/Notification";
import { Group } from "@mantine/core";

type Props = {
  order: ORDER.Order | undefined;
};

export const OrderReplyTrigger = (props: Props) => {
  const [user] = useAtom(userAtom);
  const [usersDCE] = useAtom(dceUsersAtom);
  const [triggerOrder, { loading }] = useMutation(triggerOrderReply, {
    context: { clientName: "order" },
  });
  const [selectedStatus, setSelectedStatus] =
    useState<ORDER.OrderStatus | undefined>(undefined);
  const [opened, setOpened] = useState(false);

  const onOrderReply = () => {
    if (!selectedStatus)
      return Notification.error({ message: "Please select status" });
    triggerOrder({
      variables: {
        id: props.order?.id,
        status: selectedStatus,
      },
    })
      .then((res) => {
        Notification.success({ message: res.data.dceOrderReply.message });
        setSelectedStatus(undefined);
        setOpened(false);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onSelectStatus = (status: string) => {
    switch (status) {
      case "SHIPPED":
        return setSelectedStatus(ORDER.OrderStatus.Shipped);
      case "PROCESSED":
        return setSelectedStatus(ORDER.OrderStatus.Processed);
      case "COMPLETED":
        return setSelectedStatus(ORDER.OrderStatus.Completed);
      case "UNDELIVERED":
        return setSelectedStatus(ORDER.OrderStatus.Undelivered);
      default:
        break;
    }
  };

  if (
    usersDCE?.some((admin) => user.username === admin) &&
    props.order?.order_type === "ZTA"
  ) {
    return (
      <div>
        <Modal
          centered
          removeCloseButton={true}
          onClose={() => {
            setOpened(false);
            setSelectedStatus(undefined);
          }}
          opened={opened}
        >
          <p>Current Status: {props.order?.order_status}</p>
          <Select
            description="Order Status"
            placeholder="Select Status"
            onChange={(e) => onSelectStatus(e)}
            data={["SHIPPED", "PROCESSED", "COMPLETED", "UNDELIVERED"]}
          />
          <br />
          <Group position="center">
            <Button
              disabled={selectedStatus ? false : true}
              fullWidth
              loading={loading}
              onClick={() => onOrderReply()}
            >
              Yes
            </Button>
            <Button
              fullWidth
              customType="secondary"
              loading={loading}
              onClick={() => {
                setSelectedStatus(undefined);
                setOpened(false);
              }}
            >
              No
            </Button>
          </Group>
        </Modal>
        <Button loading={loading} onClick={() => setOpened(true)}>
          Trigger Order Reply
        </Button>
      </div>
    );
  }
  return <></>;
};
