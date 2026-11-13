import React, { useState, useEffect } from "react";
import { Edit, ChevronDown, CirclePlus, Download } from "tabler-icons-react";
import { useRouter } from "next/router";
import {
  getDirectReceivableStocksCount,
  getReceivableStocksCount,
  getSubmittedTransferCount,
  getWarehouse,
} from "../../../GraphQL/InventorySchema";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CreateTransaction } from "../Transaction/CreateTransaction";
import { useStyles } from "../Inventory/Inventory.styles";
import { Create } from "../Inventory/Create";
import { InventoryTab } from "../../Modules/Tabs/InventoryTab";
import { LendingDeviceTab } from "../../Modules/Tabs/LendingDeviceTab";
import { DeviceTab } from "../../Modules/Tabs/DeviceTab";
import { VouchersTab } from "../../Modules/Tabs/VouchersTab";
import { WarehouseLogsTab } from "../../Modules/Tabs/WarehouseLogsTab";
import { DraftsTab } from "../../Modules/Tabs/DraftsTab";
import { ReceivableStocksTab } from "../../Modules/Tabs/ReceivableStocksTab";
import {
  Badge,
  Button,
  DateRangePicker,
  Grid,
  Group,
  Paper,
  Tabs,
  Divider,
} from "../../Elements";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { LampsTab } from "../../Modules/Tabs/LampsTab";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { reportWarehouse } from "../../../GraphQL/ReportsSchema";
import Notification from "../../Elements/Notification/Notification";
import { GTInventoryTab } from "../../Modules/Tabs/GTInventoryTab";
import { PendingTransactions } from "../../Modules/Tabs/PendingTransactions";

dayjs.extend(weekday);

