import React from "react";
import { Paper, ScrollArea, Table } from "../../Elements";

export const ConsumerHypercareLogs = () => {
  return (
    <Paper radius={10}>
      <h2>Update Logs</h2>
      <ScrollArea style={{ height: 300 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Guided Trial Schedule</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Assigned Coach</th>
              <th>Datetime</th>
              <th>Last Updated Hypercare</th>
              <th>Last Updated Unresponsive</th>
              <th>Updated By</th>
            </tr>
          </thead>
          <tbody>{/* {rows} */}</tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};
