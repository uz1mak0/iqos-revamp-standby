import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Button,
  ActionIcon,
  DateRangePicker,
} from "../../../Elements";
import { getStockRequests } from "../../../../GraphQL/TransactionSchema";
import { useAtom } from "jotai";
import { channelAtom, userAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { useUploadPortalStore } from "../Store";
import { CaretUp, CaretDown } from "tabler-icons-react";
import { Details } from "./Details";
import { WMS } from "../../../../GraphQL";
import { getWarehouses } from "../../../../GraphQL/InventorySchema";

export const WHList = () => {
  const [selectedChannel] = useAtom(channelAtom);

  const { warehouses } = useUploadPortalStore();

  const [reports, setReports] = useState<WMS.SRFs[]>([]);
  const [selectedSRF, setSelectedSRF] =
    useState<WMS.SRFs | undefined>(undefined);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().subtract(5, "day").startOf("day").toDate(),
    dayjs().endOf("day").toDate(),
  ]);

  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(
    new Set(),
  );

  const [fetchWarehouses] = useLazyQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
  });

  const [dataWarehouses, setDataWarehouses] = useState<any[]>([]);

  useEffect(() => {
    const loadWarehouses = async () => {
      const channels = ["ECOMM", "DIRECT_RETAIL", "INDIRECT_CHANNEL"];

      const responses = await Promise.all(
        channels.map((channel) =>
          fetchWarehouses({
            variables: {
              channel,
            },
          }),
        ),
      );

      const mergedWarehouses = responses.flatMap(
        (res) => res.data?.warehouses?.items || [],
      );

      setDataWarehouses(mergedWarehouses);
    };

    loadWarehouses();
  }, []);
  const [filter, setFilter] = useState<{
    warehouse_id: string | undefined;
    date_filter: WMS.DateFilter;
  }>({
    warehouse_id: undefined,
    date_filter: {
      from: dayjs().subtract(5, "day").format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  });

  const [fetchSRF] = useLazyQuery(getStockRequests, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  useEffect(() => {
    if (warehouses && warehouses[0]?.id) {
      loadSRFeports([], filter.date_filter, undefined);
    }
  }, [warehouses]);

  const loadSRFeports = (
    list: WMS.SRFs[],

    date_filter: WMS.DateFilter,
    next_token?: string,
  ) => {
    fetchSRF({
      variables: {
        date_filter,
        next_token,
      },
    }).then((res) => {
      const updateList = [...list, ...(res?.data?.stockRequests?.items || [])];
      const nextToken = res?.data?.stockRequests?.next_token;
      if (nextToken) {
        return loadSRFeports(updateList, date_filter, nextToken);
      }

      setFilter((prev) => ({ ...prev, date_filter }));
      setReports(updateList);
    });
  };

  const handleDetailUpdate = (updated: WMS.SRFs) => {
    setReports((prev) =>
      prev.map((report) => (report.id === updated.id ? updated : report)),
    );
    setSelectedSRF(updated);
  };
  
  const handleUpdateStatus = (ids: string[]) => {
    setReports((prev) =>
      prev.map((srf) =>
        ids.includes(srf.id!) ? { ...srf, status: "Close" as any } : srf,
      ),
    );
    setSelectedForBulk(new Set());
  };

  const getWarehouseName = (warehouse: any) => {
    if (!warehouse) return "";

    const WarehouseName: WMS.Warehouse = dataWarehouses.find(
      (e: WMS.Warehouse) => e.id == warehouse,
    );

    return `${WarehouseName?.name} ${warehouse}`;
  };

  const filteredReports = reports.filter((report) => {
    if (report.status === WMS.StockRequestStatus.CLOSED) {
      return false;
    }

    if (!selectedStatus) {
      return true;
    }

    return report.status === selectedStatus;
  });

  const rows = filteredReports.flatMap((element) => {
    const mainRow = (
      <tr key={element.id}>
        <td>
          <Group spacing="xs" align="center">
            <ActionIcon onClick={() => toggleExpand(element.id!)}>
              {expanded.has(element.id!) ? <CaretUp /> : <CaretDown />}
            </ActionIcon>
          </Group>
        </td>
        <td>
          {" "}
          <Button onClick={() => setSelectedSRF(element)}>
            {element.id ?? "-"}
          </Button>
        </td>
        <td>{getWarehouseName(element.warehouse_id)}</td>
        <td>
          {element.date_created
            ? dayjs(element.date_created * 1000).format("MMM DD YYYY")
            : "-"}
        </td>
        <td>
          {element.date_input
            ? dayjs(element.date_input * 1000).format("MMM DD YYYY")
            : "-"}
        </td>
        <td>{element.created_by}</td>
        <td>{element.updated_by ?? "-"}</td>
        <td>{element.status?.replaceAll("_", " ")}</td>
      </tr>
    );

    const expandedRows = expanded.has(element.id!)
      ? [
          <tr key={`expanded-${element.id}`}>
            <td colSpan={8}>
              <Table fontSize="sm">
                <thead>
                  <tr>
                    <th>GTIN</th>
                    <th>SKU</th>
                    <th>Description</th>
                    <th>Requested Qty</th>
                    <th>SC Approved Qty</th>
                    <th>WH Approved Qty</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {(element.items ?? []).map((item, idx) => (
                    <tr key={`${element.id}-item-${idx}`}>
                      <td>{item?.gtin?.replace("_PMI", "")}</td>
                      <td>{item?.sku}</td>
                      <td>{item?.description}</td>
                      <td>{item?.req_qty}</td>
                      <td>{item?.sc_qty}</td>
                      <td>{item?.wh_qty}</td>
                      <td>{item?.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </td>
          </tr>,
        ]
      : [];

    return [mainRow, ...expandedRows];
  });

  return (
    <div>
      <Stack>
        <Details
          warehouseName={getWarehouseName(selectedSRF?.warehouse_id)}
          onClose={() => setSelectedSRF(undefined)}
          srf={selectedSRF}
          onUpdate={handleDetailUpdate}
        />

        {warehouses.length > 0 && (
          <Group>
            <DateRangePicker
              label="Date Range"
              defaultValue={[
                dayjs().subtract(5, "day").startOf("day").toDate(),
                dayjs().endOf("day").toDate(),
              ]}
              onChange={(value) => {
                setDateRange(value);

                if (value[0] && value[1]) {
                  loadSRFeports([], {
                    from: dayjs(value[0]).format("YYYY-MM-DD"),
                    to: dayjs(value[1]).format("YYYY-MM-DD"),
                  });
                }
              }}
            />
            <Select
              label="Status"
              searchable
              clearable
              data={[
                { label: "Supply Chain Review", value: "FOR_REVIEW_SC" },
                { label: "Warehouse Review", value: "FOR_REVIEW_WH" },
                { label: "Available", value: "AVAILABLE" },
                { label: "Rejected", value: "REJECT" },
              ]}
              onChange={(status) => {
                setSelectedStatus(status);
              }}
            />
          </Group>
        )}

        {selectedForBulk.size > 0 && (
          <Group position="right">
            <Button
              customType="danger"
              onClick={() => handleUpdateStatus([...selectedForBulk])}
            >
              {"Close Selected " + selectedForBulk.size.toString()}
            </Button>
          </Group>
        )}

        <ScrollArea style={{ height: 700 }}>
          <Table highlightOnHover fontSize="md">
            <thead>
              <tr>
                <th></th>
                <th>Transaction ID</th>
                <th>Store</th>
                <th>Date Created</th>
                <th>Date Of Expected Delivery</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </div>
  );
};
