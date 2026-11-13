import React from "react";
import { CRM } from "../../../GraphQL";
import { Divider, Paper, ScrollArea, Table } from "../../Elements";

type Props = {
  items: CRM.Maybe<CRM.Order>[] | undefined;
};

export const ZynUsedItems = (props: Props) => {
  const rows = props?.items?.map((item, index) => (
    <tr key={`list-${index}`}>
      <td>{item?.sku}</td>
      <td>{item?.variant}</td>
      <td>{item?.description}</td>
      <td>{item?.uom}</td>
      <td>{item?.quantity}</td>
    </tr>
  ));

  return (
    <Paper radius={10}>
      <Divider label={<h2>Zyn Variant Used</h2>} />
      <ScrollArea style={{ height: 250 }}>
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
  );
};
