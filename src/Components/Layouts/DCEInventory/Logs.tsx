import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  DateRangePicker,
  LoadingOverlay,
  ScrollArea,
  Table,
  Badge,
} from "../../Elements";
import { CaretDown, CaretUp } from "tabler-icons-react";
import { useLazyQuery } from "@apollo/client";
import { getBlockedSKULogs } from "../../../GraphQL/SKUsSchema";
import { WMS } from "../../../GraphQL";
import { Maybe } from "graphql/jsutils/Maybe";
import dayjs from "dayjs";

export const Logs = () => {
  const [expand, setExpand] = useState<string[]>([]);
  const [list, setList] = useState<WMS.SkuBlockLogs[]>([]);
  const [queryLogs, { loading }] = useLazyQuery(getBlockedSKULogs, {
    context: { clientName: "warehouse" },
  });

  useEffect(() => {
    loadLogs({
      from: dayjs().startOf("month").unix(),
      to: dayjs().endOf("month").unix(),
    });
  }, []);

  const statusBadge = (status: string) => {
    if (status == "BLOCKED") {
      return (
        <Badge size="lg" fullWidth color="red">
          BLOCKED
        </Badge>
      );
    } else {
      return (
        <Badge size="lg" fullWidth color="green">
          LIVE
        </Badge>
      );
    }
  };

  const loadLogs = (date: { from: number; to: number }) => {
    queryLogs({
      variables: {
        from: date.from * 1000,
        to: date.to * 1000,
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      setList(res.data.skuBlockLogs.items);
    });
  };

  const onClickItem = (id: string) => {
    if (expand.some((e) => e == id)) {
      setExpand(expand.filter((e) => e !== id));
    } else {
      setExpand([...expand, id]);
    }
  };

  console.log(list);

  const expandedTable = (items: Maybe<WMS.Sku>[]) => {
    return (
      <>
        <td colSpan={7}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>UOM</th>
                  <th>Inventory Type</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item: Maybe<WMS.Sku>, i: number) => (
                  <tr key={` batch-${i}`}>
                    <td></td>
                    <td>{item?.sku}</td>
                    <td>{item?.name}</td>
                    <td>{item?.unit_of_measure}</td>
                    <td>{item?.type}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  const rows = () => {
    return list?.map((element, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr onClick={() => onClickItem(`${element?.id}-${index}`)}>
          <td style={{ width: 10 }}>
            {
              <ActionIcon>
                {expand?.some((e) => e == `${element?.id}-${index}`) ? (
                  <CaretUp />
                ) : (
                  <CaretDown />
                )}
              </ActionIcon>
            }
          </td>
          <td>{element?.modified_by}</td>
          <td>{dayjs(element?.date_created).format("MMM-DD-YYYY, hh:mm A")}</td>
          <td>
            <div style={{ width: 100 }}>{statusBadge(`${element?.log}`)}</div>
          </td>
        </tr>
        {expand?.some((e) => e == `${element?.id}-${index}`) ? (
          <tr key={`list-expanded=${index}`}>
            {expandedTable(element?.skus || [])}
          </tr>
        ) : undefined}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <DateRangePicker
        defaultValue={[
          dayjs().startOf("month").toDate(),
          dayjs().endOf("month").toDate(),
        ]}
        onChange={(date: [Date, Date]) => {
          if (!date[1]) return;
          loadLogs({
            from: dayjs(date[0]).startOf("day").unix(),
            to: dayjs(date[1]).endOf("day").unix(),
          });
        }}
        description="Date"
      />
      <br />
      <ScrollArea scrollbarSize={20} style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th></th>
              <th>User</th>
              <th>Date & Time</th>
              <th>Status Logs</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
