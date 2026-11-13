import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Table,
} from "../../../Elements";
import { Text } from "@mantine/core";
import { useQuery } from "@apollo/client";
import { getSMSWarehouses } from "../../../../GraphQL/SMSSettingsSchema";
import { ORDER, WMS } from "../../../../GraphQL";
import { Group } from "@mantine/core";
import { Filter as WarehouseFilter } from "./Filter";
import { AssignSMS } from "../SMS/AssignSMS";
import { FilterProps } from "../config";
import { UnAssignSMS } from "../SMS/UnAssignSMS";
import ListRows from "./ListRows";

import { Pencil, PencilPlus, Refresh } from "tabler-icons-react";

export const List = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WMS.Warehouse[]>(
    []
  );
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [warehouses, setWarehouses] = useState<WMS.Warehouse[]>([]);
  const [opened, setOpened] = useState({
    custom: false,
    default: false,
  });

  const { loading, data } = useQuery(getSMSWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: "ECOMM",
    },
    fetchPolicy: "no-cache",
  });

  const [filterValues, setFilterValues] = useState<FilterProps>({
    by_name_id: undefined,
    by_sms_type: undefined,
    by_warehouse_type: undefined,
  });

  useEffect(() => {
    if (data)
      setWarehouses(
        data.warehouses.items.filter((w: any) => w.status === true)
      );
  }, [data]);

  const onSelectWarehouse = (isSelected: boolean, warehouse: WMS.Warehouse) => {
    const updateList = [...selectedWarehouse];
    if (isSelected) {
      updateList.push(warehouse);
      setSelectedWarehouse(updateList);
    } else {
      setSelectedWarehouse(updateList.filter((e) => e.id !== warehouse.id));
    }
  };

  const onSelectAllWarehouse = (isSelected: boolean) => {
    setIsAllSelected(isSelected);
    if (isSelected) return setSelectedWarehouse(filterWarehouses(warehouses));
    return setSelectedWarehouse([]);
  };

  const onChangeSMStype = (wh: WMS.Warehouse) => {
    const updateList = [...warehouses];
    const index = updateList.findIndex((e) => e.id === wh.id);
    updateList[index] = wh;
    setWarehouses(updateList);
  };

  const onAssignSMSToWarehouses = (
    sms: ORDER.SmsTemplate,
    warehouse_ids: string[]
  ) => {
    const newList = warehouses.map((wh) => {
      return {
        ...wh,
        ecomm_sms: warehouse_ids.includes(`${wh.id}`) ? sms : wh.ecomm_sms,
      };
    });
    setWarehouses(newList);
    setSelectedWarehouse([]);
  };

  const onUnAssignSMSToWarehouses = (
    unassinged_warehouses: WMS.Warehouse[]
  ) => {
    const newList = warehouses.map((wh) => {
      return {
        ...wh,
        ecomm_sms: unassinged_warehouses.some((e) => e.id === wh.id)
          ? undefined
          : wh.ecomm_sms,
      };
    });
    setWarehouses(newList);
    setSelectedWarehouse([]);
  };

  const filterWarehouses = (warehouses: WMS.Warehouse[]) => {
    const byNameID = filterValues?.by_name_id?.toLowerCase();
    return warehouses
      .filter(
        (e) =>
          e.name?.toLowerCase().includes(byNameID || "") ||
          e.id?.toLowerCase().includes(byNameID || "")
      )
      .filter((e) =>
        filterValues.by_warehouse_type
          ? e.type === filterValues.by_warehouse_type
          : e
      )
      .filter((e) =>
        filterValues.by_sms_type
          ? filterValues.by_sms_type === "CUSTOM"
            ? e.ecomm_sms !== undefined && e.ecomm_sms !== null
            : e.ecomm_sms == undefined || e.ecomm_sms == null
          : e
      );
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <AssignSMS
        opened={opened.custom}
        onClose={() => setOpened({ custom: false, default: false })}
        warehouses={selectedWarehouse}
        onAssignSMSToWarehouses={onAssignSMSToWarehouses}
      />
      <UnAssignSMS
        opened={opened.default}
        onClose={() => setOpened({ custom: false, default: false })}
        warehouses={selectedWarehouse}
        onUnAssignSMSToWarehouses={onUnAssignSMSToWarehouses}
      />
      <Stack>
        <Group position="apart">
          <div>
            <Text fw={700} fz="lg">
              List of Warehouse/Hub
            </Text>
            <Text fz="sm" c="dimmed">
              SMS Notification Settings for Warehouses/Hubs
            </Text>
          </div>
          <Group>
            <WarehouseFilter
              onFilter={(values) => {
                setFilterValues(values);
                setSelectedWarehouse([]);
                setIsAllSelected(false);
              }}
            />
            <Divider orientation="vertical" />
            <Button
              customType="custom"
              color="#228BE6"
              icon={<PencilPlus />}
              disabled={selectedWarehouse.length <= 0}
              onClick={() => setOpened({ custom: true, default: false })}
            >
              Custom
            </Button>
            <Button
              customType="custom"
              color="gray"
              icon={<Refresh />}
              disabled={selectedWarehouse.length <= 0}
              onClick={() => setOpened({ custom: false, default: true })}
            >
              Default
            </Button>
          </Group>
        </Group>
        <ScrollArea style={{ height: 650 }}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => onSelectAllWarehouse(e.target.checked)}
                    label={""}
                  />
                </th>
                <th>Warehouse/Hub Name</th>
                <th>Type</th>
                <th>Area</th>
                <th>ID</th>
                <th>SMS Type</th>
                <th>SMS Message</th>
                <th>Message Type</th>
              </tr>
            </thead>
            <tbody>
              <ListRows
                warehouses={filterWarehouses(warehouses)}
                selectedWarehouse={selectedWarehouse}
                onSelectWarehouse={onSelectWarehouse}
                onChangeSMStype={onChangeSMStype}
              />
            </tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </div>
  );
};