const Profile = () => {
  const [create, setCreate] = useState<boolean>(false);
  const { classes } = useStyles();
  const router = useRouter();
  const [warehouse, setWarehouse] =
    useState<WMS.Warehouse | undefined>(undefined);
  const [reportDate, setReportDate] = useState<[Date, Date]>([
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  ]);
  const [receivableCount, setReceivableCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [userRoles] = useAtom(rolesAtom);

  const { loading, error, data, refetch } = useQuery(getWarehouse, {
    context: { clientName: "warehouse" },
    variables: { id: router.query.warehouse },
  });
  const [onLoadReportWarehouse, { loading: loadingWarehouseReport }] =
    useLazyQuery(reportWarehouse, { context: { clientName: "warehouse" } });
  const { data: dataReceivable } = useQuery<{
    transfersToWarehouse: WMS.TransferConnection;
  }>(getReceivableStocksCount, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: router.query.warehouse,
      status: "FLOATING",
    },
  });

  const { data: dataDirectReceivable } = useQuery<{
    directTransfersToWarehouse: WMS.DirectTransferConnection;
  }>(getDirectReceivableStocksCount, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: router.query.warehouse,
      status: "FLOATING",
    },
  });
  const { data: dataSumittedTransfer } = useQuery<{
    transactionsPerWarehouse: WMS.TransactionConnection;
  }>(getSubmittedTransferCount, {
    context: { clientName: "warehouse" },
    variables: {
      warehouse_id: router.query.warehouse,
      status: "FLOATING",
    },
  });
  const [selectedTab, setSelectedTab] = useState<string | undefined>();
  const [accessDenied, setAccessDenied] = useState(false);

  // useEffect(() => {
  //   if (userRoles.isSupplyChainFullAdmin) {
  //     setAccessDenied(true);
  //     router.replace("/");
  //   }
  // }, [userRoles]);

  useEffect(() => {
    if (data) setWarehouse(data.warehouse);
    if (dataDirectReceivable)
      setReceivableCount(
        (dataDirectReceivable?.directTransfersToWarehouse?.items?.length || 0) +
          (dataReceivable?.transfersToWarehouse.items?.length || 0)
      );
    if (dataSumittedTransfer) {
      setSubmittedCount(
        dataSumittedTransfer?.transactionsPerWarehouse?.items?.filter(
          (e) =>
            e?.type === WMS.TransactionType.DirectTransfer ||
            e?.type === WMS.TransactionType.Transfer
        ).length || 0
      );
    }
    if (router.isReady) {
      setSelectedTab(`${router.query.tab || "INVENTORY"}`);
    }
  }, [
    data,
    dataReceivable,
    dataSumittedTransfer,
    dataDirectReceivable,
    router,
  ]);

  const onUpdateWarehouse = (warehouse: WMS.Warehouse) => {
    setWarehouse(warehouse);
    setCreate(false);
  };

  const onDownloadPulloutReport = () => {
    onLoadReportWarehouse({
      variables: {
        type: "PULLOUT",
        warehouse_id: "RS51",
        date_filter: reportDate
          ? {
              from: dayjs(reportDate[0]).format("YYYY-MM-DD"),
              to: dayjs(reportDate[1]).format("YYYY-MM-DD"),
            }
          : undefined,
      },
    })
      .then((res) => {
        Notification.success({ title: "Download Reports", message: "Success" });
        window.open(res.data.reportWarehouse, "_blank");
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const getDisableCreate = () => {
    if (
      userRoles.isAdminDC ||
      userRoles.isDirectRetailAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin ||
      userRoles.isDirectRetailAdmin ||
      userRoles.isWarehousePersonnel
    )
      return false;
    return true;
  };

  const statusBadge = (status: boolean) => {
    return status ? (
      <Badge color="green" variant="dot">
        Active
      </Badge>
    ) : (
      <Badge color="red" variant="dot">
        Inactive
      </Badge>
    );
  };

  if (accessDenied) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <Create
        isDirectRetailUser={userRoles.isDirectRetailUser}
        onSubmit={(wh) => onUpdateWarehouse(wh)}
        visible={create}
        onClose={() => setCreate(false)}
        title="Edit Warehouse"
      />
      <Paper radius={8}>
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>Warehouse Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <Button
                disabled={getDisableCreate()}
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        {/* <p className={classes.whText}>Name: {warehouse.name}</p> */}
        <p className={classes.whText}>Warehouse ID: {warehouse?.id}</p>
        <p className={classes.whText}>Warehouse Name: {warehouse?.name}</p>
        <p className={classes.whText}>Warehouse Type: {warehouse?.type}</p>
        <p className={classes.whText}>Area: {warehouse?.area}</p>
        <p className={classes.whText}>
          Status: {statusBadge(warehouse?.status ?? false)}
        </p>
        <Divider size={"xs"} />

        <h4 className={classes.whText}>Accounts </h4>
        <p className={classes.whText}>COD: {warehouse?.accounts?.cod}</p>
        <p className={classes.whText}>
          None COD: {warehouse?.accounts?.non_cod}
        </p>

        <Divider size={"xs"} />

        <h4 className={classes.whText}>ZIP Codes</h4>
        <ul>
          {warehouse?.zip_codes?.map(
            (zip: WMS.Maybe<WMS.Maybe<WMS.ZipCode>> | undefined) => (
              <li key={`${zip?.from}${zip?.to}`}>
                From: {zip?.from} To: {zip?.to}
              </li>
            )
          )}
        </ul>
      </Paper>
      {router.query.warehouse === "RS51" ? (
        <Paper radius={8}>
          <Group position="apart">
            <div>
              <Group>
                <DateRangePicker
                  defaultValue={reportDate}
                  description="Date"
                  onChange={(e) => setReportDate(e)}
                />
                <Button
                  disabled={reportDate && reportDate[1] ? false : true}
                  onClick={() => onDownloadPulloutReport()}
                  styles={{ marginTop: 15 }}
                  icon={<Download />}
                >
                  Download Pullout Report
                </Button>
              </Group>
            </div>
          </Group>
        </Paper>
      ) : undefined}
      <Paper radius={8}>
        <Group position="right">
          <CreateTransaction status={warehouse?.status ?? false} />
        </Group>
        <Tabs
          value={selectedTab}
          color="blue"
          onTabChange={(e) => {
            setSelectedTab(e);
            router.replace(
              `/inventory/warehouse?warehouse=${router.query.warehouse}&tab=${e}`,
              undefined,
              { shallow: true }
            );
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="INVENTORY">Inventory</Tabs.Tab>
            <Tabs.Tab value="DEVICES">Devices</Tabs.Tab>
            {warehouse?.id === "RS50" ? (
              <Tabs.Tab value="VOUCHERS">Voucher</Tabs.Tab>
            ) : undefined}
            <Tabs.Tab value="LOGS">Warehouse Logs</Tabs.Tab>
            {userRoles.isCSC ? undefined : (
              <Tabs.Tab value="DRAFTS">Draft</Tabs.Tab>
            )}
            <Tabs.Tab
              rightSection={<Badge variant="filled">{submittedCount}</Badge>}
              value="PENDING"
            >
              Submitted Transfer
            </Tabs.Tab>

            {userRoles.isCSC ? undefined : (
              <Tabs.Tab
                rightSection={<Badge variant="filled">{receivableCount}</Badge>}
                value="STOCKS"
              >
                Receivable Stocks
              </Tabs.Tab>
            )}
            {warehouse?.id === "RS50" &&
            !userRoles.isDirectRetailUser &&
            userRoles.isAdminDC ? (
              <Tabs.Tab value="LAMPS">LAMPS</Tabs.Tab>
            ) : undefined}
            {userRoles.isDirectRetailUser ? (
              <Tabs.Tab value="GTINVENTORY">GT Inventory</Tabs.Tab>
            ) : undefined}
          </Tabs.List>
          <Tabs.Panel value="INVENTORY">
            <InventoryTab />
          </Tabs.Panel>
          <Tabs.Panel value="DEVICES">
            {warehouse?.id === "RS50" ? <LendingDeviceTab /> : <DeviceTab />}
          </Tabs.Panel>
          {warehouse?.id === "RS50" ? (
            <Tabs.Panel value="VOUCHERS">
              <VouchersTab />
            </Tabs.Panel>
          ) : undefined}
          <Tabs.Panel value="LOGS">
            <WarehouseLogsTab />
          </Tabs.Panel>
          <Tabs.Panel value="DRAFTS">
            <DraftsTab />
          </Tabs.Panel>
          <Tabs.Panel value="STOCKS">
            <ReceivableStocksTab />
          </Tabs.Panel>
          {warehouse?.id === "RS50" ? (
            <Tabs.Panel value="LAMPS">
              <LampsTab />
            </Tabs.Panel>
          ) : undefined}
          {userRoles.isDirectRetailUser ? (
            <Tabs.Panel value="GTINVENTORY">
              <GTInventoryTab />
            </Tabs.Panel>
          ) : undefined}
          <Tabs.Panel value="PENDING">
            <PendingTransactions />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </div>
  );
};

export default Profile;
