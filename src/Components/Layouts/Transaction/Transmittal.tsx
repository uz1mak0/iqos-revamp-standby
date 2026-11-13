/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  DatePicker,
  Divider,
  Grid,
  Group,
  Button,
  Input,
  Select,
  TimeInput,
  Paper,
} from "../../Elements";
import {
  getTransmittal,
  transmitByBatch,
  transmitItem,
  transmitItemVoid,
  updateTransmittal,
} from "../../../GraphQL/TransactionSchema";
import { useStyles } from "./Transaction.syles";
import {
  getDeliverySource,
  getDeviceTags,
  getDRTags,
} from "./TransactionConfig";
import { TransactionTable } from "./TransactionTable";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import {
  checkScanRestrictions,
  formatCodentify,
} from "../CodentifyScanner/Config";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import Notification from "../../Elements/Notification/Notification";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { Check, Plus } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { PrintTransaction } from "./PrintTransaction";
import { Autocomplete } from "@mantine/core";
import { onScanProductCode } from "../../../Utilities/Formatter";

type BatchesProps = WMS.BatchPulloutItems &
  WMS.BatchTransmittalItems &
  WMS.BatchTransferItems &
  WMS.BatchReturnItems;
type CodentifyProps = {
  gtin: string | undefined;
  serial: string | undefined;
  sku: string | undefined;
};
type SerialItem = {
  gtin: string | undefined;
  batch_id: string | undefined;
  quantity: string | undefined;
};

