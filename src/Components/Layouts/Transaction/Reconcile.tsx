/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { CaretDown, CaretUp, Checkbox, Search } from "tabler-icons-react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Input,
  LoadingOverlay,
  Paper,
  DatePicker,
  TimeInput,
  Table,
  ActionIcon,
  Badge,
  NumberInput,
} from "../../Elements";
import { useForm } from "@mantine/form";
import { useStyles } from "./Transaction.syles";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  getReconcile,
  reconByBatches,
  updateReconcile,
} from "../../../GraphQL/TransactionSchema";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Notification from "../../Elements/Notification/Notification";
import { formatInventoryItems } from "../../Modules/Tabs/Config";
import {
  getSkuInventory,
  getWarehouseInventory,
} from "../../../GraphQL/InventorySchema";
import { WMS } from "../../../GraphQL";
import {
  BatchItems,
  BatchItemsConnection,
  Maybe,
} from "../../../GraphQL/_gql/wms/graphql";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import { hasReconcileAccess } from "../../../Utilities/AccessRoles";
interface ReconcileBatchItems extends WMS.BatchItems {
  reconcile_quantity: Maybe<number> | undefined;
}

export const Reconcile = () => {
  const { classes } = useStyles();
  const [userRoles] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const router = useRouter();
  const [expand, setExpand] = useState<Maybe<string[]>>([]);
  const [transaction, setTransaction] = useState<WMS.Transmittal>({});
  const [searched, setSearched] = useState<string | undefined>(undefined);
  const [disable, setDisable] = useState(true);
  const [list, setList] = useState<{
    inventory: Maybe<BatchItems>[];
    batches: Maybe<BatchItems>[];
  }>({
    inventory: [],
    batches: [],
  });
  const [reconciledItems, setReconciledItems] = useState<
    ReconcileBatchItems[] & Maybe<BatchItems>[]
  >([]);
  const [warehouseInventory, { loading }] = useLazyQuery<{
    batchesPerWarehouse: Maybe<BatchItemsConnection>;
  }>(getWarehouseInventory, { context: { clientName: "warehouse" } });

  const { data } = useQuery(getReconcile, {
    context: { clientName: "warehouse" },
    variables: { id: router.query.transactionId },
  });
  const [reconcileUpdate] = useMutation(updateReconcile, {
    context: { clientName: "warehouse" },
  });
  const [reconcileByBatches, { loading: loadingBatches }] = useMutation(
    reconByBatches,
    { context: { clientName: "warehouse" } }
  );
  const { loading: loadingSKUs, data: dataSKUs } = useQuery(getSkuInventory, {
    context: { clientName: "warehouse" },
  });

  const form = useForm({
    initialValues: {
      remarks: "",
      invoice_id: "",
      date: new Date(),
      time: new Date(),
    },
    validate: {
      invoice_id: (value) => (!value ? "Please add Invoice ID!" : null),
      remarks: (value) => (!value ? "Please add Remarks!" : null),
    },
  });

  useEffect(() => {
    if (data?.recon) {
      if (
        !hasReconcileAccess(userRoles) &&
        data?.recon.status !== "COMPLETED"
      ) {
        router.push("/");
        Notification.info({
          title: "Invalid Access",
          message: "Returning to homepage",
        });
      } else {
        form.setValues({
          remarks: data?.recon.remarks || "",
          invoice_id: data?.recon?.invoice_id || "",
          date: new Date(data?.recon?.date) || "",
          time:
            dayjs(`${data?.recon?.date} ${data?.recon?.time}`).toDate() || "",
        });
        setTransaction(data?.recon);
        setDisable(
          data?.recon?.status === "COMPLETED" || !hasReconcileAccess(userRoles)
            ? true
            : false
        );
        const warehouse_id = router.query.warehouse?.toString();
        loadInventory([], undefined);
      }
    }
  }, [data]);

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
      ].filter((item) => item?.inventory_type !== WMS.SkuType.Devices);
      if (res.data?.batchesPerWarehouse?.next_token) {
        loadInventory(updateList, res.data.batchesPerWarehouse?.next_token);
      } else {
        const warehouse_id = router.query.warehouse?.toString();
        setList({
          inventory: formatInventoryItems(
            updateList,
            dataSKUs?.skuInventory?.items,
            warehouse_id
          ),
          batches: updateList,
        });
      }
    });
  };

  const onUpdateReconcileForm = () => {
    reconcileUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.reconUpdate);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onAddReconcileQuantity = (
    item: WMS.Maybe<WMS.BatchItems>,
    value: number
  ) => {
    const newBatch: ReconcileBatchItems[] = list.batches.map((e) => {
      return {
        sku: e?.sku,
        batch_id: e?.batch_id,
        description: e?.description,
        gtin: e?.gtin,
        unit_of_measure: e?.unit_of_measure,
        expiration_date: e?.expiration_date,
        inventory: e?.inventory,
        warehouse_id: e?.warehouse_id,
        reconcile_quantity: undefined,
      };
    });
    const updateItems: ReconcileBatchItems[] = [
      ...(reconciledItems.length <= 0 ? newBatch : reconciledItems),
    ];
    const index = updateItems.findIndex(
      (e) => e.gtin === item?.gtin && e.batch_id === item?.batch_id
    );
    updateItems[index] = {
      ...item,
      reconcile_quantity:
        value !== undefined ? Number(value - (item?.quantity || 0)) : undefined,
    };
    setReconciledItems(updateItems);
  };

  const onSubmitTransaction = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields" });
    // if (reconciledItems.some(e => (e?.reconcile_quantity || 0) < 0)) return Notification.error({message: "Invalid to add negative reconcile qty"})
    const reconBatches = reconciledItems?.filter((e) => e.reconcile_quantity);
    reconcileByBatches({
      variables: {
        recon_id: transaction.id,
        input: reconBatches.map((e) => {
          return {
            gtin: e?.gtin,
            quantity: e?.reconcile_quantity,
            batch_id: e?.batch_id,
            expiration_date: e?.expiration_date,
            channel: channel,
          };
        }),
      },
    })
      .then((res) => {
        reconcileUpdate({
          variables: {
            input: {
              status: "COMPLETED",
              id: transaction?.id,
              remarks: form.values.remarks,
              invoice_id: form.values.invoice_id,
            },
          },
        })
          .then((res) => {
            router.push(
              `/inventory/warehouse?warehouse=${router.query.warehouse}`
            );
            Notification.success({ message: "Reconcile Saved" });
          })
          .catch((e) => {
            Notification.error({ message: e.message });
          });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onClickItem = (item: Maybe<BatchItems>) => {
    if (expand?.some((e) => e == item?.gtin)) {
      setExpand(expand.filter((e) => e != item?.gtin));
    } else {
      setExpand([...(expand || []), item?.gtin || ""]);
    }
  };

  const getReconDefaultValue = (item: WMS.Maybe<WMS.BatchItems>) => {
    const reconValue = reconciledItems.find(
      (e) => e.batch_id === item?.batch_id && e.gtin === item?.gtin
    )?.reconcile_quantity;
    if (reconValue !== undefined) {
      return (reconValue || 0) + (item?.quantity || 0);
    } else {
      return undefined;
    }
  };

  const rows = () => {
    const updateList = disable
      ? list.inventory.filter((e) =>
          transaction?.batch_items?.some((item) => item?.gtin === e?.gtin)
        )
      : list.inventory;
    return updateList
      ?.filter((item) => {
        if (!searched || searched === "") {
          return item;
        } else {
          return (
            item?.gtin?.toLowerCase().includes(searched.toLowerCase()) ||
            item?.sku?.toLowerCase().includes(searched.toLowerCase()) ||
            item?.description?.toLowerCase().includes(searched.toLowerCase())
          );
        }
      })
      .map((element, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr onClick={() => onClickItem(element)}>
            <td style={{ width: 10 }}>
              {
                <ActionIcon>
                  {expand?.some((e) => e == element?.gtin) ? (
                    <CaretUp />
                  ) : (
                    <CaretDown />
                  )}
                </ActionIcon>
              }
            </td>
            <td>{element?.gtin}</td>
            <td>{element?.sku}</td>
            <td>{element?.description}</td>
            <td>
              {element?.quantity} {getReconcileByBatch(element, false)}
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

  const expandedTable = (items: WMS.Maybe<WMS.BatchItems>[]) => {
    return (
      <>
        <td colSpan={7}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Exp. Date</th>
                  {disable ? undefined : <th>Reconcile Quantity</th>}
                  {!disable ? undefined : <th>Updated By</th>}
                </tr>
              </thead>
              <tbody>
                {items?.map((item, i: number) => (
                  <tr key={` batch-${i}`}>
                    <td></td>
                    <td>{item?.batch_id}</td>
                    <td>
                      {item?.quantity} {getReconcileByBatch(item, true)}
                    </td>
                    <td>{item?.expiration_date}</td>
                    {disable ? undefined : (
                      <td>
                        <NumberInput
                          min={0}
                          defaultValue={getReconDefaultValue(item)}
                          onChange={(e) => onAddReconcileQuantity(item, e)}
                          style={{ width: 200 }}
                        />
                      </td>
                    )}
                    {!disable ? undefined : <th>{item?.updated_by}</th>}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  const getReconcileByBatch = (item: Maybe<BatchItems>, isBatch: boolean) => {
    var value: number = 0;
    const getItem = reconciledItems.find(
      (e) => e?.gtin === item?.gtin && e?.batch_id === item?.batch_id
    );
    const totalPerBatches = reconciledItems
      ?.filter((e) => e.gtin === item?.gtin && e.reconcile_quantity)
      ?.reduce(
        (acc: number, curr: ReconcileBatchItems) =>
          acc + (curr?.reconcile_quantity || 0) || 0,
        0
      );
    if (disable) {
      value =
        transaction?.batch_items?.find(
          (e) => e?.gtin === item?.gtin && e?.batch_id === item?.batch_id
        )?.quantity || 0;
    } else {
      value = isBatch ? getItem?.reconcile_quantity || 0 : totalPerBatches;
    }
    if (value == 0) return "";
    if (value > 0) return <Badge>+{value}</Badge>;
    if (value < 0) return <Badge color="red">{value}</Badge>;
  };

  return (
    <div>
      <LoadingOverlay
        overlayOpacity={0.4}
        visible={loadingBatches}
      ></LoadingOverlay>
      <Paper radius={8}>
        <div className={classes.transactionCard}>
          <h2>{router.query.warehouse}: Reconcile</h2>
          <form>
            <Grid gutter={"lg"}>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("remarks")}
                  onBlur={(e) => onUpdateReconcileForm()}
                  label="Remarks"
                  placeholder="Enter Remarks"
                  disabled={disable}
                  required
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("invoice_id")}
                  onBlur={(e) => onUpdateReconcileForm()}
                  label="Invoice ID"
                  placeholder="Enter Invoice ID"
                  disabled={true}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <DatePicker
                  {...form.getInputProps("date")}
                  label="Date"
                  disabled={transaction ? true : false}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <TimeInput
                  format="12"
                  {...form.getInputProps("time")}
                  label="Time"
                  disabled={transaction ? true : false}
                />
              </Grid.Col>
            </Grid>
            <Divider my="lg" />
          </form>
        </div>
      </Paper>
      <div>
        <Input
          icon={<Search />}
          onChange={(e) => setSearched(e.target.value)}
          className={classes.searchInput}
          placeholder="GTIN/Batch Search/SKU/Description"
        />
        <div className={classes.tabPanelTableContainer}>
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
        </div>
      </div>
      <br />
      <Group position="center">
        <Button
          disabled={
            reconciledItems.filter((e) => e.reconcile_quantity !== undefined)
              .length <= 0 || disable
          }
          onClick={() => onSubmitTransaction()}
          icon={<Checkbox />}
        >
          Done
        </Button>
      </Group>
    </div>
  );
};
