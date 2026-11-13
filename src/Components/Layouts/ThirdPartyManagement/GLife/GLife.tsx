import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { GLIFE } from "../../../../GraphQL";
import {
  getGLifeOrders,
  gLifeOrderCreated,
} from "../../../../GraphQL/ThirdPartySchema";
import { Card, LoadingOverlay } from "../../../Elements";
import { DateRangePicker } from "../../../Elements/DateRangePicker";
import { useStyles } from "../ThirdPartyManagement.styles";
import { List } from "./List";

export const GLife = () => {
  const { classes } = useStyles();
  const [orders, setOrders] = useState<GLIFE.Order[]>([]);
  const [isSelected, setIsSelected] = useState<string>("ALL");
  const [filters, setFilters] = useState({
    date: {
      from: dayjs().subtract(1, "month").unix(),
      to: dayjs().endOf("day").unix(),
    },
  });
  const [loadGlifeOrders, { loading }] = useLazyQuery(getGLifeOrders, {
    context: { clientName: "glife" },
  });
  // const { loading: loadingRegistrationUpdate } = useSubscription(
  //   gLifeOrderCreated,
  //   {
  //   context: { clientName: "glife" },
  //     onData: ({ data }) => {
  //       getOrders([filters.date.from, filters.date.to]);
  //     },
  //   },
  // );

  useEffect(() => {
    getOrders([filters.date.from, filters.date.to]);
  }, []);

  const getOrders = (date: number[]) => {
    loadGlifeOrders({
      variables: {
        from: date[0],
        to: date[1],
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      setOrders(res.data.orders.items);
      setFilters({ date: { from: date[0], to: date[1] } });
    });
  };

  const onUpdateList = (order: GLIFE.Order | string) => {
    if (order === "CANCELLED") {
      getOrders([filters.date.from, filters.date.to]);
    } else {
      const updateList = [...orders];
      const newOrder: GLIFE.Order = typeof order !== "string" ? order : {};
      const index = updateList.findIndex((e) => e.id == newOrder?.id);
      updateList[index] = newOrder;
      setOrders(updateList);
    }
  };

  return (
    <div>
      <DateRangePicker
        description="Date"
        onChange={(date) => {
          if (date[1] == null) return;
          setIsSelected("ALL");
          getOrders([
            dayjs(date[0]).startOf("day").unix(),
            dayjs(date[1]).endOf("day").unix(),
          ]);
        }}
        defaultValue={[dayjs().subtract(1, "month").toDate(), dayjs().toDate()]}
      />
      <LoadingOverlay visible={loading} />
      <div className={classes.statusContainer}>
        <Card
          background="#808080"
          title="ALL"
          isSelected={isSelected == "ALL" ? true : false}
          onClick={() => setIsSelected("ALL")}
          number={
            orders?.filter((order: GLIFE.Order) => order.status).length || 0
          }
        />
        <Card
          background="#FD9710"
          title="PENDING"
          isSelected={isSelected == "PENDING" ? true : false}
          onClick={() => setIsSelected("PENDING")}
          number={
            orders?.filter((order: GLIFE.Order) => order.status == "PENDING")
              .length || 0
          }
        />
        <Card
          background="#61B765"
          title="VERIFIED"
          isSelected={isSelected == "VERIFIED" ? true : false}
          onClick={() => setIsSelected("VERIFIED")}
          number={
            orders?.filter((order: GLIFE.Order) => order.status == "VERIFIED")
              .length || 0
          }
        />
        <Card
          background="#E73F3C"
          title="CANCELLED"
          isSelected={isSelected == "CANCELLED" ? true : false}
          onClick={() => setIsSelected("CANCELLED")}
          number={
            orders?.filter((order: GLIFE.Order) => order.status == "CANCELLED")
              .length || 0
          }
        />
      </div>
      <List
        onUpdateList={onUpdateList}
        list={
          isSelected == "ALL"
            ? orders
            : orders?.filter((order: GLIFE.Order) => order.status == isSelected)
        }
      />
    </div>
  );
};
