import { useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { ORDER } from "../../../GraphQL";
import {
  assignOrderToRider,
  deliveryFinish,
  deliveryStart,
  orderScanRider,
  removeLogistics,
  updateOrderStatus,
} from "../../../GraphQL/OrderManagementSchema";
import { userAtom } from "../../../Store/StoreAtom";
import { Button, Group, Modal, Paper } from "../../Elements";
import Notification from "../../Elements/Notification/Notification";

type FormProps = {
  notification_message?: string;
  notification_cancel_message?: string;
};

type Props = {
  order?: ORDER.Order;
  onUpdate: (prder: ORDER.Order) => void;
  formValues: FormProps;
};

export const OrderThirdPartyShipment = (props: Props) => {
  const [logisticRemove, { loading: loadingRemoveLogistics }] = useMutation(
    removeLogistics,
    { context: { clientName: "external" } },
  );
  const [assignRider, { loading: loadingAssignRider }] = useMutation(
    assignOrderToRider,
    { context: { clientName: "order" } },
  );
  const [scanRider, { loading: loadingScanRider }] = useMutation(
    orderScanRider,
    { context: { clientName: "order" } },
  );
  const [startDelivery, { loading: loadingStartDelivery }] = useMutation(
    deliveryStart,
    { context: { clientName: "order" } },
  );
  const [finishDelivery, { loading: loadingFinishDelivery }] = useMutation(
    deliveryFinish,
    { context: { clientName: "order" } },
  );
  const [updateStatus, { loading: loadingUpdateStatus }] = useMutation(
    updateOrderStatus,
    { context: { clientName: "order" } },
  );
  const [visible, setVisible] = useState(false);
  const [user] = useAtom(userAtom);

  const progressStatuses = [
    "RECEIVED",
    "PROCESSED",
    "SHIPPED",
    "COMPLETED",
    "UNDELIVERED",
    "CANCELLED",
  ];
  const indexOfDeliveryStatus = progressStatuses.indexOf(
    props?.order?.order_status || "RECEIVED",
  );

  const onRemoveLogistics = () => {
    logisticRemove({
      variables: {
        order_id: props?.order?.id,
      },
    }).then(() => {
      Notification.success({ message: "Shipment Cancelled" });
      props.onUpdate({
        ...props.order,
        assigned_logistics: undefined,
        shipment_type: undefined,
      });
    });
  };

  const onUpdateCancelOrderStatus = () => {
    updateStatus({
      variables: {
        id: props.order?.id,
        order_status: "UNDELIVERED",
        order_type: "ORDER",
      },
    })
      .then((response) => {
        props.onUpdate(response.data.orderStatusUpdate);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onChangeShipmentStatus = (status: string) => {
    function onDeliveryStart() {
      return startDelivery({
        mutation: deliveryStart,
        variables: {
          order_id: props.order?.order_id,
          order_type: "ORDER",
        },
      });
    }
    function onDeliveryFinish() {
      return finishDelivery({
        variables: {
          order_id: props?.order?.order_id,
          rider_id: user?.username,
          order_type: "ORDER",
          status: status == "UNDELIVERED" ? "UNDELIVERABLE" : "DELIVERED",
          input:
            status == "UNDELIVERED"
              ? {
                  undeliverable: {
                    reason:
                      status == "UNDELIVERED"
                        ? "UNDELIVERED_THIRD_PARTY"
                        : undefined,
                    remarks: "cc cancel",
                  },
                }
              : {
                  delivered: {
                    remarks: "cc delivered",
                  },
                },
        },
      }).then((res) => {
        const newOrder = res?.data?.deliveryFinish;
        props.onUpdate(newOrder);
      });
    }

    function onRiderReceive() {
      if (props?.order?.order_status == "SHIPPED") return Promise.resolve();
      return scanRider({
        variables: {
          id: props.order?.id,
          rider_id:
            props.order?.assigned_rider || props?.order?.assigned_logistics,
          order_type: "ORDER",
          notification_message: props.formValues.notification_message,
        },
      });
    }
    return onRiderReceive()
      .then((res) => {
        return onDeliveryStart().catch((e) => {
          if (e.message.indexOf("ConditionalCheckFailed") >= 0) {
            return onDeliveryFinish();
          } else {
            return Promise.reject(e);
          }
        });
      })
      .then(onDeliveryFinish)
      .then((res) =>
        status == "UNDELIVERED" ? onUpdateCancelOrderStatus() : undefined,
      )
      .then((res) => {
        return Notification.success({ message: "Order Cancelled" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <div>
      <br />
      <Modal
        title="Notice"
        centered
        opened={visible}
        onClose={() => setVisible(false)}
      >
        <p>Are you sure to cancel this shipment?</p>
        <Group position="center">
          <Button
            loading={loadingRemoveLogistics}
            onClick={() => setVisible(false)}
          >
            Back
          </Button>
          <Button
            loading={loadingRemoveLogistics}
            onClick={() => onRemoveLogistics()}
            customType="danger"
          >
            Cancel Shipment
          </Button>
        </Group>
      </Modal>
      <Group position="center">
        <Button
          onClick={() => onChangeShipmentStatus("COMPLETED")}
          customType="primary"
        >
          COMPLETED SHIPMENT
        </Button>
        <Button onClick={() => onChangeShipmentStatus("UNDELIVERED")}>
          UNDELIVER
        </Button>
        <Button onClick={() => setVisible(true)} customType="danger">
          CANCEL SHIPMENT
        </Button>
      </Group>
    </div>
  );
};
