import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  getDeviceInventoryItems,
  inventoryReconcile,
} from "../../../GraphQL/InventorySchema";
import {
  InventoryItem,
  InventoryItemConnection,
  Maybe,
} from "../../../GraphQL/_gql/wms/graphql";
import {
  Group,
  Input,
  LoadingOverlay,
  Select,
  Table,
  Pagination,
  ScrollArea,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { formatCodentify } from "../../Layouts/CodentifyScanner/Config";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { getDeviceReconFilters } from "./Config";
import { usePagination } from "@mantine/hooks";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  isGT?: boolean;
};

export const DeviceTab = (props: Props) => {
  const router = useRouter();
  const { classes } = useStyles();
  const [loadWarehouseDevices, { loading }] = useLazyQuery(
    getDeviceInventoryItems,
    { context: { clientName: "warehouse" } }
  );
  const [reconcileDevice, { loading: loadingReconcile }] = useMutation(
    inventoryReconcile,
    { context: { clientName: "warehouse" } }
  );
  const [deviceList, setDeviceList] = useState<
    Maybe<Maybe<InventoryItem>[]> | undefined
  >([]);
  const [filter, setFilter] = useState("FOR_RECONCILIATION");
  const pagination = usePagination({
    total: deviceList?.length || 0,
    initialPage: 1,
  });
  const [currentRecon, setCurrentRecon] = useState(1);
  const [userRoles] = useAtom(rolesAtom);
  useEffect(() => {
    if (router.query.warehouse) {
      getDevices([], undefined);
    }
  }, [router.query.warehouse]);

  const accessRole = () => {
    if (
      userRoles.isAdminDC ||
      userRoles.isAdminIC ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin ||
      userRoles.isWarehousePersonnel
    ) {
      return false;
    } else {
      return true;
    }
  };

  const getCurrentReconcileValue = (
    list: Maybe<Maybe<InventoryItem>[]> | undefined
  ) => {
    const reconciledValue = list?.map((e) => e?.reconcile_count || 0);
    setCurrentRecon(Math.max(...(reconciledValue || [])));
  };

  const filterDevice = (list: Maybe<Maybe<InventoryItem>[]> | undefined) => {
    switch (filter) {
      case "ALL":
        return list;
      case "RECONCILLED":
        return list?.filter((e) => e?.reconcile_count === currentRecon);
      case "FOR_RECONCILIATION":
        return list?.filter((e) => e?.reconcile_count !== currentRecon);
      default:
        return [];
    }
  };

  const getDevices = (
    list: Maybe<Maybe<InventoryItem>[]> | undefined,
    next_token: undefined | string
  ) => {
    loadWarehouseDevices({
      variables: {
        warehouse_id: router.query.warehouse,
        status: "AVAILABLE",
        next_token: next_token,
      },
    }).then((res) => {
      const updateList = [
        ...(list || []),
        ...(res?.data?.inventoryItems?.items || []),
      ];
      if (res.data?.inventoryItems?.next_token) {
        getDevices(updateList, res.data.inventoryItems.next_token);
      } else {
        setDeviceList(
          updateList?.filter((e) => (props.isGT ? e?.gtin?.includes("GT_") : e))
        );
        getCurrentReconcileValue(updateList);
      }
    });
  };

  const totalReconciled = () => {
    return deviceList?.filter((item) => item?.reconcile_count == currentRecon)
      .length;
  };

  const onScan = (value: string) => {
    const codentify = formatCodentify(value);
    if (codentify) {
      const item = deviceList?.find(
        (item) =>
          codentify.serial == item?.serial &&
          item?.reconcile_count == currentRecon
      );
      if (item) return Notification.error({ message: "Already reconciled" });
      reconcileDevice({
        variables: {
          input: {
            warehouse_id: router.query.warehouse,
            serial: codentify.serial,
          },
        },
      })
        .then((res) => {
          const updateList = [...(deviceList || [])];
          const index = updateList.findIndex(
            (e) => e?.serial === codentify.serial
          );
          updateList[index] = {
            ...updateList[index],
            reconcile_count: res.data.inventoryReconcile.reconcile_count,
          };
          setDeviceList(updateList);
          Notification.success({ message: "Reconcile Success" });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
      Notification.error({ message: "Not Codentify" });
    }
  };

  const rows = (list: Maybe<Maybe<InventoryItem>[]> | undefined) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element?.serial}</td>
            <td>{element?.gtin}</td>
            <td>{element?.sku}</td>
            <td>{element?.description}</td>
            <td>{element?.unit_of_measure}</td>
            <td>{dayjs(Number(element?.date_created)).format("YYYY-MM-DD")}</td>
            {props?.isGT && userRoles.isDirectRetailUser ? (
              <td>{element?.cycle || 0}</td>
            ) : undefined}
            {!props.isGT && !userRoles.isDirectRetailUser ? (
              <td>
                {element?.reconcile_count === currentRecon ? "YES" : "NO"}
              </td>
            ) : undefined}
            <td>{element?.item_status}</td>
            {!props?.isGT ? <td>{element?.batch_id}</td> : undefined}
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      <LoadingOverlay visible={loading || loadingReconcile} />
      <h3>AVAILABLE DEVICES: {deviceList?.length}</h3>
      {props.isGT ? undefined : (
        <Group>
          <Input
            disabled={accessRole()}
            style={{ width: 300 }}
            description="CODENTIFY"
            placeholder="Scan CODENTIFY to reconcile"
            onKeyPress={(e) =>
              e.key === "Enter" ? onScan(e.target.value) : undefined
            }
          />
          <Select
            searchable
            defaultValue={filter}
            onChange={(e) => setFilter(e)}
            description="Show"
            data={getDeviceReconFilters}
          />
          <h3>RECONCILED: {totalReconciled()}</h3>
        </Group>
      )}

      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>UOM</th>
              <th>Date Created</th>
              {props?.isGT && userRoles.isDirectRetailUser ? (
                <th>Cycle</th>
              ) : undefined}
              {!props?.isGT && !userRoles.isDirectRetailUser ? (
                <th>Reconciled</th>
              ) : undefined}
              <th>Status</th>
              {!props?.isGT ? <th>Batch</th> : undefined}
            </tr>
          </thead>
          <tbody>{rows(filterDevice(deviceList))}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((filterDevice(deviceList)?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
