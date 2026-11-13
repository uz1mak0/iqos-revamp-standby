import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Input } from "../../Elements/Input";
import { Table } from "../../Elements/Table";
import { List } from "./List";
import { getRiders } from "./Schema";

export const RiderWallet = () => {
  const { loading, error, data, refetch } = useQuery(getRiders, {
    context: { clientName: "order" },
  });
  const [riders, setRiders] = useState<Array<Object>>();

  useEffect(() => {
    if (data) setRiders(data.riders.items);
  }, [data]);

  return (
    <div>
      <Input placeholder="Scan Riders QR" />
      <List users={riders} refetch={refetch} />
    </div>
  );
};
