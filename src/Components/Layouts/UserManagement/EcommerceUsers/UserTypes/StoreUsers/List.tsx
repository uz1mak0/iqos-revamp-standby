import React, { useEffect, useState } from "react";
import router from "next/router";
import { STORE } from "../../../../../../GraphQL";
import { Table } from "../../../../../Elements";
import { useStyles } from "./StoreUsers.styles";
import ResetPassword from "../../../../../Modules/Users/Reset";
import { StoreUserActions } from "../../../Actions/StoreUsersActions";
import { ResetUserPassword } from "../../../Actions/ResetUserPassword";
import { StoreUserForm } from "../../Create/StoreUserForm";

type Props = {
  users: STORE.StoreUser[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();

  const [selectedAction, setSelectedAction] = useState<{
    user: STORE.StoreUser | undefined;
    type: string | undefined;
  }>({
    user: undefined,
    type: undefined,
  });

  const rows = props.users?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>{element.phone_number}</td>
      <td>{element.email}</td>
      <td>{element.roles?.toString() || ""}</td>
      <td>
        <StoreUserActions
          user={element}
          onSelectAction={(user, type) => setSelectedAction({ user, type })}
        />
      </td>
    </tr>
  ));

  const onCloseAction = () => {
    setSelectedAction({ user: undefined, type: undefined });
  };

  return (
    <>
      <div>
        <StoreUserForm
          visible={selectedAction.type === "EDIT"}
          onClose={onCloseAction}
          profile={selectedAction.user}
        />
        <ResetUserPassword
          visible={selectedAction.type === "RESET"}
          onClose={onCloseAction}
          profile={selectedAction.user}
        />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </>
  );
};
