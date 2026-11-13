import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Input, Paper, Image } from "../../Elements";
import { useStyles } from "./DeliveryTracking.styles";
import LogoDark from "../../../../assets/LOGO_DARK.png";
import LogoLight from "../../../../assets/LOGO.png";

import { useLazyQuery } from "@apollo/client";
import { deliveryTracking } from "../../../GraphQL/OrderManagementSchema";
import Notification from "../../Elements/Notification/Notification";
import { useMantineColorScheme } from "@mantine/core";

export const DeliveryTracking = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [findOrder, { data, loading }] = useLazyQuery(deliveryTracking, {
    context: { clientName: "deliveryTracking" },
    variables: { id: router.query.order },
  });
  const { colorScheme } = useMantineColorScheme();

  const form = useForm({
    initialValues: {
      order_number: "",
    },
  });

  console.log(router);

  const onFindOrder = (id: string) => {
    findOrder({
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        if (!data.deliveryTracking) {
          Notification.error({ message: "Order ID not Found" });
          return;
        }
        router.push(`/delivery-tracking/order?orderID=${id}`);
      },
      onError: console.error,
    });
  };

  return (
    <div className={classes.main}>
      <div className={classes.card}>
        <Paper>
          <div className={classes.form}>
            <div className={classes.logo}>
              <Image
                alt="LOGO"
                src={colorScheme === "dark" ? LogoLight : LogoDark}
              />
            </div>
            <h2>Delivery Tracking</h2>
            <form
              onSubmit={form.onSubmit((values) =>
                onFindOrder(values.order_number),
              )}
            >
              <Input
                {...form.getInputProps("order_number")}
                className={classes.input}
                placeholder="Order Number"
                required
                style={{ marginBottom: 15 }}
              />
              <Button type={"submit"} loading={loading} styles={{ width: 300 }}>
                Search
              </Button>
            </form>
          </div>
        </Paper>
      </div>
    </div>
  );
};
