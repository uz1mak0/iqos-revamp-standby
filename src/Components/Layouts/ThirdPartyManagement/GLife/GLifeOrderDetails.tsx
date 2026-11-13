import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Check, QuestionMark, X } from "tabler-icons-react";
import { GLIFE } from "../../../../GraphQL";
import {
  cancelGLifeOrder,
  updateGLifeOrder,
} from "../../../../GraphQL/ThirdPartySchema";
import { ActionIcon, Grid, LoadingOverlay, Popover } from "../../../Elements";
import { Button } from "../../../Elements/Button";
import { Group } from "../../../Elements/Group";
import { Input } from "../../../Elements/Input";
import { Modal } from "../../../Elements/Modal";
import Notification from "../../../Elements/Notification/Notification";
import { Select } from "../../../Elements/Select";
import { Table } from "../../../Elements/Table";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../Store/StoreAtom";

type Props = {
  opened: boolean;
  onClose: () => void;
  profile: GLIFE.Order | undefined;
  onUpdateOrder: (order: GLIFE.Order | string) => void;
};

export const GLifeOrderDetails = ({ profile, ...props }: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [selectedStatus, setSelectedStatus] = useState<
    string | undefined | null
  >(profile?.status);
  const [ecomOrderValue, setEcomOrderValue] = useState<number>();
  const [opened, setOpened] = useState<boolean>(false);

  const [onCancelGlifeOrder, { loading }] = useMutation(cancelGLifeOrder, {
    context: { clientName: "glife" },
  });
  const [onUpdatelGlifeOrder, { loading: updateLoading }] = useMutation(
    updateGLifeOrder,
    { context: { clientName: "glife" } }
  );

  useEffect(() => {
    if (profile?.status) {
      setSelectedStatus(profile.status);
    }
  }, [profile?.status]);
  const status = [
    {
      label: "PENDING",
      value: "PENDING",
    },
    {
      label: "VERIFIED",
      value: "VERIFIED",
    },
    {
      label: "CANCELLED",
      value: "CANCELLED",
    },
  ];

  const rows = profile?.cart?.items?.map(
    (e: GLIFE.Maybe<GLIFE.CartItem>, index: number) => (
      <tr key={`list-${index}`}>
        <td>{e?.sku}</td>
        <td>{e?.description}</td>
        <td>{e?.quantity}</td>
        <td>{e?.discount || 0}</td>
        <td>
          <Group>
            <span>{Number(e?.amount || 0) - Number(e?.discount || 0)}</span>
            <Popover position="right">
              <Popover.Target>
                <div>
                  <ActionIcon size={"sm"} variant="filled">
                    <QuestionMark />
                  </ActionIcon>
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <div>
                  <h4>Amount Breakdown</h4>
                  <p>Original Amount: {e?.amount || 0}</p>
                  <p>Discount Amount: {e?.discount || 0}</p>
                  <p>
                    Final Amount:{" "}
                    {Number(e?.amount || 0) - Number(e?.discount || 0)}
                  </p>
                </div>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </td>
      </tr>
    )
  );

  // const onCompletedData = (message: string) => {
  //     return {
  //         onCompleted: () => {
  //             Notification.success({ title: "Order Status", message: message })
  //         },
  //         onError: () =>  Notification.error({message: message})
  //     }
  // }

  const onSave = () => {
    if (selectedStatus == "VERIFIED" && !ecomOrderValue)
      return Notification.error({
        title: "Input Error",
        message: "Please add Ecom Order Number!",
      });

    if (selectedStatus == "CANCELLED") {
      return onCancelGlifeOrder({
        variables: {
          order_id: profile?.id,
          total_amount: profile?.total_amount,
          payment_id: profile?.payment_id,
        },
        // ...onCompletedData("Cancelled Order")
      })
        .then(() => {
          props.onUpdateOrder("CANCELLED");
          Notification.success({ message: "Order Updated" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }

    return onUpdatelGlifeOrder({
      variables: {
        status: !selectedStatus ? profile?.status : selectedStatus,
        order_id: profile?.id,
        ecom_order: ecomOrderValue,
      },
      // ...onCompletedData("Update Order")
    })
      .then((res) => {
        props.onUpdateOrder(res.data.orderUpdate);
        Notification.success({ message: "Order Updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onCancelOrder = () => {
    onCancelGlifeOrder({
      variables: {
        order_id: profile?.id,
        total_amount: profile?.total_amount,
        payment_id: profile?.payment_id,
      },
    })
      .then(() => {
        props.onUpdateOrder("CANCELLED");
        Notification.success({ message: "Order Updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const accessRole = () => {
    if (
      userRoles.isAdminDC ||
      //old roles
      userRoles.isAdmin
    ) {
      return false;
    } else {
      return true;
    }
  };

  const footer = () => {
    switch (profile?.status) {
      case "PENDING":
        return (
          <>
            <Select
              placeholder="Select Status"
              onChange={(e) => setSelectedStatus(e)}
              defaultValue={profile?.status}
              data={status}
              disabled={profile?.status != "PENDING" || accessRole()}
            />
            {selectedStatus == "VERIFIED" ? (
              <Input
                disabled={accessRole()}
                onChange={(e) => setEcomOrderValue(e.target.value)}
                placeholder="Enter Ecom Order ID"
              />
            ) : undefined}
            <Button
              customType="primary"
              onClick={() => onSave()}
              disabled={profile?.status != "PENDING" || accessRole()}
            >
              Save
            </Button>
          </>
        );
      case "VERIFIED":
        return (
          <>
            {profile?.tracking?.order_status === "UNDELIVERED" ? (
              <Button
                disabled={accessRole()}
                customType="danger"
                onClick={() => setOpened(true)}
              >
                CANCEL ORDER
              </Button>
            ) : undefined}
          </>
        );
      default:
        return;
    }
  };

  const totalAmountView = () => (
    <Group>
      <p>Total Amount: {Number(profile?.total_amount || 0) || "N/A"}</p>
      <Popover position="right">
        <Popover.Target>
          <div>
            <ActionIcon size={"sm"} variant="filled">
              <QuestionMark />
            </ActionIcon>
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <div>
            <h4>Amount Breakdown</h4>
            <p>
              Original Amount:{" "}
              {(profile?.total_amount || 0) + (profile?.discount || 0)}
            </p>
            <p>Discount Amount: {profile?.discount}</p>
            <p>Final Amount: {Number(profile?.total_amount || 0)}</p>
          </div>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );

  return (
    <div>
      <Modal
        zIndex={1000}
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        removeCloseButton={true}
        centered
      >
        <p>Are you sure you want to cancel?</p>
        <Group position="center">
          <Button customType="secondary" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button customType="danger" onClick={() => onCancelOrder()}>
            Confirm
          </Button>
        </Group>
      </Modal>
      <Modal
        title="Order Details"
        centered
        size={1000}
        onClose={() => {
          props.onClose();
          setSelectedStatus(profile?.status);
        }}
        opened={props.opened}
      >
        <LoadingOverlay visible={loading || updateLoading} />
        <Grid>
          <Grid.Col span={8}>
            <p>Order ID: {profile?.id || "N/A"}</p>
            <p>DCE ID: {profile?.dce_id || "N/A"}</p>
            <p>Name: {profile?.name || "N/A"}</p>
            <p>Contact No: {profile?.address?.contact_no || "N/A"}</p>
            <p>Email: {profile?.address?.email || "N/A"}</p>
            <p>
              Address: {profile?.address?.street}{" "}
              {profile?.address?.address_extension} {profile?.address?.city}{" "}
              {profile?.address?.region}
            </p>
            <p>
              Birthday:{" "}
              {dayjs(profile?.address?.birthday).format("MMM-DD-YYYY")}
            </p>
            <p>Channel: {profile?.channel || "N/A"}</p>
            <p>Payment Type: {profile?.cart?.payment_type || "N/A"}</p>
          </Grid.Col>
          <Grid.Col span={4}>
            <p>Status: {profile?.status || "N/A"}</p>
            <p>Ecom Order Number: {profile?.ecom_order || "N/A"}</p>
            <p>
              Data Privacy: {profile?.tickers?.data_privacy ? <Check /> : <X />}
            </p>
            <p>Marketing: {profile?.tickers?.marketing ? <Check /> : <X />}</p>
            <p>
              Terms & Conditions:{" "}
              {profile?.tickers?.terms_and_conditions ? <Check /> : <X />}
            </p>
            <p>Promo Code: {profile?.promo_code || "N/A"}</p>
            <p>Discount: {profile?.discount || "N/A"}</p>
            {totalAmountView()}
          </Grid.Col>
        </Grid>

        <br />
        <h3>Cart</h3>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <br />
        <Group position="center">{footer()}</Group>
      </Modal>
    </div>
  );
};
