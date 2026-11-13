import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { WMS } from "../../../GraphQL";
import { Divider, Paper, Stack } from "../../Elements";
import { Group, ScrollArea, Table, Title } from "@mantine/core";

type Props = {
  form: UseFormReturnType<
    {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    },
    (values: {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }) => {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }
  >;
};

export const Summary = ({ form }: Props) => {
  const skuRows = form?.values?.thresholds?.map((element, index) => (
    <tr key={`sku-${index}`}>
      <td>{element?.gtin}</td>
      <td>{element?.sku}</td>
      <td>{element?.value}</td>
    </tr>
  ));

  const recipientsRow = form?.values?.recipients?.map((email, index) => (
    <tr key={`sku-${index}`}>
      <td>{email}</td>
    </tr>
  ));
  return (
    <Paper radius={8}>
      <Stack>
        <Title order={3}>Summary</Title>
        <Divider />
        <Group grow>
          <ScrollArea style={{ height: 300 }}>
            <Paper radius={8}>
              <Title order={4}>Inventory Thresholds</Title>
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>GTIN</th>
                    <th>SKU</th>
                    <th>Threshold</th>
                  </tr>
                </thead>
                <tbody>{skuRows}</tbody>
              </Table>
            </Paper>
          </ScrollArea>
          <ScrollArea style={{ height: 300 }}>
            <Paper radius={8}>
              <Title order={4}>Recipients</Title>
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{recipientsRow}</tbody>
              </Table>
            </Paper>
          </ScrollArea>
        </Group>
      </Stack>
    </Paper>
  );
};
