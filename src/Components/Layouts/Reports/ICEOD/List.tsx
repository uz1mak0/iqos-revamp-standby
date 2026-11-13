import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  getEODReports,
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

  const [fetchEODReports, { loading }] = useLazyQuery(getEODReports, {
    context: { clientName: "warehouse" },
  });
  const { warehouses } = useUploadPortalStore();

  const [reports, setReports] = useState<WMS.EndOfDay[]>([]);
  const [selectedEOD, setSelectedEOD] =
    useState<WMS.EndOfDay | undefined>(undefined);

  const [filter, setFilter] = useState<{
    warehouse_id: string | undefined;
    date_filter: WMS.DateFilter;
    type: string;
  }>({
    warehouse_id: undefined,
    type: "EOD",
    date_filter: {
      from: dayjs().startOf("day").format("YYYY-MM-DD"),
      to: dayjs().endOf("day").format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (warehouses) {
      warehouses[0]?.id
        ? loadEODReports([], warehouses[0]?.id, filter.date_filter, undefined)
        : null;
    }
  }, [warehouses]);

  const loadEODReports = (
    list: WMS.EndOfDay[],
    warehouse_id: string | undefined,
    date_filter: WMS.DateFilter,
    next_token: string | undefined,
  ) => {
    fetchEODReports({
      variables: {
        type: "EOD",
        warehouse_id: warehouse_id,
        date_filter: date_filter,
        next_token: next_token,
      },
    }).then((res) => {
      const updateList = [...list, ...(res?.data?.endOfDayList?.items || [])];
      const next_token = res?.data?.endOfDayList?.nextToken;
      if (next_token) {
        return loadEODReports(
          updateList,
          warehouse_id,
          date_filter,
          next_token,
        );
      }
      setFilter({ date_filter: date_filter, warehouse_id: warehouse_id, type: "EOD" });
      setReports(updateList);
    });
  };

  const rows = reports.map((element: WMS.EndOfDay, index: number) => (
    <tr onClick={() => setSelectedEOD(element)} key={`sku-${index}`}>
      <td>{element.invoice_id}</td>
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
        <Details onClose={() => setSelectedEOD(undefined)} eod={selectedEOD} />
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
                loadEODReports([], e, filter.date_filter, undefined);
              }}
            />
            <DatePicker
              defaultValue={dayjs().toDate()}
              onChange={(e) =>
                loadEODReports(
                  [],
                  filter.warehouse_id,
                  {
                    from: dayjs(e).format("YYYY-MM-DD"),
                    to: dayjs(e).format("YYYY-MM-DD"),
                  },
                  undefined,
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
