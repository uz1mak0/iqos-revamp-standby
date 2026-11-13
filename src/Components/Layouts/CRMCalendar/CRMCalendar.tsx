import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import { getTodaySchedule } from "../../../GraphQL/CRMSchema";
import {
  Input,
  Paper,
  Select,
  Group,
  ScrollArea,
  Table,
  Badge,
} from "../../Elements";
import { LoadingOverlay } from "@mantine/core";
import { Schedule } from "./Config";
import { CalendarNavgation } from "./CalendarNavgation";
import dayjs from "dayjs";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

export const CRMCalendar = () => {
  const [queryTodaySchedule, { loading }] = useLazyQuery(getTodaySchedule, {
    context: { clientName: "warehouse" },
  });
  const [filterValue, setFilterValue] = useDebouncedState<string | undefined>(
    undefined,
    200,
  );
  const [list, setList] = useState<Schedule[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSchedule(dayjs().format("YYYY-MM-DD"));
  }, []);

  const getStatusView = (status: string) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "COMPLETED":
        return "green";
      case "ABANDONED":
        return "red";
      default:
        break;
    }
  };

  const filterItem = (items: Schedule[]) => {
    if (!filterValue) return items;
    const value = filterValue?.toLowerCase();
    return items.filter(
      (e) =>
        e.customer_info?.first_name?.toLowerCase()?.includes(value) ||
        e.customer_info?.last_name?.toLowerCase()?.includes(value),
    );
  };

  const rows = filterItem(list).map((item, index) => (
    <tr
      onClick={() =>
        router.push(
          `/crm/${
            item.type === "HYPERCARE SCHEDULE"
              ? "hypercare"
              : "trial-management"
          }/order?orderID=${item.customer_id}`,
        )
      }
      key={`list-${index}`}
    >
      <td>{item.customer_info.customer_id}</td>
      <td>
        {item.customer_info.first_name} {item.customer_info.last_name}
      </td>
      <td>{dayjs(item.time, "HH:mm").format("hh: mm A")}</td>
      <td>
        <Badge color={getStatusView(item.status)}>{item.status}</Badge>
      </td>
      <td>
        <Badge color={"green"}>{item.type}</Badge>
      </td>
    </tr>
  ));

  const loadSchedule = (date: string) => {
    queryTodaySchedule({
      variables: {
        date: date,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      setList(data.schedules.items);
    });
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <CalendarNavgation onSelectDate={loadSchedule} />
      <br />
      <Paper radius={10}>
        <Group align="center" spacing={"lg"}>
          <h3>List of Lead Schedule</h3>
          <Input
            icon={<IconSearch />}
            onChange={(e) => {
              if (e.target.value) {
                setFilterValue(e.target.value);
              } else {
                setFilterValue(undefined);
              }
            }}
            style={{ width: 400 }}
            placeholder="Search by Name..."
          />
          {/* <Select 
            data={[]}
            description="Filter by status"
            placeholder={"Select Status"}
          /> */}
        </Group>
        <ScrollArea style={{ height: 700 }}>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th>Consumer ID</th>
                <th>Consumer Name</th>
                <th>Time</th>
                <th>Status</th>
                <th>Schedule Type</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </div>
  );
};
