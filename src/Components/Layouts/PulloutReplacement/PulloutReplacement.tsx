/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Plus } from "tabler-icons-react";
import {
  Button,
  Group,
  LoadingOverlay,
  ScrollArea,
  Table,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { Create } from "./Create";
import { Details } from "../PulloutReplacementDetails/Details";
import { Download as PulloutDownload } from "./Download";
import { getReplacementOrders } from "../../../GraphQL/OrderManagementSchema";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";
import { ORDER } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const PulloutReplacement = () => {
  const [fetchReplacementOrders, { loading: loadingReplacementOrders }] =
    useLazyQuery(getReplacementOrders, { context: { clientName: "order" } });
  const { classes } = useStyles();
  const [userRoles] = useAtom(rolesAtom);
  const [create, setCreate] = useState(false);
  const [replacementOrders, setReplacementOrders] = useState<
    ORDER.ReplacementOrder[]
  >([]);
  const [filters, setFilters] = useState<{
    warehouse: string | undefined;
    date: string;
  }>({
    warehouse: "PH01",
    date: dayjs().format("YYYY-MM-DD"),
  });
  const [pullout, setPullout] = useState({
    opened: false,
    details: {},
  });

  useEffect(() => {
    getPulloutReplacementOrders(
      [],
      "PH01",
      dayjs().format("YYYY-MM-DD"),
      undefined
    );
  }, []);

  const getPulloutReplacementOrders = (
    list: ORDER.ReplacementOrder[],
    warehouse: string | undefined,
    date: string,
    next_token: string | undefined
  ) => {
    fetchReplacementOrders({
      variables: {
        next_token: next_token,
        date_filter: {
          from: date,
          to: date,
        },
        warehouse_id: warehouse,
      },
    })
      .then((res) => {
        const updateList = [...list, ...res?.data?.replacementOrders?.items];
        if (res.data.replacementOrders?.next_token) {
          getPulloutReplacementOrders(
            updateList,
            warehouse,
            date,
            res.data.replacementOrdes.next_toke
          );
        } else {
          setReplacementOrders(updateList);
          setFilters({ warehouse: warehouse, date: date });
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const accessRole = () => {
    if (
      userRoles.isPacker ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPacker
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = () => {
    return replacementOrders?.map(
      (element: ORDER.ReplacementOrder, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr onClick={() => setPullout({ details: element, opened: true })}>
            <td>
              {element?.customer?.first_name} {element?.customer?.last_name}
            </td>
            <td>
              {dayjs(Number(element.date_created)).format(
                "MMM DD, YYYY hh:mm A"
              )}
            </td>
            <td>{element.remarks}</td>
          </tr>
        </React.Fragment>
      )
    );
  };

  return (
    <div>
      <LoadingOverlay visible={loadingReplacementOrders} />
      <Details
        onSubmit={() =>
          getPulloutReplacementOrders(
            [],
            filters.warehouse,
            filters.date,
            undefined
          )
        }
        pullout={pullout.details}
        onClose={() => setPullout({ details: {}, opened: false })}
        opened={pullout.opened}
      />
      <Create
        opened={create}
        onClose={() => setCreate(false)}
        onSubmit={() =>
          getPulloutReplacementOrders(
            [],
            filters.warehouse,
            filters.date,
            undefined
          )
        }
      />
      <Group position="apart">
        <div style={{ width: 1000 }}>
          <OrdersFilter
            defaultValues={{
              warehouse: "PH01",
              date: {
                from: dayjs().format("YYYY-MM-DD"),
                to: dayjs().format("YYYY-MM-DD"),
              },
            }}
            onFilter={(e: {
              warehouse: string | undefined;
              date: { from: string; to: string };
            }) =>
              getPulloutReplacementOrders(
                [],
                e.warehouse,
                e.date.from,
                undefined
              )
            }
          />
        </div>
        <PulloutDownload disabled={accessRole()} />
      </Group>
      <Group position="apart">
        <h2>List of Pullout Replacement Items</h2>
        <Button
          disabled={accessRole()}
          onClick={() => setCreate(true)}
          icon={<Plus />}
        >
          Pullout Replacement Items
        </Button>
      </Group>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Customer Nme</th>
                <th>Date of Pullout</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};
