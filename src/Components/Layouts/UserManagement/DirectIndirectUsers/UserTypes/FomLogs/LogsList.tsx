import React, { useState } from "react";
import { ScrollArea, Table } from "../../../../../Elements";
import { WMS } from "../../../../../../GraphQL";

type Props = {
  logs: WMS.FOMLogs[] | undefined;
};

export const List = (props: Props) => {
  let rows;

  if (!props.logs || props.logs.length === 0) {
    rows = (
      <tr>
        <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>
          No matching records
        </td>
      </tr>
    );
  } else {
    rows = props.logs.map((element, index) => {
      if (element) {
        return (
          <tr key={`logs-${index}`}>
            <td>{element.se_username}</td>
            <td>{element.from_warehouse?.warehouse_name}</td>
            <td>{element.to_warehouse?.warehouse_name}</td>
            <td>
              {element.date_created
                ? new Date(Number(element.date_created)).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )
                : "-"}
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={`user-${index}`}>
            <td colSpan={4} style={{ textAlign: "center", fontWeight: "bold" }}>
              No matching records
            </td>
          </tr>
        );
      }
    });
  }

  return (
    <ScrollArea style={{ height: 500 }}>
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>Sales Expert</th>
            <th>From Warehouse</th>
            <th>To Warehouse</th>
            <th>Time Stamp</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
};
