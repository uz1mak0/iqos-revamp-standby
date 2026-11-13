import React, { useState } from "react";
import { ScheduleLogs } from "../../../GraphQL/_gql/crm/graphql";
import { Button, Modal, ScrollArea, Table } from "../../Elements";

type Props = {
  logs: ScheduleLogs[];
};

export const HypercareScheduleLogs = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const rows = props.logs?.map((item, index) => (
    <tr key={`list-${index}`}>
      <td>{item.type}</td>
      <td>{item.reason}</td>
      <td>{item.date}</td>
      <td>{item.time}</td>
    </tr>
  ));

  return (
    <div>
      <Modal
        size={1000}
        centered
        opened={visible}
        onClose={() => setVisible(false)}
        title="Schedule Logs"
      >
        <ScrollArea style={{ height: 300 }}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reason For Schedule</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Modal>
      <Button onClick={() => setVisible(true)}>Schedule Logs</Button>
    </div>
  );
};
