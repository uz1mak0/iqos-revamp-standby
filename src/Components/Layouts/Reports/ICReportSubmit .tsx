import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { Paper } from "../../Elements/Paper";
import { Button, Stack } from "../../Elements";
import { Group, Text } from "@mantine/core";
import { EODForm } from "./ICEOD/EODForm";
import { useUploadPortalStore } from "./Store";
import { List } from "./ICEOD/List";
import { Checklist, CheckupList } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";

export const ICReportSubmit = () => {
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
        if (userRoles.isDirectRetailUser || userRoles.isSE) {
          setWarehouses(
            data.warehouses.items.filter((e: WMS.Warehouse) =>
              user.office_ids?.includes(`${e.id}`),
            ),
          );
        } else {
          setWarehouses(
            data.warehouses.items.filter((e: WMS.Warehouse) =>
              userRoles.isDirectRetailUser ||
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

  if (isReportSubmission) return <EODForm />;
  return (
    <Stack>
      <Group p={10} align="center" position="apart">
        <div>
          <Text fw={700} fz="lg">
            Submit End of Day Report IC
          </Text>
          <Text fz="sm" c="dimmed">
            Access and download available reports for offline review and
            analysis
          </Text>
        </div>
        <Button
          icon={<CheckupList />}
          onClick={() => setIsReportSubmission(true)}
        >
          Report Submission
        </Button>
      </Group>
      <Paper radius={8}>
        <List />
      </Paper>
    </Stack>
  );
};

export default ICReportSubmit;
