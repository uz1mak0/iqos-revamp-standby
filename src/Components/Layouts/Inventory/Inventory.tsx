import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Input,
  Select,
  SegmentedControl,
  ScrollArea,
} from "../../Elements";
import { Plus, Search } from "tabler-icons-react";
import { Create } from "./Create";
import { WMS } from "../../../GraphQL";
import { useQuery } from "@apollo/client";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { List } from "./List";
import { getWarehouseType, listView } from "./InventoryConfig";
import { Flex } from "@mantine/core";

export const Inventory = () => {
  const [create, setCreate] = useState<boolean>(false);
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);

  const { loading, data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });

  const [list, setList] = useState<WMS.Warehouse[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>("Active");
  const [listType, setListType] = useState("card");

  useEffect(() => {
    if (data) {
      let rawWarehouses: WMS.Warehouse[] = data.warehouses?.items || [];

      if (channel !== "DIRECT_RETAIL" && channel !== "INDIRECT_CHANNEL") {
        rawWarehouses = rawWarehouses.filter((e: any) => {
          return (
            e.id === "PH1204" ||
            (e.channel && e.channel.includes("ECOM")) ||
            (e.channel_type && e.channel_type.includes("ECOM"))
          );
        });
      }

      if (channel === "DIRECT_RETAIL") {
        rawWarehouses = rawWarehouses.filter(
          (e: WMS.Warehouse) => e.id !== "PH1204"
        );
      }

      const isKitchenCityUser =
        user.office_id === "PH1204" ||
        user.office_ids?.includes("PH1204") ||
        user.office_name?.toLowerCase().includes("kitchen city");

      if (!isKitchenCityUser && !userRoles.isFullAdmin) {
        rawWarehouses = rawWarehouses.filter(
          (e: WMS.Warehouse) =>
            e.id !== "PH1204" &&
            !e.name?.toLowerCase().includes("kitchen city")
        );
      }

      if (
        userRoles.isFullAdmin ||
        userRoles.isAdministratorEC ||
        userRoles.isEcomAdmin ||
        userRoles.isEcommUser
      ) {
        setList(rawWarehouses);
      } else if (
        userRoles.isDirectRetailUser ||
        userRoles.isIndirectChannelUser
      ) {
        setList(
          rawWarehouses.filter((e: WMS.Warehouse) =>
            user.office_ids?.includes(`${e.id}`)
          )
        );
      } else {
        setList(
          rawWarehouses.filter((e: WMS.Warehouse) =>
            userRoles.isDirectRetailAdmin || userRoles.isAdmin
              ? true
              : e.id === user.office_id
          )
        );
      }
    }
  }, [data, channel, user, userRoles]);


  const onCreateWarehouse = (warehouse: WMS.Warehouse) => {
    const updateList = [...list];
    updateList.push(warehouse);
    setList(updateList);
  };

  // const filterWarehouse = (value: string | undefined) => {
  //   if (!value) return list;
  //   return list.filter(
  //     (e) =>
  //       e.name?.toLowerCase()?.includes(value?.toLocaleLowerCase()) ||
  //       e.type?.toLowerCase()?.includes(value?.toLocaleLowerCase())
  //   );
  // };

  const filterWarehouse = (value: string | undefined) => {
    return list.filter((e) => {
      const matchText = value
        ? e.name?.toLowerCase().includes(value.toLowerCase()) ||
        e.type?.toLowerCase().includes(value.toLowerCase())
        : true;

      const matchStatus =
        status === "Active"
          ? e.status === true
          : status === "Inactive"
            ? e.status === false
            : true;

      // Only include if both filters pass
      return matchText && matchStatus;
    });
  };

  const getDisableCreate = () => {
    if (
      userRoles.isDirectRetailAdmin ||
      userRoles.isFullAdmin ||
      userRoles.isAdminDC ||
      userRoles.isAdminIC ||
      //old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin
    )
      return false;
    return true;
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <h3>List of Warehouse</h3>
      <Create
        isDirectRetailUser={userRoles.isDirectRetailUser}
        onSubmit={(wh) => onCreateWarehouse(wh)}
        visible={create}
        onClose={() => setCreate(false)}
      />
      <Flex
        mih={50}
        direction={{ base: "column", sm: "row" }}
        align={{ lg: "center" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "center", lg: "space-between" }}
      >
        <div>
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ lg: "center", sm: "center" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "center", lg: "space-between", md: "cemter" }}
          >
            <Input
              onChange={(e) => setFilter(e.target.value)}
              icon={<Search />}
              style={{ minWidth: 300 }}
              placeholder="Search by warehouse name"
            />
            <Select
              clearable
              searchable
              onChange={(e) => setFilter(e)}
              data={getWarehouseType.map((e) => {
                return {
                  label: e,
                  value: e,
                };
              })}
              placeholder="Filter by warehouse type"
            />
            <Select
              clearable
              value={status}
              onChange={(e) => setStatus(e)}
              data={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              placeholder="Filter by status"
            />

            <SegmentedControl
              size="sm"
              onChange={(value) => setListType(value)}
              data={listView}
              defaultValue="card"
            />
          </Flex>
        </div>
        <Button
          disabled={getDisableCreate()}
          onClick={() => setCreate(true)}
          icon={<Plus />}
        >
          Create Warehouse
        </Button>
      </Flex>
      <br />
      <ScrollArea style={{ height: 1000 }}>
        <List listType={listType} warehouses={filterWarehouse(filter)} />
      </ScrollArea>
    </div>
  );
};
