import React, { useState } from "react";
import router from "next/router";
import { useStyles } from "./Admins.styles";
import { Flex, Tooltip } from "@mantine/core";
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
import { HRForm } from "../../Create/HRForm";

type Props = {
  users: WMS.Admin[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();
  const { directIndirectAdmins, setDirectIndirectAdmins } = useUsersStore();
  const [selectedAction, setSelectedAction] = useState<{
    user: WMS.Admin | undefined;
    type: string | undefined;
  }>({
    user: undefined,
    type: undefined,
  });

  const badgePerRole = (role: WMS.Maybe<WMS.Role>) => {
    switch (role) {
      case WMS.Role.AdminDC:
        return <Badge color="green">{"DC - ADMIN"}</Badge>;
      case WMS.Role.AdminIC:
        return <Badge color="green">{"IC - ADMIN"}</Badge>;
      case WMS.Role.PmftcAdministrator:
        return <Badge>{"PMFTC ADMIN"}</Badge>;
      case WMS.Role.ASM:
        return <Badge>{"ASM"}</Badge>;
      case WMS.Role.StoreManager:
        return <Badge>{"Store Manager/Asst. Store Manager"}</Badge>;
      case WMS.Role.SE:
        return <Badge>{"Sales Expert"}</Badge>;
      case WMS.Role.FOM:
        return <Badge>{"FOM"}</Badge>;
      case WMS.Role.HR:
        return <Badge>{"Human Resource"}</Badge>;
      default:
        return <Badge color="orange">{`INVALID ROLE - ${role}`}</Badge>;
    }
  };
  const rows = props.users?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.username}</td>
      <td>{element.name}</td>

      <td>{element.phone_number}</td>
      <td>{element.email}</td>
      <td>
        <div style={{ width: 250 }}>
          <Flex
            gap="xs"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {element?.roles?.map((roles) => (
              <div key={roles}>{badgePerRole(roles)}</div>
            ))}
          </Flex>
        </div>
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
      <HRForm
        profile={selectedAction.user}
        visible={selectedAction.type === "EDIT"}
        onClose={onCloseAction}
        channel={WMS.ChannelType.HRChannel}
      />
      <ResetUserPassword
        visible={selectedAction.type === "RESET"}
        onClose={onCloseAction}
        profile={selectedAction.user}
      />
      <DisableAdmin
        users={directIndirectAdmins}
        setUsers={setDirectIndirectAdmins}
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
