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
import { EcommerceAdminForm } from "../../Create/EcommerceAdminForm";

type Props = {
  users: WMS.Admin[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();
  const { ecommerceAdmins, setEcommerceAdmins } = useUsersStore();
  const [selectedAction, setSelectedAction] = useState<{
    user: WMS.Admin | undefined;
    type: string | undefined;
  }>({
    user: undefined,
    type: undefined,
  });

  const badgePerRole = (role: WMS.Maybe<WMS.Role> | undefined) => {
    if (!role) return <></>;
    switch (role) {
      case WMS.Role.EcomAdmin:
      case WMS.Role.AdministratorEC:
        return <Badge color="green">{"ECOMM - ADMIN"}</Badge>;
      case WMS.Role.AdminCSC:
        return <Badge>{"CSC ADMIN"}</Badge>;
      case WMS.Role.Dispatch:
        return <Badge>{"DISPATCH"}</Badge>;
      case WMS.Role.Packer:
        return <Badge>{"PACKER"}</Badge>;
      case WMS.Role.PmftcAdministrator:
        return <Badge>{"PMFTC ADMIN"}</Badge>;
      default:
        return <Badge color="orange">{`INVALID ROLE - ${role}`}</Badge>;
    }
  };

  const rows = props.users?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>{element.office_name}</td>
      <td>{element.phone_number}</td>
      <td>{element.email}</td>
      <td>
        <div style={{ width: 300 }}>
          {(element?.roles?.length || 0) > 3 ? (
            <Flex
              gap="xs"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="wrap"
            >
              {badgePerRole(element?.roles ? element?.roles[0] : undefined)}
              {badgePerRole(element?.roles ? element?.roles[1] : undefined)}
              {badgePerRole(element?.roles ? element?.roles[2] : undefined)}
              <Tooltip
                position="right"
                arrowPosition="side"
                label={
                  <Stack spacing={5}>
                    {element?.roles
                      ?.filter((e, index) => index > 2)
                      .map((e) => badgePerRole(e))}
                  </Stack>
                }
              >
                <div>
                  <Badge size="xs" key="more">
                    +{(element.roles?.length || 0) - 3} more
                  </Badge>
                </div>
              </Tooltip>
            </Flex>
          ) : (
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
          )}
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
      <EcommerceAdminForm
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
        users={ecommerceAdmins}
        setUsers={setEcommerceAdmins}
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
              <th>Sales Office</th>
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
