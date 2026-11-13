import React from "react";
import { ArrowBack } from "tabler-icons-react";
import { Accordion } from "../../Elements/Accordion";
import { Button } from "../../Elements/Button";
import { Divider } from "../../Elements/Divider";
import { Group } from "../../Elements/Group";
import { Table } from "../../Elements/Table";
import { useStyles } from "./RiderMap.styles";

type Props = {
  onBack: () => void;
};

export const RiderDetails = (props: Props) => {
  const { classes } = useStyles();
  const data = [
    {
      item: "TEST ITEM",
      quantity: 1,
    },
  ];
  const rows = data.map((e: { [key: string]: any }, index: number) => (
    <tr key={`item-${index}`}>
      <td>{e.item}</td>
      <td>{e.quantity}</td>
    </tr>
  ));

  return (
    <div>
      <div>
        <Group position="apart">
          <h3>Rider Name</h3>
          <Button onClick={() => props.onBack()} icon={<ArrowBack />}>
            Back
          </Button>
        </Group>
        <p>Contact Number:</p>
        <p>Code:</p>
        <p>Status:</p>
        <Divider />
        <h3>Current Delivery</h3>
        <p>Order ID:</p>
        <p>Status:</p>
        <p>Date:</p>
        <p>Area:</p>
        <Table highlightOnHover fontSize={"xs"}>
          <thead>
            <tr>
              <th>Item(s)</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Divider />
        <h3>Deliveries</h3>
        <div className={classes.deliveryContainer}>
          <Accordion>
            <Accordion.Item value="1">
              <Accordion.Control>ORDER ID</Accordion.Control>
              <Accordion.Panel>
                <Group grow>
                  <p>Date:</p>
                  <p>Area:</p>
                </Group>

                <Table highlightOnHover fontSize={"xs"}>
                  <thead>
                    <tr>
                      <th>Item(s)</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default RiderDetails;
