import React from "react";
import router from "next/router";
import { Table } from "../../Elements";
import { WMS } from "../../../GraphQL";

type Props = {
  users: WMS.Coach[];
};

export const List = (props: Props) => {
  const rows = props.users?.map((element: WMS.Coach, index: number) => (
    <tr
      onClick={() =>
        router.push(`/coaches/profile?coachId=${element?.coach_id}`)
      }
      key={`user-${index}`}
    >
      <td>{element?.name}</td>
      <td>{element?.coach_id}</td>
      <td>{element?.phone_number}</td>
      <td>{element?.email}</td>
      <td>{element?.user_status}</td>
    </tr>
  ));

  return (
    <Table highlightOnHover fontSize={"md"}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Coach ID</th>
          <th>Contact</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
