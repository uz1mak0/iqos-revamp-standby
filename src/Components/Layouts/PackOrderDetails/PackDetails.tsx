import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { OrderCustomerInfo } from "../../Modules/Order/OrderCustomerInfo";
import { OrderPickAndPack } from "../../Modules/Order/OrderPickAndPack";
import { OrderPromoInfo } from "../../Modules/Order/OrderPromoInfo";
import { OrderTrackingInfo } from "../../Modules/Order/OrderTrackingInfo";
import { getOrder } from "../../../GraphQL/OrderManagementSchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const PackDetails = () => {
  const router = useRouter();
  const [user] = useAtom(rolesAtom);
  const {
    data: dataOrder,
    refetch: refetchOrder,
    loading: loadingOrder,
  } = useQuery(getOrder, {
    context: { clientName: "order" },
    variables: { id: router.query.pack },
  });
  const { data: dataSKU, refetch: refetchSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: user.isDirectRetailUser ? "DIRECT_RETAIL" : "ECOMM" },
  });
  const [order, setOrder] = useState<{ [key: string]: any }>();

  useEffect(() => {
    if (dataOrder) setOrder(dataOrder.order);
  }, [dataOrder]);

  const onUpdate = (order: { [key: string]: any }) => {
    setOrder(order);
  };

  return (
    <div>
      <OrderCustomerInfo order={order} />
      <OrderTrackingInfo order={order} isPack />
      <OrderPickAndPack
        skus={dataSKU?.skus?.items}
        order={order}
        onUpdate={onUpdate}
        isPack
      />
      {order?.promo?.verified ? (
        <OrderPromoInfo order={order} onUpdate={onUpdate} />
      ) : undefined}
    </div>
  );
};
