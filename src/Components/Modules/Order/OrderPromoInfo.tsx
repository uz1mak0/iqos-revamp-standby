import { useMutation } from "@apollo/client";
import React from "react";
import Notification from "../../Elements/Notification/Notification";
import { orderUpdate } from "../../../GraphQL/OrderManagementSchema";
import { Button, Checkbox, Divider, Group, Input, Paper } from "../../Elements";
import { Sku } from "../../../GraphQL/_gql/wms/graphql";
import { ORDER, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  order?: ORDER.Order;
  skus?: WMS.Sku[];
  onUpdate: (order: ORDER.Order) => void;
};
export const OrderPromoInfo = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });
  var heetsInput: number = 0;

  const onPromoVerification = (isVerified: boolean) => {
    updateOrder({
      variables: {
        id: props?.order?.id,
        input: {
          promo: {
            tag: props?.order?.promo?.tag,
            verified: isVerified,
            description: props?.order?.promo?.description,
            heets: props?.order?.promo?.heets,
          },
        },
        order_type: "ORDER",
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.orderUpdate);
        heetsInput = 0;
        Notification.success({ message: "Order Updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onPromoHeets = (value: number) => {
    if (value < 0 || !Number.isInteger(value))
      return Notification.error({ message: "Invalid value" });
    updateOrder({
      variables: {
        id: props?.order?.id,
        input: {
          promo: {
            tag: props?.order?.promo?.tag,
            verified: props?.order?.promo?.verified,
            description: props?.order?.promo?.description,
            heets: value,
          },
        },
        order_type: "ORDER",
      },
    })
      .then((res) => {
        props.onUpdate(res.data?.orderUpdate);
        Notification.success({ message: "Order Updated" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const accessRole = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
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
      <Paper radius={8}>
        <h2>PROMO - {props.order?.promo?.tag}</h2>
        <Paper radius={8}>
          {props.order?.promo?.verified !== undefined ? (
            <div>
              <div>
                <p>PROMO:</p>
                <Checkbox
                  disabled={accessRole()}
                  defaultChecked={props.order?.promo?.verified || false}
                  onChange={(e) => onPromoVerification(e.target.checked)}
                  label="Promo Verified"
                />
                <p>Description: {props.order?.promo?.description}</p>
              </div>
              <Divider />
              <div>
                <p>HEETS:</p>
                <Group>
                  <Input
                    disabled={accessRole()}
                    onChange={(e) => (heetsInput = e.target.value)}
                    defaultValue={props.order?.promo?.heets || 0}
                    type="number"
                  />
                  <Button
                    disabled={accessRole()}
                    onClick={() => onPromoHeets(Number(heetsInput))}
                  >
                    Save
                  </Button>
                </Group>
              </div>
            </div>
          ) : (
            <p>{props.order?.promo?.description}</p>
          )}
        </Paper>
      </Paper>
    </div>
  );
};
