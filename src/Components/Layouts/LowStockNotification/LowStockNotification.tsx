import React, { useEffect, useState } from "react";
import { Group, LoadingOverlay, Stack, Tabs } from "../../Elements";
import { Warehouses } from "./Warehouses";
import { useQuery } from "@apollo/client";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { useAtom } from "jotai";
import { channelAtom, userAtom } from "../../../Store/StoreAtom";
import { WMS } from "../../../GraphQL";
import { getThresholdConfigs } from "../../../GraphQL/SKUsSchema";
import { useLowStockNotificationStore } from "./Store";
import { Text } from "@mantine/core";
import Notification from "../../Elements/Notification/Notification";
import { useRouter } from "next/router";

export const LowStockNotification = () => {
  const [channel] = useAtom(channelAtom);
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [warehouses, setWwarehouses] = useState<WMS.Warehouse[]>([]);
  const { thresholds, setThresholds } = useLowStockNotificationStore();
  const { loading: warehouseLoading, data: warehouseData } = useQuery(
    getWarehouses,
    {
      context: { clientName: "warehouse" },
      variables: {
        channel: channel,
      },
      fetchPolicy: "no-cache",
    }
  );
  const { loading: thresholdsLoading, data: thresholdsData } = useQuery(
    getThresholdConfigs,
    {
      context: { clientName: "warehouse" },
    }
  );

  useEffect(() => {
    if (user.username !== "Administrator") {
      Notification.info({ message: "Invalid Access, returing to homepage" });
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    if (warehouseData && thresholdsData) {
      setWwarehouses(warehouseData.warehouses.items || []);
      setThresholds(thresholdsData.thresholdConfigs.items || []);
    }
  }, [warehouseData, thresholdsData]);

  return (
    <Stack>
      <LoadingOverlay visible={thresholdsLoading || warehouseLoading} />
      <Group position="apart">
        <div>
          <Text fw={700} fz="lg">
            Low Stock Notification
          </Text>
          <Text fz="sm" c="dimmed">
            Manage warehouse inventory thresholds and recipients
          </Text>
        </div>
      </Group>
      <Warehouses thresholds={thresholds} warehouses={warehouses} />
    </Stack>
  );
};
