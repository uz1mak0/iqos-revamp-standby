import { useQuery } from "@apollo/client";
import { MediaQuery } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Number1, Number2, Number3, Number4 } from "tabler-icons-react";
import {
  delivered,
  inTransit,
  orderPlaced,
  pickUp,
  undeliverable,
} from "../../../../assets/orders";
import { ORDER } from "../../../GraphQL";
import { deliveryTracking } from "../../../GraphQL/OrderManagementSchema";
import {
  Accordion,
  ActionIcon,
  Group,
  Paper,
  Table,
  ScrollArea,
  Button,
  Image,
  Stack,
} from "../../Elements";
import { useStyles } from "./DeliveryTrackingProfile.styles";

export const Profile = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [delivery, setDelivery] = useState<ORDER.DeliveryTracking>();

  const { data, loading } = useQuery(deliveryTracking, {
    context: { clientName: "deliveryTracking" },
    variables: { id: router.query.orderID },
  });

  useEffect(() => {
    if (data) setDelivery(data.deliveryTracking);
    if (!loading && !data.deliveryTracking) router.push(`/delivery-tracking/`);
  }, [data]);

  const rows = () => {
    return delivery?.items?.map((element, index) => (
      <tr key={`items-${index}`}>
        <td>{element?.description}</td>
        <td>{element?.price_per_unit}</td>
        <td>{element?.quantity}</td>
        <td>{element?.total}</td>
      </tr>
    ));
  };

  const orderStatusRows = () => {
    return delivery?.delivery_status_logs?.map((element, index) => (
      <tr key={`order-logs-${index}`}>
        <td>{element?.status}</td>
        <td>{dayjs(element?.status_datetime).format("MMMM DD, YYYY h:m A")}</td>
        <td>{element?.undeliverable ? element.undeliverable.reason : "-"}</td>
        <td>{element?.undeliverable ? element.undeliverable.remarks : "-"}</td>
        <td>{element?.delivered ? element.delivered.customers_id : "-"}</td>
        <td>
          {element?.delivered ? element.delivered.authorized_recipient_id : "-"}
        </td>
        <td>-</td>
      </tr>
    ));
  };

  return (
    <div>
      <Paper radius={8}>
        <h2>Order Status</h2>
        <Paper radius={8}>
          <h3>Order Tracking - {delivery?.id}</h3>
          <p>Status: {delivery?.order_status}</p>
          <p>Payment Type: {delivery?.payment_type}</p>
        </Paper>
      </Paper>
      <Paper radius={8}>
        <h2>Delivery Status </h2>
        <Group align="center" position="center">
          <div className={classes.trackingIconContainer}>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <div className={classes.statusContainer}>
                <Paper
                  noPaper
                  icon={{
                    avatar: <img src={orderPlaced} />,
                    color: delivery?.order_status_logs?.some(
                      (e) =>
                        e?.status === "RECEIVED" || e?.status === "COMPLETED",
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
                    color: delivery?.order_status_logs?.some(
                      (e) =>
                        e?.status === "PROCESSED" || e?.status === "COMPLETED",
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
                    color: delivery?.order_status_logs?.some(
                      (e) =>
                        e?.status === "SHIPPED" || e?.status === "COMPLETED",
                    )
                      ? "#FD9710"
                      : "#868E96",
                    title: "SHIPPED",
                  }}
                />
                <Group spacing={5}>
                  <Paper
                    noPaper
                    icon={{
                      avatar: (
                        <ActionIcon
                          size={"sm"}
                          color={
                            (delivery?.retry_count || 0) >= 2
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
                            (delivery?.retry_count || 0) >= 3
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
                            (delivery?.retry_count || 0) >= 4
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
                <Paper
                  noPaper
                  icon={{
                    avatar: <img src={undeliverable} />,
                    color: delivery?.order_status_logs?.some(
                      (e) => e?.status === "UNDELIVERED",
                    )
                      ? "red"
                      : "#868E96",
                    title: "UNDELIVERED",
                  }}
                />
                <Paper
                  noPaper
                  icon={{
                    avatar: <img src={delivered} />,
                    color: delivery?.order_status_logs?.some(
                      (e) => e?.status === "COMPLETED",
                    )
                      ? "#61B765"
                      : "#868E96",
                    title: "COMPLETED",
                  }}
                />
              </div>
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Accordion defaultValue="customization">
                <Accordion.Item value="customization">
                  <Accordion.Control>Delivery Details</Accordion.Control>
                  <Accordion.Panel>
                    <Button
                      icon={<Image width={30} src={orderPlaced} />}
                      customType="custom"
                      color={
                        delivery?.order_status_logs?.some(
                          (e) =>
                            e?.status === "RECEIVED" ||
                            e?.status === "COMPLETED",
                        )
                          ? "violet"
                          : "gray"
                      }
                      size="xl"
                      fullWidth
                    >
                      RECEIVED
                    </Button>
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Button
                      icon={<Image width={30} src={pickUp} />}
                      customType="custom"
                      color={
                        delivery?.order_status_logs?.some(
                          (e) =>
                            e?.status === "PROCESSED" ||
                            e?.status === "COMPLETED",
                        )
                          ? "cyan"
                          : "gray"
                      }
                      size="xl"
                      fullWidth
                    >
                      PROCESSED
                    </Button>
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Button
                      icon={<Image width={30} src={inTransit} />}
                      customType="custom"
                      color={
                        delivery?.order_status_logs?.some(
                          (e) =>
                            e?.status === "SHIPPED" ||
                            e?.status === "COMPLETED",
                        )
                          ? "yellow"
                          : "gray"
                      }
                      size="xl"
                      fullWidth
                    >
                      SHIPPED
                    </Button>
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Group spacing={2} position="center">
                      <Paper
                        noPaper
                        icon={{
                          avatar: (
                            <ActionIcon
                              size={"sm"}
                              color={
                                (delivery?.retry_count || 0) >= 2
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
                                (delivery?.retry_count || 0) >= 3
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
                                (delivery?.retry_count || 0) >= 4
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
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Button
                      icon={<Image width={30} src={undeliverable} />}
                      customType="custom"
                      color={
                        delivery?.order_status_logs?.some(
                          (e) => e?.status === "UNDELIVERED",
                        )
                          ? "red"
                          : "gray"
                      }
                      size="xl"
                      fullWidth
                    >
                      UNDELIVERED
                    </Button>
                  </Accordion.Panel>
                  <Accordion.Panel>
                    <Button
                      icon={<Image width={30} src={delivered} />}
                      customType="custom"
                      color={
                        delivery?.order_status_logs?.some(
                          (e) => e?.status === "COMPLETED",
                        )
                          ? "green"
                          : "gray"
                      }
                      size="xl"
                      fullWidth
                    >
                      COMPLETED
                    </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </MediaQuery>
          </div>
        </Group>
      </Paper>
      <Paper radius={8}>
        <h2>Items</h2>
        <div className={classes.desktopView}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>{`Total: ${delivery?.items?.reduce(
                  (acc, curr) => acc + curr?.total!,
                  0,
                )}`}</th>
              </tr>
            </tfoot>
          </Table>
        </div>
        <div className={classes.mobileView}>
          <ScrollArea style={{ maxHeight: 500 }}>
            <Accordion multiple={true}>
              {delivery?.items?.map((element, index) => (
                <Accordion.Item key={`items-${index}`} value={`items-${index}`}>
                  <Accordion.Control>{element?.description}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack spacing={"xs"}>
                      <p style={{ margin: 0 }}>
                        Price: {element?.price_per_unit}
                      </p>
                      <p style={{ margin: 0 }}>Quantity: {element?.quantity}</p>
                      <p style={{ margin: 0 }}>Total: {element?.total}</p>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
          <h3
            style={{ textAlign: "center" }}
          >{`TOTAL: ${delivery?.items?.reduce(
            (acc, curr) => acc + curr?.total!,
            0,
          )}`}</h3>
        </div>
      </Paper>
      <Paper radius={8}>
        <h2>Order Logs</h2>
        <div className={classes.desktopView}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Datetime</th>
                <th>Reason</th>
                <th>Remarks</th>
                <th>Customers ID</th>
                <th>Authorized Recipient ID</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>{orderStatusRows()}</tbody>
          </Table>
        </div>
        <div className={classes.mobileView}>
          <ScrollArea style={{ maxHeight: 500 }}>
            <Accordion multiple={true}>
              {delivery?.delivery_status_logs?.map((element, index) => (
                <Accordion.Item key={`logs-${index}`} value={`logs-${index}`}>
                  <Accordion.Control>{element?.status}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack spacing={"xs"}>
                      <p style={{ margin: 0 }}>
                        Date:{" "}
                        {dayjs(element?.status_datetime).format(
                          "MMMM DD, YYYY",
                        )}
                      </p>
                      <p style={{ margin: 0 }}>
                        Time: {dayjs(element?.status_datetime).format("h:m A")}
                      </p>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </Paper>
    </div>
  );
};
