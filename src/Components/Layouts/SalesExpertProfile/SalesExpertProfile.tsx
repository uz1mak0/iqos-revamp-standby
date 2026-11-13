import React, { useEffect, useState } from "react";
import { Edit } from "tabler-icons-react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getSalesExpertInfo } from "../../../GraphQL/UserSchema";
import {
  Badge,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
} from "../../Elements";
import { RETAIL, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import Create from "../SalesExpert/Create";

export const Profile = () => {
  const [userRoles] = useAtom(rolesAtom);
  const router = useRouter();
  const [create, setCreate] = useState(false);
  const [visible, setVisible] = useState(true);
  const [salesExpertProfile, setSalesExpertProfile] =
    useState<RETAIL.SalesExpert>();
  const { data, refetch } = useQuery(getSalesExpertInfo, {
    variables: { sales_expert_id: router.query.userId },
    context: { clientName: "warehouse" },
  });
  if (!userRoles.isDirectRetailUser) router.push("/");

  useEffect(() => {
    if (data) {
      setSalesExpertProfile(data.salesExpert);
      setVisible(false);
    }
  }, [data]);

  const onUpdate = (user: WMS.SalesExpert) => {
    setSalesExpertProfile(user);
    setCreate(false);
  };

  return (
    <div>
      <Create
        visible={create}
        onSubmit={onUpdate}
        profile={salesExpertProfile}
        onClose={() => setCreate(false)}
      />
      <Paper radius={8} style={{ position: "relative" }}>
        <LoadingOverlay visible={visible} />
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>User Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <Button
                disabled={!userRoles.isDirectRetailAdmin}
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <p>Name: {salesExpertProfile?.name} </p>
        <p>Sales Expert ID: {salesExpertProfile?.sales_expert_id} </p>
        <p>Phone Number: {salesExpertProfile?.phone_number}</p>
        <p>Email: {salesExpertProfile?.email}</p>
        <p>
          Warehouses:{" "}
          {salesExpertProfile?.office_ids?.map((office) => (
            <Badge key={office}>{office}</Badge>
          ))}
        </p>
      </Paper>
    </div>
  );
};
