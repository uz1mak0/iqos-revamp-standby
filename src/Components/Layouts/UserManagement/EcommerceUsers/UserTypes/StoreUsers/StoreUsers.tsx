import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import {
  getStoreUsers,
  storeUserCreate,
} from "../../../../../../GraphQL/UserSchema";
import { useStyles } from "../Riders/Users.styles";
import {
  Button,
  Grid,
  Group,
  Input,
  ScrollArea,
  Stack,
} from "../../../../../Elements";
import Create from "../../../../../Modules/Users/Create";
import { formElements } from "./Config";
import { STORE } from "../../../../../../GraphQL";
import Notification from "../../../../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useUsersStore } from "../../../Store";

export const StoreUsers = () => {
  const { data, refetch } = useQuery(getStoreUsers, {
    context: { clientName: "store" },
  });
  const { storeUsers, setStoreUsers } = useUsersStore();
  const [selectedValue, setSelectedValue] = useState("");
  const [userRoles] = useAtom(rolesAtom);

  useEffect(() => {
    if (data) {
      setStoreUsers(data.storeUsers.items);
    }
  }, [data]);

  const { classes } = useStyles();

  const filterStore = (e: string) => {
    setSelectedValue(e);
  };

  return (
    <Stack>
      <Input
        icon={<Search />}
        placeholder="Search by username/name"
        onChange={(e) => filterStore(e.target.value)}
      />

      <ScrollArea style={{ height: 800 }}>
        <List
          users={storeUsers?.filter((text) => {
            if (selectedValue == undefined) return storeUsers;
            return (
              text?.username
                ?.toLowerCase()
                .includes(selectedValue?.toLowerCase()) ||
              text?.name?.toLowerCase().includes(selectedValue?.toLowerCase())
            );
          })}
        />
      </ScrollArea>
    </Stack>
  );
};
