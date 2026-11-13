import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useStyles } from "../Riders/Users.styles";
import { useQuery } from "@apollo/client";
import { getAdmins } from "../../../GraphQL/UserSchema";
import { WMS } from "../../../GraphQL";
import { Button, Grid, Group, Input } from "../../Elements";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import Create from "./Create";

export const Admins = () => {
  const [userRoles] = useAtom(rolesAtom);
  const [create, setCreate] = useState(false);
  const { data } = useQuery(getAdmins, {
    context: { clientName: "warehouse" },
    variables: {
      channel:
        userRoles.isDirectRetailUser || userRoles.isDirectRetailAdmin
          ? "DIRECT_RETAIL"
          : "ECOMM",
    },
  });
  const [admins, setAdmins] = useState<WMS.Admin[]>([]);
  const [selectedValue, setSelectedValue] = useState("");

  const filterAdmins = (e: string) => {
    setSelectedValue(e);
  };

  useEffect(() => {
    if (data) setAdmins(data.admins.items);
  }, [data]);

  const { classes } = useStyles();

  const onCreateUser = (admin: WMS.Admin) => {
    const list = [...admins];
    list.push(admin);
    setAdmins(list);
    setCreate(false);
  };

  const getDisableCreate = () => {
    if (
      userRoles.isAdminDC ||
      //old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin ||
      userRoles.isDirectRetailAdmin
    )
      return false;
    return true;
  };

  return (
    <div>
      <Create
        onSubmit={onCreateUser}
        visible={create}
        onClose={() => setCreate(false)}
        profile={undefined}
      />
      <Grid align="right">
        <Grid.Col span={6}>
          <Group position="left">
            <Input
              className={classes.searchInput}
              icon={<Search />}
              placeholder="Search by username/name"
              onChange={(e) => filterAdmins(e.target.value)}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <Button
              disabled={getDisableCreate()}
              icon={<Plus />}
              onClick={() => setCreate(true)}
            >
              Create User
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <br />
      <List
        users={admins?.filter((text) => {
          if (selectedValue == undefined) return admins;
          return (
            text?.username
              ?.toLowerCase()
              .includes(selectedValue?.toLowerCase()) ||
            text?.name?.toLowerCase().includes(selectedValue?.toLowerCase())
          );
        })}
      />
    </div>
  );
};
