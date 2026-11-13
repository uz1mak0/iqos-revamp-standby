import React, { useEffect, useState } from "react";
import { LoadingOverlay, Tabs } from "../../Elements";
import { List, Logs } from ".";
import { useAtom } from "jotai";
import { dceUsersAtom, userAtom } from "../../../Store/StoreAtom";
import Notification from "../../Elements/Notification/Notification";
import { useRouter } from "next/router";

export const DCEInventory = () => {
  const [user] = useAtom(userAtom);
  const [usersDCE] = useAtom(dceUsersAtom);
  const router = useRouter();

  useEffect(() => {
    if (usersDCE) {
      if (!usersDCE?.some((admin) => user.username === admin)) {
        Notification.error({ message: "Invalid Access" });
        router.push("/");
      }
    }
  }, [usersDCE]);

  if (!usersDCE) return <LoadingOverlay visible={true} />;

  return (
    <div>
      <Tabs defaultValue="inventory">
        <Tabs.List>
          <Tabs.Tab value="inventory">Inventory</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="inventory" pt="xs">
          <List />
        </Tabs.Panel>
        <Tabs.Panel value="logs" pt="xs">
          <Logs />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
