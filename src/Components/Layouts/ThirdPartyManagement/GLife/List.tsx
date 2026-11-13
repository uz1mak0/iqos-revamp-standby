import React, { useState } from "react";
import { Table, Button, ScrollArea } from "../../../Elements";
import { GLifeOrderDetails } from "./GLifeOrderDetails";
import { GLIFE } from "../../../../GraphQL";
import { useStyles } from "../ThirdPartyManagement.styles";
import dayjs from "dayjs";
import { useRouter } from "next/router";

type Props = {
  list?: GLIFE.Order[];
  onUpdateList: (order: GLIFE.Order | string) => void;
};

export const List = (props: Props) => {
  const [opened, setOpened] = useState(false);
  const [orderProfile, setOrderProfile] = useState<GLIFE.Order | undefined>();
  const { classes } = useStyles();
  const router = useRouter();

  const onUpdate = (order: GLIFE.Order | string) => {
    setOpened(false);
    props.onUpdateList(order);
  };

  const rows = props.list?.map((e: GLIFE.Order, index: number) => (
    <tr
      onClick={() => {
        setOpened(true);
        setOrderProfile(e);
      }}
      key={`user-${index}`}
    >
      <td>{e?.id}</td>
      <td>{e?.name}</td>
      <td>
        {dayjs(Number((e?.date_created || 0) * 1000)).format(
          "MMM DD, YYYY hh:mm A",
        )}
      </td>
      <td>{e?.address?.contact_no}</td>
      <td>
        {e?.ecom_order ? (
          <Button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              router.push(
                `/order-management/order-details/orderID/?orderID=${e?.ecom_order}`,
              );
            }}
          >
            {e?.ecom_order}
          </Button>
        ) : undefined}
      </td>
      <td>{e?.tracking?.order_status}</td>
      <td>{e?.status}</td>
    </tr>
  ));

  return (
    <div>
      <GLifeOrderDetails
        onUpdateOrder={onUpdate}
        opened={opened}
        onClose={() => setOpened(false)}
        profile={orderProfile}
      />
      <ScrollArea style={{ height: 700 }}>
        <h2>GLife Orders</h2>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Date Created</th>
              <th>Contact Number</th>
              <th>Ecom Order Number</th>
              <th>Ecom Order Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
