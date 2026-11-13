import React, { useState, useEffect } from "react";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { getWarehouseLogsFilters } from "../../Layouts/Inventory/InventoryConfig";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { getWarehourseTransactions } from "../../../GraphQL/InventorySchema";
import { deleteDraftedTransaction } from "../../../GraphQL/TransactionSchema";
import {
  Group,
  Select,
  Table,
  Pagination,
  ScrollArea,
  Modal,
  Button,
} from "../../Elements";
import { usePagination } from "@mantine/hooks";
import { WMS } from "../../../GraphQL";
import Notification from "../../Elements/Notification/Notification";
import { ActionIcon } from "../../Elements/ActionIcon";
import { Trash } from "tabler-icons-react";

export const DraftsTab = () => {
  const { classes } = useStyles();
  const [list, setList] = useState<WMS.Transaction[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState<string | undefined>(undefined);
  const [pendingDelete, setPendingDelete] =
    useState<WMS.Transaction | null>(null);
  const pagination = usePagination({
    total: list?.length || 0,
    initialPage: 1,
  });
  const router = useRouter();
  const [fetchDrafts, { loading, error, refetch }] = useLazyQuery(
    getWarehourseTransactions,
    { context: { clientName: "warehouse" } },
  );

  const [deleteDraft, { loading: deleteLoading, error: deleteError }] =
    useMutation(deleteDraftedTransaction, {
      context: { clientName: "warehouse" },
    });
  useEffect(() => {
    if (router.query.warehouse) {
      getAllDrafts([], undefined);
    }
  }, [router.query.warehouse]);

  const getAllDrafts = (
    list: WMS.Transaction[],
    next_token: string | undefined,
  ) => {
    if (list.length >= 300) {
      setList(list.slice(0, 300));
      return;
    }

    fetchDrafts({
      variables: {
        warehouse_id: router.query.warehouse,
        status: "PENDING",
        next_token: next_token,
      },
    }).then((res) => {
      const updateList: WMS.Transaction[] = [
        ...list,
        ...res?.data?.transactionsPerWarehouse?.items,
      ];
      if (res?.data?.transactionsPerWarehouse?.next_token)
        return getAllDrafts(
          updateList,
          res?.data?.transactionsPerWarehouse?.next_token,
        );
      setList(updateList);
    });
  };

  const formatDraftsLogs = (list: WMS.Transaction[] | undefined) => {
    return list
      ?.filter((e) => (filter === "ALL" ? e : e?.type === filter))
      .sort(
        (a, b) =>
          parseInt(b?.date_created || "0") - parseInt(a?.date_created || "0"),
      );
  };

  const rows = () => {
    return formatDraftsLogs(list)
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
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
                }`,
              )
            }
          >
            <td>{element?.type}</td>
            <td>{element?.id}</td>
            <td>{element?.status}</td>
            <td>
              {dayjs(Number(element?.date_created)).format(
                "MMM D, YYYY h:mm A",
              )}
            </td>
            <td>
              {element?.date_updated
                ? dayjs(Number(element?.date_updated)).format(
                    "MMM D, YYYY h:mm A",
                  )
                : "-"}
            </td>
            <td>{element?.invoice_id}</td>
            <td>{element?.remarks}</td>
            <td>
              <ActionIcon
                color="red"
                variant="light"
                disabled={pendingDelete != null ? true : false}
                onClick={
                  ((e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleDeleteClick(element);
                  }) as unknown as () => void
                }
              >
                <Trash size={16} />
              </ActionIcon>
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  const handleDeleteClick = (transaction: WMS.Transaction) => {
    setPendingDelete(transaction);
    setShowModal("delete_draft");
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      if (pendingDelete.status !== "PENDING") {
        return Notification.error({ message: "Deleting Draft Failed" });
      }

      if (pendingDelete.batch_items && pendingDelete.batch_items.length > 0) {
        return Notification.error({
          message: "Please Delete/Void the Draft contents and Refresh the page",
        });
      }

      await deleteDraft({
        variables: { id: pendingDelete.id },
      });

      Notification.success({
        message: `Successfully deleted ${pendingDelete.id}`,
      });

      setList((prev) => prev.filter((t) => t.id !== pendingDelete.id));
    } catch (err) {
      console.error("Delete failed:", err);
      Notification.error({ message: "Deleting Draft Failed" });
    } finally {
      setPendingDelete(null);
      setShowModal(undefined);
    }
  };

  const modalTypeRender = () => (
    <Modal
      centered
      title="Delete Confirmation"
      onClose={() => {
        setPendingDelete(null);
        setShowModal(undefined);
      }}
      opened={showModal === "delete_draft"}
    >
      Are you sure you want to delete this draft?
      <Group position="right">
        <Button
          customType="danger"
          size="xs"
          onClick={() => {
            setPendingDelete(null);
            setShowModal(undefined);
          }}
        >
          Cancel
        </Button>
        <Button size="xs" customType="primary" onClick={confirmDelete}>
          Delete
        </Button>
      </Group>
    </Modal>
  );

  return (
    <div className={classes.tabPanelContainer}>
      {modalTypeRender()}
      <Group>
        <Select
          defaultValue="ALL"
          searchable
          data={getWarehouseLogsFilters.map((e) => {
            return {
              label: e,
              value: e,
            };
          })}
          description="Filter by type"
          placeholder="Select type"
          onChange={(e) => {
            setFilter(e);
            pagination.setPage(1);
          }}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((formatDraftsLogs(list)?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
