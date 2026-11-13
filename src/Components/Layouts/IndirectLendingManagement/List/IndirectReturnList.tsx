import React, { useEffect, useState } from "react";
import { OrdersFilter } from "../../../Modules/Filters/OrdersFilter";
import { WMS } from "../../../../GraphQL";
import dayjs from "dayjs";
import { SalesScanner } from "../../SalesLogs/SalesScanner";
import { LoadingOverlay, ScrollArea, Table } from "../../../Elements";
import { useLazyQuery } from "@apollo/client";
import { getDCLendingTransactons } from "../../../../GraphQL/RecordSalesSchema";
import IndirectLendingOrderDetails from "./IndirectLendingOrderDetails";
import { channelAtom, rolesAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";

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

export const IndirectReturnList = ({ user }: Props) => {
  const [list, setList] = useState<WMS.SaleTransaction[]>([]);
  const [selectedLending, setSelectedLending] = useState<WMS.SaleTransaction>();
  const [channel] = useAtom(channelAtom);
  const [queryLendingTransactions, { loading: loading }] = useLazyQuery(
    getDCLendingTransactons,
    { context: { clientName: "warehouse" }, fetchPolicy: "no-cache" }
  );

  const [filters, setFilters] = useState<FilterProps>({
    warehouse_id: undefined,
    date: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().endOf("week").format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (user.username && user.office_ids) {
      getLendingTransactionList(
        filters.date,
        user?.office_ids ? user?.office_ids[0] : user.office_id
      );
    }
  }, [user]);

  const onClose = () => {
    setSelectedLending(undefined);
  };

  const getLendingTransactionList = (
    date: { from: string; to: string },
    warehouse_id: string | undefined | null
  ) => {
    queryLendingTransactions({
      variables: {
        warehouse_id: warehouse_id,
        type: WMS.LendingSalesType.ReturnLending,
        channel: channel,
        date_filter: date
          ? {
              from: Number(
                dayjs(date.from, "YYYY-MM-DD").startOf("day").unix()
              ),
              to: Number(dayjs(date.to, "YYYY-MM-DD").endOf("day").unix()),
            }
          : {
              from: Number(
                dayjs(filters.date.from, "YYYY-MM-DD").startOf("day").unix()
              ),
              to: Number(
                dayjs(filters.date.to, "YYYY-MM-DD").endOf("day").unix()
              ),
            },
      },
    }).then((res) => {
      const lendingList: WMS.SaleTransaction[] =
        res?.data?.lendingSaleTransactions?.items;
      setList(lendingList);
      setFilters({
        warehouse_id: warehouse_id,
        date: date,
      });
    });
  };

  const rows = list?.map((element, index) => (
    <tr onClick={() => setSelectedLending(element)} key={`${index}`}>
      <td>{element.transaction_no}</td>
      <td>{element.warehouse_id}</td>
      <td>{element.created_by}</td>
      <td>
        {dayjs(Number((element?.date_created || 0) * 1000)).format(
          "MMM-DD-YYYY"
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <IndirectLendingOrderDetails order={selectedLending} onClose={onClose} />
      {user.username && (
        <OrdersFilter
          isDateRange
          defaultValues={{
            warehouse: user?.office_ids ? `${user?.office_ids[0]}` : "PH01",
            date: {
              from: dayjs().startOf("week").format("YYYY-MM-DD"),
              to: dayjs().endOf("week").format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => {
            getLendingTransactionList(date, warehouse);
          }}
        />
      )}
      <br />
      <ScrollArea style={{ height: 800 }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>
                <div>Invoice ID</div>
              </th>
              <th>
                <div>Warehouse/Store</div>
              </th>
              <th>
                <div>Created By</div>
              </th>
              <th>
                <div>Date Created</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
