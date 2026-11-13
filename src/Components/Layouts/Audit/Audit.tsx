import { useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  getAuditOrders,
  getRiders,
  getWarehouses,
} from "../../../GraphQL/FinanceSchema";
import { Button } from "../../Elements/Button";
import { Card } from "../../Elements/Card";
import { DateRangePicker } from "../../Elements/DateRangePicker";
import { Divider } from "../../Elements/Divider";
import { Grid } from "../../Elements/Grid";
import { Group } from "../../Elements/Group";
import { Modal } from "../../Elements/Modal";
import { Select } from "../../Elements/Select";
import { cardList } from "./Config";

export const Audit = () => {
  const [modal, setModal] = useState(false);
  const [details, setDetails] = useState<{
    title: string;
    number: number;
  }>({
    title: "",
    number: 0,
  });
  const [filters, setFilters] = useState<{
    warehouse: string;
    rider: string;
    status: string;
    date: string[];
  }>({
    warehouse: "",
    rider: "",
    status: "",
    date: [""],
  });
  const [warehouses, setWarehouses] = useState<any[]>();
  const [allRiders, setAllRiders] = useState<any[]>();
  const [orders, setOrders] = useState<any>();

  const { data: warehouseData } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
  });
  const { data: riderData } = useQuery(getRiders, {
    context: { clientName: "order" },
  });
  const [loadOrdersData, { called, loading, data }] = useLazyQuery(
    getAuditOrders,
    { context: { clientName: "order" } },
  );

  useEffect(() => {
    if (warehouseData || riderData) {
      setWarehouses(
        warehouseData?.warehouses.items.filter(
          (v: any, i: number, a: any) =>
            a.findIndex((v2: any) => v2.name === v.name) === i,
        ),
      );
      setAllRiders(riderData?.riders.items);
    }
  }, [warehouseData, riderData]);

  useEffect(() => {
    if (called && data) {
      console.log(data?.auditOrders);
      const entries = Object.values(data?.auditOrders).slice(1);
      setOrders(entries);
    }
  }, [data]);

  const auditOrders = (
    warehouse_id: string | undefined,
    date: string[],
    status: string | undefined,
    rider: string | undefined,
  ) => {
    loadOrdersData({
      variables: {
        warehouse_id: warehouse_id || null,
        date_filter: {
          from: date[0] == "" ? null : dayjs(date[0]).format("YYYY-MM-DD"),
          to: date[0] == "" ? null : dayjs(date[1]).format("YYYY-MM-DD"),
        },
        status: status || null,
        rider: rider || null,
      },
    });
  };

  return (
    <div>
      <Modal
        size={800}
        centered
        title={`Total ${details?.title?.toUpperCase()}`}
        opened={modal}
        onClose={() => setModal(false)}
      >
        <Divider />
        <p style={{ paddingBlock: 20 }}>PHP{details?.number}.00</p>
        <Divider my="10px" />
        <Group position="center">
          <Button
            customType="primary"
            styles={{ width: 250 }}
            onClick={() => setModal(false)}
          >
            Ok
          </Button>
        </Group>
      </Modal>
      <Grid gutter={"lg"} align="center">
        <Grid.Col span={2}>
          <h4>Filter By:</h4>
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            placeholder="Select Warehouse"
            data={
              warehouses?.map((warehouse: any) => {
                return { label: warehouse.name, value: warehouse.id };
              }) || []
            }
            onChange={(e: any) => {
              setFilters({ ...filters, warehouse: e });
              auditOrders(e, filters.date, filters.status, filters.rider);
            }}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            placeholder="Select Status"
            data={[
              {
                label: "DELIVERED",
                value: "COMPLETED",
              },
              {
                label: "PENDING",
                value: "PENDING",
              },
              {
                label: "ALL",
                value: "ALL",
              },
            ]}
            onChange={(e: any) => {
              setFilters({ ...filters, status: e });
              auditOrders(filters.warehouse, filters.date, e, filters.rider);
            }}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            placeholder="Select Rider"
            data={
              allRiders?.map((rider: any) => {
                return { label: rider.name, value: rider.name };
              }) || []
            }
            onChange={(e: any) => {
              setFilters({ ...filters, rider: e });
              auditOrders(filters.warehouse, filters.date, filters.status, e);
            }}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <DateRangePicker
            onChange={(e: any) => {
              setFilters({ ...filters, date: [""] });
              if (e[1] == undefined) return;
              setFilters({ ...filters, date: e });
              auditOrders(filters.warehouse, e, filters.status, filters.rider);
            }}
          />
        </Grid.Col>
      </Grid>
      <Group position="center">
        {cardList.map((card, i) => (
          <Card
            onClick={() => {
              setModal(true);
              setDetails({
                title: card.title,
                number: orders ? orders[i] : 0,
              });
            }}
            key={`card-${i}`}
            removeSelect
            number={orders ? orders[i] : 0}
            title={card.title}
            background={card.background}
          />
        ))}
      </Group>
    </div>
  );
};
