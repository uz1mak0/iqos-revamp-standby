import { useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { WMS } from "../../../GraphQL";
import {
  getTransfersToWarehouse,
  getDirectTransfersToWarehouse,
  getWarehouses,
} from "../../../GraphQL/InventorySchema";
import { Table, Pagination, ScrollArea } from "../../Elements";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { usePagination } from "@mantine/hooks";

export const ReceivableStocksTab = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [list, setList] = useState<WMS.Maybe<WMS.Maybe<WMS.Transfer>[]>>([]);

  const { data: dataDRWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const { data: dataICWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "INDIRECT_CHANNEL" },
  });

  const { data: dataEcomWarehouses } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });

  const [warehouseTransferTransactions, { loading: loadingTransfers }] =
    useLazyQuery(getTransfersToWarehouse, {
      context: { clientName: "warehouse" },
    });
  const [
    warehouseDirectTransferTransactions,
    { loading: loadingDirectTransfers },
  ] = useLazyQuery(getDirectTransfersToWarehouse, {
    context: { clientName: "warehouse" },
  });

  const pagination = usePagination({
    total: list?.length || 0,
    initialPage: 1,
  });

  const getWarehouseName = (warehouse: any) => {
    if (!warehouse) return "";

    const drWarehouseName: WMS.Warehouse =
      dataDRWarehouses?.warehouses?.items?.find(
        (e: WMS.Warehouse) => e.id == warehouse
      );

    const icWarehouseName: WMS.Warehouse =
      dataICWarehouses?.warehouses?.items?.find(
        (e: WMS.Warehouse) => e.id == warehouse
      );

    const ecomWarehouseName: WMS.Warehouse =
      dataEcomWarehouses?.warehouses?.items?.find(
        (e: WMS.Warehouse) => e.id == warehouse
      );
    return `${ecomWarehouseName?.name || drWarehouseName?.name || icWarehouseName?.name || warehouse} (${
      ecomWarehouseName?.id || drWarehouseName?.id || icWarehouseName?.id || warehouse
    })`;
  };

  useEffect(() => {
    if (router.query.warehouse) {
      getAllFloatingTransferTransactions([], undefined);
    }
  }, [router.query.warehouse]);

  const getAllFloatingTransferTransactions = (
    list: WMS.Transaction[],
    next_token: string | undefined
  ) => {
    warehouseTransferTransactions({
      variables: {
        status: "FLOATING",
        warehouse_id: router.query.warehouse,
        next_token: next_token,
      },
    }).then((res) => {
      const updateList: (WMS.Transaction & WMS.Transfer)[] = [
        ...list,
        ...res?.data?.transfersToWarehouse?.items,
      ];
      if (res.data.transfersToWarehouse.next_token)
        return getAllFloatingTransferTransactions(
          updateList,
          res.data.transfersToWarehouse.next_token
        );
      getAllFloatingDirectTransferTransactions(updateList, undefined);
    });
  };

  const getAllFloatingDirectTransferTransactions = (
    list: WMS.Transaction[],
    next_token: string | undefined
  ) => {
    warehouseDirectTransferTransactions({
      variables: {
        status: "FLOATING",
        warehouse_id: router.query.warehouse,
        next_token: next_token,
      },
    }).then((res) => {
      const updateList: (WMS.Transaction & WMS.Transfer)[] = [
        ...list,
        ...res?.data?.directTransfersToWarehouse?.items,
      ];
      if (res.data.directTransfersToWarehouse.next_token)
        return getAllFloatingDirectTransferTransactions(
          updateList,
          res.data.transfersToWarehouse.next_token
        );
      setList(
        updateList.sort(
          (a, b) => Number(a.date_created) - Number(b.date_created)
        )
      );
    });
  };

  const formatReceivableLogs = (list: WMS.Maybe<WMS.Maybe<WMS.Transfer>[]>) => {
    const newList = [...(list || [])];
    return newList?.sort(
      (a, b) =>
        parseInt(b?.date_created || "0") - parseInt(a?.date_created || "0")
    );
  };

  const rows = () => {
    return formatReceivableLogs(list)
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() => {
              if (element?.id?.includes("INDIRECT_TRANSFER")) {
                router.push(
                  `/inventory/warehouse/transaction/?transactionId=${element?.id}&warehouse=${router.query.warehouse}&transaction=indirect_transfer`
                );
              } else if (element?.id?.includes("DIRECT_TRANSFER")) {
                router.push(
                  `/inventory/warehouse/transaction/?transactionId=${element?.id}&warehouse=${router.query.warehouse}&transaction=direct_transfer`
                );
              } else {
                router.push(
                  `/inventory/warehouse/transaction/?transactionId=${element?.id}&warehouse=${router.query.warehouse}&transaction=transfer`
                );
              }
              // window.open(
              //   `/inventory/warehouse/transaction/?transactionId=${
              //     element?.id
              //   }&warehouse=${router.query.warehouse}&transaction=${
              //     element?.id?.includes("DIRECT_TRANSFER")
              //       ? "direct_transfer"
              //       : element?.id?.includes("INDIRECT_TRANSFER")
              //       ? "indirect_transfer"
              //       : "transfer"
              //   }`
              // );
            }}
          >
            <td>{element?.id}</td>
            <td>{element?.status}</td>
            <td>
              {dayjs(Number(element?.date_created)).format(
                "MMM D, YYYY h:mm A"
              )}
            </td>
            <td>
              {dayjs(Number(element?.date_updated)).format(
                "MMM D, YYYY h:mm A"
              )}
            </td>
            <td>{element?.invoice_id}</td>
            <td>{element?.remarks}</td>
            <td>{getWarehouseName(element?.warehouse_id)}</td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Invoice ID</th>
              <th>Remarks</th>
              <th>Origin Warehouse</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((formatReceivableLogs(list)?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
