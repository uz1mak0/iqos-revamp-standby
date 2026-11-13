import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useStyles } from "../Riders/Users.styles";
import { useQuery } from "@apollo/client";
import { getSalesExperts } from "../../../GraphQL/UserSchema";
import { WMS } from "../../../GraphQL";
import { Button, Grid, Group, Input } from "../../Elements";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { useRouter } from "next/router";
import Create from "./Create";

export const SalesExpert = () => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();

  const [salesExperts, setSalesExperts] = useState<WMS.SalesExpert[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [create, setCreate] = useState(false);

  const { data } = useQuery(getSalesExperts, {
    context: { clientName: "warehouse" },
  });
  if (!userRoles.isDirectRetailUser) router.push("/");

  const filterAdmins = (e: string) => {
    setSelectedValue(e);
  };

  useEffect(() => {
    if (data) setSalesExperts(data.salesExperts.items);
  }, [data]);

  const onCreate = (user: WMS.SalesExpert) => {
    const updateList = [...salesExperts];
    updateList.push(user);
    setSalesExperts(updateList);
    setCreate(false);
  };

  return (
    <div>
      <Grid align="right">
        <Grid.Col span={6}>
          <Group position="left">
            <Input
              className={classes.searchInput}
              icon={<Search />}
              placeholder="Search by Sales Expert ID/Name"
              onChange={(e) => filterAdmins(e.target.value)}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <Button
              disabled={!userRoles.isDirectRetailAdmin}
              icon={<Plus />}
              onClick={() => setCreate(true)}
            >
              Create Sales Expert
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      {userRoles.isDirectRetailAdmin && (
        <Create
          profile={undefined}
          visible={create}
          onSubmit={onCreate}
          onClose={() => setCreate(false)}
        />
      )}

      <br />
      <List
        roles={userRoles}
        users={salesExperts?.filter((text) => {
          if (selectedValue == undefined) return salesExperts;
          return (
            text?.name?.toLowerCase().includes(selectedValue?.toLowerCase()) ||
            text?.sales_expert_id
              ?.toLowerCase()
              .includes(selectedValue?.toLowerCase())
          );
        })}
      />
    </div>
  );
};
