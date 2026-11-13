import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { usePagination } from "@mantine/hooks";
import {
  Group,
  Select,
  Table,
  ScrollArea,
  Pagination,
  LoadingOverlay,
} from "../../Elements";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { getWarehouseLogsFilters } from "../../Layouts/Inventory/InventoryConfig";
import dayjs from "dayjs";
import { getWarehourseTransactionsPagination } from "../../../GraphQL/InventorySchema";
import { WMS } from "../../../GraphQL";

export const WarehouseLogsTab = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const [dataList, setDataList] = useState<(WMS.Transaction & WMS.Transfer)[]>(
    []
  );
  const [filter, setFilter] = useState("TRANSMITTAL");
  const [status, setStatus] = useState("COMPLETED");
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [isFetching, setIsFetching] = useState(false);

  const pagination = usePagination({
    total: Math.ceil(totalLoaded / pageSize),
    initialPage: 1,
  });

  const [fetchTransactions, { loading }] = useLazyQuery(
    getWarehourseTransactionsPagination,
    {
      context: { clientName: "warehouse" },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (router.query.warehouse) {
      loadNextBatch(null, true, filter, status);
    }
  }, [router.query.warehouse]);

  useEffect(() => {
    const requiredIndex = pagination.active * pageSize;
    if (requiredIndex > dataList.length && !isFetching && nextToken !== null) {
      loadNextBatch(nextToken, false, filter, status);
    }
  }, [pagination.active, pageSize]);

  const loadNextBatch = async (
    token: string | null,
    reset: boolean = false,
    currentFilter: string = filter,
    currentStatus: string = status
  ) => {
    setIsFetching(true);
    try {
      const res = await fetchTransactions({
        variables: {
          warehouse_id: router.query.warehouse,
          status: currentStatus,
          type: currentFilter,
          limit: pageSize * 5,
          next_token: token,
        },
      });

      const newItems =
        res.data?.transactionsPerWarehousePagination?.items || [];
      const newToken =
        res.data?.transactionsPerWarehousePagination?.next_token || null;

      if (reset) {
        setDataList(newItems);
        setTotalLoaded(newItems.length);
      } else {
        setDataList((prev) => [...prev, ...newItems]);
        setTotalLoaded((prev) => prev + newItems.length);
      }

      setNextToken(newToken);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFilterChange = (e: string) => {
    let newFilter = e;
    let newStatus;

    if (status == "CANCELLED") {
      newStatus = "COMPLETED";
    } else {
      newStatus = status;
    }

    setFilter(newFilter);
    setStatus(newStatus);
    pagination.setPage(1);

    // Pass the new values directly to ensure we use the latest state
    loadNextBatch(null, true, newFilter, newStatus);
  };

  const handleStatusChange = (e: string) => {
    if (!e) return;

    const newStatus = e;
    let newFilter = filter;

    setStatus(newStatus);
    pagination.setPage(1);

    // Pass the new values directly
    loadNextBatch(null, true, newFilter, newStatus);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value || "50", 10);
    setPageSize(newPageSize);
    pagination.setPage(1);

    // Reset everything and load fresh data with the new page size
    setDataList([]);
    setNextToken(null);
    setTotalLoaded(0);
    loadNextBatch(null, true, filter, status);
  };

  const handlePageChange = async (page: number) => {
    const requiredIndex = page * pageSize;

    // If we need to load more data and there's a next token, load it first
    if (requiredIndex > dataList.length && !isFetching && nextToken !== null) {
      await loadNextBatch(nextToken, false, filter, status);
    }

    // Then set the page
    pagination.setPage(page);
  };

  const paginatedData = dataList.slice(
    (pagination.active - 1) * pageSize,
    pagination.active * pageSize
  );

  // Calculate if we need to show a "load more" indicator in pagination
  const totalPages = Math.ceil(totalLoaded / pageSize);
  const hasMorePages = nextToken !== null;
  const displayTotalPages = hasMorePages ? totalPages + 1 : totalPages;

  const rows = () =>
    paginatedData.map((element, index) => (
      <tr
        key={`list-${index}`}
        onClick={() =>
          window.open(
            `/inventory/warehouse/transaction/?transactionId=${
              element?.id
            }&warehouse=${router.query.warehouse}&transaction=${
              element?.type === "RECON"
                ? "reconcile"
                : element?.type
                ? element?.type?.toLowerCase()
                : "transfer"
            }`
          )
        }
      >
        <td>
          {element.id?.includes("TRANSFER_")
            ? "TRANSFER"
            : element?.type ?? "-"}
        </td>
        <td>{element?.id}</td>
        <td>{element?.status}</td>
        <td>
          {dayjs(Number(element?.date_created)).format("MMM D, YYYY h:mm A")}
        </td>
        <td>
          {dayjs(
            Number(element?.date_updated)?.toString().length === 13
              ? Number(element?.date_updated)
              : Number(element?.date_updated) * 1000
          ).format("MMM D, YYYY h:mm A")}
        </td>
        <td>{element?.invoice_id}</td>
        <td>{element?.remarks}</td>
      </tr>
    ));

  return (
    <div className={classes.tabPanelContainer}>
      <LoadingOverlay visible={loading || isFetching} />
      <Group>
        <Select
          value={filter}
          data={getWarehouseLogsFilters.map((e) => ({ label: e, value: e }))}
          description="Filter by type"
          placeholder="Select type"
          onChange={handleFilterChange}
        />

        <Select
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          data={[
            { label: "50", value: "50" },
            { label: "100", value: "100" },
            { label: "300", value: "300" },
          ]}
          placeholder="Select page size"
          description="Page Size"
        />

        <Select
          value={status}
          onChange={handleStatusChange}
          data={[
            { label: "COMPLETED", value: "COMPLETED" },
            { label: "PENDING", value: "PENDING" },
            ...(filter === "TRANSFER" || filter === "DIRECT_TRANSFER"
              ? [{ label: "CANCELLED", value: "CANCELLED" }]
              : []),
          ]}
          placeholder="Select Transaction Status"
          description="Transaction Status"
        />
      </Group>
      <br />
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Invoice ID</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={displayTotalPages}
        page={pagination.active}
        onChange={handlePageChange}
      />
    </div>
  );
};
