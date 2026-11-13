import React from "react";
import { Group, Paper, Stack, Tabs } from "../../Elements";
import { BackButton } from "../../Modules/BackButton/BackButton";
import { IndirectLendingCreate } from "./Create/IndirectLendingCreate";
import { IndirectReturnCreate } from "./Create/IndirectReturnCreate";
import { useAtom } from "jotai";
import { userAtom } from "../../../Store/StoreAtom";
import { IndirectLendingList } from "./List/IndirectLendingList";
import { IndirectReturnList } from "./List/IndirectReturnList";
import { LendingDashboard } from "./Dashboard/index";

export const IndirectLendingManagement = () => {
  const [user] = useAtom(userAtom);
  return (
    <Stack>
      <Group position="apart">
        <BackButton title="Home" url="/" />
        <Group>
          <IndirectLendingCreate />
          <IndirectReturnCreate />
        </Group>
      </Group>
      <Paper radius={5}>
        <Tabs keepMounted={true} defaultValue="orders">
          <Tabs.List>
            <Tabs.Tab value="orders">Lending Order Mngt</Tabs.Tab>
            <Tabs.Tab value="returns">Lending Returns</Tabs.Tab>
            <Tabs.Tab value="dashboard">Lending Dashboard</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel pt="lg" value="orders">
            <IndirectLendingList user={user} />
          </Tabs.Panel>
          <Tabs.Panel pt="lg" value="returns">
            <IndirectReturnList user={user} />
          </Tabs.Panel>
          <Tabs.Panel pt="lg" value="dashboard">
            <LendingDashboard user={user} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
};
