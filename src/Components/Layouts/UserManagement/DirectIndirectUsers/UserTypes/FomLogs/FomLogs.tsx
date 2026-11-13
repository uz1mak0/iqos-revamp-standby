import React, { useEffect, useState } from "react";
import { List } from "./List";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useQuery } from "@apollo/client";
import { getAdmins } from "../../../../../../GraphQL/UserSchema";
import { WMS } from "../../../../../../GraphQL";
import { Group, Input, Select } from "@mantine/core";
import { Search } from "tabler-icons-react";
import { useUsersStore } from "../../../Store";
import { Stack } from "../../../../../Elements";
import { useRouter } from "next/router";

export const FOMLogs = () => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const { data } = useQuery(getAdmins, {
    context: { clientName: "warehouse" },
    variables: {
      channel: "INDIRECT_CHANNEL",
    },
    fetchPolicy: "no-cache",
  });
  const { directIndirectAdmins, setDirectIndirectAdmins } = useUsersStore();
  const [filterValues, setFilterValues] = useState({
    search: "",
    status: `${WMS.UserStatus.Active}`,
  });

  useEffect(() => {
    if (data) setDirectIndirectAdmins(data.admins.items);
  }, [data]);

  const filterList = () => {
    return directIndirectAdmins
      ?.filter((user) => {
        // search filter
        if (!filterValues.search) return true;

        return (
          user?.username
            ?.toLowerCase()
            .includes(filterValues.search.toLowerCase()) ||
          user?.name?.toLowerCase().includes(filterValues.search.toLowerCase())
        );
      })
      .filter(
        (user) =>
          user.user_status === filterValues.status &&
          user.roles?.includes(WMS.Role.FOM),
      );
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
      <List users={filterList()} />
    </Stack>
  );
};
