import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Search } from "tabler-icons-react";
import { useQuery } from "@apollo/client";
import { getRiders } from "../../../../../../GraphQL/FinanceSchema";
import { WMS } from "../../../../../../GraphQL";
import { useStyles } from "./Users.styles";
import { Group, Input, ScrollArea, Stack } from "../../../../../Elements";

import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useUsersStore } from "../../../Store";
import { Select } from "@mantine/core";

export const Riders = () => {
  const { data, refetch } = useQuery(getRiders, {
    context: { clientName: "order" },
  });
  const { riders, setRiders } = useUsersStore();
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();

  const [filterValues, setFilterValues] = useState({
    search: "",
    status: `${WMS.UserStatus.Active}`,
  });

  useEffect(() => {
    if (data) setRiders(data.riders.items);
  }, [data]);

  const filterList = () => {
    return riders
      ?.filter((text) => {
        if (filterValues.search == undefined) return riders;
        return (
          text?.username
            ?.toLowerCase()
            .includes(filterValues.search?.toLowerCase()) ||
          text?.name?.toLowerCase().includes(filterValues.search?.toLowerCase())
        );
      })
      .filter((e) => e.user_status === filterValues.status);
  };

  return (
    <Stack>
      <Group>
        <Input
          style={{ width: 300 }}
          icon={<Search />}
          placeholder="Search by username/name"
          onChange={(e) =>
            setFilterValues({ ...filterValues, search: e.target.value })
          }
        />
        <Select
          defaultValue={`${WMS.UserStatus.Active}`}
          placeholder="Select Status"
          data={[WMS.UserStatus.Active, WMS.UserStatus.Inactive]}
          onChange={(e) => setFilterValues({ ...filterValues, status: `${e}` })}
        ></Select>
      </Group>

      <ScrollArea style={{ height: 800 }}>
        <List users={filterList()} />
      </ScrollArea>
    </Stack>
  );
};
