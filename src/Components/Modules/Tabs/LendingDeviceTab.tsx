import React, { useState, useEffect } from "react";
import { ChevronDown } from "tabler-icons-react";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { getDeviceFilter } from "../../Layouts/Inventory/InventoryConfig";
import { useQuery, useLazyQuery } from "@apollo/client";
// import { getDeviceInventoryItems } from '../../../../GraphQL/InventortTabsSchema';
import Notification from "../../Elements/Notification/Notification";
import { getDeviceInventoryItems } from "../../../GraphQL/InventorySchema";
import { WMS } from "../../../GraphQL";
import { Maybe } from "../../../GraphQL/_gql/wms/graphql";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Select,
  Table,
  Pagination,
  ScrollArea,
} from "../../Elements";
import { reportWarehouse } from "../../../GraphQL/ReportsSchema";
import { usePagination } from "@mantine/hooks";

export const LendingDeviceTab = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [filter, setFilter] = useState({
    status: "ALL",
    tag: "ALL",
  });
  const [cycleHistory, setCycleHistory] = useState<{
    device: WMS.InventoryItem | undefined;
    history:
      | WMS.Maybe<Maybe<WMS.UsageHistory[]>>
      | WMS.Maybe<WMS.Maybe<string>[]>
      | undefined;
  }>({
    device: {},
    history: [],
  });
  const [usageHistory, setUsageHistory] = useState<{
    device: WMS.InventoryItem | undefined;
    history: WMS.Maybe<WMS.Maybe<WMS.UsageHistory>> | undefined;
  }>({
    device: {},
    history: {},
  });
  const [devices, setDevices] = useState({
    ALL: [] as WMS.InventoryItem[],
    AVAILABLE: [] as WMS.InventoryItem[],
    RELEASED: [] as WMS.InventoryItem[],
    DAMAGED: [] as WMS.InventoryItem[],
    LOSS: [] as WMS.InventoryItem[],
  });

  const { loading, data, refetch } = useQuery<{
    inventoryItems: WMS.InventoryItemConnection;
  }>(getDeviceInventoryItems, { context: { clientName: "warehouse" } });
  const [onLoadReportWarehouse, { loading: loadingWarehouseReport }] =
    useLazyQuery(reportWarehouse, { context: { clientName: "warehouse" } });
  const pagination = usePagination({
    total: devices.ALL.length || 0,
    initialPage: 1,
  });

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = () => {
    Promise.all([
      getDeviceByStatus("AVAILABLE", undefined, []),
      getDeviceByStatus("RELEASED", undefined, []),
      getDeviceByStatus("DAMAGED", undefined, []),
      getDeviceByStatus("LOSS", undefined, []),
    ])
      .then(
        ([
          responseAvailable,
          responseReleased,
          responseDamaged,
          responseLoss,
        ]) => {
          setDevices({
            ALL: [
              ...responseAvailable,
              ...responseReleased,
              ...responseDamaged,
              ...responseLoss,
            ],
            AVAILABLE: [...responseAvailable],
            RELEASED: [...responseReleased],
            DAMAGED: [...responseDamaged],
            LOSS: [...responseLoss],
          });
        },
      )
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const getDeviceByStatus: any = (
    status: string,
    next_token: string | undefined,
    list: WMS.InventoryItem[] | undefined,
  ) => {
    return refetch({
      warehouse_id: "RS50",
      next_token: next_token,
      status: status,
    })
      .then(({ data }) => {
        if (data.inventoryItems?.next_token)
          return getDeviceByStatus(
            status,
            data.inventoryItems?.next_token,
            data.inventoryItems?.items?.filter((e) => e?.gtin !== "LVC"),
          );
        return [
          ...(list || []),
          ...(data.inventoryItems?.items?.filter((e) => e?.gtin !== "LVC") ||
            []),
        ];
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onSelectDeviceStatus = (status: string) => {
    pagination.setPage(1);
    setFilter({ ...filter, status: status });
  };

  const filterOrders = () => {
    switch (filter.status) {
      case "ALL":
        return devices.ALL;
      case "RELEASED":
        return devices.RELEASED;
      case "AVAILABLE":
        return devices.AVAILABLE;
      case "DAMAGED":
        return devices.DAMAGED;
      case "LOSS":
        return devices.LOSS;
      default:
        return [];
    }
  };

  const onDeviceReportDownload = (status: string) => {
    onLoadReportWarehouse({
      variables: {
        type: "DEVICES",
        warehouse_id: "RS50",
        status: status === "ALL" ? undefined : status,
      },
    })
      .then((response) => {
        window.open(response.data.reportWarehouse);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const rows = (list: WMS.InventoryItem[] | undefined) => {
    return list
      ?.filter((e) => (filter.tag == "ALL" ? e : e.tag == filter.tag))
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element.serial}</td>
            <td>{element.description}</td>
            <td>
              {element.cycle ? (
                <Button
                  onClick={() =>
                    setCycleHistory({
                      device: element,
                      history: element.order_history,
                    })
                  }
                >
                  {String(element.cycle)}
                </Button>
              ) : undefined}
            </td>
            <td>
              {" "}
              {element.order_id ? (
                <Button
                  onClick={() =>
                    window.open(
                      `/order-management/order-details/orderID/?orderID=${element?.order_id}`,
                    )
                  }
                >
                  {element.order_id}
                </Button>
              ) : undefined}
            </td>
            <td>
              {" "}
              {element.order_id ? (
                <Button
                  onClick={() =>
                    window.open(
                      `/order-management/return/return-details/returnID/?returnID=RETURN_${element?.order_id}`,
                    )
                  }
                >{`RETURN_${element.order_id}`}</Button>
              ) : undefined}
            </td>
            <td>{element.tag}</td>
            <td>
              {element.usage_history ? (
                <Button
                  onClick={() =>
                    setUsageHistory({
                      device: element,
                      history: element?.usage_history as WMS.UsageHistory,
                    })
                  }
                >
                  View
                </Button>
              ) : undefined}
            </td>
            <td>{element.item_status}</td>
            <td>{element.batch_id}</td>
            <td>{element.charger_serial}</td>
            <td>{element.holder_serial}</td>
          </tr>
        </React.Fragment>
      ));
  };

  const cycleHistoryRows = () => {
    return cycleHistory?.history?.map((element, index) => (
      <React.Fragment key={`cycle-list-${index}`}>
        <tr>
          <td>{<Button>{String(element)}</Button>}</td>
        </tr>
      </React.Fragment>
    ));
  };

  const usageHistoryRows = (usage: Maybe<WMS.UsageData> | undefined) => {
    return (
      <tr>
        <td>{usage?.charger_cycle}</td>
        <td>{usage?.device_cycle}</td>
        <td>{usage?.version}</td>
      </tr>
    );
  };

  const cycleHistoryView = () => (
    <Modal
      size={800}
      title={`${cycleHistory?.device?.description}: ${cycleHistory?.device?.serial}`}
      centered
      opened={Object.keys(cycleHistory.device || {}).length > 1 ? true : false}
      onClose={() => setCycleHistory({ device: undefined, history: [] })}
    >
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>Order ID</th>
          </tr>
        </thead>
        <tbody>{cycleHistoryRows()}</tbody>
      </Table>
    </Modal>
  );

  const usageHistoryView = () => (
    <Modal
      size={1000}
      title={`${usageHistory?.device?.description}: ${usageHistory?.device?.serial}`}
      centered
      opened={Object.keys(usageHistory.device || {}).length > 1 ? true : false}
      onClose={() => setUsageHistory({ device: undefined, history: {} })}
    >
      <Table>
        <thead>
          <tr>
            <th>Pre Usage</th>
            <th>Post Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>Charger Usage</th>
                    <th>Holder Usage</th>
                    <th>Version</th>
                  </tr>
                </thead>
                <tbody>{usageHistoryRows(usageHistory.history?.pre)}</tbody>
              </Table>
            </td>
            <td>
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>Charger Usage</th>
                    <th>Holder Usage</th>
                    <th>Version</th>
                  </tr>
                </thead>
                <tbody>{usageHistoryRows(usageHistory.history?.post)}</tbody>
              </Table>
            </td>
          </tr>
        </tbody>
      </Table>
    </Modal>
  );

  return (
    <div className={classes.tabPanelContainer}>
      <LoadingOverlay visible={loadingWarehouseReport} />
      {cycleHistoryView()}
      {usageHistoryView()}
      <Group position="apart">
        <Select
          defaultValue="ALL"
          data={getDeviceFilter.map((e) => {
            return {
              label: e,
              value: e,
            };
          })}
          onChange={(e) => {
            setFilter({ ...filter, tag: e });
            pagination.setPage(1);
          }}
          description="Filter by Tag"
          placeholder="Select Tag"
        />

        <Menu width={200} placement="center" trigger="click">
          <Menu.Target>
            <div>
              <Button icon={<ChevronDown />}>Download Device Report</Button>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item onClick={() => onDeviceReportDownload("ALL")}>All</Menu.Item> */}
            <Menu.Item onClick={() => onDeviceReportDownload("AVAILABLE")}>
              Available
            </Menu.Item>
            <Menu.Item
              onClick={() => onDeviceReportDownload("RELEASED")}
              value="RELEASED"
            >
              Release
            </Menu.Item>
            <Menu.Item
              onClick={() => onDeviceReportDownload("DAMAGED")}
              value="DAMAGED"
            >
              Damaged
            </Menu.Item>
            <Menu.Item
              onClick={() => onDeviceReportDownload("LOSS")}
              value="LOSS"
            >
              Loss
            </Menu.Item>
            <Menu.Item onClick={() => onDeviceReportDownload("AVAILABLE")}>
              Available
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <div className={classes.statusContainer}>
        <Card
          key={"ALL"}
          background="#808080"
          title="ALL"
          number={devices.ALL.length}
          onClick={() => onSelectDeviceStatus("ALL")}
          isSelected={filter.status == "ALL"}
        />
        <Card
          background="#FD9710"
          title="AVAILABLE"
          number={devices.AVAILABLE.length}
          onClick={() => onSelectDeviceStatus("AVAILABLE")}
          isSelected={filter.status == "AVAILABLE"}
        />
        <Card
          background="#61B765"
          title="RELEASED"
          number={devices.RELEASED.length}
          onClick={() => onSelectDeviceStatus("RELEASED")}
          isSelected={filter.status == "RELEASED"}
        />
        <Card
          background="#C2534C"
          title="DAMAGED"
          number={devices.DAMAGED.length}
          onClick={() => onSelectDeviceStatus("DAMAGED")}
          isSelected={filter.status == "DAMAGED"}
        />
        <Card
          background="#4A1D1A"
          title="LOSS"
          number={devices.LOSS.length}
          onClick={() => onSelectDeviceStatus("LOSS")}
          isSelected={filter.status == "LOSS"}
        />
      </div>
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Description</th>
              <th>Cycle</th>
              <th>Order ID</th>
              <th>Return ID</th>
              <th>Tag</th>
              <th>Usage History</th>
              <th>Status</th>
              <th>Batch</th>
              <th>Charger</th>
              <th>Holder</th>
            </tr>
          </thead>
          <tbody>{rows(filterOrders()) || []}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil(
          (filterOrders().filter((e) =>
            filter.tag == "ALL" ? e : e.tag == filter.tag,
          )?.length || 0) / 100,
        )}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
