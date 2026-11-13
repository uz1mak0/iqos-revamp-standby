import React, { useState, useEffect } from "react";
import {
  Table,
  LoadingOverlay,
  Button,
  Group,
  Input,
  Select,
  ScrollArea,
  Pagination,
  Badge,
} from "../../Elements";
import { useStyles } from "./SKU.styles";
import { useQuery } from "@apollo/client";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import { Create } from "./Create";
import { Edit, Plus, Search } from "tabler-icons-react";

export const SKU = () => {
  const [list, setList] = useState<WMS.Sku[]>([]);
  const { classes } = useStyles();
  const [userRoles] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);

  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState({
    visibility: false,
    isUpdate: false,
  });

  const [skuProfile, setSkuProfile] = useState<WMS.Sku>({});

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const { loading, data } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel === "INDIRECT_CHANNEL" ? "DIRECT_RETAIL" : channel,
    },
  });

  const SKUTYPE: WMS.SkuType[] = [
    WMS.SkuType.Accessories,
    WMS.SkuType.Heets,
    WMS.SkuType.Devices,
    WMS.SkuType.Voucher,
    WMS.SkuType.Zyn,
  ];

  const hasAdditionSKUField =
    ((userRoles.isDirectRetailUser ||
      userRoles.isDirectRetailAdmin ||
      userRoles.isAdminIC ||
      userRoles.isDirectRetailUser ||
      userRoles.isDirectRetailAdmin) &&
      channel === "DIRECT_RETAIL") ||
    channel == "INDIRECT_CHANNEL";

  useEffect(() => {
    if (data) setList(data.skus.items);
  }, [data]);

  // =========================
  // FILTER LOGIC (FIXED)
  // =========================
  const filtered = list.filter((e) => {
    const keyword = filter?.toLowerCase();

    const matchesSearch =
      !keyword ||
      e.description?.toLowerCase().includes(keyword) ||
      e.gtin?.toLowerCase().includes(keyword) ||
      e.sku?.toLowerCase().includes(keyword) ||
      e.type?.toLowerCase().includes(keyword);

    const matchesType = !filterType || e.type === filterType;

    const matchesStatus = !statusFilter
      ? true
      : statusFilter === "ACTIVE"
      ? !e.status
      : e.status === "INACTIVE";

    return matchesSearch && matchesType && matchesStatus;
  });

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  const rows = paginated.map((element: WMS.Sku, index: number) => {
    const isActive = !element.status;

    return (
      <tr key={`sku-${index}`}>
        <td>{element.gtin?.replace("_PMI", "")}</td>
        <td>{element.sku}</td>
        <td>{element.description}</td>
        <td>{element.unit_of_measure}</td>
        <td>{element.type}</td>
        <td>{hasAdditionSKUField ? element.price : ""}</td>
        <td>
          <Badge color={isActive ? "green" : "red"}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </td>

        {hasAdditionSKUField ? (
          <td>
            <Button
              disabled={
                !userRoles.isAdminDC &&
                !userRoles.isAdminIC &&
                !userRoles.isFullAdmin &&
                !userRoles.isDirectRetailAdmin
              }
              onClick={() => {
                setOpenModal({ visibility: true, isUpdate: true });
                setSkuProfile(element);
              }}
              icon={<Edit />}
            >
              Edit
            </Button>
          </td>
        ) : undefined}
      </tr>
    );
  });

  const onSubmit = (item: WMS.Sku, isUpdate: boolean) => {
    const updateList = [...list];
    if (isUpdate) {
      const index = updateList.findIndex((e) => e.gtin === item.gtin);
      updateList[index] = { ...item };
    } else {
      updateList.push(item);
    }
    setList(updateList);
  };

  return (
    <div>
      <Create
        onSubmit={onSubmit}
        isUpdate={openModal.isUpdate}
        profile={skuProfile}
        onClose={() => {
          setSkuProfile({});
          setOpenModal({ isUpdate: false, visibility: false });
        }}
        visible={openModal.visibility}
      />

      <LoadingOverlay visible={loading} />

      <Group position="apart" mx="15">
        <Group>
          <h3>List of SKU</h3>

          {/* SEARCH */}
          <Input
            onChange={(e) => {
              setPage(1);
              setFilter(e.target.value);
            }}
            style={{ width: 250 }}
            icon={<Search />}
            placeholder="Search by SKU"
          />

          {/* TYPE FILTER */}
          <Select
            clearable
            searchable
            value={filterType ?? ""}
            onChange={(value) => {
              setPage(1);
              setFilterType(value);
            }}
            data={SKUTYPE.map((e) => ({
              label: e,
              value: e,
            }))}
            placeholder="Filter by SKU type"
          />

          {/* STATUS FILTER (NEW) */}
          <Select
            clearable
            placeholder="Status"
            style={{ width: 140 }}
            data={[
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
            value={statusFilter ?? ""}
            onChange={(value) => {
              setPage(1);
              setStatusFilter(value);
            }}
          />

          {/* PAGE SIZE */}
          <Select
            value={String(pageSize)}
            onChange={(value) => {
              setPageSize(parseInt(value || "50", 10));
              setPage(1);
            }}
            data={[
              { label: "50", value: "50" },
              { label: "100", value: "100" },
              { label: "300", value: "300" },
            ]}
            style={{ width: 120 }}
            placeholder="Page size"
          />
        </Group>

        {hasAdditionSKUField && (
          <Button
            disabled={
              !userRoles.isAdminDC &&
              !userRoles.isFullAdmin &&
              !userRoles.isDirectRetailAdmin
            }
            icon={<Plus />}
            onClick={() => setOpenModal({ isUpdate: false, visibility: true })}
          >
            Create SKU
          </Button>
        )}
      </Group>

      <ScrollArea style={{ height: "80vh", marginBottom: "20px" }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Unit of Measure</th>
              <th>Type</th>
              <th>{hasAdditionSKUField ? "Price" : ""}</th>
              <th>Status</th>
              <th>{hasAdditionSKUField ? "Action" : ""}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>

      <Group position="center">
        <Pagination
          page={page}
          onChange={setPage}
          total={Math.ceil(filtered.length / pageSize)}
        />
      </Group>
    </div>
  );
};
