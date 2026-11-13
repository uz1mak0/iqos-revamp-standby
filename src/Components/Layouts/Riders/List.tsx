import React from "react";
import router from "next/router";
import { ORDER } from "../../../GraphQL";
import { Button, Table } from "../../Elements";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { useStyles } from "./Riders.styles";
import ResetPassword from "../../Modules/Users/Reset";

type Props = {
  users: ORDER.Rider[] | undefined;
};

export const List = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();

  const rows = props.users?.map((element, index) => (
    <tr
      onClick={() =>
        router.push(`/users/riders/profile?userId=${element.username}`)
      }
      key={`user-${index}`}
    >
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>{element.address}</td>
      <td>{element.phone_number}</td>
      <td>{element.user_status}</td>
      <td>
        <ResetPassword username={element.username} />
      </td>
    </tr>
  ));

  return (
    <>
      <div>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Address</th>
              <th>Contact No.</th>
              <th>Status</th>
              <th>Reset</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </>
  );
};
