import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import { getStoreUsers, storeUserCreate } from "../../../GraphQL/UserSchema";
import { useStyles } from "../Riders/Users.styles";
import { Button, Grid, Group, Input, ScrollArea } from "../../Elements";
import Create from "../../Modules/Users/Create";
import { formElements } from "./Config";
import { STORE } from "../../../GraphQL";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const StoreUsers = () => {
  const [create, setCreate] = useState(false);
  const { data, refetch } = useQuery(getStoreUsers, {
    context: { clientName: "store" },
  });
  const [onCreateStoreUser, { loading: loadingCreate }] = useMutation(
    storeUserCreate,
    { context: { clientName: "store" } }
  );
  const [stores, setStores] = useState<STORE.StoreUser[]>();
  const [selectedValue, setSelectedValue] = useState("");
  const [userRoles] = useAtom(rolesAtom);

  useEffect(() => {
    if (data) {
      setStores(data.storeUsers.items);
    }
  }, [data]);

  const { classes } = useStyles();

  const filterStore = (e: string) => {
    setSelectedValue(e);
  };

  const onSubmit = (values: STORE.StoreUser) => {
    const configValues = {
      ...values,
      phone_number: "+63" + values.phone_number,
    };
    onCreateStoreUser({
      variables: { input: configValues },
      onCompleted: (data) => {
        setCreate(false);
        refetch();
        Notification.success({ message: "Created Successfully" });
      },
      onError: (error) => {
        console.log(error);
        Notification.error({ message: error.message });
        setCreate(false);
      },
    });
  };

  return (
    <div>
      <Grid align="right">
        <Grid.Col span={6}>
          <Group position="left">
            <Input
              className={classes.searchInput}
              icon={<Search />}
              placeholder="Search by username/name"
              onChange={(e) => filterStore(e.target.value)}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <Button
              disabled={
                !userRoles.isAdminDC &&
                // old roles
                !userRoles.isAdmin
              }
              icon={<Plus />}
              onClick={() => setCreate(true)}
            >
              Create Store Users
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <Create
        type="Store User"
        visible={create}
        loading={loadingCreate}
        onSubmit={(values) => onSubmit(values)}
        formElements={formElements}
        onClose={() => setCreate(false)}
      />
      <br />
      <ScrollArea style={{ height: 800 }}>
        <List
          users={stores?.filter((text) => {
            if (selectedValue == undefined) return stores;
            return (
              text?.username
                ?.toLowerCase()
                .includes(selectedValue?.toLowerCase()) ||
              text?.name?.toLowerCase().includes(selectedValue?.toLowerCase())
            );
          })}
        />
      </ScrollArea>
    </div>
  );
};
