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

export const Admins = () => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const { data } = useQuery(getAdmins, {
    context: { clientName: "warehouse" },
    variables: {
      channel: router.route.includes("/users/direct")
        ? "DIRECT_RETAIL"
        : router.route.includes("/users/indirect")
        ? "INDIRECT_CHANNEL"
        : "HR_CHANNEL",
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

  const getDisableCreate = () => {
    if (userRoles.isAdminDC || userRoles.isDirectRetailAdmin) return false;
    return true;
  };

  const filterList = () => {
    return directIndirectAdmins
      ?.filter((text) => {
        if (filterValues.search == undefined) return directIndirectAdmins;
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
      <List users={filterList()} />
    </Stack>
  );
};
