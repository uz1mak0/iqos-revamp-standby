import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Check,
  Edit,
  Number1,
  Number2,
  Number3,
  Number4,
} from "tabler-icons-react";
import {
  delivered,
  inTransit,
  orderPlaced,
  pickUp,
  undeliverable,
} from "../../../../assets/orders";
import { ORDER } from "../../../GraphQL";
import {
  orderVerify,
  UpdateSubWarehouseTag,
  UpdateSellerCenterOrderID,
} from "../../../GraphQL/OrderManagementSchema";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Paper,
  TextArea,
  Text,
  DatePicker,
  Select,
  Input,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { useStyles } from "../../Layouts/OrderManagement/OrderManagement.styles";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { OrderReplyTrigger } from "./OrderReplyTrigger";

type Props = {
  editable?: boolean;
  isPack?: boolean;
  order?: ORDER.Order;
  subWarehouseTags?: any;
};
export const OrderTrackingInfo = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const router = useRouter();
  const { classes } = useStyles();
  const [edit, setEdit] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [sellerCenter, setSellerCenter] = useState(
    props.order?.seller_center_order_id ?? ""
  );

  const [onOrderVerify, { loading }] = useMutation(orderVerify, {
    context: { clientName: "order" },
  });

  const [updateTag, { data, loading: tagLoading, error }] = useMutation(
    UpdateSubWarehouseTag,
    {
      context: { clientName: "order" },
    }
  );

  const [
    updateSellerCenter,
    { data: SellerData, loading: SellerLoading, error: errorSeller },
  ] = useMutation(UpdateSellerCenterOrderID, {
    context: { clientName: "order" },
  });

  useEffect(() => {
    setSellerCenter(props.order?.seller_center_order_id ?? "");
  }, [props.order?.seller_center_order_id]);

  const onSubmitUpdateNotes = () => {
    onOrderVerify({
      variables: {
        id: router.query.orderID,
        note: notesInput,
      },
      onCompleted: () => {
        Notification.success({
          title: "Notes",
          message: "Successfully Updated",
        });
        setEdit(false);
        setNotesInput("");
      },
      onError: console.error,
    });
  };

  const accessRole = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isPacker ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      //old roles
      userRoles.isAdmin 
    ) {
      return false;
    } else {
      return true;
    }
  };

  const orderTrackingDisplay = () => (
    <>
      <p>Assigned Hub: {props.order?.assigned_hub || "No assigned hub"}</p>
      <p>Rider: {props.order?.assigned_rider || "No assigned rider"}</p>
      <h3>Delivery Status - {props.order?.delivery_status || ""}</h3>
      <p>Delivery Fee: {props.order?.delivery_fee || 0} </p>
      <Group align="center" position="center">
        <div className={classes.trackingIconContainer}>
          <div className={classes.statusContainer}>
            <Paper
              noPaper
              icon={{
                avatar: <img src={orderPlaced} />,
                color: props.order?.order_status_logs?.some(
                  (e) => e?.status === "RECEIVED" || e?.status === "COMPLETED"
                )
                  ? "#A23DB6"
                  : "#868E96",
                title: "RECEIVED",
              }}
            />
            <Paper
              noPaper
              icon={{
                avatar: <img src={pickUp} />,
                color: props.order?.order_status_logs?.some(
                  (e) => e?.status === "PROCESSED" || e?.status === "COMPLETED"
                )
                  ? "#0EB6CA"
                  : "#868E96",
                title: "PROCESSED",
              }}
            />
            <Paper
              noPaper
              icon={{
                avatar: <img src={inTransit} />,
                color: props.order?.order_status_logs?.some(
                  (e) => e?.status === "SHIPPED" || e?.status === "COMPLETED"
                )
                  ? "#FD9710"
                  : "#868E96",
                title: "SHIPPED",
              }}
            />
            {props.order?.assigned_warehouse === "RS50" ? (
              <Paper
                noPaper
                icon={{
                  avatar: (
                    <ActionIcon
                      size={"sm"}
                      color={props?.order?.retry_count ? "yellow" : undefined}
                      variant="filled"
                    >
                      <p>{props?.order?.retry_count || 0}</p>
                    </ActionIcon>
                  ),

                  color: props.order.retry_count ? "yellow" : "transparent",
                  title: "TRY COUNT",
                }}
              />
            ) : (
              <Group spacing={5}>
                <Paper
                  noPaper
                  icon={{
                    avatar: (
                      <ActionIcon
                        size={"sm"}
                        color={
                          (props?.order?.retry_count || 0) >= 2
                            ? "yellow"
                            : undefined
                        }
                        variant="filled"
                      >
                        <Number2 />
                      </ActionIcon>
                    ),
                    color: "transparent",
                    title: "asdasd",
                  }}
                />
                <Paper
                  noPaper
                  icon={{
                    avatar: (
                      <ActionIcon
                        size={"sm"}
                        color={
                          (props?.order?.retry_count || 0) >= 3
                            ? "yellow"
                            : undefined
                        }
                        variant="filled"
                      >
                        <Number3 />
                      </ActionIcon>
                    ),
                    color: "transparent",
                    title: "asdad",
                  }}
                />
                <Paper
                  noPaper
                  icon={{
                    avatar: (
                      <ActionIcon
                        size={"sm"}
                        color={
                          (props?.order?.retry_count || 0) >= 4
                            ? "yellow"
                            : undefined
                        }
                        variant="filled"
                      >
                        <Number4 />
                      </ActionIcon>
                    ),
                    color: "transparent",
                    title: "asdad",
                  }}
                />
              </Group>
            )}
            <Paper
              noPaper
              icon={{
                avatar: <img src={undeliverable} />,
                color:
                  props.order?.order_status === "UNDELIVERED" ||
                  (props.order?.order_status_logs?.some(
                    (e) => e?.status === "UNDELIVERED"
                  ) &&
                    props.order?.order_status_logs?.some(
                      (e) => e?.status !== "COMPLETED"
                    ))
                    ? "red"
                    : "#868E96",
                title: "UNDELIVERED",
              }}
            />
            <Paper
              noPaper
              icon={{
                avatar: <img src={delivered} />,
                color:
                  props.order?.order_status_logs?.some(
                    (e) => e?.status === "COMPLETED"
                  ) && props.order.order_status === "COMPLETED"
                    ? "#61B765"
                    : "#868E96",
                title: "COMPLETED",
              }}
            />
          </div>
        </div>
      </Group>
    </>
  );

  const packTrackingDisplay = () => (
    <>
      <h3>Pack Status</h3>
      <Group align="center" position="center">
        <div className={classes.trackingIconContainer}>
          <div className={classes.statusContainer}>
            <Paper
              noPaper
              icon={{
                avatar: <Check />,
                color: "#0EB6CA",
                title: "ORDER PLACED",
              }}
            />
            <Paper
              noPaper
              icon={{
                avatar: <Check />,
                color:
                  props.order?.order_status === "PROCESSED"
                    ? "#FD9710"
                    : "#868E96",
                title: "PACKED",
              }}
            />
          </div>
        </div>
      </Group>
    </>
  );

  const getAWBLink = () => {
    return (
      <>
        AWB -{" "}
        <a
          target="_blank"
          href={`${process.env.NEXT_PUBLIC_AWB_LINK}` + props.order?.awb}
          rel="noreferrer"
        >
          {props.order?.awb}
        </a>
      </>
    );
  };

  const getAgeVerifiedStatus = (
    ageVerifiedStatus: ORDER.Maybe<boolean> | undefined
  ) => {
    if (ageVerifiedStatus === undefined || ageVerifiedStatus === null)
      return (
        <Badge size="lg" color="gray">
          AGE VERIFIED: N/A
        </Badge>
      );
    if (ageVerifiedStatus)
      return (
        <Badge size="lg" color="green">
          AGE VERIFIED: YES
        </Badge>
      );
    return (
      <Badge size="lg" color="red">
        AGE VERIFIED: NO
      </Badge>
    );
  };
  const handleTagChange = async (tag: string | null) => {
    if (!tag || !props.order?.id) return;

    try {
      await updateTag({
        variables: {
          order_id: props.order.id,
          tag,
        },
      });
      Notification.success({
        message: "Sub Warehouse Tag Successfully Updated",
      });
    } catch (err) {
      console.error("Failed to update tag:", err);
      Notification.error({
        message: "Failed to update tag",
      });
    }
  };

  const handleSellerCenterUpdate = async (seller_center: string | null) => {
    if (!seller_center || !props.order?.id) return;

    try {
      await updateSellerCenter({
        variables: {
          order_id: props.order.id,
          seller_center,
        },
      });
      Notification.success({
        message: "Seller Center Order ID Successfully Updated",
      });
    } catch (err) {
      console.error("Failed to update Seller Center Order ID:", err);
      Notification.error({
        message: "Failed to update Seller Center Order ID",
      });
    }
  };

  return (
    <div>
      <Paper radius={8}>
        <Group position="apart">
          <h2>
            Order Status - {props?.order?.verification_status || "UNVERIFIED"}
          </h2>
          <OrderReplyTrigger order={props.order} />
        </Group>

        <Paper radius={8}>
          <h3>
            Order Tracking - {props?.order?.id}{" "}
            {props?.order?.awb ? getAWBLink() : ""}
          </h3>
          {props.order?.verification_status === "FLAGGED" ||
          props.order?.verification_status === "CANCELLED" ? (
            <p>Reason: {props.order?.verification_reason}</p>
          ) : undefined}

          <p>Notes: {props.order?.note}</p>
          {props.editable ? (
            <>
              {edit ? (
                <div style={{ width: 300 }}>
                  <TextArea
                    minRows={5}
                    placeholder="Enter notes"
                    onChange={(e) => setNotesInput(e.target.value)}
                  />
                  <br />
                  <Group position="center">
                    <Button
                      customType="secondary"
                      onClick={() => {
                        setNotesInput("");
                        setEdit(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={accessRole()}
                      customType="primary"
                      onClick={() => onSubmitUpdateNotes()}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </Group>
                </div>
              ) : (
                <span>
                  <Button
                    disabled={accessRole()}
                    onClick={() => setEdit(true)}
                    icon={<Edit />}
                  >
                    Update Notes
                  </Button>
                </span>
              )}
            </>
          ) : undefined}

          <p>Status: {props?.order?.order_status}</p>
          <p>Payment Type: {props?.order?.payment_type}</p>
          <p>Warehouse: {props.order?.assigned_warehouse}</p>
          <Select
            value={props.order?.sub_warehouse_tag ?? undefined}
            description="Sub Warehouse Tag"
            onChange={(tag) => handleTagChange(tag)}
            disabled={tagLoading}
            data={
              props.subWarehouseTags?.map((tag: string) => ({
                label: tag,
                value: tag,
              })) || []
            }
            placeholder="Select Sub Warehouse Tag"
            style={{ width: "210px", marginBottom: "20px" }}
          />

          <Group>
            <Input
              description="Seller center order id"
              placeholder="Seller center order id"
              value={sellerCenter}
              style={{ width: "210px" }}
              onChange={(e) => setSellerCenter(e.target.value)}
            />
            <Button onClick={() => handleSellerCenterUpdate(sellerCenter)}>
              Save
            </Button>
          </Group>

          <br />

          <span style={{ width: "210px", marginBottom: "20px" }}>
            {getAgeVerifiedStatus(props.order?.hard_age_verified)}
          </span>
          {props.isPack ? packTrackingDisplay() : orderTrackingDisplay()}
        </Paper>
      </Paper>
    </div>
  );
};
