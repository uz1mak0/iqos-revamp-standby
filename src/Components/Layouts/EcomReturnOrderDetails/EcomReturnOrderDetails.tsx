/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Paper } from "../../Elements/Paper";
import { OrderCustomerInfo } from "../../Modules/Order/OrderCustomerInfo";
import { OrderUnpack } from "../../Modules/Order/OrderUnpack";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import {
  getOrder,
  getReturnOrder,
} from "../../../GraphQL/OrderManagementSchema";
import { OrderLendingUnpack } from "../../Modules/Order/OrderLendingUnpack";
import { Maybe } from "../../../GraphQL/_gql/order/graphql";
import { ORDER, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const EcomReturnOrderDetails = () => {
  const router = useRouter();
  const [user] = useAtom(rolesAtom);
  const {
    data: dataReturnOrder,
    refetch: refetchReturnOrder,
    loading: loadingReturnOrder,
  } = useQuery(getReturnOrder, {
    context: { clientName: "order" },
    variables: { id: router.query.returnID },
  });
  const {
    data: dataOrder,
    refetch: refetchOrder,
    loading: loadingOrder,
  } = useQuery(getOrder, {
    context: { clientName: "order" },
    variables: { id: "" },
  });
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: WMS.ChannelType.Ecomm },
  });
  const [returnOrder, setReturnOrder] = useState<Maybe<ORDER.Order>>();
  const [order, setOrder] = useState<Maybe<ORDER.Order>>();

  useEffect(() => {
    if (dataReturnOrder && dataSKU) {
      setReturnOrder(dataReturnOrder.returnOrder);
      refetchOrder({
        id: dataReturnOrder.returnOrder?.order_reference_number,
      }).then((res) => {
        setOrder(res.data.order);
      });
    }
  }, [dataReturnOrder, dataSKU]);

  const onUpdate = (order: Maybe<ORDER.Order>, isReturnOrder: boolean) => {
    if (isReturnOrder) {
      setReturnOrder(order);
    } else {
      setOrder(order);
    }
  };
  console.log(returnOrder?.order_type);
  return (
    <div>
      <Paper radius={8}>
        <h2>Return Order</h2>
        <Paper radius={8}>
          <h3>Order Tracking - {returnOrder?.order_id}</h3>
          <p>Oder Reference: {returnOrder?.order_reference_number}</p>
          <p>Status: {returnOrder?.order_status}</p>
        </Paper>
      </Paper>
      {returnOrder?.order_type === "MANUAL" ? (
        <OrderLendingUnpack
          order={order}
          returnOrder={returnOrder}
          skus={dataSKU?.skus.items}
          onUpdate={onUpdate}
        />
      ) : (
        <OrderUnpack
          order={order}
          returnOrder={returnOrder}
          skus={dataSKU?.skus?.items}
          onUpdate={onUpdate}
        />
      )}
      <OrderCustomerInfo order={order} type={"return"} />
    </div>
  );
};
