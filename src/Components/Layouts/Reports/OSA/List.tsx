import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  getOSAReports,
  getWarehouses,
  report,
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
} from "../../../Elements";
import { Details } from "./Details";
import { useAtom } from "jotai";
import { channelAtom } from "../../../../Store/StoreAtom";
import { useUploadPortalStore } from "../Store";

export const List = () => {
  const [selectedChannel] = useAtom(channelAtom);

  const [fetchOSAReports, { loading }] = useLazyQuery(getOSAReports, {
    context: { clientName: "warehouse" },
  });
  const { warehouses } = useUploadPortalStore();

  const [reports, setReports] = useState<WMS.OSA[]>([]);
  const [selectedOSA, setSelectedOSA] =
    useState<WMS.OSA | undefined>(undefined);
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

  useEffect(() => {
    if (warehouses) {
      warehouses[0]?.id
        ? loadOSAReports([], warehouses[0]?.id, filter.date_filter, undefined)
        : null;
    }
  }, [warehouses]);

const loadOSAReports = (
  list: WMS.OSA[],
  warehouse_id: string | undefined,
  date_filter: WMS.DateFilter,
  next_token: string | undefined
) => {
  fetchOSAReports({
    variables: {
      warehouse_id,
      date_filter,
      next_token,
    },
  }).then((res) => {
    const updateList = [...list, ...(res?.data?.OSAList?.items || [])];
    const next_token = res?.data?.OSAList?.nextToken;

    if (next_token) {
      return loadOSAReports(
        updateList,
        warehouse_id,
        date_filter,
        next_token
      );
    }

    setFilter({ date_filter, warehouse_id });
    setReports(updateList);
  });
};

  const rows = reports.map((element: WMS.OSA, index: number) => (
    <tr onClick={() => setSelectedOSA(element)} key={element.id}>
      <td>{element.id}</td>
      <td>{element.warehouse_id}</td>
      <td>
        {dayjs(Number(element?.datetime || 0) * 1000).format("MMM-DD-YYYY")}
      </td>
            <td>
        {dayjs(Number(element?.date_created || 0) * 1000).format("MMM-DD-YYYY")}
      </td>
      <td>{element.created_by}</td>
    </tr>
  ));

  return (
    <div>
      <Stack>
        <Details onClose={() => setSelectedOSA(undefined)} osa={selectedOSA} />
        {warehouses.length > 0 && (
          <Group>
            <Select
              searchable
              defaultValue={warehouses[0]?.id}
              data={warehouses.map((e) => {
                return {
                  label: `${e.name}`,
                  value: `${e.id}`,
                };
              })}
              onChange={(e) => {
                loadOSAReports([], e, filter.date_filter, undefined);
              }}
            />
            <DatePicker
              defaultValue={dayjs().toDate()}
              onChange={(e) =>
                loadOSAReports(
                  [],
                  filter.warehouse_id,
                  {
                    from: dayjs(e).format("YYYY-MM-DD"),
                    to: dayjs(e).format("YYYY-MM-DD"),
                  },
                  undefined
                )
              }
            />
          </Group>
        )}
        <ScrollArea style={{ height: 700 }}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Store</th>
                <th>Date Submission</th>
                <th>Date Created</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </div>
  );
};
