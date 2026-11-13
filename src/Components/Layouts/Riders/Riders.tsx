import React, { useEffect, useState } from "react";
import { List } from "./List";
import { Plus, Search } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import { getRiders } from "../../../GraphQL/FinanceSchema";
import { ORDER } from "../../../GraphQL";
import { useStyles } from "./Users.styles";
import { Button, Grid, Group, Input, ScrollArea } from "../../Elements";
import Create from "../../Modules/Users/Create";
import { formElements } from "./Config";
import dayjs from "dayjs";
import { riderCreate } from "../../../GraphQL/RiderSchema";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const Riders = () => {
  const [create, setCreate] = useState(false);
  const { data, refetch } = useQuery(getRiders, {
    context: { clientName: "order" },
  });
  const [riders, setRiders] = useState<ORDER.Rider[]>();
  const [selectedValue, setSelectedValue] = useState("");
  const [onRiderCreate, { loading: loadingCreate }] = useMutation(riderCreate, {
    context: { clientName: "order" },
  });
  const [userRoles] = useAtom(rolesAtom);

  const filterRider = (e: string) => {
    setSelectedValue(e);
  };

  useEffect(() => {
    if (data) setRiders(data.riders.items);
  }, [data]);

  const { classes } = useStyles();

  const onSubmit = (values: ORDER.Rider) => {
    const configValues = {
      ...values,
      phone_number: "+63" + values.phone_number,
      license_expiration_date: dayjs(values.license_expiration_date).format(
        "MMMM DD YYYY"
      ),
    };

    onRiderCreate({
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
              onChange={(e) => filterRider(e.target.value)}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group position="right">
            <Button
              disabled={
                !userRoles.isAdminDC ||
                // old roles
                userRoles.isAdmin
              }
              icon={<Plus />}
              onClick={() => setCreate(true)}
            >
              Create Rider
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <Create
        type="Rider"
        loading={loadingCreate}
        visible={create}
        onClose={() => setCreate(false)}
        formElements={formElements}
        onSubmit={(values) => onSubmit(values)}
      />
      <br />
      <ScrollArea style={{ height: 800 }}>
        <List
          users={riders?.filter((text) => {
            if (selectedValue == undefined) return riders;
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
