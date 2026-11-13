import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { Paper } from "../../Elements/Paper";
import { Button, Stack } from "../../Elements";
import { Group, Text } from "@mantine/core";
import { POForm } from "./PO/POForm";
import { useUploadPortalStore } from "./Store";
import { List } from "./PO/List";
import { Checklist, CheckupList } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";

export const POReportSubmit = () => {
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [selectedChannel] = useAtom(channelAtom);
  const { isReportSubmission, setIsReportSubmission, setWarehouses } =
    useUploadPortalStore();
  const { data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: selectedChannel,
    },
  });

  useEffect(() => {
    if (data) {
      if (userRoles.isFullAdmin) {
        setWarehouses(data.warehouses.items);
      } else {
        if (userRoles.isDirectRetailUser || userRoles.isIndirectChannelUser) {
          setWarehouses(
            data.warehouses.items.filter((e: WMS.Warehouse) =>
              user.office_ids?.includes(`${e.id}`),
            ),
          );
        } else {
          setWarehouses(
            data.warehouses.items.filter((e: WMS.Warehouse) =>
              userRoles.isDirectRetailAdmin ||
              // old roles
              userRoles.isAdmin
                ? e
                : e.id === user.office_id,
            ),
          );
        }
      }
    }
  }, [data]);

  if (isReportSubmission) return <POForm />;
  return (
    <Stack>
      <Group p={10} align="center" position="apart">
        <div>
          <Text fw={700} fz="xl">
            PMFTC Delivery Report
          </Text>
        </div>
        <Button
          icon={<CheckupList />}
          onClick={() => setIsReportSubmission(true)}
        >
        Create Declaration
        </Button>
      </Group>
      <Paper radius={8}>
        <List />
      </Paper>
    </Stack>
  );
};

export default POReportSubmit;
