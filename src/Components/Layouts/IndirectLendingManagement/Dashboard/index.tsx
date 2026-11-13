import React, { useEffect, useState } from "react";
import { OrdersFilter } from "../../../Modules/Filters/OrdersFilter";
import { WMS } from "../../../../GraphQL";
import dayjs from "dayjs";
import {
  LoadingOverlay,
  ScrollArea,
  Table,
  Card,
  Input,
} from "../../../Elements";
import { useLazyQuery } from "@apollo/client";
import {
  getDCLendingTransactons,
  lendingSalesTransaction,
} from "../../../../GraphQL/RecordSalesSchema";
import { channelAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";
import { Group } from "@mantine/core";
import IndirectLendingOrderDetails from "../List/IndirectLendingOrderDetails";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  user: WMS.Admin;
};

type FilterProps = {
  warehouse_id: string | undefined | null;
  date: {
    from: string;
    to: string;
  };
};

enum LendingStatus {
  ALL = "ALL",
  ONGOING = "ONGOING",
  RETURNED = "RETURNED",
  RETRIEVAL = "RETRIEVAL",
}

export const LendingDashboard = ({ user }: Props) => {
  const [lendingList, setLendingList] = useState<WMS.SaleTransaction[]>([]);
  const [returnLendingList, setReturnLendingList] = useState<
    WMS.SaleTransaction[]
  >([]);
  const [selectedLending, setSelectedLending] = useState<WMS.SaleTransaction>();
  const [selectedStatus, setSelectedStatus] = useState<LendingStatus>(
    LendingStatus.ALL,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [channel] = useAtom(channelAtom);
  const [role] = useAtom(rolesAtom);

  const [searchInvoice, setSearchInvoice] = useState("");
  const [filters, setFilters] = useState<FilterProps>({
    warehouse_id: undefined,
    date: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().endOf("week").format("YYYY-MM-DD"),
    },
  });

  const [getLending] = useLazyQuery(lendingSalesTransaction, {
    context: { clientName: "warehouse" },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [queryLending, { loading: loadingLending }] = useLazyQuery(
    getDCLendingTransactons,
    {
      context: { clientName: "warehouse" },
      fetchPolicy: "no-cache",
    },
  );

  const [queryReturnLending, { loading: loadingReturn }] = useLazyQuery(
    getDCLendingTransactons,
    {
      context: { clientName: "warehouse" },
      fetchPolicy: "no-cache",
    },
  );

  const loading = loadingLending || loadingReturn;

  useEffect(() => {
    getTransactions(
      filters.date,
      user?.office_ids ? user.office_ids[0] : user.office_id,
    );
  }, [user]);

  const onClose = () => setSelectedLending(undefined);

  const handleLendingStatus = (element: MergedLending) => {
    if (element.status === "CLOSED") return "CLOSED";

    const now = dayjs().unix();
    const dateCreated = element.date_created || 0;
    const daysElapsed = (now - dateCreated) / (60 * 60 * 24);

    if (daysElapsed > 15) return "FOR RETRIEVAL";

    return "OPEN";
  };

  const getTransactions = async (
    date: { from: string; to: string },
    warehouse_id: string | undefined | null,
  ) => {
    const fromUnix = dayjs(date.from, "YYYY-MM-DD").startOf("day").unix();
    const toUnix = dayjs(date.to, "YYYY-MM-DD").endOf("day").unix();

    try {
      const lendingRes = await queryLending({
        variables: {
          warehouse_id,
          type: WMS.LendingSalesType.Lending,
          channel,
          date_filter: { from: fromUnix, to: toUnix },
        },
      });

      const returnRes = await queryReturnLending({
        variables: {
          warehouse_id,
          type: WMS.LendingSalesType.ReturnLending,
          channel,
          date_filter: { from: fromUnix, to: toUnix },
        },
      });

      setLendingList(lendingRes?.data?.lendingSaleTransactions?.items || []);
      setReturnLendingList(
        returnRes?.data?.lendingSaleTransactions?.items || [],
      );
      setFilters({ warehouse_id, date });
    } catch (err) {
      console.error("Failed to fetch lending transactions:", err);
      setLendingList([]);
      setReturnLendingList([]);
    }
  };

  type MergedLending = WMS.SaleTransaction & {
    return_date?: number | null;
    transaction_no: string;
    status: "OPEN" | "CLOSED" | string;
  };

  const mergedList: MergedLending[] = React.useMemo(() => {
    const map = new Map<string, MergedLending>();

    lendingList.forEach((item) => {
      if (!item.id) return;
      map.set(item.id, {
        ...item,
        return_date: null,
        transaction_no: item.transaction_no || item.id,
        status: item.status || "OPEN",
      });
    });

    returnLendingList.forEach((item) => {
      if (!item.id) return;
      const baseId = item.id.startsWith("RETURN_")
        ? item.id.replace(/^RETURN_/, "")
        : item.id;

      const existing = map.get(baseId);
      if (existing) {
        map.set(baseId, {
          ...existing,
          return_date: item.date_created || null,
          status: "CLOSED",
        });
      } else {
        map.set(baseId, {
          ...item,
          id: baseId,
          return_date: item.date_created || null,
          transaction_no: item.transaction_no || baseId,
          status: "CLOSED",
        });
      }
    });

    return Array.from(map.values());
  }, [lendingList, returnLendingList]);

  const cardCounts = React.useMemo(() => {
    const counts = {
      ALL: mergedList.length,
      ONGOING: 0,
      RETURNED: 0,
      RETRIEVAL: 0,
    };

    mergedList.forEach((e) => {
      const status = handleLendingStatus(e);
      if (status === "OPEN") counts.ONGOING += 1;
      else if (status === "CLOSED") counts.RETURNED += 1;
      else if (status === "FOR RETRIEVAL") counts.RETRIEVAL += 1;
    });

    return counts;
  }, [mergedList]);

  const filteredList = React.useMemo(() => {
    return mergedList
      .filter((item) => {
        const status = handleLendingStatus(item);
        switch (selectedStatus) {
          case LendingStatus.ALL:
            return true;
          case LendingStatus.ONGOING:
            return status === "OPEN";
          case LendingStatus.RETURNED:
            return status === "CLOSED";
          case LendingStatus.RETRIEVAL:
            return status === "FOR RETRIEVAL";
          default:
            return true;
        }
      })
      .filter((item) =>
        (item.transaction_no || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => (b.date_created || 0) - (a.date_created || 0));
  }, [mergedList, selectedStatus, searchTerm]);

  const calculateDaysLeft = (item: MergedLending) => {
    const created = item.date_created || 0;
    const returned = item.return_date || 0;
    const now = dayjs().unix();

    const status = handleLendingStatus(item);

    if (status === "CLOSED") {
      if (!returned) return 0;
      return Math.round((returned - created) / (60 * 60 * 24));
    } else {
      const daysElapsed = (now - created) / (60 * 60 * 24);
      return Math.round(14 - daysElapsed);
    }
  };

  const rows = filteredList.map((element, index) => (
    <tr key={index} onClick={() => setSelectedLending(element)}>
      <td>{element.transaction_no}</td>
      <td>{element.warehouse_id}</td>
      <td>{element.created_by}</td>
      <td>
        {element.date_created
          ? dayjs(element.date_created * 1000).format("MMM-DD-YYYY")
          : "-"}
      </td>
      <td>
        {element.return_date
          ? dayjs(element.return_date * 1000).format("MMM-DD-YYYY")
          : "-"}
      </td>
      <td>{calculateDaysLeft(element)} days</td>
      <td>{handleLendingStatus(element)}</td>
    </tr>
  ));

  const handleSearchEnter = async () => {
    try {
      const { data } = await getLending({
        variables: {
          id: `${searchTerm}`,
        },
      });

      if (!data?.lendingTransaction) {
        Notification.error({ message: "Sale invoice ID Not Found" });
        return;
      }

      console.log("PO data:", data);

      setSelectedLending(data.lendingTransaction);
    } catch (error) {
      Notification.error({
        message: "Something went wrong in sales invoice ID search",
      });
      console.log(error);
    }
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <IndirectLendingOrderDetails order={selectedLending} onClose={onClose} />

      {user.username && (
        <OrdersFilter
          isClearable={role.isSE ? false : true}
          isDateRange
          defaultValues={{
            warehouse: user?.office_ids ? `${user.office_ids[0]}` : undefined,
            date: {
              from: dayjs().startOf("week").format("YYYY-MM-DD"),
              to: dayjs().endOf("week").format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => getTransactions(date, warehouse)}
        />
      )}

      <br />
      <Group position="center">
        <Card
          title="ALL"
          background="#FD9710"
          number={cardCounts.ALL}
          onClick={() => setSelectedStatus(LendingStatus.ALL)}
          isSelected={selectedStatus === LendingStatus.ALL}
        />
        <Card
          title="ONGOING"
          background="#61B765"
          number={cardCounts.ONGOING}
          onClick={() => {
            setSelectedStatus(LendingStatus.ONGOING);
          }}
          isSelected={selectedStatus === LendingStatus.ONGOING}
        />
        <Card
          title="RETURNED"
          background="#A23DB6"
          number={cardCounts.RETURNED}
          onClick={() => setSelectedStatus(LendingStatus.RETURNED)}
          isSelected={selectedStatus === LendingStatus.RETURNED}
        />
        <Card
          title="FOR RETRIEVAL"
          background="#FF4444"
          number={cardCounts.RETRIEVAL}
          onClick={() => setSelectedStatus("RETRIEVAL" as LendingStatus)}
          isSelected={selectedStatus === "RETRIEVAL"}
        />
      </Group>

      <br />
      <Input
        placeholder="Search Invoice ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            await handleSearchEnter();
          }
        }}
      />
      <br />
      <ScrollArea style={{ height: 800 }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Warehouse/Store</th>
              <th>Created By</th>
              <th>Start Date</th>
              <th>Return Date</th>
              <th>Days Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
