import React, { useState } from "react";
import router from "next/router";
import { useStyles } from "./FomLogs.styles";
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
import { DirectIndirectAdminForm } from "../../Create/DirectIndirectAdminForm";

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
      default:
        return <Badge color="orange">{`INVALID ROLE - ${role}`}</Badge>;
    }
  };
  const rows = props.users?.map((element, index) => (
    <tr
      key={`user-${index}`}
      onClick={() =>
        router.push(
          `/users/FomProfile/Profile/?userId=${element.username}`
        )
      }
    >
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>
        {element.channel === "DIRECT_RETAIL" ? (
          <div style={{ width: 200 }}>
            {(element?.office_ids || [])?.length > 3 ? (
              <SimpleGrid spacing={1} verticalSpacing={1} cols={3}>
                <Badge fullWidth size="xs" key="m2ore">
                  {element.office_ids ? element.office_ids[0] : ""}
                </Badge>
                <Badge fullWidth size="xs" key="2more">
                  {element.office_ids ? element.office_ids[1] : ""}
                </Badge>
                <Tooltip
                  position="right"
                  arrowPosition="side"
                  label={
                    <Stack spacing={5}>
                      {element?.office_ids
                        ?.filter((e, index) => index > 1)
                        .map((e) => (
                          <Badge fullWidth size="xs" key={e}>
                            {e}
                          </Badge>
                        ))}
                    </Stack>
                  }
                >
                  <div>
                    <Badge fullWidth size="xs" key="mo3re">
                      +{(element.office_ids?.length || 0) - 2} more
                    </Badge>
                  </div>
                </Tooltip>
              </SimpleGrid>
            ) : (
              <SimpleGrid spacing={1} verticalSpacing={1} cols={3}>
                {element?.office_ids?.map((office) => (
                  <Badge fullWidth size="xs" key={office}>
                    {office}
                  </Badge>
                ))}
              </SimpleGrid>
            )}
          </div>
        ) : (
          element.office_name
        )}
      </td>
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
    </tr>
  ));

  const onCloseAction = () => {
    setSelectedAction({ user: undefined, type: undefined });
  };
  return (
    <div className={classes.tableContainer}>
      <DirectIndirectAdminForm
        profile={selectedAction.user}
        visible={selectedAction.type === "EDIT"}
        onClose={onCloseAction}
        channel={
          router.route.includes("/users/direct")
            ? "DIRECT_RETAIL"
            : "INDIRECT_CHANNEL"
        }
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
              <th>Sales Office</th>
              <th>Contact No.</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
