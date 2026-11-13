import React, { useState } from "react";
import { Group, Select, Stack, Uploader } from "../../../../Elements";
import { DatePicker } from "@mantine/dates";
import { useQuery } from "@apollo/client";
import { getWarehouses } from "../../../../../GraphQL/UserSchema";
import { WMS } from "../../../../../GraphQL";
import { useUploadPortalStore } from "./Store";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { rolesAtom, userAtom } from "../../../../../Store/StoreAtom";

export const UploadFileStep = () => {
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  const {
    warehouse,
    setWarehouse,
    setFile,
    isUploading,
    setDate,
    date,
    setUnoTypeTransaction,
    unoTypeTransaction,
  } = useUploadPortalStore();
  const { loading, data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: "DIRECT_RETAIL",
    },
  });

  return (
    <div>
      <Stack>
        <Group grow position="center">
          <Select
            disabled={isUploading}
            label="Validate by Warehouse"
            required
            placeholder="Select Warehouse"
            onChange={(value) => setWarehouse(value)}
            searchable
            data={
              data?.warehouses?.items
                .filter((wh: WMS.Warehouse) =>
                  userRoles.isDirectRetailUser && !userRoles.isFullAdmin
                    ? user?.office_ids?.some((o) => o == wh.id)
                    : wh,
                )
                ?.map((e: WMS.Warehouse) => {
                  return {
                    label: e.name,
                    value: e.id,
                  };
                }) || []
            }
          />
          <DatePicker
            excludeDate={(date) => dayjs(date).isAfter(dayjs())}
            clearable={false}
            value={date ? dayjs(date, "YYYY-MM-DD").toDate() : undefined}
            onChange={(value) => {
              setDate(dayjs(value).format("YYYY-MM-DD"));
            }}
            description="Date"
            placeholder="Select Date"
          />
          {warehouse == "PH1012" ? (
            <Select
              disabled={isUploading}
              label="UNO Template Type"
              required
              placeholder="Select Template"
              onChange={(value) => setUnoTypeTransaction(value)}
              searchable
              data={[
                { label: "TRANSACTION-POS", value: "TRANSACTIONS" },
                { label: "EOD-POS", value: "EOD" },
              ]}
            />
          ) : undefined}
        </Group>

        <Uploader
          disabled={isUploading}
          accept={["text/csv"]}
          onSave={(file) => setFile(file[0])}
          removeActionButtons={true}
        />
      </Stack>
    </div>
  );
};
