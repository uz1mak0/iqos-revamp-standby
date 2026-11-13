import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getTrials } from "../../../GraphQL/CRMSchema";
import {
  Badge,
  Group,
  Input,
  Pagination,
  ScrollArea,
  Stack,
  Table,
} from "../../Elements";
import { Create } from "./Create/Create";
import { ActionIcon, Center, LoadingOverlay, Text } from "@mantine/core";
import { Trial } from "../../../GraphQL/_gql/crm/graphql";
import dayjs from "dayjs";
import { usePagination } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import {
  FilterValuesInput,
  TrialListFilter,
} from "../../Modules/CRM/TrialListFilter";
import { DatabaseOff, SortAscending, SortDescending } from "tabler-icons-react";
import { CRM } from "../../../GraphQL";
import Notification from "../../Elements/Notification/Notification";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

type TrialListSort = {
  order: CRM.SortType;
  type: string;
};

export const CRMTrials = () => {
  const [queryTrials, { loading }] = useLazyQuery(getTrials, {
    context: { clientName: "crm" },
  });
  const defaultFilterValues: FilterValuesInput = {
    status: "ALL",
    search: "",
    channel: "ALL",
    date_type: "datetime_created",
    date_filter: [
      dayjs().startOf("month").toDate(),
      dayjs().endOf("month").toDate(),
    ],
  };
  const [list, setList] = useState<Trial[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const pagination = usePagination({ total: 200, initialPage: 1 });
  const [filterValues, setFilterValues] =
    useState<FilterValuesInput>(defaultFilterValues);
  const [sort, setSort] = useState<TrialListSort>({
    order: CRM.SortType.Asc,
    type: "datetime_created",
  });

  useEffect(() => {
    loadTrials(filterValues, sort, 1);
  }, []);

  const loadTrials = (
    filterValues: FilterValuesInput,
    sort: TrialListSort,
    page: number
  ) => {
    setFilterValues(filterValues);
    setSort(sort);
    queryTrials({
      variables: {
        from: (page - 1) * 100,
        limit: 100,
        sort: {
          attribute: sort.type,
          type: sort.order,
        },
        date_filter: filterValues.search
          ? undefined
          : {
              type: filterValues.date_type,
              from: dayjs(filterValues.date_filter[0]).format("YYYY-MM-DD"),
              to: dayjs(filterValues.date_filter[1]).format("YYYY-MM-DD"),
            },
        filters: filterValues.search
          ? []
          : [
              {
                attribute: "status",
                value:
                  filterValues.status == "ALL"
                    ? undefined
                    : filterValues.status,
              },
              {
                attribute: "registration_channel",
                value:
                  filterValues.channel == "ALL"
                    ? undefined
                    : filterValues.channel,
              },
            ].filter((e) => e.value),
        search: filterValues?.search?.toUpperCase(),
      },
      fetchPolicy: "no-cache",
    })
      .then(({ data }) => {
        if (!data) {
          Notification.info({ message: "Problem occured. Reloading page..." });
          router.reload();
        } else {
          setList(data?.trials?.items || []);
          setTotal(data?.trials?.total || 0);
          pagination.setPage(page);
        }
      })
      .catch((e) => {
        console.log(e);
        Notification.error({ message: e.message });
      });
  };

  const setColorByStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "yellow";
      case "COMPLETED":
        return "green";
      case "ABANDONED":
        return "red";
      default:
        return "blue";
    }
  };

  const sortButtonDisplay = (type: string) => {
    const sortValue = {
      type: type,
      order:
        sort.type === type
          ? sort.order === CRM.SortType.Asc
            ? CRM.SortType.Desc
            : CRM.SortType.Asc
          : sort.order,
    };
    return (
      <div data-testid={`sort-button-${sort.order}-${type}`}>
        <ActionIcon
          variant={type == sort.type ? "filled" : undefined}
          color="blue"
          size={"xs"}
          onClick={() => {
            loadTrials(filterValues, sortValue, 1);
          }}
        >
          {sort.order === CRM.SortType.Asc ? (
            <SortAscending data-testid={`sort-asc-${type}`} />
          ) : (
            <SortDescending data-testid={`sort-desc-${type}`} />
          )}
        </ActionIcon>
      </div>
    );
  };

  const rows = list.map((e, index) => (
    <tr
      onClick={() => {
        router.push(`/crm/trial-management/order?orderID=${e.customer_id}`);
      }}
      key={`user-${index}`}
    >
      <td data-testid={`testId-name-${e.customer_id}-${index}`}>
        {e?.first_name} {e.last_name}
      </td>
      <td>{e.gt_date ? dayjs(e?.gt_date).format("MMM DD, YYYY") : "N/A"}</td>
      <td>{e.gt_time ? dayjs(e.gt_time, "HH:mm").format("hh:mm A") : "N/A"}</td>
      <td>{dayjs(Number(e?.datetime_created)).format("MMM DD, YYYY")}</td>
      <td>{e?.registration_channel}</td>
      <td>{e?.customer_id}</td>
      <td>
        <Badge color={setColorByStatus(`${e?.status}`)}>{e?.status}</Badge>
      </td>
    </tr>
  ));

  return (
    <div>
      <LoadingOverlay visible={loading} />

      <Stack>
        <Group position="apart">
          <Group>
            <TrialListFilter
              filterValues={filterValues}
              onFilter={(filter) => loadTrials(filter, sort, 1)}
            />
            <Input
              icon={<IconSearch />}
              style={{ width: 400 }}
              onKeyPress={(e) =>
                e.key === "Enter"
                  ? loadTrials(
                      { ...filterValues, search: e.target.value },
                      sort,
                      1
                    )
                  : undefined
              }
              placeholder="Search by Service Appointment No, or Filter by Name.."
            />
          </Group>
          <Create onCreate={() => loadTrials(defaultFilterValues, sort, 1)} />
        </Group>
        <Group>
          <Badge data-testid={`TEST-FILTER-CHANNEL-${filterValues.channel}`}>
            Source: {filterValues.channel}
          </Badge>
          <Badge data-testid={`TEST-FILTER-DATE-${filterValues.date_type}`}>
            {filterValues.date_type == "gt_date" ? "GT Date" : "Date Created"}
          </Badge>
          <Badge>{`${dayjs(filterValues.date_filter[0]).format(
            "MMM DD, YYYY"
          )} - ${dayjs(filterValues.date_filter[1]).format(
            "MMM DD, YYYY"
          )}`}</Badge>
          <Badge data-testid={`TEST-FILTER-STATUS${filterValues.status}`}>
            Status: {filterValues.status}
          </Badge>
        </Group>
        <ScrollArea style={{ height: 650 }}>
          {list.length < 1 ? (
            <div>
              <Center style={{ height: 650 }}>
                <Stack align="center">
                  <DatabaseOff />
                  <Text fw={700}>No data found</Text>
                </Stack>
              </Center>
            </div>
          ) : (
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th>
                    <Group spacing={"xs"}>
                      <span>Consumer Name</span>
                      {sortButtonDisplay("first_name.keyword")}
                    </Group>
                  </th>
                  <th>
                    <Group spacing={"xs"}>
                      <span>GT Date</span>
                      {sortButtonDisplay("gt_date")}
                    </Group>
                  </th>
                  <th>GT Time</th>
                  <th>
                    <Group spacing={"xs"}>
                      <span>Date Created</span>
                      {sortButtonDisplay("datetime_created")}
                    </Group>
                  </th>
                  <th>Registration Source</th>
                  <th>Service Appointment Number</th>
                  <th>Trial Status</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          )}
        </ScrollArea>
        <Pagination
          position="center"
          total={Math.ceil(total / 100)}
          page={pagination.active}
          onChange={(page) => {
            loadTrials(filterValues, sort, page);
          }}
        />
      </Stack>
    </div>
  );
};
