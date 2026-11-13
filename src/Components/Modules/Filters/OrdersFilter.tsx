import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { DatePicker } from "../../Elements/DatePicker/DatePicker";
import { DateRangePicker } from "../../Elements/DateRangePicker";
import { Group } from "../../Elements/Group";
import { Select } from "../../Elements/Select";
import { Grid, Loader } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";

type Props = {
  onFilter: (event: {
    warehouse: string | undefined;
    date: { from: string; to: string };
  }) => void;
  isDateRange?: boolean;
  isClearable?: Boolean | false
  defaultValues: {
    warehouse: string | undefined;
    date: { from: string; to: string };
  };
  isLoading?: boolean;
  customField?: React.ReactNode;
};

export const OrdersFilter = (props: Props) => {
  const { height, width } = useViewportSize();
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);
  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });
  const [filters, setFilters] = useState({
    warehouse: props.defaultValues?.warehouse,
    date: props.defaultValues.date,
  });


  useEffect(() => {
    if (props.defaultValues?.warehouse) {
      setFilters((prev) => ({
        ...prev,
        warehouse: props.defaultValues.warehouse,
      }));
    }
  }, [props.defaultValues?.warehouse]);

  return (
    <Grid>
      <Grid.Col md={6} lg={3}>
        <Select
          clearable={userRoles.isEcommUser || userRoles.isEcomAdmin ? false : !!props.isClearable}
          isPullUpSelect={width <= isTabletMobileView}
          onSelectFromPullUp={(wh: string) => {
            setFilters({ ...filters, warehouse: wh });
            props.onFilter({ warehouse: wh, date: filters.date });
          }}
          placeholder="Select warehouse"
          description="Warehouse"
          disabled={props.isLoading || userRoles.isCSC}
          searchable
          value={filters.warehouse}
          icon={props.isLoading ? <Loader size={"xs"} /> : undefined}
          defaultValue={filters.warehouse}
          onChange={(wh: string) => {
            setFilters({ ...filters, warehouse: wh });
            props.onFilter({ warehouse: wh, date: filters.date });
          }}
          data={
            dataWarehouse?.warehouses?.items
              ?.filter((wh: WMS.Warehouse) => {
                if (wh.status === false) return false;

                if (channel === "INDIRECT_CHANNEL" || userRoles.isAdminIC) {
                  return true;
                }

                if (userRoles.isFullAdmin || userRoles.isDirectRetailAdmin || userRoles.isAdminDC) {
                  return true;
                }

                if (userRoles.isDirectRetailUser) {
                  return user?.office_ids?.some((o) => o === wh.id);
                }

                return true;
              })
              .map((e: WMS.Warehouse) => ({
                label: e.name,
                value: e.id,
              })) || []
          }
        />
      </Grid.Col>
      <Grid.Col md={6} lg={3}>
        {props.isDateRange ? (
          <DateRangePicker
            fullWidth
            dropdownType="modal"
            icon={props.isLoading ? <Loader size={"xs"} /> : undefined}
            disabled={props.isLoading}
            defaultValue={[
              dayjs(filters.date.from).toDate(),
              dayjs(filters.date.to).toDate(),
            ]}
            onChange={(date: [Date, Date]) => {
              if (!date[1]) return;
              setFilters({
                ...filters,
                date: {
                  from: dayjs(date[0]).format("YYYY-MM-DD"),
                  to: dayjs(date[1]).format("YYYY-MM-DD"),
                },
              });
              props.onFilter({
                warehouse: filters.warehouse,
                date: {
                  from: dayjs(date[0]).format("YYYY-MM-DD"),
                  to: dayjs(date[1]).format("YYYY-MM-DD"),
                },
              });
            }}
            description="Date"
          />
        ) : (
          <DatePicker
            fullWidth
            defaultValue={dayjs(filters.date.to).toDate()}
            icon={props.isLoading ? <Loader size={"xs"} /> : undefined}
            disabled={props.isLoading}
            onChange={(e) => {
              setFilters({
                ...filters,
                date: {
                  from: dayjs(e).format("YYYY-MM-DD"),
                  to: dayjs(e).format("YYYY-MM-DD"),
                },
              });
              props.onFilter({
                warehouse: filters.warehouse,
                date: {
                  from: dayjs(e).format("YYYY-MM-DD"),
                  to: dayjs(e).format("YYYY-MM-DD"),
                },
              });
            }}
            description="Date"
          />
        )}
      </Grid.Col>
      <Grid.Col md={6} lg={3}>
        {props.customField}
      </Grid.Col>
    </Grid>
  );
};
