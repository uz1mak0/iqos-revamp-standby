import { s3Url } from "../../../../Utilities/Backend";
import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  getPOReports,
  updatePOStatus,
  getPO,
} from "../../../../GraphQL/ReportsSchema";
import { WMS } from "../../../../GraphQL";
import dayjs from "dayjs";
import {
  DatePicker,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Button,
  ActionIcon,
  Input,
  Checkbox,
} from "../../../Elements";
import { ArrowDown, ArrowUp, Download } from "tabler-icons-react";
import { Details } from "./Details";

import { useAtom } from "jotai";

import { channelAtom, userAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { useUploadPortalStore } from "../Store";
import Notification from "../../../Elements/Notification/Notification";

export const List = () => {
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  const [selectedChannel] = useAtom(channelAtom);

  const [fetchPOReports] = useLazyQuery(getPOReports, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [getPOReport] = useLazyQuery(getPO, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [updateStatus] = useMutation(updatePOStatus, {
    context: { clientName: "warehouse" },
  });

  const { warehouses } = useUploadPortalStore();

  const [reports, setReports] = useState<WMS.POs[]>([]);
  const [selectedPO, setSelectedPO] = useState<WMS.POs | undefined>(undefined);
  const [sortOpenFirst, setSortOpenFirst] = useState(true);
  const [searchInvoice, setSearchInvoice] = useState("");
  const [filter, setFilter] = useState<{
    warehouse_id: string | undefined;
    date_filter: WMS.DateFilter;
  }>({
    warehouse_id: undefined,
    date_filter: {
      from: dayjs().startOf("day").format("YYYY-MM-DD"),
      to: dayjs().endOf("day").format("YYYY-MM-DD"),
    },
  });

  const [selectedForBulk, setSelectedForBulk] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (warehouses && warehouses[0]?.id) {
      loadPOReports([], warehouses[0]?.id, filter.date_filter, undefined);
    }
  }, [warehouses]);

  const loadPOReports = (
    list: WMS.POs[],
    warehouse_id: string | undefined,
    date_range: WMS.DateFilter,
    next_token?: string,
  ) => {
    fetchPOReports({
      variables: {
        warehouse_id,
        date_range,
        next_token,
        channel: selectedChannel,
      },
    }).then((res) => {
      const updateList = [
        ...list,
        ...(res?.data?.posTransactions?.items || []),
      ];
      const nextToken = res?.data?.posTransactions?.nextToken;
      if (nextToken) {
        return loadPOReports(updateList, warehouse_id, date_range, nextToken);
      }
      setFilter({ date_filter: date_range, warehouse_id });
      setReports(updateList);
    });
  };

  const handleUpdateStatus = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await updateStatus({
          variables: {
            id,
            update_by: user.username,
            channel: selectedChannel,
          },
        });
      }
      setReports((prev) =>
        prev.map((po) =>
          ids.includes(po.id!)
            ? { ...po, status: "Close" as WMS.POStatus }
            : po,
        ),
      );

      Notification.success({
        message: `Successfully updated status`,
      });

      setSelectedForBulk(new Set()); // Clear bulk selection
    } catch (error) {
      Notification.error({ message: `Failed to update status` });
    }
  };

  const toggleSelectForBulk = (id: string, checked: boolean) => {
    setSelectedForBulk((prev) => {
      const copy = new Set(prev);
      if (checked) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  };

  const sortedReports = [...reports]
    .filter((r) =>
      r.sales_invoice?.toLowerCase().includes(searchInvoice.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOpenFirst) return a.status === "Open" ? -1 : 1;
      else return a.status === "Close" ? -1 : 1;
    });

  const rows = sortedReports.map((element: WMS.POs, index: number) => (
    <tr key={element.id}>
      <td>
        {element.id && (
          <Checkbox
            disabled={element.status === "Close"}
            label=""
            checked={selectedForBulk.has(element.id)}
            onChange={(e) => {
              if (!element.id) return;
              toggleSelectForBulk(element.id, e.currentTarget.checked);
            }}
          />
        )}
      </td>
      <td>
        <Button onClick={() => setSelectedPO(element)}>
          {element.sales_invoice ?? "-"}
        </Button>
      </td>
      <td>{element.warehouse_id}</td>
      <td>
        {element.date
          ? dayjs(element.date * 1000).format("MMM DD YYYY")
          : "-"}
      </td>
      <td>
        {element.date_created
          ? dayjs(element.date_created * 1000).format("MMM DD YYYY")
          : "-"}
      </td>
      <td>{element.created_by}</td>
      <td>{element.updated_by ?? "-"}</td>
      <td>
        {userRoles.isFullAdmin ? (
          <Button
            disabled={element.status === "Close"}
            onClick={() => {
              if (element.id) handleUpdateStatus([element.id]);
            }}
          >
            {element.status === "Open" ? "Open" : "Close"}
          </Button>
        ) : (
          `${element.status}`
        )}
      </td>
      <td>
        {element.attachments && element.attachments.length > 0 && (
          <ActionIcon
            variant="filled"
            onClick={async () => {
              if (!element.attachments) return;

              for (const file of element.attachments) {
                if (!file) return;
                const url = s3Url(file?.bucket, file?.key, file?.region);
                const res = await fetch(url);
                const blob = await res.blob();
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = file.key.split("/").pop()!;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
              }
            }}
          >
            <Download />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  const handleSearchEnter = async () => {
    try {
      const { data } = await getPOReport({
        variables: {
          id: `PO_${searchInvoice}`,
          channel: selectedChannel,
        },
      });

      if (!data?.posTransaction) {
        Notification.error({ message: "Sale invoice ID Not Found" });
        return;
      }

      console.log("PO data:", data);

      setSelectedPO(data.posTransaction);
    } catch (error) {
      Notification.error({
        message: "Something went wrong in sales invoice ID search",
      });
      console.log(error);
    }
  };

  return (
    <div>
      <Stack>
        <Details onClose={() => setSelectedPO(undefined)} po={selectedPO} />

        {warehouses.length > 0 && (
          <Group>
            <Select
              label="Warehouse/Store"
              searchable
              defaultValue={warehouses[0]?.id}
              data={warehouses
                .filter((e) => e.name && e.id)
                .map((e) => ({ label: e.name!, value: e.id! }))}
              onChange={(e) =>
                loadPOReports([], e, filter.date_filter, undefined)
              }
            />
            <DatePicker
              label="Invoice Date"
              defaultValue={dayjs().toDate()}
              onChange={(e) =>
                loadPOReports([], filter.warehouse_id, {
                  from: dayjs(e).format("YYYY-MM-DD"),
                  to: dayjs(e).format("YYYY-MM-DD"),
                })
              }
            />
            <Input
              label="Search"
              placeholder="Search by Sales Invoice"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.currentTarget.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleSearchEnter();
                }
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
                <th>Sales Invoice</th>
                <th>Store</th>
                <th>Invoice Date</th>
                <th>Date Submission</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th>
                  <Group>
                    Status
                    <ActionIcon
                      onClick={() => setSortOpenFirst(!sortOpenFirst)}
                      variant={sortOpenFirst ? "outline" : "filled"}
                      size="xs"
                    >
                      {sortOpenFirst ? <ArrowUp /> : <ArrowDown />}
                    </ActionIcon>
                  </Group>
                </th>
                <th>Attch</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </div>
  );
};
