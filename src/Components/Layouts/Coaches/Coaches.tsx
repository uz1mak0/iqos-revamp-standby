import React, { useEffect, useState } from "react";
import { Button, Grid, Group, LoadingOverlay } from "../../Elements";
import { List } from "./List";
import { Plus } from "tabler-icons-react";
import Create from "./Create";
import { useQuery } from "@apollo/client";
import { getCoaches } from "../../../GraphQL/CoachesSchema";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const Coaches = () => {
  const [userRoles] = useAtom(rolesAtom);
  const { loading, error, data, refetch } = useQuery(getCoaches, {
    context: { clientName: "warehouse" },
  });
  const [create, setCreate] = useState<boolean>(false);
  const [coaches, setCoaches] = useState<WMS.Coach[]>([]);

  useEffect(() => {
    if (data) setCoaches(data.coaches.items);
  }, [data]);

  const onCreateCoach = (coach: WMS.Coach) => {
    const list: WMS.Coach[] = [...coaches];
    list.push(coach);
    setCoaches(list);
  };

  const accessRoles = () => {
    if (
      userRoles.isDirectRetailAdmin ||
      //old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin
    )
      return false;
    return true;
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <Grid align="right">
        <Grid.Col span={6}>
          <Group position="left">
            <h2>List of Coaches</h2>
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <Button
              disabled={accessRoles()}
              icon={<Plus />}
              onClick={() => setCreate(true)}
            >
              Create Coach
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <Create
        onSubmit={onCreateCoach}
        visible={create}
        onClose={() => setCreate(false)}
      />
      <br />
      <List users={coaches} />
    </div>
  );
};
