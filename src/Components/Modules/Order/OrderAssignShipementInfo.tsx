/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Edit } from "tabler-icons-react";
import Notification from "../../Elements/Notification/Notification";
import {
  assignOrderToRider,
  deliveryFinish,
  deliveryStart,
  getRiders,
  orderScanRider,
  updateOrderStatus,
} from "../../../GraphQL/OrderManagementSchema";
import { useForm } from "@mantine/form";
import { isRiderForCancel } from "../../../Utilities/Formatter";
import {
  getCancelSMSType,
  getCustomerSMSType,
  getPaperBagSizes,
  getZynCancelSMSType,
  getZynCustomerSMSType,
  shipmentType,
} from "./Config";
import {
  Button,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
  Switch,
  TextArea,
} from "../../Elements";
import { ORDER, WMS } from "../../../GraphQL";
import { OrderThirdPartyShipment } from "./OrderThirdPartyShipment";
import { openConfirmModal } from "@mantine/modals";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { useAtom } from "jotai";
import { OrderAssignLogistics } from "./OrderAssignLogistics";
import { Loader } from "@mantine/core";

type Props = {
  order?: ORDER.Order;
  onUpdate: (order: ORDER.Order) => void;
  skus?: WMS.Sku[];
};

export const OrderAssignShipementInfo = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const {
    loading: loadingRiders,
    error: errorRiders,
    data: dataRiders,
    refetch: refetchRiders,
  } = useQuery<{ riders: { items: ORDER.Rider[] } }>(getRiders, {
    context: { clientName: "order" },
  });
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
  const [isScanning, setIsScanning] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCheckRider, setIsCheckRider] = useState(false);
  const [isZynOrder, setIsZynOrder] = useState(false);

  const form = useForm({
    initialValues: {
      rider: "",
      shipment_type: "",
      custom_sms_option: "",
      notification_message: "",
      scanned_rider: "",
      change_rider: false,
      cancel_sms_option: "",
      cancel_notification_message: "",
      logistic_partner: "",
      paper_bag_size: "",
      assigned_hub: "",
    },
  });

  useEffect(() => {
    if (props.order) {
      const zynSKUs = props.skus
        ?.filter((e) => e.type === "ZYN")
        .map((e) => e.sku);
      const hasZyn =
        props.order.items?.some((item) => zynSKUs?.includes(`${item?.sku}`)) ||
        false;
      setIsZynOrder(hasZyn);

      form.setValues({
        rider: props.order?.assigned_rider!,
        shipment_type: props.order?.shipment_type || "RIDER",
        custom_sms_option: "IN_TRANSIT",
        notification_message: hasZyn
          ? getZynCustomerSMSType(props.order).find(
              (e) => e.value === "IN_TRANSIT",
            )?.message || ""
          : getCustomerSMSType(props.order).find(
              (e) => e.value === "IN_TRANSIT",
            )?.message || "",
        cancel_sms_option: "IN_TRANSIT",
        cancel_notification_message: hasZyn
          ? getZynCancelSMSType(props.order).find(
              (e) => e.value === "IN_TRANSIT",
            )?.message || ""
          : getCancelSMSType(props.order).find((e) => e.value === "IN_TRANSIT")
              ?.message || "",
        scanned_rider: "",
        logistic_partner: "TWO_GO",
        paper_bag_size: "SMALL",
        assigned_hub: undefined,
        change_rider: false,
      });
    }
  }, [props.order]);

  const onAssignRider = (rider: string) => {
    assignRider({
      variables: {
        id: props?.order?.id,
        rider_id: rider,
        order_type: "ORDER",
        shipment_type: form.values.shipment_type,
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.orderAssignRider);
        Notification.success({ message: "Rider Assigned" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onScanRiderCode = () => {
    const rider = dataRiders?.riders?.items?.find(
      (e) => e?.username === form.values.scanned_rider,
    );
    const isChangeRider =
      isRiderForCancel(props.order) && props.order?.order_status === "PROCESSED"
        ? true
        : form.values.change_rider;
    if (!rider) {
      setIsScanning(false);
      return Notification.error({ message: "Cant find rider" });
    }
    if (form.values.rider !== form.values.scanned_rider && !isChangeRider) {
      setIsScanning(false);
      return Notification.error({ message: "Invalid rider code" });
    }
    scanRider({
      variables: {
        id: props.order?.id,
        rider_id: form.values.scanned_rider,
        order_type: "ORDER",
        notification_message: form.values.notification_message,
        order_status: props.order?.order_status,
      },
    })
      .then((res) => {
        props.onUpdate(res?.data?.orderScanRider);
        form.setValues({
          ...form.values,
          change_rider: false,
        });
        Notification.success({ message: "Scan rider success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
        setIsScanning(false);
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const onCancelOrder = () => {
    if (
      loadingAssignRider ||
      loadingScanRider ||
      loadingStartDelivery ||
      loadingUpdateStatus ||
      loadingFinishDelivery ||
      isCancelling
    )
      return Notification.info({ message: "Processing please wait..." });
    setIsCancelling(true);
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
          order_id: props.order?.order_id,
          rider_id: user.username || "Administrator",
          order_type: "ORDER",
          status: "UNDELIVERABLE",
          input: {
            undeliverable: {
              reason: "AAI_REJECTED",
              remarks: form.values.cancel_sms_option || "cc cancel",
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
          rider_id: props.order?.assigned_rider,
          order_type: "ORDER",
          notification_message:
            isRiderForCancel(props?.order) &&
            props.order?.delivery_status != "UNDELIVERABLE" &&
            (props?.order?.items![0]?.scanned_quantity ||
              props.order?.items![0]?.inventory_items)!
              ? form.values.cancel_notification_message
              : form.values.notification_message,
          order_status: props.order?.order_status,
        },
      });
    }
    return onRiderReceive()
      .then((res) => {
        return onDeliveryStart().catch((e) => {
          if (
            e.message.indexOf("ConditionalCheckFailed") >= 0 ||
            e.message.includes("conditional request failed")
          ) {
            return onDeliveryFinish();
          } else {
            return Promise.reject(e);
          }
        });
      })
      .then(onDeliveryFinish)
      .then((res) => onUpdateCancelOrderStatus())
      .then((res) => {
        setIsCancelling(false);
        return Notification.success({ message: "Order Cancelled" });
      })
      .catch((e) => {
        setIsCancelling(false);
        Notification.error({ message: e.message });
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

  const validate = (item: ORDER.Maybe<ORDER.OrderItem>) => {
    if (item) return item.quantity === item.scanned_quantity;
    return true;
  };

  const getReceiveForm = () => {
    if (props.order?.shipment_type == "COACH") {
      if (props?.order?.order_status == "PROCESSED") {
        return <Button>RELEASED</Button>;
      }
      return "RELEASED";
    } else if (props.order?.shipment_type == "THIRD_PARTY") {
    } else {
      return scanRiderView();
    }
  };

  const getAssignedTo = () => {
    switch (props?.order?.shipment_type) {
      case "RIDER":
        return props?.order?.assigned_rider;
      case "RIDER_MARKETPLACE":
        return props?.order?.assigned_rider;
      case "COACH":
        return props?.order?.assigned_coach;
      case "THIRD_PARTY":
        return props?.order?.assigned_logistics;
      default:
        return props?.order?.assigned_rider;
    }
  };

  const onBeforeScanCode = () => {
    setIsScanning(true);
    setTimeout(() => {
      onScanRiderCode();
    }, 500);
  };

  const checkRider = (rider: string) => {
    if (isRiderForCancel({ assigned_rider: rider })) {
      confirmRiderModal(rider);
    } else {
      onAssignRider(rider);
    }
  };

  const confirmRiderModal = (rider: string) =>
    openConfirmModal({
      title: "Please confirm your action",
      centered: true,
      children: <p>Are you sure to assign this order to Cancel rider?</p>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => onAssignRider(rider),
    });

  const scanRiderView = () => (
    <div>
      {props?.order?.shipment_type == undefined &&
      props?.order?.assigned_rider == undefined ? undefined : props.order
          ?.order_status !== "RECEIVED" &&
        props.order?.shipment_type != "THIRD_PARTY" &&
        props.order?.items?.every((item) => validate(item)) ? (
        <>
          {isRiderForCancel(props.order) &&
          props.order?.order_status === "PROCESSED" ? undefined : (
            <h2>Released to {props.order?.shipment_type}</h2>
          )}
          <Paper radius={8}>
            {isRiderForCancel(props.order) &&
            props.order?.order_status === "PROCESSED" ? (
              <Input
                disabled={isScanning}
                rightSection={isScanning ? <Loader size={20} /> : undefined}
                style={{ width: 400 }}
                {...form.getInputProps("scanned_rider")}
                onKeyPress={(e) =>
                  e.key === "Enter" ? onBeforeScanCode() : undefined
                }
                description="Change Rider"
                placeholder="Enter or scan to change rider code"
              />
            ) : (
              <Group position="apart">
                {form.values.change_rider ? (
                  <Input
                    disabled={isScanning}
                    rightSection={isScanning ? <Loader size={20} /> : undefined}
                    style={{ width: 400 }}
                    {...form.getInputProps("scanned_rider")}
                    onKeyPress={(e) =>
                      e.key === "Enter" ? onBeforeScanCode() : undefined
                    }
                    description="Scan Rider Code"
                    placeholder="Enter or scan to change rider code"
                  />
                ) : (
                  <div></div>
                )}
                <div>
                  <Switch
                    disabled={props.order?.order_status === "PROCESSED"}
                    {...form.getInputProps("change_rider")}
                    checked={form.values.change_rider}
                    offLabel="Edit"
                    size="lg"
                    onLabel="Change Rider"
                  />
                </div>
              </Group>
            )}

            {props.order?.order_status !== "PROCESSED" ? (
              <Group align="start" position="apart">
                <>
                  <div>
                    <h3>Scanned Rider Details</h3>
                    <p>Username: {props.order?.assigned_rider}</p>
                    <p>
                      Name:{" "}
                      {
                        dataRiders?.riders?.items?.find(
                          (e) => e?.username === props.order?.assigned_rider,
                        )?.name
                      }
                    </p>
                    <p>
                      Location:{" "}
                      {
                        dataRiders?.riders?.items?.find(
                          (e) => e?.username === props.order?.assigned_rider,
                        )?.address
                      }
                    </p>
                    <p>
                      Contact No:{" "}
                      {
                        dataRiders?.riders?.items?.find(
                          (e) => e?.username === props.order?.assigned_rider,
                        )?.phone_number
                      }
                    </p>
                    <p>
                      Status:{" "}
                      {
                        dataRiders?.riders?.items?.find(
                          (e) => e?.username === props.order?.assigned_rider,
                        )?.rider_status
                      }
                    </p>
                  </div>
                </>
              </Group>
            ) : undefined}

            {isRiderForCancel(props.order) &&
            props.order.delivery_status != "UNDELIVERABLE" &&
            (props.order?.items[0]?.scanned_quantity ||
              props.order?.items[0]?.inventory_items) ? undefined : props.order
                ?.delivery_status == "READYFORPICKUP" ? (
              <>
                <div style={{ width: 600 }}>
                  <h3>Customer SMS:</h3>
                  <Select
                    {...form.getInputProps("custom_sms_option")}
                    disabled={accessRole()}
                    description="SMS Type"
                    placeholder="Select SMS Type"
                    data={
                      isZynOrder
                        ? getZynCustomerSMSType(props.order).map((sms) => sms)
                        : getCustomerSMSType(props.order).map((sms) => sms)
                    }
                    onChange={(value) => {
                      form.setValues({
                        ...form.values,
                        custom_sms_option: value,
                        notification_message: isZynOrder
                          ? getZynCustomerSMSType(props.order).find(
                              (e) => e.value === value,
                            )?.message || ""
                          : getCustomerSMSType(props.order).find(
                              (e) => e.value === value,
                            )?.message || "",
                      });
                    }}
                  />
                  <br />
                  <TextArea
                    {...form.getInputProps("notification_message")}
                    placeholder="SMS Message"
                    minRows={8}
                  />
                </div>
                <div style={{ width: 600 }}>
                  <h3>Scan Rider to Receive:</h3>
                  <Input
                    {...form.getInputProps("scanned_rider")}
                    disabled={isScanning}
                    rightSection={isScanning ? <Loader size={20} /> : undefined}
                    onKeyPress={(e) =>
                      e.key === "Enter" ? onBeforeScanCode() : undefined
                    }
                    description="Scan Rider Code"
                    placeholder="Enter or Scan Rider Code"
                  />
                </div>
              </>
            ) : undefined}
          </Paper>
        </>
      ) : undefined}
    </div>
  );

  const riderShipment = () => (
    <Select
      {...form.getInputProps("rider")}
      disabled={
        props.order?.assigned_rider ||
        !props.order?.items?.some((e) => e?.scanned_quantity) ||
        accessRole()
          ? true
          : false
      }
      label="Rider"
      placeholder="Select rider"
      searchable
      data={
        dataRiders?.riders?.items?.map((rider) => {
          return {
            label: `${rider?.name}`,
            value: `${rider?.username}`,
          };
        }) || []
      }
      onChange={(rider: string) => checkRider(rider)}
    />
  );

  const shipmentTypeFormView = () => {
    switch (form.values.shipment_type) {
      case "RIDER_MARKETPLACE":
      case "RIDER":
        return riderShipment();
      case "THIRD_PARTY":
        return (
          <OrderAssignLogistics
            order={props?.order}
            onUpdate={(order) => props.onUpdate(order)}
          />
        );
      default:
        break;
    }
  };

  const accessRole = () => {
    if (
      userRoles.isEcommUser ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <LoadingOverlay
        visible={
          loadingAssignRider ||
          loadingScanRider ||
          loadingStartDelivery ||
          loadingUpdateStatus ||
          loadingFinishDelivery ||
          isCancelling
        }
      />
      <Paper radius={8}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <h2>Assign Shipment</h2>
          <Paper radius={8}>
            <Grid>
              <Grid.Col span={4}>
                {props.order?.shipment_type || props.order?.assigned_rider ? (
                  <div>
                    <p>
                      Shipment Type: {props.order?.shipment_type || "RIDER"}
                    </p>
                    <p>Assigned to: {getAssignedTo()}</p>
                  </div>
                ) : (
                  <Select
                    {...form.getInputProps("shipment_type")}
                    label="Shipment Type"
                    placeholder="Select shipment type"
                    disabled={
                      props.order?.shipment_type || accessRole() ? true : false
                    }
                    data={
                      shipmentType
                        .filter((ship) =>
                          props?.order?.order_type === "MANUAL"
                            ? ship.value === "RIDER"
                            : ship,
                        )
                        .map((e) => {
                          return {
                            label: e.label,
                            value: e.value,
                          };
                        }) || []
                    }
                  />
                )}
                {loadingAssignRider ? undefined : shipmentTypeFormView()}
              </Grid.Col>
            </Grid>

            {(props?.order?.items?.some((e) => e?.scanned_quantity) ||
              props?.order?.items?.some((e) => e?.inventory_items)) &&
            props?.order?.shipment_type == "THIRD_PARTY" &&
            props?.order.order_status !== "COMPLETED" &&
            props?.order.order_status !== "UNDELIVERED" ? (
              <OrderThirdPartyShipment
                formValues={{
                  notification_message: form.values?.notification_message,
                  notification_cancel_message:
                    form.values?.cancel_notification_message,
                }}
                order={props.order}
                onUpdate={(order) => props.onUpdate(order)}
              />
            ) : undefined}
          </Paper>
          {isRiderForCancel(props.order) &&
          props.order?.delivery_status != "UNDELIVERABLE" &&
          (props.order?.items![0]?.scanned_quantity ||
            props.order?.items![0]?.inventory_items) ? (
            <>
              <h2>Cancel Order</h2>
              <Paper radius={8}>
                {
                  <>
                    <div style={{ width: 600 }}>
                      <h3>Customer SMS:</h3>
                      <Select
                        {...form.getInputProps("cancel_sms_option")}
                        description="SMS Type"
                        placeholder="Select SMS Type"
                        disabled={accessRole()}
                        data={
                          isZynOrder
                            ? getZynCancelSMSType(props.order).map((sms) => sms)
                            : getCancelSMSType(props.order).map((sms) => sms)
                        }
                        onChange={(value) => {
                          form.setValues({
                            ...form.values,
                            cancel_sms_option: value,
                            cancel_notification_message: isZynOrder
                              ? getZynCancelSMSType(props.order).find(
                                  (e) => e.value === value,
                                )?.message || ""
                              : getCancelSMSType(props.order).find(
                                  (e) => e.value === value,
                                )?.message || "",
                          });
                        }}
                      />
                      <br />
                      <TextArea
                        {...form.getInputProps("cancel_notification_message")}
                        placeholder="SMS Message"
                        minRows={8}
                      />
                    </div>
                    <br />
                    <Button
                      disabled={isCancelling}
                      onClick={() => onCancelOrder()}
                      customType="danger"
                    >
                      Cancel Order
                    </Button>
                  </>
                }
              </Paper>
            </>
          ) : undefined}

          {getReceiveForm()}
        </form>
      </Paper>
    </div>
  );
};