export const Transmittal = () => {
  const [isVoucher, setIsVoucher] = useState<boolean>(false);
  const [user] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);
  const { classes } = useStyles();
  const router = useRouter();
  const [transaction, setTransaction] = useState<WMS.Transmittal>({});
  const [transactionBatchItems, setTransactionBatchItems] = useState<
    BatchesProps[]
  >([]);
  const [disable, setDisable] = useState(true);
  const [isGTINScanned, setIsGTINScanned] = useState(false);
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel === "INDIRECT_CHANNEL" ? "DIRECT_RETAIL" : channel,
    },
  });
  const [queryTransmittal] = useLazyQuery(getTransmittal, {
    context: { clientName: "warehouse" },
  });
  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );
  const [transmittalUpdate] = useMutation(updateTransmittal, {
    context: { clientName: "warehouse" },
  });
  const [transmitGTIN, { loading: loadingBatch }] = useMutation(
    transmitByBatch,
    { context: { clientName: "warehouse" } },
  );
  const [transmitDevice, { loading: loadingDevice }] = useMutation(
    transmitItem,
    { context: { clientName: "warehouse" } },
  );
  const [voidDeviceSerial, { loading: loadingVoid }] = useMutation(
    transmitItemVoid,
    { context: { clientName: "warehouse" } },
  );
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      remarks: "",
      invoice_id: "",
      delivery_source: "",
      date: new Date(),
      time: new Date(),
      codentify: "",
      batch_id: "",
      holder_serial: "",
      charger_serial: "",
      tag: "",
      expiration_date: null as Date | null,
      product_code: "",
      delivery_type: "",
      box_count: 0,
      bundle_count: 0,
      bag_count: 0,
      sales_invoice: "",
    },
    validate: {
      invoice_id: (value) => (!value ? "Please add Invoice ID!" : null),
      sales_invoice: (value) => (!value ? "Please add Sales Invoice!" : null),
      remarks: (value) => (!value ? "Please add Remarks!" : null),
      delivery_source: (value) => (!value ? "Please add Remarks!" : null),
      box_count: (value) => {
        if (value < 0) return "Box count cannot be negative";
        if (value > 1000) return "Box count cannot exceed 1000";
        return null;
      },
      bundle_count: (value) => {
        if (value < 0) return "Bundle count cannot be negative";
        if (value > 1000) return "Bundle count cannot exceed 1000";
        return null;
      },
      bag_count: (value) => {
        if (value < 0) return "Bag count cannot be negative";
        if (value > 1000) return "Bag count cannot exceed 1000";
        return null;
      },
    },
  });

  useEffect(() => {
    loadTransmittal();
  }, []);

  const accessRole = () => {
    if (
      user.isAdminDC ||
      user.isDirectRetailAdmin ||
      user.isEcommUser ||
      user.isAdministratorEC ||
      user.isAdminIC ||
      user.isFullAdmin ||
      user.isSE ||
      user.isStoreManager ||
      user.isEcomAdmin ||
      // old roles
      user.isAdmin ||
      user.isCRMAdmin ||
      user.isWarehousePersonnel ||
      user.isDirectRetailAdmin ||
      user.isExecutive
    ) {
      return false;
    } else {
      return true;
    }
  };

  const loadTransmittal = () => {
    setLoading(true);
    setTimeout(() => {
      queryTransmittal({
        variables: {
          id: router.query.transactionId,
        },
        fetchPolicy: "no-cache",
      })
        .then(({ data }) => {
          if (data?.transmittal) {
            form.setValues({
              remarks: data?.transmittal.remarks || "",
              invoice_id: data?.transmittal?.invoice_id || "",
              sales_invoice: data?.transmittal?.sales_invoice || "",
              delivery_source: data?.transmittal?.delivery_source || "",
              delivery_type: data?.transmittal?.delivery_type || "",
              box_count: data?.transmittal?.box_count || 0,
              bundle_count: data?.transmittal?.bundle_count || 0,
              bag_count: data?.transmittal?.bag_count || 0,
              date: new Date(data?.transmittal?.date) || "",
              time:
                dayjs(
                  `${data?.transmittal?.date} ${data?.transmittal?.time}`,
                ).toDate() || "",
              codentify: "",
              batch_id: form.values.batch_id || "",
              holder_serial: "",
              charger_serial: "",
              tag: "",
              expiration_date: undefined,
              product_code: form.values.product_code,
            });
            setTransaction(data?.transmittal);
            const batches = data.transmittal.batch_items;
            setTransactionBatchItems(batches || []);
            setDisable(
              data?.transmittal?.status === "COMPLETED" || accessRole()
                ? true
                : false,
            );
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          Notification.error({ title: "Error", message: e.message });
        });
    }, 1500);
  };

  const onUpdateQuantity = (
    value: number,
    item:
      | WMS.BatchPulloutItems
      | WMS.BatchTransmittalItems
      | WMS.BatchTransferItems
      | WMS.BatchReturnItems
      | null,
  ) => {
    if (value < 0) return Notification.error({ message: "Invalid Qty value" });
    transmitGTIN({
      variables: {
        transmittal_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: `${item?.batch_id}`,
          quantity: value,
          expiration_date: item?.expiration_date,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transmitByBatch);
        const batches = res?.data?.transmitByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        // resetForm();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onUpdateExpDate = (
    value: Date,
    item:
      | WMS.BatchPulloutItems
      | WMS.BatchTransmittalItems
      | WMS.BatchTransferItems
      | WMS.BatchReturnItems
      | null,
  ) => {
    transmitGTIN({
      variables: {
        transmittal_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: `${item?.batch_id}`,
          quantity: item?.quantity,
          expiration_date: item?.expiration_date,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transmitByBatch);
        const batches = res?.data?.transmitByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        // resetForm();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onRemoveItem = (
    item:
      | WMS.BatchPulloutItems
      | WMS.BatchTransmittalItems
      | WMS.BatchTransferItems
      | WMS.BatchReturnItems
      | null,
  ) => {
    if (
      loading ||
      loadingDevice ||
      loadingSerial ||
      loadingVoid ||
      loadingBatch
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    transmitGTIN({
      variables: {
        transmittal_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: 0,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transmitByBatch);
        const batches = res?.data?.transmitByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        // resetForm();
        Notification.success({ message: `${item?.gtin} removed` });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onRemoveSerial = async (
    item: WMS.InventoryItem | null,
    serialItem: SerialItem,
  ) => {
    //Get the latest quantities and batch items added to transactions
    const updatedTransaction = await getLatestTransactionValues();
    const batchItem: WMS.BatchItems = updatedTransaction.batch_items?.find(
      (e: WMS.BatchItems) =>
        e?.gtin === serialItem.gtin && e?.batch_id == serialItem.batch_id,
    );

    //Check if selected serial is already removed/voided from the current transaction
    //Reload page to update table data
    const isSerialARemoved = !batchItem?.inventory?.items?.some(
      (e) => e?.serial === item?.serial,
    );
    if (isSerialARemoved) {
      Notification.error({
        message: `${item?.serial} already removed. Reloading page...`,
      });
      setLoading(true);
      return router.reload();
    }

    // Get the updated quantity form the result (updatedTransaction) of getLatestTransactionValues function
    const quantity =
      updatedTransaction.batch_items?.find(
        (e: WMS.BatchItems) =>
          e?.gtin === serialItem.gtin && e?.batch_id == serialItem.batch_id,
      )?.quantity || 0;
    voidDeviceSerial({
      variables: {
        serial: item?.serial,
        transmittal_id: transaction.id,
        batch_input: {
          gtin: serialItem?.gtin,
          batch_id: serialItem?.batch_id,
          quantity: Number(quantity) - 1,
          channel: channel,
          expiration_date: "-",
        },
      },
    })
      .then((res) => {
        Notification.success({ message: `${item?.serial} removed` });
        setTransaction(res?.data?.transmitItemVoid);
        const batches = res?.data?.transmitItemVoid.batch_items;
        setTransactionBatchItems(batches || []);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onUpdateTransmittalForm = () => {
    transmittalUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
          sales_invoice: form.values.sales_invoice,
          delivery_source: form.values.delivery_source,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transmittalUpdate);
        const batches = res?.data?.transmittalUpdate.batch_items;
        setTransactionBatchItems(batches || []);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const updateDRTag = (gtin: string | undefined, tag: string | undefined) => {
    switch (tag) {
      case "PROMO GOODS":
        return gtin?.includes("PG_") ? gtin : `PG_${gtin}`;
      case "GUIDED TRIAL":
        return gtin?.includes("GT_") ? gtin : `GT_${gtin}`;
      default:
        return gtin;
    }
  };

  const onScan = () => {
    if (
      loading ||
      loadingDevice ||
      loadingSerial ||
      loadingVoid ||
      loadingBatch
    ) {
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    }

    const input = form.values;

    const codentify = isVoucher
      ? { gtin: "LVC", serial: input.codentify, sku: "LVC" }
      : formatCodentify(input.codentify);

    if (codentify) {
      onScanCodentify(codentify);
    } else {
      const gtin = input.tag
        ? updateDRTag(input.codentify, input.tag)
        : input.codentify;

      const foundItem: WMS.Sku | undefined = dataSKU?.skus?.items.find(
        (e: WMS.Sku) => e.gtin === gtin,
      );

      const foundNewItem: WMS.Sku | undefined = dataSKU?.skus?.items.find(
        (e: WMS.Sku) => e.gtin === gtin + "_PMI",
      );

      console.log(foundNewItem);
      console.log(foundItem);

      if (!foundItem) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      }

      if (checkScanRestrictions(`${gtin}`)) {
        return Notification.error({
          message: "Invalid GTIN format",
        });
      }

      if (
        !input.expiration_date &&
        (foundItem.type === WMS.SkuType.Heets ||
          foundItem.type === WMS.SkuType.Zyn)
      ) {
        // if (form.values.product_code === "" && !form.values?.product_code)
        //   return form.setFieldError(
        //     "product_code",
        //     "Please add product code before scanning GTIN",
        //   );

        return form.setFieldError(
          "expiration_date",
          "Please add expiration date",
        );
      }

      if (foundItem.type === "DEVICES" || foundItem.type === "VOUCHER") {
        return Notification.info({
          message: "Cannot scan device/voucher using GTIN",
        });
      }

      onScanGTIN(foundNewItem ?? foundItem);
    }
  };

  // Query transaction and return the data to be used for scanning codentify
  const getLatestTransactionValues = async () => {
    return queryTransmittal({
      variables: {
        id: router.query.transactionId,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      return data.transmittal;
    });
  };

  const onScanCodentify = async (codentify: CodentifyProps) => {
    //Get the latest quantities and batch items added to transactions
    const updatedTransaction = await getLatestTransactionValues();
    let input = form.values;
    input.batch_id = `DEVICES`;
    if (!isVoucher && router.query.warehouse === "RS50") {
      if (input.charger_serial === "" || input.charger_serial === undefined)
        return form.setFieldError(
          "charger_serial",
          "Please add charger serial",
        );
      if (input.holder_serial === "" || input.holder_serial === undefined)
        return form.setFieldError("holder_serial", "Please add holder serial");
      if (input.tag === "" || input.tag === undefined)
        return form.setFieldError("tag", "Please add tag");
    }
    // Get the updated quantity form the result (updatedTransaction) of getLatestTransactionValues function
    const quantity =
      updatedTransaction.batch_items?.find(
        (e: WMS.BatchItems) =>
          e?.gtin === codentify.gtin && e?.batch_id == `${input.batch_id}`,
      )?.quantity || 0;
    //Get the updated tag quantity form the result (updatedTransaction) of getLatestTransactionValues function
    const tagQuantity =
      updatedTransaction.batch_items?.find(
        (e: WMS.BatchItems) =>
          e?.gtin === updateDRTag(codentify?.gtin, input.tag) &&
          e?.batch_id == `${input?.batch_id}`,
      )?.quantity || 0;

    const { data } = await refetchSerial({
      variables: { serial: codentify.serial },
      fetchPolicy: "no-cache",
    });
    if (
      transaction.batch_items?.some((e) =>
        e?.inventory?.items?.some(
          (e) => e?.serial === data?.inventoryItem?.serial,
        ),
      )
    )
      return Notification.error({
        message: `${codentify.serial} already scanned`,
      });
    if (
      data.inventoryItem &&
      data?.inventoryItem?.item_status !== "PULLOUT" &&
      data?.inventoryItem?.item_status !== "RELEASED"
    ) {
      Notification.error({ message: `${codentify.serial} not available` });
    } else {
      transmitDevice({
        variables: {
          input: {
            serial: codentify.serial,
            transmittal_id: transaction?.id,
            type: dataSKU?.skus?.items?.find(
              (e: WMS.Sku) => e.gtin === codentify.gtin,
            )?.type,
            gtin:
              input.tag && channel === "DIRECT_RETAIL"
                ? updateDRTag(codentify?.gtin, input.tag)
                : codentify.gtin,
            batch_id: `${input.batch_id.trim()}`,
            holder_serial: input.holder_serial,
            charger_serial: input.charger_serial,
            tag: input.tag,
          },
          batch_input: {
            gtin:
              input.tag && channel === "DIRECT_RETAIL"
                ? updateDRTag(codentify?.gtin, input.tag)
                : codentify.gtin,
            batch_id: `${input.batch_id.trim()}`,
            quantity:
              input.tag && channel === "DIRECT_RETAIL"
                ? tagQuantity + 1
                : quantity + 1,
            channel: channel,
            expiration_date: "-",
          },
          transmittal_id: transaction.id,
        },
      })
        .then((res) => {
          //Pass the updatedTransaction.batch_items for updating the device batch items for table
          updateDeviceLineItems(
            res.data.transmitItem,
            updatedTransaction.batch_items || [],
          );

          Notification.success({ message: `${codentify.serial} scan success` });
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  const updateDeviceLineItems = (
    device: WMS.InventoryItem,
    updatedBatchItems: BatchesProps[],
  ) => {
    const updateList: BatchesProps[] = [...updatedBatchItems];
    const index = updateList.findIndex(
      (e: BatchesProps) =>
        e?.batch_id === device.batch_id && e.gtin === device.gtin,
    );
    if (index < 0) {
      updateList.push({
        batch_id: device.batch_id,
        description: device.description,
        expiration_date: device.expiration_date,
        gtin: device.gtin,
        quantity: 1,
        sku: device.sku,
        unit_of_measure: device.unit_of_measure,
        updated_by: userDetails.username,
        warehouse_id: device.warehouse_id,
        inventory: {
          items: [
            {
              charger_serial: device.charger_serial,
              holder_serial: device.holder_serial,
              id: device.id,
              serial: device.serial,
              tag: device.tag,
            },
          ],
        },
      });
    } else {
      updateList[index] = {
        ...updateList[index],
        quantity: (updateList[index].quantity || 0) + 1,
        inventory: {
          items: [
            ...(updateList[index]?.inventory?.items || []),
            {
              charger_serial: device.charger_serial,
              holder_serial: device.holder_serial,
              id: device.id,
              serial: device.serial,
              tag: device.tag,
            },
          ],
        },
      };
    }
    form.setValues({
      codentify: "",
      batch_id: form.values.batch_id || "",
      holder_serial: "",
      charger_serial: "",
      tag: "",
    });

    setTransaction({
      ...transaction,
      batch_items: updateList,
    });
    setTransactionBatchItems(updateList || []);
  };

  const onScanGTIN = async (item: WMS.Sku | null | undefined) => {
    console.log("onScanGtin", item);

    let input = form.values;

    if (
      item?.type === WMS.SkuType.Accessories ||
      item?.type === WMS.SkuType.Devices
    ) {
      input.batch_id = item?.type;
    } else {
      input.batch_id = dayjs(input.expiration_date).format("YYYY-MM-DD");
    }
    
    if (item?.type === "DEVICES")
      return Notification.error({
        message: "Cannot scan Device GTIN, use Codentify/Serial",
      });
    const quantity =
      transaction?.batch_items?.find(
        (e) =>
          e?.sku === item?.sku &&
          e?.gtin === item?.gtin &&
          e?.batch_id == `${input.batch_id}`,
      )?.quantity || 0;
    setIsGTINScanned(true);
    transmitGTIN({
      variables: {
        transmittal_id: transaction?.id,
        input: {
          gtin:
            input.tag && channel === "DIRECT_RETAIL"
              ? updateDRTag(item?.gtin || undefined, input.tag)
              : item?.gtin,
          batch_id: `${input.batch_id.trim()}`,
          quantity: quantity + 1,
          expiration_date:
            item?.type === WMS.SkuType.Accessories
              ? "-"
              : dayjs(input.expiration_date).format("YYYY-MM-DD"),
          channel: channel,
        },
      },
    })
      .then((response) => {
        setIsGTINScanned(false);
        setTransaction(response?.data?.transmitByBatch);
        const batches = response?.data?.transmitByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        Notification.success({ message: `${item?.gtin} scan success` });
        form.setValues({
          ...form.values,
          codentify: "",
        });
      })
      .catch((e) => {
        setIsGTINScanned(false);
        Notification.error({ message: e.message });
      });
  };

  const onSubmitTransaction = () => {
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields" });
    transmittalUpdate({
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
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
        Notification.success({ message: "Transmittal Saved" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  return (
    <div>
      <LoadingOverlay
        overlayOpacity={0.4}
        visible={
          loading ||
          loadingDevice ||
          loadingSerial ||
          loadingVoid ||
          (loadingBatch && isGTINScanned)
        }
      ></LoadingOverlay>
      <Paper radius={8}>
        <div className={classes.transactionCard}>
          <Group>
            <h2>{router.query.warehouse}: Transmittal</h2>
            {form.values.invoice_id?.trim() ? (
              <PrintTransaction
                transactionId={String(router.query.transactionId)}
              />
            ) : null}
          </Group>
          <form>
            <Grid gutter={"lg"}>
              <Grid.Col span={2}>
                <Input
                  {...form.getInputProps("remarks")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Remarks"
                  placeholder="Enter Remarks"
                  required
                  disabled={disable}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Input
                  {...form.getInputProps("invoice_id")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Invoice ID"
                  disabled={true}
                  placeholder="Enter Invoice ID"
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Input
                  {...form.getInputProps("sales_invoice")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Sales Invoice"
                  disabled={disable}
                  required
                  placeholder="Enter Sales Invoice"
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  clearable
                  {...form.getInputProps("delivery_source")}
                  onBlur={() => onUpdateTransmittalForm()}
                  label="Delivery Source"
                  placeholder="Enter Delivery Source"
                  required
                  disabled={disable}
                  data={getDeliverySource.map((source: string) => {
                    return {
                      label: source,
                      value: source,
                    };
                  })}
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
            <Grid gutter={"lg"}>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("delivery_type")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Delivery Type"
                  placeholder="PMI Delivery/Lalamove/Other courier provider"
                  disabled={disable}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("box_count")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Box Count"
                  placeholder="Enter Box Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("bundle_count")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Bundle Count"
                  placeholder="Enter Bundle Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("bag_count")}
                  onBlur={(e) => onUpdateTransmittalForm()}
                  label="Bag Count"
                  placeholder="Enter Bag Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
            </Grid>
            <Divider my="lg" />
            {disable ? undefined : (
              <Group>
                {/* {channel === "DIRECT_RETAIL" ? undefined : (
                  <Checkbox
                    onChange={(e) => setIsVoucher(e.target.checked)}
                    label="Voucher"
                  />
                )} */}
                {isVoucher ? (
                  <>
                    {/* <Input
                      {...form.getInputProps("product_code")}
                      description="Product Code"
                      placeholder="Enter Product Code"
                      icon-={<Plus />}
                      onKeyPress={(e) =>
                        e.key === "Enter" ? onScanProductCode() : undefined
                      }
                    /> */}
                    <Input
                      {...form.getInputProps("codentify")}
                      description="Voucher Code"
                      placeholder="Scan Voucher Code"
                      onKeyPress={(e) =>
                        e.key === "Enter" ? onScan() : undefined
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input
                      {...form.getInputProps("product_code")}
                      label="Product Code"
                      placeholder="Enter Product Code"
                      icon-={<Plus />}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          let expirationDate = onScanProductCode(
                            form.values.product_code,
                          );

                          if (!expirationDate)
                            return Notification.error({
                              message:
                                "Invalid product code. Please check the code and try again.",
                            });

                          form.setValues({
                            expiration_date: dayjs(expirationDate).toDate(),
                          });

                          return Notification.success({
                            message: "Product Code Scan Successfully",
                          });
                        }
                      }}
                    />
                    <DatePicker
                      {...form.getInputProps("expiration_date")}
                      withAsterisk
                      label="Expiration Date"
                      disabled={
                        !form.values.product_code ||
                        form.values.product_code == ""
                          ? false
                          : true
                      }
                    />

                    <Autocomplete
                      style={{ width: "400px" }}
                      {...form.getInputProps("codentify")}
                      onChange={(value) =>
                        form.setFieldValue("codentify", value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onScan();
                          form.setFieldValue("codentify", "");
                        }
                      }}
                      data={
                        dataSKU?.skus?.items
                          .filter((sku: WMS.Sku) => sku.status !== "INACTIVE")
                          .map((sku: WMS.Sku, index: Number) => ({
                            value: `${sku.gtin}`,
                            label: `${sku.gtin?.replace("_PMI", "")} - ${
                              sku.description
                            } - ${sku.unit_of_measure}`,
                            description: sku.description,
                          })) || []
                      }
                      placeholder="Scan or Input GTIN/Condentify"
                      description="Scan or Search"
                      filter={(value, item) =>
                        item.label.toLowerCase().includes(value.toLowerCase())
                      }
                      limit={dataSKU?.skus?.items.length || 100}
                      maxDropdownHeight={200}
                    />

                    {channel === "DIRECT_RETAIL" ? (
                      <Select
                        clearable
                        {...form.getInputProps("tag")}
                        description="Tag"
                        placeholder="Select Tag"
                        data={getDRTags.map((tag: string) => {
                          return {
                            label: tag,
                            value: tag,
                          };
                        })}
                      />
                    ) : undefined}
                    {router.query.warehouse === "RS50" ? (
                      <>
                        <Input
                          {...form.getInputProps("holder_serial")}
                          description="Holder Serial"
                          placeholder="Enter holder serial"
                        />
                        <Input
                          {...form.getInputProps("charger_serial")}
                          description="Charger Serial"
                          placeholder="Enter charger serial"
                        />
                        <Select
                          {...form.getInputProps("tag")}
                          description="Tag"
                          placeholder="Select Tag"
                          data={getDeviceTags.map((tag: string) => {
                            return {
                              label: tag,
                              value: tag,
                            };
                          })}
                        />
                      </>
                    ) : undefined}
                  </>
                )}
              </Group>
            )}
          </form>
        </div>
      </Paper>

      <TransactionTable
        isLending={router.query.warehouse === "RS50" ? true : false}
        loaders={{ batch: loadingBatch, device: loadingSerial }}
        onUpdateQuantity={onUpdateQuantity}
        onUpdateExpDate={onUpdateExpDate}
        onRemoveSerial={onRemoveSerial}
        onRemoveItem={onRemoveItem}
        skus={dataSKU?.skus?.items}
        transaction={transaction}
        list={transactionBatchItems}
      />
      <br />
      <Group position="center">
        <Button
          loading={
            loading ||
            loadingDevice ||
            loadingSerial ||
            loadingVoid ||
            (loadingBatch && isGTINScanned)
          }
          disabled={
            (transaction?.batch_items?.length || 0) <= 0 ||
            !transaction?.batch_items ||
            disable
          }
          onClick={() => onSubmitTransaction()}
          icon={<Check />}
        >
          Done
        </Button>
      </Group>
    </div>
  );
};
