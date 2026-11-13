import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { Paper } from "../../Elements/Paper";
import { Button, Stack } from "../../Elements";
import { Group, Text } from "@mantine/core";
import { EODForm } from "./EOD/EODForm";
import { useUploadPortalStore } from "./Store";
import { List } from "./EOD/List";
import { Checklist, CheckupList } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";

export const ReportSubmit = () => {
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
    if (data?.warehouses?.items) {
      const allWarehouses = data.warehouses.items;

      if (userRoles.isFullAdmin) {
        setWarehouses(allWarehouses);
      }
      else if (
        (userRoles.isEcommUser || userRoles.isEcomAdmin) &&
        !userRoles.isDirectRetailAdmin &&
        !userRoles.isDirectRetailUser
      ) {
        setWarehouses(
          allWarehouses.filter((e: WMS.Warehouse) => e.id === "PH8012")
        );
      }
      else if (userRoles.isDirectRetailUser || userRoles.isIndirectChannelUser) {
        setWarehouses(
          allWarehouses.filter((e: WMS.Warehouse) =>
            user.office_ids?.includes(`${e.id}`)
          )
        );
      }
      else {
        setWarehouses(
          allWarehouses.filter((e: WMS.Warehouse) =>
            userRoles.isDirectRetailAdmin || userRoles.isAdmin
              ? true
              : e.id === user.office_id
          )
        );
      }
    }
  }, [data, userRoles, user]);

  if (isReportSubmission) return <EODForm />;
  return (
    <Stack>
      <Group p={10} align="center" position="apart">
        <div>
          <Text fw={700} fz="lg">
            Submit End of Day Report
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

export default ReportSubmit;
