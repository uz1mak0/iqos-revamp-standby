import React, { useState, useEffect } from "react";
import {
  CaretDown,
  CaretUp,
  Search,
  ArrowRight,
  Edit,
  AlertCircle,
} from "tabler-icons-react";
import { useStyles } from "../../Layouts/Inventory/Inventory.styles";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { formatInventoryItems } from "./Config";
import {
  getSkuInventory,
  getWarehouseInventory,
  updateExpiration,
} from "../../../GraphQL/InventorySchema";
import {
  ActionIcon,
  Badge,
  Input,
  ScrollArea,
  Table,
  Modal,
  DatePicker,
  Group,
  Button,
  Paper,
  Text,
} from "../../Elements";
import {
  BatchItems,
  BatchItemsConnection,
  Maybe,
  SkuInventoryConnection,
} from "../../../GraphQL/_gql/wms/graphql";
import Notification from "../../Elements/Notification/Notification";
import { useAtom } from "jotai";
import { rolesAtom, channelAtom } from "../../../Store/StoreAtom";

import dayjs from "dayjs";
import { hasAccessToEditExpiration } from "../../../Utilities/AccessRoles";
type Props = {
  isGT?: boolean;
};

export const InventoryTab = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [selectedChannel] = useAtom(channelAtom);
  const [expand, setExpand] = useState<Maybe<string[]>>();
  const { classes } = useStyles();
  const [searched, setSearched] = useState("");
  const MIN_DEVICE = 50;
  const MIN_STICKS = 50;
  const MIN_TOOLS = 50;
  const MIN_HEETS = 50;
  const [list, setList] = useState<{
    inventory: Maybe<BatchItems>[];
    batches: Maybe<BatchItems>[];
  }>({
    inventory: [],
    batches: [],
  });
  const router = useRouter();

  const [updateInvExpiration, { loading: expLoading }] = useMutation<{
    updateInventoryExpiration: BatchItems;
  }>(updateExpiration, { context: { clientName: "warehouse" } });

  const { data: dataSKUs } = useQuery<{
    skuInventory: Maybe<SkuInventoryConnection>;
  }>(getSkuInventory, { context: { clientName: "warehouse" } });

  const [warehouseInventory] = useLazyQuery<{
    batchesPerWarehouse: Maybe<BatchItemsConnection>;
  }>(getWarehouseInventory, { context: { clientName: "warehouse" } });

  const [opened, setOpened] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Maybe<BatchItems>>(null);
  const [newDate, setNewDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (router.query.warehouse && dataSKUs) {
      loadInventory([], undefined);
    }
  }, [router.query.warehouse, dataSKUs]);

  const loadInventory = (
    list: Maybe<Maybe<BatchItems>[]> | undefined,
    next_token: string | undefined
  ) => {
    warehouseInventory({
      variables: {
        warehouse_id: router.query.warehouse,
        next_token: next_token,
      },
    }).then((res) => {
      const updateList = [
        ...(list || []),
        ...(res.data?.batchesPerWarehouse?.items || []),
      ];
      if (res.data?.batchesPerWarehouse?.next_token) {
        loadInventory(updateList, res.data.batchesPerWarehouse?.next_token);
      } else {
        const warehouse_id = router.query.warehouse?.toString();
        const newList = props.isGT
          ? updateList.filter(
              (e) => e?.gtin?.includes("GT_") && e.inventory_type !== "DEVICES"
            )
          : updateList;
        setList({
          inventory: formatInventoryItems(
            newList,
            dataSKUs?.skuInventory?.items,
            warehouse_id
          ),
          batches: newList,
        });
      }
    });
  };

  const onClickItem = (item: Maybe<BatchItems> | undefined) => {
    if (expand?.some((e) => e == item?.gtin)) {
      setExpand(expand.filter((e) => e != item?.gtin));
    } else {
      setExpand([...(expand || []), item?.gtin || ""]);
    }
  };

  const rows = () => {
    return list?.inventory
      ?.filter((item) => {
        if (!searched || searched === "") return item;
        return (
          item?.gtin?.toLowerCase().includes(searched.toLowerCase()) ||
          item?.sku?.toLowerCase().includes(searched.toLowerCase()) ||
          item?.description?.toLowerCase().includes(searched.toLowerCase())
        );
      })
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr onClick={() => onClickItem(element)}>
            <td style={{ width: 10 }}>
              <ActionIcon>
                {expand?.some((e) => e == element?.gtin) ? (
                  <CaretUp />
                ) : (
                  <CaretDown />
                )}
              </ActionIcon>
            </td>
            <td>{element?.gtin?.replace('_PMI', '')}</td>
            <td>{element?.sku}</td>
            <td>{element?.description}</td>
            <td>
              {router.query.warehouse === "RS50"
                ? getItemQuantity(element)
                : element?.quantity}
            </td>
            <td>{element?.unit_of_measure}</td>
            <td>{element?.inventory_type}</td>
          </tr>
          {expand?.some((e) => e == element?.gtin) ? (
            <tr key={`list-expanded=${index}`}>
              {expandedTable(
                list.batches?.filter((e) => e?.gtin == element?.gtin)
              )}
            </tr>
          ) : undefined}
        </React.Fragment>
      ));
  };

  const getItemQuantity = (item: Maybe<BatchItems> | undefined) => {
    if (item?.inventory_type == "HEETS" && (item?.quantity || 0) < MIN_HEETS)
      return (
        <Badge size="lg" color="red">{`Low stocks: ${item.quantity}`}</Badge>
      );

    if (item?.inventory_type == "DEVICES" && (item?.quantity || 0) < MIN_DEVICE)
      return (
        <Badge size="lg" color="red">{`Low stocks: ${item.quantity}`}</Badge>
      );

    if (item?.sku?.includes("DR000056") && (item?.quantity || 0) < MIN_STICKS)
      return (
        <Badge size="lg" color="red">{`Low stocks: ${item.quantity}`}</Badge>
      );

    if (item?.sku?.includes("DN000") && (item?.quantity || 0) < MIN_TOOLS)
      return (
        <Badge size="lg" color="red">{`Low stocks: ${item.quantity}`}</Badge>
      );

    return item?.quantity;
  };

  const expandedTable = (items: Maybe<BatchItems>[]) => {
    return (
      <td colSpan={7}>
        <div>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                {/* <th>Batch</th> */}
                <th>Quantity</th>
                <th>Exp. Date</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, i) => (
                <tr key={`batch-${i}`}>
                  <td></td>
                  {/* <td>{item?.batch_id}</td> */}
                  <td>{item?.quantity}</td>
                  <td>
                    <Group>
                      {item?.inventory_type === "DEVICES"
                        ? "-"
                        : item?.expiration_date || ""}
                      {item?.inventory_type !== "DEVICES" &&
                        hasAccessToEditExpiration(
                          userRoles,
                          selectedChannel
                        ) && (
                          <ActionIcon
                            disabled={!hasAccessToEditExpiration(
                              userRoles,
                              selectedChannel
                            )}
                            variant="default"
                            onClick={() => {
                              setSelectedBatch(item);
                              setNewDate(() => {
                                const exp = item?.expiration_date;
                                if (!exp || exp === "-") return new Date();
                                const parsed = new Date(exp);
                                return isNaN(parsed.getTime())
                                  ? new Date()
                                  : parsed;
                              });
                              setOpened(true);
                            }}
                          >
                            <Edit size={20} />
                          </ActionIcon>
                        )}
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </td>
    );
  };

  const renderUpdateModal = () => (
    <Modal
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      title="Update Expiration Date"
    >
      <Group>
        <AlertCircle size={20} color="red" />
        <Text>Are you sure want to edit the Expiration Date?</Text>
      </Group>

      <Paper radius={10}>
        <Group align="center" position="center" spacing="md">
          <Input
            label="Current Date"
            value={
              !selectedBatch?.expiration_date ||
              selectedBatch.expiration_date === "-"
                ? ""
                : selectedBatch.expiration_date
            }
            style={{ flex: 1 }}
            disabled
          />

          <ArrowRight size={28} />

          <DatePicker
            label="New Date"
            placeholder="Pick new date"
            value={newDate ?? new Date()}
            onChange={setNewDate}
            minDate={new Date()}
          />
        </Group>
      </Paper>

      <Group position="right">
        <Button
          customType="danger"
          variant="default"
          onClick={() => setOpened(false)}
        >
          Cancel
        </Button>
        <Button
          customType="primary"
          loading={expLoading}
          onClick={async () => {
            if (!selectedBatch || !newDate) return;

            try {
              const formatDate = (date: Date) =>
                dayjs(date).format("YYYY-MM-DD");

              const res = await updateInvExpiration({
                variables: {
                  batch_id:
                    "BATCH" +
                    "_" +
                    selectedBatch.batch_id +
                    "_" +
                    selectedBatch.gtin,
                  warehouse_id: selectedBatch.warehouse_id,
                  new_date: formatDate(newDate),
                },
              });

              if (res.data?.updateInventoryExpiration) {
                setList((prev) => {
                  const updatedBatches = prev.batches.map((b) =>
                    b?.batch_id === selectedBatch.batch_id &&
                    b?.warehouse_id === selectedBatch.warehouse_id
                      ? {
                          ...b,
                          expiration_date:
                            res.data?.updateInventoryExpiration.expiration_date,
                        }
                      : b
                  );

                  Notification.success({
                    message: "Updated the Expiration date successfully",
                  });

                  return {
                    inventory: [...prev.inventory],
                    batches: [...updatedBatches],
                  };
                });
              } else {
                Notification.error({
                  message: "Updating the expiration failed",
                });
              }
            } catch (err: any) {
              Notification.error({
                message: "Updating the expiration failed",
              });
            } finally {
              setOpened(false);
              setSelectedBatch(null);
              setNewDate(new Date());
            }
          }}
        >
          Update
        </Button>
      </Group>
    </Modal>
  );

  return (
    <div className={classes.tabPanelContainer}>
      {renderUpdateModal()}

      <Input
        icon={<Search />}
        onChange={(e) => setSearched(e.target.value)}
        className={classes.searchInput}
        placeholder="GTIN/Batch Search/SKU/Description"
      />
      <ScrollArea style={{ height: 700 }}>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th></th>
              <th>GTIN</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Inventory Type</th>
            </tr>
          </thead>
          <tbody>{rows()}</tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};
