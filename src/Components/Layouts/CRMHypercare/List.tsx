import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Hypercare } from "../../../GraphQL/_gql/crm/graphql";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Input,
  ScrollArea,
  Table,
} from "../../Elements";
import { useDebouncedState } from "@mantine/hooks";
import { CRM } from "../../../GraphQL";
import { IconSearch } from "@tabler/icons-react";
import { Edit } from "tabler-icons-react";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

type Props = {
  items: Hypercare[];
};
/**
 *
 * @param props items: List of Hypercares
 * @returns
 */
const List = (props: Props) => {
  const router = useRouter();
  const [filterValue, setFilterValue] = useDebouncedState<string | undefined>(
    undefined,
    200
  );
  const [userRoles] = useAtom(rolesAtom);

  /**
   *
   * @param status types: PENDING, COMPLETED and ABANDONED
   * @returns color
   */
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

  const trialSchedule = (hypercare: CRM.Hypercare) => {
    const date = `${dayjs(hypercare.date).format("MMMM DD, YYYY")}`;
    const time = `${dayjs(hypercare?.time, "HH:mm").format("hh:mm A")}`;
    return `${date} ${time}`;
  };

  const filterItem = (items: Hypercare[]) => {
    if (!filterValue) return items;
    const value = filterValue?.toLowerCase();
    return items.filter(
      (e) =>
        e.customer_info?.first_name?.toLowerCase()?.includes(value) ||
        e.customer_info?.last_name?.toLowerCase()?.includes(value) ||
        e.order_id?.toLowerCase().includes(filterValue)
    );
  };
  const rows = filterItem(props.items)?.map((item, index) => (
    <tr
      key={`list-${index}`}
      onClick={() => {
        router.push(
          `/crm/hypercare/order?orderID=${item.customer_id}&week=${item.week}`
        );
      }}
    >
      <td>{item.customer_info?.customer_id}</td>
      <td>
        {item.customer_info?.first_name} {item.customer_info?.last_name}
      </td>
      <td>{trialSchedule(item)}</td>
      <td>
        {
          <Group>
            {userRoles.isAdministratorEC ||
            userRoles.isEcomAdmin ||
            //old roles
            userRoles.isCRMAdmin ? (
              <ActionIcon color="cyan" variant="filled">
                <Edit
                  id="edit-zyn-order-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(
                      `/order-management/order-details/orderID/?orderID=${item.order_id}`
                    );
                  }}
                />
              </ActionIcon>
            ) : undefined}

            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `/delivery-tracking/order/?orderID=${item.order_id}`
                );
              }}
            >
              {item?.order_id || ""}
            </Button>
          </Group>
        }
      </td>
      <td>
        {item.delivery_date
          ? dayjs(item.delivery_date).format("MMM DD, YYYY")
          : undefined}
      </td>
      <td>{item.week}</td>
      <td>
        <Badge color={getStatusView(item.status || "PENDING")}>
          {item.status}
        </Badge>
      </td>
    </tr>
  ));

  return (
    <div>
      <Group>
        <h2>Hypercare</h2>
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
          placeholder="Search by Order Tracking No or Filter by Name..."
        />
      </Group>
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Consumer ID</th>
              <th>Consumer Name</th>
              <th>Trial Schedule</th>
              <th>Order Tracking No.</th>
              <th>Delivery Date</th>
              <th>Week</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default List;
