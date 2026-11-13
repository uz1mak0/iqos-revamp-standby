import React from "react";
import { Button, ScrollArea, Table, Text } from "../../Elements";
import { ORDER } from "../../../GraphQL";
import { useRouter } from "next/router";
import {
  formatCustomerAddress,
  formatCustomerName,
} from "../../../Utilities/Formatter";
import { useStyles } from "./FraudChecking.styles";
import dayjs from "dayjs";
import { FraudOrders } from "./FraudChecking";
import { Maybe } from "../../../GraphQL/_gql/order/graphql";
import { FraudListRow } from "./FraudListRow";

type Props = {
  orders: FraudOrders[];
};

export const FraudList = (props: Props) => {
  return (
    <div>
      <h3>List of Orders</h3>
      <ScrollArea style={{ height: 700 }}>
        <Table fontSize={"sm"}>
          <thead>
            <tr>
              <th>Verification Status</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Date of Order</th>
              <th>Promo</th>
              <th>Total Kits</th>
              <th>Total HEETs</th>
              <th>Total Zyn</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <FraudListRow list={props.orders} />
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
