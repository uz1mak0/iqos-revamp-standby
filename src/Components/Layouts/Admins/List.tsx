import React from "react";
import router from "next/router";
import { Badge, ScrollArea, SimpleGrid, Stack, Table } from "../../Elements";
import { WMS } from "../../../GraphQL";
import { useStyles } from "./Admins.styles";
import { Tooltip } from "@mantine/core";

type Props = {
  users: WMS.Admin[] | undefined;
};

export const List = (props: Props) => {
  const { classes } = useStyles();

  const rows = props.users?.map((element, index) => (
    <tr
      onClick={() =>
        router.push(`/users/admins/profile?userId=${element.username}`)
      }
      key={`user-${index}`}
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
        <div style={{ width: 300 }}>
          {(element?.roles?.length || 0) > 4 ? (
            <SimpleGrid spacing={1} verticalSpacing={1} cols={3}>
              <Badge fullWidth size="xs" key="m2ore">
                {element.roles ? element.roles[0] : ""}
              </Badge>
              <Badge fullWidth size="xs" key="2more">
                {element.roles ? element.roles[1] : ""}
              </Badge>
              <Badge fullWidth size="xs" key="2more">
                {element.roles ? element.roles[2] : ""}
              </Badge>
              <Tooltip
                position="right"
                arrowPosition="side"
                label={
                  <Stack spacing={5}>
                    {element?.roles
                      ?.filter((e, index) => index > 2)
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
                    +{(element.roles?.length || 0) - 3} more
                  </Badge>
                </div>
              </Tooltip>
            </SimpleGrid>
          ) : (
            <SimpleGrid spacing={1} verticalSpacing={1} cols={2}>
              {element?.roles?.map((roles) => (
                <Badge size="xs" fullWidth key={roles}>
                  {roles}
                </Badge>
              ))}
            </SimpleGrid>
          )}
        </div>
      </td>
      <td>{element.user_status}</td>
    </tr>
  ));

  return (
    <div className={classes.tableContainer}>
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
