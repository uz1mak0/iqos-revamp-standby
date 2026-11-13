import React, { useEffect, useState } from "react";
import router from "next/router";
import { STORE } from "../../../GraphQL";
import { Table } from "../../Elements";
import { useStyles } from "./StoreUsers.styles";
import ResetPassword from "../../Modules/Users/Reset";

type Props = {
  users: STORE.StoreUser[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();

  const rows = props.users?.map((element, index) => (
    <tr
      onClick={() =>
        router.push(`/users/store-users/profile?userId=${element.username}`)
      }
      key={`user-${index}`}
    >
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>{element.phone_number}</td>
      <td>{element.email}</td>
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
              <th>Contact No.</th>
              <th>Email</th>
              <th>Reset</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </>
  );
};
