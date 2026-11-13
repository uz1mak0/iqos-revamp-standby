import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // 👈 Hook imported
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { Paper } from "../../Elements/Paper";
import { Button, Stack, Tabs } from "../../Elements"; // 👈 Keeping your custom wrapper intact
import { Group, Text } from "@mantine/core";
import { SRFForm } from "./SRF/SRFForm";
import { useUploadPortalStore } from "./Store";
import { List } from "./SRF/List";
import { SCList } from "./SRF/SCList";
import { WHList } from "./SRF/WHList";
import { CheckupList } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";

export const SRFReportSubmit = () => {
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [selectedChannel] = useAtom(channelAtom);
  const router = useRouter();
  const [activeDefaultTab, setActiveDefaultTab] = useState<string>("store_request");

  const { isReportSubmission, setIsReportSubmission, setWarehouses } =
    useUploadPortalStore();

  const { data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: selectedChannel,
    },
  });

  const hasWarehouseOnlyAccess =
    userRoles.isWarehouseFullAdmin && !userRoles.isSupplyChainFullAdmin;
  const hasSupplyChainOnlyAccess =
    userRoles.isSupplyChainFullAdmin && !userRoles.isWarehouseFullAdmin;
  const hasStoreRequestOnlyAccess =
    (userRoles.isSalesExpert || userRoles.isSE) &&
    !userRoles.isWarehouseFullAdmin &&
    !userRoles.isSupplyChainFullAdmin;

  const canAccessStoreRequest =
    hasStoreRequestOnlyAccess ||
    (!hasWarehouseOnlyAccess && !hasSupplyChainOnlyAccess);
  const canAccessSupplyChain =
    hasSupplyChainOnlyAccess || (!hasWarehouseOnlyAccess && !hasStoreRequestOnlyAccess);
  const canAccessWarehouse =
    hasWarehouseOnlyAccess || (!hasSupplyChainOnlyAccess && !hasStoreRequestOnlyAccess);
  const showCreateRequest = !(
    userRoles.isWarehouseFullAdmin || userRoles.isSupplyChainFullAdmin
  );

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
              userRoles.isAdmin
                ? e
                : e.id === user.office_id,
            ),
          );
        }
      }
    }
  }, [data]);


  useEffect(() => {
    if (!router.isReady) return;
    
    const allowedTabs = [] as string[];
    if (canAccessStoreRequest) allowedTabs.push("store_request");
    if (canAccessSupplyChain) allowedTabs.push("supply_chain");
    if (canAccessWarehouse) allowedTabs.push("warehouse");

    if (!allowedTabs.includes(activeDefaultTab)) {
      setActiveDefaultTab(allowedTabs[0] || "store_request");
    }
  }, [
      activeDefaultTab, 
      canAccessStoreRequest, 
      canAccessSupplyChain, 
      canAccessWarehouse, 
      router.isReady
    ]);

  if (isReportSubmission) return <SRFForm />;
  return (
    <Stack>
      <Group p={10} align="center" position="apart">
        <div>
          <Text fw={700} fz="xl">
            Stock Request Form
          </Text>
          <Text fz="sm">
            Streamlined Inventory Request, Validation, Fullfillment and Receiving Process.
          </Text>
        </div>
        {showCreateRequest ? (
          <Button
            icon={<CheckupList />}
            onClick={() => setIsReportSubmission(true)}
          >
            Create Request
          </Button>
        ) : null}
      </Group>

      <Paper radius={8}>
        <Tabs 
          keepMounted={true} 
          key={activeDefaultTab} 
          defaultValue={activeDefaultTab}
        >
          <Tabs.List>
            {canAccessStoreRequest ? (
              <Tabs.Tab value="store_request">Store Request</Tabs.Tab>
            ) : null}
            {canAccessSupplyChain ? (
              <Tabs.Tab value="supply_chain">Supply Chain</Tabs.Tab>
            ) : null}
            {canAccessWarehouse ? (
              <Tabs.Tab value="warehouse">Warehouse</Tabs.Tab>
            ) : null}
          </Tabs.List>

          {canAccessStoreRequest ? (
            <Tabs.Panel pt="lg" value="store_request">
              <List />
            </Tabs.Panel>
          ) : null}
          {canAccessSupplyChain ? (
            <Tabs.Panel pt="lg" value="supply_chain">
              <SCList />
            </Tabs.Panel>
          ) : null}
          {canAccessWarehouse ? (
            <Tabs.Panel pt="lg" value="warehouse">
              <WHList />
            </Tabs.Panel>
          ) : null}
        </Tabs>
      </Paper>
    </Stack>
  );
};

export default SRFReportSubmit;