import { useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { RETAIL } from "../../../GraphQL";
import { getActivations } from "../../../GraphQL/TransactionSchema";
import {
  DateRangePicker,
  LoadingOverlay,
  Table,
  Pagination,
  ScrollArea,
} from "../../Elements";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { LampsActivatonStatus } from "./LampsActivatonStatus";
import { usePagination } from "@mantine/hooks";

export interface OutletProps extends RETAIL.Outlet {
  activation_id: string;
}

export const LampsTab = () => {
  const { classes } = useStyles();
  const [activationQuery, { loading: loading }] = useLazyQuery(getActivations, {
    context: { clientName: "retail" },
  });
  const [list, setList] = useState<OutletProps[]>([]);
  const pagination = usePagination({ total: list.length || 0, initialPage: 1 });

  const [date, setDate] = useState({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  useEffect(() => {
    loadActivations([], undefined, date);
  }, []);

  const loadActivations = (
    list: OutletProps[],
    next_token: string | undefined,
    date: { from: string; to: string },
  ) => {
    activationQuery({
      variables: {
        date_filter: date,
      },
    }).then((res) => {
      const updateList = [
        ...list,
        ...res.data.activations.items.flatMap(
          (e: RETAIL.Activation) =>
            e?.outlets?.map((e1) => ({ ...e1, activation_id: e.id })),
        ),
      ];
      setList(updateList);
    });
  };

  const rows = () => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((element: OutletProps, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td>{element?.activation_id}</td>
            <td>{element?.name}</td>
            <td>{element?.location}</td>
            <td>
              <LampsActivatonStatus activation={element} />
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div className={classes.tabPanelContainer}>
      <LoadingOverlay visible={loading} />
      <DateRangePicker
        description="Select date range"
        defaultValue={[dayjs(date.from).toDate(), dayjs(date.to).toDate()]}
        onChange={(date) => {
          if (date[1]) {
            loadActivations([], undefined, {
              from: dayjs(date[0]).format("YYYY-MM-DD"),
              to: dayjs(date[1]).format("YYYY-MM-DD"),
            });
          }
        }}
      />
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Activation</th>
              <th>Outlet</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
      <br />
      <Pagination
        position="center"
        total={Math.ceil((list?.length || 0) / 100)}
        page={pagination.active}
        onChange={pagination.setPage}
      />
    </div>
  );
};
