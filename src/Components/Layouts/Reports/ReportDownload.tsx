import { useQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  downloadSubscriptionReport,
  getWarehouses,
} from "../../../GraphQL/ReportsSchema";
import { LoadingOverlay } from "../../Elements";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import {
  CLSReport,
  GLifeReports,
  InventorySnapShotReport,
  LendingOrdersReport,
  OrderSummaryReport,
  SalesReport,
  SalesZipReport,
  TransactionsReport,
  TransmittalReport,
  POReport,
  SRFReport,
  NewOrderSummaryReport,
  ApplicantsReport,
  NewEODReport,
  EODFinanceReport,
} from "./ReportsType";
import { GuidedTrialReport } from "./ReportsType/GuidedTrialReport";
import { HAVReport } from "./ReportsType/HAVReport";
import Notification from "../../Elements/Notification/Notification";
import { hasReportsPermission } from "../../../Utilities/AccessRoles";
import { ifError } from "assert";
import { IMSReport } from "./ReportsType/IMSReport";
import { EODReport } from "./ReportsType/EODReport";
import { OSAReport } from "./ReportsType/OSAReport";
import { FOMLogs } from "./ReportsType/FOMLogs";

type RequestIDType = {
  wms: string | undefined;
  oms: string | undefined;
};

export const ReportDownload = () => {
  const [warehouseList, setWarehouseList] = useState<WMS.Warehouse[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [requestIDs, setRequestIDs] = useState<RequestIDType>({
    oms: undefined,
    wms: undefined,
  });
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [selectedChannel] = useAtom(channelAtom);

  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: selectedChannel,
    },
  });

  const { data } = useSubscription(downloadSubscriptionReport, {
    context: { clientName: "warehouse" },
    skip: !requestIDs.wms,
    variables: {
      request_id: requestIDs.wms,
    },
    shouldResubscribe: !!requestIDs.wms,
    fetchPolicy: "no-cache",
    onData: ({ data }) => {
      if (data.data.onReportDownload.status === "Request Completed") {
        window.open(data.data.onReportDownload.url, "_blank");
        setRequestIDs({ ...requestIDs, wms: undefined });
        setIsGeneratingReport(false);
      }
      if (data.data.onReportDownload.status === "Request failed") {
        Notification.error({ message: data.data.onReportDownload.error });
        setRequestIDs({ ...requestIDs, wms: undefined });
        setIsGeneratingReport(false);
      }
      console.log("WMS", data);
    },

    onError(error) {
      console.log(error);
      if (requestIDs.wms)
        return Notification.error({
          message: "Error while generating report. Please try again",
        });
      setRequestIDs({ ...requestIDs, wms: undefined });
      setIsGeneratingReport(false);
    },
  });

  const { data: dataOMS } = useSubscription(downloadSubscriptionReport, {
    context: { clientName: "order" },
    skip: !requestIDs.oms,
    variables: {
      request_id: requestIDs.oms,
    },
    shouldResubscribe: !!requestIDs.oms,
    fetchPolicy: "no-cache",
    onData: ({ data }) => {
      if (data.data.onReportDownload.status === "Request Completed") {
        window.open(data.data.onReportDownload.url, "_blank");
        setRequestIDs({ ...requestIDs, oms: undefined });
        setIsGeneratingReport(false);
      }
      if (data.data.onReportDownload.status === "Request failed") {
        Notification.error({ message: data.data.onReportDownload.error });
        setRequestIDs({ ...requestIDs, oms: undefined });
        setIsGeneratingReport(false);
      }
      console.log("OMS", data);
    },
    onError(error) {
      console.log(error);
      if (requestIDs.oms)
        return Notification.error({
          message: "Error while generating report. Please try again",
        });
      setRequestIDs({ ...requestIDs, oms: undefined });
      setIsGeneratingReport(false);
    },
  });

  useEffect(() => {
    if (dataWarehouse) {
      let filteredWarehouses = dataWarehouse.warehouses.items.filter(
        (e: WMS.Warehouse) => e.status === true
      );

      const isKitchenCityUser =
        user.office_id === "PH1204" ||
        user.office_ids?.includes("PH1204") ||
        user.office_name?.toLowerCase().includes("kitchen city") ||
        user.office_ids?.some((id) =>
          filteredWarehouses.find(
            (w: WMS.Warehouse) =>
              w.id === id &&
              (w.id === "PH1204" || w.name?.toLowerCase().includes("kitchen city"))
          )
        );

      if (isKitchenCityUser && !userRoles.isFullAdmin) {
        setWarehouseList(
          filteredWarehouses.filter(
            (e: WMS.Warehouse) =>
              (user.office_ids?.includes(`${e.id}`) || user.office_id === e.id) &&
              (e.id === "PH1204" || e.name?.toLowerCase().includes("kitchen city"))
          )
        );
      } else if (
        (userRoles.isDirectRetailUser ||
          userRoles.isIndirectChannelUser ||
          userRoles.isEcomAdmin) &&
        !userRoles.isFullAdmin
      ) {
        setWarehouseList(
          filteredWarehouses.filter((e: WMS.Warehouse) =>
            user.office_ids?.includes(`${e.id}`)
          )
        );
      } else {
        if (!isKitchenCityUser && !userRoles.isFullAdmin) {
          filteredWarehouses = filteredWarehouses.filter(
            (e: WMS.Warehouse) =>
              e.id !== "PH1204" &&
              !e.name?.toLowerCase().includes("kitchen city")
          );
        }
        setWarehouseList(
          filteredWarehouses.filter(
            (e: WMS.Warehouse) =>
              userRoles.isDirectRetailAdmin ||
                userRoles.isAdminDC ||
                userRoles.isAdminIC ||
                userRoles.isAdmin
                ? true
                : e.id === user.office_id
          )
        );
      }
    }
  }, [dataWarehouse, user, userRoles]);

  const onRequestReport = (id: string | undefined, reportChannel: string) => {
    setRequestIDs((prevState) => ({
      ...prevState,
      [reportChannel]: id,
    }));
    setIsGeneratingReport(!!id);
  };

  return (
    <div>
      <LoadingOverlay
        visible={isGeneratingReport || !!requestIDs.oms || !!requestIDs.wms}
      />
      {hasReportsPermission(
        "INVENTORY_SNAPSHOT",
        userRoles,
        selectedChannel,
      ) && (
          <InventorySnapShotReport
            channel={selectedChannel}
            isGeneratingReport={isGeneratingReport}
            onRequestReport={(id: string | undefined) =>
              onRequestReport(id, "wms")
            }
          />
        )}
      {hasReportsPermission("TRANSACTIONS", userRoles, selectedChannel) && (
        <TransactionsReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("SALES", userRoles, selectedChannel) && (
        <SalesReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("GUIDED_TRIAL", userRoles, selectedChannel) && (
        <GuidedTrialReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {hasReportsPermission("SALES_ZIP", userRoles, selectedChannel) && (
        <SalesZipReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("TRANSMITTAL", userRoles, selectedChannel) && (
        <TransmittalReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("ORDER_SUMMARY", userRoles, selectedChannel) && (
        <OrderSummaryReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "oms")
          }
        />
      )}

      {hasReportsPermission(
        "NEW_ORDER_SUMMARY",
        userRoles,
        selectedChannel,
      ) && (
          <NewOrderSummaryReport
            channel={selectedChannel}
            isGeneratingReport={isGeneratingReport}
            warehouseList={warehouseList}
            onRequestReport={(id: string | undefined) =>
              onRequestReport(id, "oms")
            }
          />
        )}

      {hasReportsPermission("LENDING_ORDERS", userRoles, selectedChannel) && (
        <LendingOrdersReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "oms")
          }
        />
      )}

      {hasReportsPermission("IMS_REPORT", userRoles, selectedChannel) && (
        <IMSReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "oms")
          }
        />
      )}

      {/* {hasReportsPermission("EOD", userRoles, selectedChannel) && (
        <EODReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )} */}

      {hasReportsPermission("PO", userRoles, selectedChannel) && (
        <POReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {hasReportsPermission("FOM_LOGS", userRoles, selectedChannel) && (
        <FOMLogs
          isGeneratingReport={isGeneratingReport}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("GLIFE", userRoles, selectedChannel) && (
        <GLifeReports
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          generateReport={(state) => setIsGeneratingReport(state)}
        />
      )}

      {hasReportsPermission("SRF", userRoles, selectedChannel) && (
        <SRFReport
          channel={undefined}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {hasReportsPermission("OSA", userRoles, selectedChannel) && (
        <OSAReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {hasReportsPermission("HR", userRoles, selectedChannel) && (
        <ApplicantsReport
          isGeneratingReport={isGeneratingReport}
          onRequestReport={(id: string | undefined) =>
            onRequestReport(id, "wms")
          }
        />
      )}

      {hasReportsPermission("EOD", userRoles, selectedChannel) && (
        <NewEODReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {hasReportsPermission("EOD", userRoles, selectedChannel) && (
        <EODFinanceReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          warehouseList={warehouseList}
          onRequestReport={(id: string) => onRequestReport(id, "wms")}
        />
      )}

      {/* {hasReportsPermission("CLS", userRoles, selectedChannel) && (
        <CLSReport
          channel={selectedChannel}
          isGeneratingReport={isGeneratingReport}
          generateReport={(state) => setIsGeneratingReport(state)}
        />
      )} */}

      {/* {userRoles.isAdmin && !userRoles.isDirectRetailUser ? (
        <HAVReport
          isGeneratingReport={isGeneratingReport}
          generateReport={(state) => setIsGeneratingReport(state)}
          warehouseList={warehouseList}
        />
      ) : undefined} */}
    </div>
  );
};
