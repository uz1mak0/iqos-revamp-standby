import React, { useEffect, useState } from "react";
import { Button, LoadingOverlay, Stack, Table } from "../../Elements";
import { RedactedOrders } from "./RedactedOrders";
import { getRedactionLogs } from "../../../GraphQL/RedactionSchema";
import { from, useLazyQuery } from "@apollo/client";
import { ORDER } from "../../../GraphQL";
import dayjs from "dayjs";
import { RedactionFilter } from "./RedactionFilter";
import { ExternalLink } from "tabler-icons-react";

export interface RedactionFilterProps {
  date: {
    from: string;
    to: string;
  };
  status: string | undefined;
}

export const RedactionLogs = () => {
  const [fetchRedactionLogs, { loading }] = useLazyQuery(getRedactionLogs, {
    context: { clientName: "order" },
  });
  const [list, setList] = useState<ORDER.RedactLog[]>([]);
  const [redactedOrders, setRedactedOrders] = useState<
    ORDER.RedactLog | undefined
  >(undefined);
  const [filters, setFilters] = useState<RedactionFilterProps>({
    date: {
      from: dayjs().startOf("week").format("YYYY-MM-DD"),
      to: dayjs().endOf("week").format("YYYY-MM-DD"),
    },
    status: undefined,
  });

  useEffect(() => {
    /**
     * The initial value of redaction logs is based on start date to end date of the current month
     * No next token on initial/first load
     * empty list for initial load
     */
    loadRedactionLogs([], filters, undefined);
  }, []);

  const loadRedactionLogs = (
    list: ORDER.RedactLog[],
    filters: RedactionFilterProps,
    next_token: string | undefined,
  ) => {
    fetchRedactionLogs({
      variables: {
        from: filters.date.from,
        to: filters.date.to,
        status: filters.status,
        next_token: next_token,
      },
    }).then((res) => {
      // merge the response and the prev list from next token
      const updateList: ORDER.RedactLog[] = [
        ...list,
        ...res.data.redactLogs.items,
      ];
      // If response has next token, query again and pass the new next token, filters and updateList as params
      if (res?.data?.redactLogs?.nexToken) {
        loadRedactionLogs(updateList, filters, res?.data?.redactLogs?.nexToken);
      } else {
        // Save the updateList on setList state
        setList(updateList);
      }
    });
  };

  const onChangeFilter = (updatedFilters: RedactionFilterProps) => {
    // Save updatedFilters to setFilters
    setFilters(updatedFilters);
    // Call loadRedactionLogs with the filters params updatedFilters to get new list
    // No next token for new values of filters
    // Empty array for params list due to new values of filters
    loadRedactionLogs([], updatedFilters, undefined);
    console.log(updatedFilters);
  };

  const rows = () => {
    return list.map((item, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td>{dayjs(item.redaction_date).format("MMMM-DD-YYYY hh:mm A")}</td>
          <td>{dayjs(item.date_affected).format("MMMM-DD-YYYY")}</td>
          <td>{item.error_log}</td>
          <td>
            <p
              style={{
                color:
                  item.status === ORDER.RedactStatus.Success
                    ? "#57DD96"
                    : "#F35A66",
              }}
            >
              {item.status}
            </p>
          </td>
          <td>
            <Button
              icon={<ExternalLink />}
              onClick={() => setRedactedOrders(item)}
            >
              View Details
            </Button>
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <div>
      <Stack>
        <LoadingOverlay visible={loading} />
        {redactedOrders ? (
          <RedactedOrders
            onClose={() => setRedactedOrders(undefined)}
            details={redactedOrders}
          />
        ) : undefined}

        <RedactionFilter filters={filters} onChange={onChangeFilter} />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Redaction Date</th>
              <th>Date Affected</th>
              <th>Error Log</th>
              <th>Redaction Status</th>
              <th>Order List</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </Stack>
    </div>
  );
};
