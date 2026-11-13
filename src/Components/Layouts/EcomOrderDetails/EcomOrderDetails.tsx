import { useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { OrderAssignShipementInfo } from "../../Modules/Order/OrderAssignShipementInfo";
import { OrderCustomerInfo } from "../../Modules/Order/OrderCustomerInfo";
import { OrderLogs } from "../../Modules/Order/OrderLogs";
import { OrderPickAndPack } from "../../Modules/Order/OrderPickAndPack";
import { OrderPromoInfo } from "../../Modules/Order/OrderPromoInfo";
import { OrderTrackingInfo } from "../../Modules/Order/OrderTrackingInfo";
import {
  getOrder,
  orderDeliveryFinished,
  GetSubWarehouseTagging,
} from "../../../GraphQL/OrderManagementSchema";
import { ORDER, WMS } from "../../../GraphQL";
import { Button } from "../../Elements";
import { LendingOrderPrint } from "../LendingOrderPrint/LendingOrderPrint";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { OrderPromoItems } from "../../Modules/Order/OrderPromoItems";

export const EcomOrderDetails = () => {
  const router = useRouter();
  const [user] = useAtom(rolesAtom);
  const {
    data: dataOrder,
    refetch: refetchOrder,
    loading: loadingOrder,
  } = useQuery(getOrder, {
    context: { clientName: "order" },
    variables: { id: router.query.orderID },
  });
  const {
    data: TaggingData,
    loading: TaggingLoading,
    error: TaggingError,
  } = useQuery(GetSubWarehouseTagging, {
    variables: {
      id: "SUB_WAREHOUSE_TAGGING",
      sort: "SWT",
    },
    context: { clientName: "order" },
  });
  const { data: dataSKU, loading: loadingSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [order, setOrder] = useState<ORDER.Order | undefined>();
  const [sku, setSku] = useState<WMS.Sku[]>();
  const { loading: loadingDeliveryFinish } = useSubscription(
    orderDeliveryFinished,
    {
      variables: {
        order_id: router.query.orderID,
      },
      onData: ({ data }) => {
        refetchOrder({ id: router.query.orderID }).then(() => {
          setOrder(dataOrder.order);
        });
      },
    }
  );

  useEffect(() => {
    if (dataOrder && dataSKU) {
      setOrder(dataOrder.order);
      setSku(dataSKU?.skus?.items);
    }
  }, [dataOrder, dataSKU]);

  const onUpdate = (order: ORDER.Order) => {
    setOrder(order);
  };

  return (
    <div>
      <LoadingOverlay visible={loadingOrder || loadingSKU} />
      <OrderCustomerInfo editable order={order} />
      <OrderTrackingInfo
        editable
        order={order}
        subWarehouseTags={TaggingData?.getSubWarehouseTagging?.tags}
      />
      {order?.promo?.tag == undefined ? undefined : (
        <OrderPromoInfo skus={sku} order={order} onUpdate={onUpdate} />
      )}

      <OrderPickAndPack skus={sku} order={order} onUpdate={onUpdate} />
      {order?.assigned_warehouse === "RS50" ? (
        <LendingOrderPrint order={order} />
      ) : undefined}
      {order?.promo_items == undefined ? undefined : (
        <OrderPromoItems skus={sku} order={order} />
      )}
      <OrderAssignShipementInfo skus={sku} order={order} onUpdate={onUpdate} />
      <OrderLogs order={order} onUpdate={onUpdate} />
    </div>
  );
};
