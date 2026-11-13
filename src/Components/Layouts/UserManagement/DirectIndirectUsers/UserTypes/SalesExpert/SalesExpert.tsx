import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useStyles } from "../../../../Riders/Users.styles";
import { useQuery } from "@apollo/client";
import { getSalesExperts } from "../../../../../../GraphQL/UserSchema";
import { WMS } from "../../../../../../GraphQL";
import { Button, Grid, Group, Input, Stack } from "../../../../../Elements";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useRouter } from "next/router";
import Create from "./Create";
import { useUsersStore } from "../../../Store";

export const SalesExpert = () => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();

  const { salesExpert, setSalesExpert } = useUsersStore();
  const [selectedValue, setSelectedValue] = useState("");
  const [create, setCreate] = useState(false);

  const { data } = useQuery(getSalesExperts, {
    context: { clientName: "warehouse" },
  });

  const filterAdmins = (e: string) => {
    setSelectedValue(e);
  };

  useEffect(() => {
    if (data) setSalesExpert(data.salesExperts.items);
  }, [data]);

  const onCreate = (user: WMS.SalesExpert) => {
    const updateList = [...salesExpert];
    updateList.push(user);
    setSalesExpert(updateList);
    setCreate(false);
  };

  console.log(salesExpert);
  return (
    <Stack>
      <Input
        icon={<Search />}
        placeholder="Search by Sales Expert ID/Name"
        onChange={(e) => filterAdmins(e.target.value)}
      />

      {userRoles.isDirectRetailAdmin && (
        <Create
          profile={undefined}
          visible={create}
          onSubmit={onCreate}
          onClose={() => setCreate(false)}
        />
      )}
      <List
        roles={userRoles}
        users={salesExpert?.filter((text) => {
          if (selectedValue == undefined) return salesExpert;
          return (
            text?.name?.toLowerCase().includes(selectedValue?.toLowerCase()) ||
            text?.sales_expert_id
              ?.toLowerCase()
              .includes(selectedValue?.toLowerCase())
          );
        })}
      />
    </Stack>
  );
};
