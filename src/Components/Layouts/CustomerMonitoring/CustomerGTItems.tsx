import React from "react";
import { WMS } from "../../../GraphQL";
import { ScrollArea, Table } from "../../Elements";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "../SalesLogs/Sales.styles";
import { isTabletMobileView } from "../../../Utilities/Formatter";

type Props = {
  line_items: WMS.Maybe<WMS.LineItem>[] | undefined | null;
};

export const CustomerGTItems = (props: Props) => {
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const rows = props.line_items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element?.sku?.gtin}</td>
      <td>{element?.sku?.description}</td>
      <td>{element?.sku?.unit_of_measure}</td>
      <td>{element?.quantity}</td>
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
                <div className={classes.mobileTableTH}>UOM</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Quantity</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
