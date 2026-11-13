import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { LoadingOverlay, ScrollArea, Table } from "../../Elements";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import { SalesLogsDetails } from "./SalesLogsDetails";
import { WMS } from "../../../GraphQL";
import { useLazyQuery, useMutation } from "@apollo/client";
import { getReturnRefundTransactions } from "../../../GraphQL/RecordSalesSchema";
import { useAtom } from "jotai";
import { userAtom } from "../../../Store/StoreAtom";
import Amplify, { Storage } from "../../../Utilities/Backend";
import Notification from "../../Elements/Notification/Notification";
import { useStyles } from "./Sales.styles";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";

type FilterProps = {
  warehouse_id: string | undefined | null;
  date: {
    from: string;
    to: string;
  };
};

export const RefundList = () => {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const [selectedLogs, setSelectedLogs] = useState<WMS.SaleTransaction>();
  const [list, setList] = useState<WMS.SaleTransaction[]>([]);
  const [queryRefundTransactions, { loading: loading }] = useLazyQuery(
    getReturnRefundTransactions,
    { context: { clientName: "warehouse" } }
  );
  const [user] = useAtom(userAtom);
  const [filters, setFilters] = useState<FilterProps>({
    warehouse_id: undefined,
    date: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().endOf("week").format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (user.username && user.office_ids) {
      getTransactionList(
        filters.date,
        user?.office_ids ? user?.office_ids[0] : undefined
      );
    }
  }, [user]);

  const getTransactionList = (
    date: { from: string; to: string },
    warehouse_id: string | undefined | null
  ) => {
    queryRefundTransactions({
      variables: {
        warehouse_id: warehouse_id,
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
      setList(res?.data?.refundTransactions?.items);
      setFilters({
        warehouse_id: warehouse_id,
        date: date,
      });
    });
  };

  const onRemoveRecord = (id: string) => {
    const updateList = [...list];
    setList(updateList.filter((e) => e.transaction_id !== id));
    setSelectedLogs(undefined);
  };

  const checkRoles = (created_by: string | undefined) => {
    if (user.roles?.some((e) => e === WMS.Role.AdminDC )) return false;
    if (user.username === created_by) return false;
    return true;
  };

  const rows = list?.map((element, index) => (
    <tr onClick={() => setSelectedLogs(element)} key={`list-${index}`}>
      <td>{element.transaction_no}</td>
      <td>{element.warehouse_id}</td>
      <td>{element.created_by}</td>
      <td>{element.sales_expert}</td>
      <td>{element.cegid_no}</td>
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
      <SalesLogsDetails
        onRefund={() => console.log("Refund")}
        onRemoveRecord={onRemoveRecord}
        details={selectedLogs}
        visible={selectedLogs ? true : false}
        onClose={() => setSelectedLogs(undefined)}
      />
      {user.username ? (
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
            getTransactionList(date, warehouse);
          }}
        />
      ) : undefined}
      <br />
      <ScrollArea scrollbarSize={10} style={{ height: 800 }}>
        <Table
          highlightOnHover
          fontSize={width <= isTabletMobileView ? "xs" : "md"}
        >
          <thead>
            <tr>
              <th>
                <div className={classes.mobileTableTH}>Invoice ID</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Warehouse/Store</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Created By</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Sales Expert</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>CEGID No.</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Date Created</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
