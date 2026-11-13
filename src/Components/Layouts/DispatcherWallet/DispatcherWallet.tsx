import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { getAdmins } from "../../../GraphQL/UserSchema";
import { Table } from "../../Elements/Table";
import { List } from "./List";

export const DispatcherWallet = () => {
  const [admins, setAdmins] = useState<object[]>();
  const { loading, error, data, refetch } = useQuery(getAdmins, {
    context: { clientName: "warehouse" },
  });

  useEffect(() => {
    if (data) setAdmins(data.admins.items);
  }, [data]);

  return <List users={admins} refetch={refetch} />;
};
