import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCustomerTrial } from "../../../GraphQL/CRMSchema";
import { Trial } from "../../../GraphQL/_gql/crm/graphql";
import { Grid, Paper, ScrollArea, Table } from "../../Elements";
import { HypercareOrders } from "../../Modules/CRM/Config";
import { IFormInput } from "../CRMTrials/Create/Create";
import { useStyles } from "../CRMTrials/crmtrials.styles";

type Props = {
  variants: HypercareOrders[];
  trial: Trial | undefined;
};

export const ConsumerTrialDetails = (props: Props) => {
  const { classes } = useStyles();
  const router = useRouter();

  const rows = props.variants.map((item, index) => (
    <tr key={`list-${index}`}>
      <td>{item.sku}</td>
      <td>{item.variant}</td>
      <td>{item.description}</td>
      <td>{item.uom}</td>
      <td>{item.quantity}</td>
    </tr>
  ));

  const displayView = (description: string, value: string) => {
    return (
      <div>
        <p className={classes.notEditableDescription}>{description}</p>
        <p className={classes.notEditableValue}>{value}</p>
      </div>
    );
  };

  return (
    <div>
      <Paper radius={10}>
        <h3>Consumer Details</h3>
        <Grid justify="start">
          <Grid.Col span={4}>
            {displayView(
              "Consumer Name",
              `${props.trial?.first_name} ${props.trial?.last_name}`,
            )}
            {displayView("Contact No.", `${props.trial?.contact_no}`)}
          </Grid.Col>
          <Grid.Col span={4}>
            {displayView("Birthday", `${props.trial?.date_of_birth}`)}
            {displayView(
              "Primary Nicotine",
              `${props.trial?.primary_nicotine_product}`,
            )}
          </Grid.Col>
          <Grid.Col span={4}>
            {displayView("Contact No.", `${props.trial?.email}`)}
            {displayView(
              "Registration Channel",
              `${props.trial?.registration_channel}`,
            )}
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper radius={10}>
        <h3>Preferred Zyn Variant</h3>
        <ScrollArea style={{ height: 300 }}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Variant</th>
                <th>Description</th>
                <th>UOM</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </div>
  );
};
