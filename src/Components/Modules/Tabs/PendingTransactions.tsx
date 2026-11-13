import React, { useEffect, useState } from "react";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { getWarehouseLogsFilters } from "../../Layouts/Inventory/InventoryConfig";
import { useRouter } from "next/router";
import { useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { Group, Select, Table, Pagination, ScrollArea } from "../../Elements";
import { usePagination } from "@mantine/hooks";
import { WMS } from "../../../GraphQL";
import {
  getTransfersToWarehouse,
  getWarehourseTransactions,
  getWarehouses,
} from "../../../GraphQL/InventorySchema";

export const PendingTransactions = () => {
  const { classes } = useStyles();
  const [list, setList] = useState<WMS.Transaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const pagination = usePagination({
    total: list?.length || 0,
    initialPage: 1,
  });
  const router = useRouter();

  const { data: dataDRWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const { data: dataEcomWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });

  const getWarehouseName = (warehouse: any) => {
    if (!warehouse) return "";

    const drWarehouseName: WMS.Warehouse =
      dataDRWarehouses?.warehouses?.items?.find(
        (e: WMS.Warehouse) => e.id == warehouse
      );
    const ecomWarehouseName: WMS.Warehouse =
      dataEcomWarehouses?.warehouses?.items?.find(
        (e: WMS.Warehouse) => e.id == warehouse
      );
    return `${ecomWarehouseName?.name || drWarehouseName?.name || warehouse} (${
      ecomWarehouseName?.id || drWarehouseName?.id || warehouse
    })`;
  };

  useEffect(() => {
    if (router.query.warehouse) {
      getAllFloatingTransferTransactions([], undefined);
    }
  }, [router.query.warehouse]);

  const [warehouseTransferTransactions, { loading: loadingTransfers }] =
    useLazyQuery(getWarehourseTransactions, {
      context: { clientName: "warehouse" },
    });

  const getAllFloatingTransferTransactions = (
    list: WMS.Transaction[],
    next_token: string | undefined
  ) => {
    warehouseTransferTransactions({
      variables: {
        status: "FLOATING",
        warehouse_id: router.query.warehouse,
        next_token: next_token,
        type: WMS.TransactionType.Transfer,
      },
    }).then((res) => {
      const updateList: (WMS.Transaction & WMS.Transfer)[] = [
        ...list,
        ...res?.data?.transactionsPerWarehouse?.items,
      ];
      if (res.data.transactionsPerWarehouse.next_token)
        return getAllFloatingTransferTransactions(
          updateList,
          res.data.transactionsPerWarehouse.next_token
        );
      getAllFloatingDirectTransferTransactions(updateList, undefined);
    });
  };

  const getAllFloatingDirectTransferTransactions = (
    list: WMS.Transaction[],
    next_token: string | undefined
  ) => {
    warehouseTransferTransactions({
      variables: {
        status: "FLOATING",
        warehouse_id: router.query.warehouse,
        next_token: next_token,
        type: WMS.TransactionType.DirectTransfer,
      },
    }).then((res) => {
      const updateList: (WMS.Transaction & WMS.Transfer)[] = [
        ...list,
        ...res?.data?.transactionsPerWarehouse?.items,
      ];
      if (res.data.transactionsPerWarehouse.next_token)
        return getAllFloatingDirectTransferTransactions(
          updateList,
          res.data.transactionsPerWarehouse.next_token
        );
      setList(updateList);
    });
  };

  console.log("list", list);

  const formatList = (list: WMS.Transaction[] | undefined) => {
    return list
      ?.filter((e) => (filter === "ALL" ? e : e?.type === filter))
      .sort(
        (a, b) =>
          parseInt(b?.date_created || "0") - parseInt(a?.date_created || "0")
      );
  };

  const rows = () => {
    return formatList(list)
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() => {
              const transactionType = element?.id?.startsWith("DIRECT_TRANSFER")
                ? "direct_transfer"
                : element?.id?.startsWith("INDIRECT_TRANSFER")
                ? "indirect_transfer"
                : "transfer";

              const url = `/inventory/warehouse/transaction/?transactionId=${element?.id}&warehouse=${router.query.warehouse}&transaction=${transactionType}`;

              window.open(url);
            }}
          >
            <td>
              {element?.id?.startsWith("DIRECT_TRANSFER")
                ? "Direct Transfer"
                : element?.id?.startsWith("INDIRECT_TRANSFER")
                ? "Indirect Transfer"
                : "Transfer"}
            </td>

            <td>{element?.id}</td>
            <td>{element?.status}</td>
            <td>
              {dayjs(Number(element?.date_created)).format(
                "MMM D, YYYY h:mm A"
              )}
            </td>
            <td>
              {element?.date_updated
                ? dayjs(Number(element?.date_updated)).format(
                    "MMM D, YYYY h:mm A"
                  )
                : "-"}
            </td>
            <td>{element?.invoice_id}</td>
            <td>{element?.remarks}</td>
            <td>{getWarehouseName(element?.to_warehouse_id)}</td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div className={classes.tabPanelContainer}>
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
              <th>Destination Warehouse</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((formatList(list)?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
