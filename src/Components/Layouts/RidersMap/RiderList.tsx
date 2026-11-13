import React, { useState } from "react";
import { Refresh, Search } from "tabler-icons-react";
import { ActionIcon } from "../../Elements/ActionIcon";
import { Group } from "../../Elements/Group";
import { Input } from "../../Elements/Input";
import { Table } from "../../Elements/Table";
import RiderDetails from "./RiderDetails";

export const RiderList = () => {
  const [isView, setIsView] = useState(false);
  const data = [
    {
      name: "Rider",
    },
    {
      name: "Rider 1",
    },
    {
      name: "Rider 2",
    },
  ];

  const rows = data.map((e: { [key: string]: any }, index: number) => (
    <tr onClick={() => setIsView(true)} key={`user-${index}`}>
      <td>{e.name}</td>
    </tr>
  ));

  if (isView) return <RiderDetails onBack={() => setIsView(false)} />;
  return (
    <div>
      <Group direction="column" grow>
        <ActionIcon size={"lg"} radius={20} color="blue" variant="filled">
          <Refresh />
        </ActionIcon>
        <Input icon={<Search />} placeholder="Search Rider" />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Rider</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Group>
    </div>
  );
};
