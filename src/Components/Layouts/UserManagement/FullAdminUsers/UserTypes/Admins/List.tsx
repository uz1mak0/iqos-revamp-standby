import React, { useState } from "react";
import router from "next/router";
import { useStyles } from "./Admins.styles";
import { Tooltip } from "@mantine/core";
import {
  Badge,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
} from "../../../../../Elements";
import { WMS } from "../../../../../../GraphQL";
import { ResetUserPassword } from "../../../Actions/ResetUserPassword";
import { DisableAdmin } from "../../../Actions/DisableAdmin";
import { useUsersStore } from "../../../Store";
import { AdminActions } from "../../../Actions/AdminActions";
import { FullAdminForm } from "../../Create/FullAdminForm";

type Props = {
  users: WMS.Admin[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();
  const { fullAdmins, setFullAdmins } = useUsersStore();
  const [selectedAction, setSelectedAction] = useState<{
    user: WMS.Admin | undefined;
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
      <td>
        <Badge fullWidth size="xs">
          {element.roles?.some((role) =>
            [
              WMS.Role.WHFullAdmin,
              "WHFullAdmin",
              "WarehouseFullAdmin",
            ].includes(role || "")
          )
            ? "Warehouse Full Admin"
            : element.roles?.some((role) =>
                [WMS.Role.SCFullAdmin, "SCFullAdmin", "SupplyChainFullAdmin"].includes(
                  role || "",
                ),
              )
            ? "Supply Chain Full Admin"
            : "Full Admin"}
        </Badge>
      </td>
      <td>
        {
          <Badge
            color={
              element.user_status === WMS.UserStatus.Inactive ? "red" : "teal"
            }
            variant="dot"
          >
            {element.user_status || WMS.UserStatus.Active}
          </Badge>
        }
      </td>
      <td>
        <AdminActions
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
    <div className={classes.tableContainer}>
      <FullAdminForm
        visible={selectedAction.type === "EDIT"}
        onClose={onCloseAction}
        profile={selectedAction.user}
      />
      <ResetUserPassword
        visible={selectedAction.type === "RESET"}
        onClose={onCloseAction}
        profile={selectedAction.user}
      />
      <DisableAdmin
        users={fullAdmins}
        setUsers={setFullAdmins}
        profile={selectedAction.user}
        visible={selectedAction.type === "DISABLE"}
        onClose={onCloseAction}
      />
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
