import React from "react";
import { WMS } from "../../../GraphQL";
import { Group, ScrollArea, Table } from "../../Elements";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "../SalesLogs/Sales.styles";

type Props = {
  line_items: WMS.Maybe<WMS.LineItem>[] | undefined | null;
  total_price?: number | undefined | null;
};

export const CustomerRSItems = (props: Props) => {
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const rows = props.line_items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element?.sku?.gtin}</td>
      <td>{element?.sku?.description}</td>
      <td>{element?.sku?.sku}</td>
      <td>{element?.quantity}</td>
      <td>{element?.sku?.promo?.name}</td>
      <td>{Number(element?.sku?.promo?.discount || 0)}</td>
      <td>{Number(element?.price || 0) * Number(element?.quantity || 0)}</td>
      <td>{element?.inputs || "-"}</td>
    </tr>
  ));

  return (
    <div>
      <ScrollArea scrollbarSize={10}>
        <Table
          highlightOnHover
          fontSize={width <= isTabletMobileView ? "xs" : "md"}
        >
          <thead>
            <tr>
              <th>
                <div className={classes.mobileTableTH}>GTIN</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Name</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>SKU</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Quantity</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Promo</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Discount</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Price</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Serial</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tfoot>
        </Table>
      </ScrollArea>
      <Group position="right">
        <h3 style={{ marginRight: 20 }}>TOTAL: {props.total_price || 0}</h3>
      </Group>
    </div>
  );
};
