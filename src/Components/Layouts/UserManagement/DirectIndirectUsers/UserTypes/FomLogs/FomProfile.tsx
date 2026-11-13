import React, { useEffect, useState } from "react";
import { WMS } from "../../../../../../GraphQL";
import { useRouter } from "next/router";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  getAdminInfo,
  getWarehouses,
} from "../../../../../../GraphQL/UserSchema";
import { BackButton } from "../../../../../Modules/BackButton/BackButton";
import {
  DatePicker,
  Grid,
  Group,
  Input,
  Select,
  Paper as CustomPaper,
  Stack,
  Button,
  LoadingOverlay,
  Text,
  Divider,
  ScrollArea,
} from "../../../../../Elements";
import { List } from "./LogsList";
import { getFOMLogs } from "../../../../../../GraphQL/UserSchema";

export const FOMProfile = () => {
  const router = useRouter();

  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [user, setUser] = useState<WMS.Admin | undefined>(undefined);

  const [loadWarehouses, { data: warehouseData, loading, error }] =
    useLazyQuery(getWarehouses, {
      context: { clientName: "warehouse" },
      variables: {
        channel: "INDIRECT_CHANNEL",
      },
    });

  const { data } = useQuery(getAdminInfo, {
    context: { clientName: "warehouse" },
    variables: {
      username: router.query.userId,
    },
    fetchPolicy: "no-cache",
  });

  const { data: logsData, loading: logsLoading } = useQuery(getFOMLogs, {
    context: { clientName: "warehouse" },
    variables: {
      fom_username: router.query.userId,
    },
  });

  const logs = logsData?.fomLogs?.items ?? [];
  useEffect(() => {
    if (data?.admin) {
      setUser(data.admin);

      if (data.admin.office_ids?.length) {
        loadWarehouses();
      }
    }
  }, [data]);

  useEffect(() => {
    if (warehouseData?.warehouses?.items?.length && user?.office_ids?.length) {
      const officeIds = user.office_ids.filter(Boolean) as string[];

      const filtered = warehouseData.warehouses.items
        .filter((w: any) => officeIds.includes(w.id))
        .map((w: any) => ({ id: w.id, name: w.name }));

      setWarehouses(filtered);
    }
  }, [warehouseData, user]);

  const attributeFormat = (title: string, value: string | null | undefined) => {
    return (
      <Group>
        <Text weight="medium">{title}:</Text>
        <Text>{value ?? "-"}</Text>
      </Group>
    );
  };

  return (
    <Stack>
      <LoadingOverlay visible={logsLoading} />
      <Group position="apart">
        <BackButton
          onClick={() => router.push(`/users/indirect/`)}
          url={""}
          title={"FOM Profile"}
        />
        {/* <Group>
          <Button>Role</Button>
          <Button>Edit</Button>
        </Group> */}
      </Group>

      <CustomPaper radius={8}>
        <Stack>
          <Text weight="bold" size={25}>
            Details:
          </Text>
          {attributeFormat("Name", user?.username)}
          {attributeFormat("Contact No.", user?.phone_number)}
          {attributeFormat("Email", user?.email)}
          <Divider size={"xs"} />
          <Text weight="bold">Office Ids:</Text>
          {loading ? (
            <Text size="sm">Loading warehouses...</Text>
          ) : warehouses.length ? (
            warehouses.map((w, index) => (
              <Text key={index} size="sm">
                {w.name} ({w.id})
              </Text>
            ))
          ) : (
            <Text size="sm">-</Text>
          )}
        </Stack>
      </CustomPaper>

      <CustomPaper radius={8}>
        <Stack>
          <Text weight="bold">FOM Logs</Text>
          <ScrollArea style={{ height: 700 }}>
            <List logs={logs} />
          </ScrollArea>
        </Stack>
      </CustomPaper>
    </Stack>
  );
};
