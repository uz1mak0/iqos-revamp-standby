import React, { useEffect, useState } from "react";
import { List } from "./List";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useQuery } from "@apollo/client";
import { getAdmins } from "../../../../../../GraphQL/UserSchema";
import { Group, Input } from "@mantine/core";
import { Search } from "tabler-icons-react";
import { useUsersStore } from "../../../Store";
import { Stack, Select } from "../../../../../Elements";
import { WMS } from "../../../../../../GraphQL";

export const Admins = () => {
  const [userRoles] = useAtom(rolesAtom);
  const { data } = useQuery(getAdmins, {
    context: { clientName: "warehouse" },
    variables: {
      channel: WMS.ChannelType.Ecomm,
    },
    fetchPolicy: "no-cache",
  });
  const { ecommerceAdmins, setEcommerceAdmins } = useUsersStore();
  const [selectedValue, setSelectedValue] = useState("");
  const [filterValues, setFilterValues] = useState({
    search: "",
    status: `${WMS.UserStatus.Active}`,
  });

  useEffect(() => {
    if (data) setEcommerceAdmins(data.admins.items);
  }, [data]);

  const getDisableCreate = () => {
    if (
      userRoles.isAdminDC ||
      userRoles.isDirectRetailAdmin
    )
      return false;
    return true;
  };

  const filterList = () => {
    return ecommerceAdmins
      ?.filter((text) => {
        if (filterValues.search == undefined) return ecommerceAdmins;
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
