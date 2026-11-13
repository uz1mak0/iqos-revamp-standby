import React, { useState } from "react";
import { FraudSearch } from "./FraudSearch";
import { LoadingOverlay, Stack } from "../../Elements";
import { FraudList } from "./FraudList";
import { getFraudResult } from "../../../GraphQL/OrderManagementSchema";
import { useLazyQuery } from "@apollo/client";
import Notification from "../../Elements/Notification/Notification";
import { ORDER } from "../../../GraphQL";

export interface FraudOrders extends ORDER.Order {
  fraud_value: string;
}

export const FraudChecking = () => {
  const [fetchFraudChecking, { data, loading }] = useLazyQuery(getFraudResult, {
    context: { clientName: "order" },
    fetchPolicy: "no-cache",
  });

  const [list, setList] = useState<FraudOrders[]>([]);

  const onSearchFraud = (value: string) => {
    fetchFraudChecking({
      variables: { search: value },
      fetchPolicy: "no-cache",
    })
      .then((res) => {
        const responseList: FraudOrders[] = res.data?.fraudCheck?.items || [];

        const filterResponseList = responseList.filter(
          (e) => !list.some((o) => o.order_id === e.order_id)
        );

        const updateList = [
          ...list,
          ...filterResponseList.map((e: FraudOrders) => ({
            ...e,
            fraud_value: value,
          })),
        ];

        const sortedList = updateList.sort((a, b) => {
          const aDate = Number(a.date_created) || 0;
          const bDate = Number(b.date_created) || 0;
          return bDate - aDate; 
        });

        setList(sortedList);

        if (responseList.length > 0) {
          return Notification.success({
            title: "Order Found",
            message: "Your order has been successfully located",
          });
        }

        return Notification.error({
          title: "Order not found",
          message: "We're sorry, but we couldn't locate your order",
        });
      })
      .catch((e) => {
        console.log(e);
        Notification.error({ title: "Error", message: e.message });
      });
  };

  const onResetFraud = () => {
    setList([]);
  };

  const onUpdateFraud = (value: string) => {
    const updated = list.filter((e) => e.fraud_value !== value);

    // keep sorted order even after removing
    const sorted = updated.sort((a, b) => {
      const aDate = Number(a.date_created) || 0;
      const bDate = Number(b.date_created) || 0;
      return bDate - aDate;
    });

    setList(sorted);
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <Stack>
        <FraudSearch
          onUpdateSearch={onUpdateFraud}
          onResetSearch={onResetFraud}
          onSearch={onSearchFraud}
        />
        <FraudList orders={list} />
      </Stack>
    </div>
  );
};
