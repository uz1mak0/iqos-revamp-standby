/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Divider,
  Grid,
  Group,
  Input,
  Paper,
  Select,
  Button,
  DatePicker,
} from "../../Elements";
import {
  getVouchers,
  getWarehouseInventory,
  getWarehouses,
} from "../../../GraphQL/InventorySchema";
import {
  getPullout,
  getActivations,
  pulloutByBatch,
  pulloutByBatches,
  pulloutItem,
  pulloutItemVoid,
  updatePullout,
} from "../../../GraphQL/TransactionSchema";
import { useStyles } from "./Transaction.syles";
import { TransactionTable } from "./TransactionTable";
import { useForm } from "@mantine/form";
import Notification from "../../Elements/Notification/Notification";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import {
  checkScanRestrictions,
  formatCodentify,
} from "../CodentifyScanner/Config";
import {
  getInventoryItem,
  getInventoryItems,
} from "../../../GraphQL/CodentifyScannerSchema";
import { LoadingOverlay } from "../../Elements/LoadingOverlay";
import { Check, Plus } from "tabler-icons-react";
import { ORDER, RETAIL, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { getDRTags } from "./TransactionConfig";
import { ActivationInventory } from "../../Modules/Activation/ActivationInventory";
import dayjs from "dayjs";
import { PrintTransaction } from "./PrintTransaction";
import { Autocomplete } from "@mantine/core";
import {
  formatProductionDate,
  onScanProductCode,
} from "../../../Utilities/Formatter";

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

export const Pullout = () => {
  const [isVoucher, setIsVoucher] = useState<boolean>(false);
  const { classes } = useStyles();
  const router = useRouter();
  const [user] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);
  const [transaction, setTransaction] = useState<WMS.Pullout>({});
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
  const [queryPullout] = useLazyQuery(getPullout, {
    context: { clientName: "warehouse" },
  });
  const { data: dataWarehouse } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });
  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );
  const { data: dataActivations } = useQuery(getActivations, {
    context: { clientName: "retail" },
  });
  const [pulloutUpdate] = useMutation(updatePullout, {
    context: { clientName: "warehouse" },
  });
  const [pulloutGTIN, { loading: loadingBatch }] = useMutation(pulloutByBatch, {
    context: { clientName: "warehouse" },
  });
  const [pullouttDevice, { loading: loadingDevice }] = useMutation(
    pulloutItem,
    { context: { clientName: "warehouse" } },
  );
  const [voidDeviceSerial, { loading: loadingVoid }] = useMutation(
    pulloutItemVoid,
    { context: { clientName: "warehouse" } },
  );
  const [pulloutBatches, { loading: loadingBatches }] = useMutation(
    pulloutByBatches,
    { context: { clientName: "warehouse" } },
  );
  const [
    refetchActivationBatchItems,
    { loading: loadingActivationBatch, data: dataActivationBatch },
  ] = useLazyQuery(getWarehouseInventory, {
    context: { clientName: "warehouse" },
  });
  const [
    refetchActivationInventoryItems,
    { loading: loadingActivationInventory, data: dataActivationInventory },
  ] = useLazyQuery(getInventoryItems, { context: { clientName: "warehouse" } });
  const [
    refetchActivationVoucherItems,
    { loading: loadingActivationVoucher, data: dataActivationVoucher },
  ] = useLazyQuery(getVouchers, { context: { clientName: "warehouse" } });
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      remarks: "",
      invoice_id: "",
      pullout_to: "",
      batch_id: "",
      codentify: "",
      activation: "",
      outlet: "",
      tag: "",
      delivery_type: "",
      box_count: 0,
      bundle_count: 0,
      bag_count: 0,
      expiration_date: null as Date | null,
      product_code: "",
    },
    validate: {
      remarks: (value) => (!value ? "Please add Remarks!" : null),
      pullout_to: (value) => (!value ? "Please add Destination!" : null),
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
    loadPullout();
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

  const loadPullout = () => {
    setLoading(true);
    setTimeout(() => {
      queryPullout({
        variables: {
          id: router.query.transactionId,
        },
        fetchPolicy: "no-cache",
      })
        .then(({ data }) => {
          if (data?.pullout) {
            const outlet = data.pullout.pullout_to?.replace(/(?:.*?_){2}/, "");
            const activation = data.pullout.pullout_to?.substring(
              0,
              outlet.length,
            );
            form.setValues({
              remarks: data?.pullout.remarks || "",
              invoice_id: data?.pullout?.invoice_id || "",
              pullout_to: data?.pullout?.pullout_to || "",
              codentify: "",
              batch_id: "",
              activation:
                data?.pullout?.pullout_type == "Activation" ? activation : "",
              outlet: data?.pullout?.pullout_type == "Activation" ? outlet : "",
              tag: "",
              delivery_type: data?.pullout.delivery_type || "",
              box_count: data?.pullout.box_count || 0,
              bundle_count: data?.pullout.bundle_count || 0,
              bag_count: data?.pullout.bag_count || 0,
            });
            setTransaction(data?.pullout);
            const batches = data.pullout.batch_items;
            setTransactionBatchItems(batches || []);
            setDisable(
              data?.pullout?.status === "COMPLETED" || accessRole()
                ? true
                : false,
            );
            if (data.pullout.pullout_type === "Activation") {
              getActivationInventory(`${data.pullout.pullout_to}`);
            }
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
    pulloutGTIN({
      variables: {
        pullout_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: value,
          channel: channel,
          expiration_date: item?.expiration_date,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.pulloutByBatch);
        const batches = res?.data?.pulloutByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        if (transaction?.pullout_type === "Activation") {
          getActivationInventory(`${transaction?.pullout_to}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
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
    console.log(value, item);
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
      loadingVoid ||
      loadingBatch ||
      loadingBatches
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    pulloutGTIN({
      variables: {
        pullout_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: 0,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.pulloutByBatch);
        const batches = res?.data?.pulloutByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        Notification.success({ message: `${item?.gtin} removed` });
        if (transaction?.pullout_type === "Activation") {
          getActivationInventory(`${transaction?.pullout_to}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
      });
  };

  const onRemoveSerial = async (
    item: WMS.InventoryItem | null,
    serialItem: SerialItem,
  ) => {
    if (!item) return;
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
        pullout_id: transaction.id,
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
        const type = dataSKU?.skus?.items?.find(
          (e: WMS.Sku) => e.gtin === serialItem.gtin,
        )?.type;
        if (
          transaction.pullout_type === "Activation" &&
          !isVoucher &&
          type !== "VOUCHER"
        ) {
          onActivationPulloutByBatches(false, {
            serial: item?.serial,
            gtin: serialItem.gtin,
          });
        } else {
          Notification.success({ message: `${item?.serial} removed` });
          setTransaction(res?.data?.pulloutItemVoid);
          const batches = res?.data?.pulloutItemVoid.batch_items;
          setTransactionBatchItems(batches || []);
        }
        if (transaction?.pullout_type === "Activation") {
          getActivationInventory(`${transaction?.pullout_to}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
      });
  };

  const onUpdatePulloutForm = () => {
    pulloutUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
          pullout_to:
            transaction?.pullout_type === "Activation"
              ? `${form.values.activation}_${form.values.outlet}`
              : form.values.pullout_to,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.pulloutUpdate);
        const batches = res?.data.pulloutUpdate.batch_items;
        setTransactionBatchItems(batches || []);
        if (res?.data?.pulloutUpdate?.pullout_type === "Activation") {
          getActivationInventory(`${res?.data?.pulloutUpdate?.pullout_to}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
      });
  };

  const updateDRTag = (gtin: string, tag: string | undefined) => {
    switch (tag) {
      case "PROMO GOODS":
        return gtin?.includes(`PG_`) ? gtin : `PG_${gtin}`;
      case "GUIDED TRIAL":
        return gtin?.includes(`GT_`) ? gtin : `GT_${gtin}`;
      default:
        return gtin;
    }
  };

  const getActivationInventory = (id: string) => {
    refetchActivationBatchItems({
      variables: {
        warehouse_id: `ACTIVATION_${id}`,
        type: "ACTIVATION_BATCH",
      },
      fetchPolicy: "no-cache",
    });
    refetchActivationInventoryItems({
      variables: {
        warehouse_id: `ACTIVATION_${id}`,
        status: "PULLOUT",
      },
      fetchPolicy: "no-cache",
    });
    refetchActivationVoucherItems({
      variables: {
        warehouse_id: `ACTIVATION_${id}`,
        status: "PULLOUT",
      },
      fetchPolicy: "no-cache",
    });
  };

  const onScan = async () => {
    if (
      loading ||
      loadingDevice ||
      loadingSerial ||
      loadingVoid ||
      loadingBatch ||
      loadingBatches
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    const input = form.values;
    const isSerial = await serialChecker(input.codentify);
    const codentify = isVoucher
      ? { gtin: "LVC", serial: input.codentify, sku: "LVC" }
      : isSerial
      ? isSerial
      : formatCodentify(input.codentify);
    if (codentify) {
      onScanCodentify(codentify);
    } else {
      const gtin =
        input.tag && channel === "DIRECT_RETAIL"
          ? updateDRTag(input.codentify, input.tag)
          : input.codentify;
      // if (input.batch_id == "" || !input.batch_id)
      //   return form.setFieldError("batch_id", "Please add batch ID");
      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      } else {
        const item: WMS.Sku = dataSKU?.skus?.items.find(
          (e: WMS.Sku) => e.gtin === gtin,
        );

        if (checkScanRestrictions(`${gtin}`))
          return Notification.error({
            message: "Invalid GTIN format",
          });
        if (item.type === "DEVICES" || item.type === "VOUCHER")
          return Notification.info({
            message: "Cannot scan device/voucher using GTIN",
          });
        onScanGTIN(gtin);
      }
    }
  };

  const serialChecker = async (serial: string) => {
    if (serial.length == 12) {
      return refetchSerial({
        variables: {
          serial: serial,
        },
        fetchPolicy: "no-cache",
      }).then((res) => {
        return res.data.inventoryItem
          ? {
              gtin: res.data.inventoryItem.gtin,
              serial: res.data.inventoryItem.serial,
              sku: res.data.inventoryItem.sku,
            }
          : undefined;
      });
    } else {
      return undefined;
    }
  };

  // Query transaction and return the data to be used for scanning codentify
  const getLatestTransactionValues = async () => {
    return queryPullout({
      variables: {
        id: router.query.transactionId,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      return data.pullout;
    });
  };

  const onScanCodentify = async (codentify: CodentifyProps) => {
    //Get the latest quantities and batch items added to transactions
    const updatedTransaction = await getLatestTransactionValues();
    const { data } = await refetchSerial({
      variables: { serial: codentify.serial },
      fetchPolicy: "no-cache",
    });
    const input = form.values;
    // Get the updated quantity form the result (updatedTransaction) of getLatestTransactionValues function
    const quantity =
      updatedTransaction?.batch_items?.find(
        (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
          e?.gtin === data?.inventoryItem?.gtin &&
          e?.batch_id == data?.inventoryItem?.batch_id,
      )?.quantity || 0;
    if (
      data?.inventoryItem?.warehouse_id !== router.query.warehouse &&
      transaction.pullout_type !== "Activation"
    )
      return Notification.error({
        message: "Serial is not from this warehouse",
      });
    if (isVoucher && data?.inventoryItem?.gtin !== "LVC") {
      return Notification.error({
        message: `${codentify.serial} is not a voucher.`,
      });
    }
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
      !data.inventoryItem ||
      data?.inventoryItem?.item_status !== "AVAILABLE"
    ) {
      Notification.error({ message: `${codentify.serial} not available` });
      resetForm();
    } else {
      const type = dataSKU?.skus?.items?.find(
        (e: WMS.Sku) => e.gtin === data.inventoryItem.gtin,
      )?.type;
      pullouttDevice({
        variables: {
          serial: data.inventoryItem.serial,
          gtin: data.inventoryItem.gtin,
          batch_id: data.inventoryItem.batch_id,
          type: type,
          batch_input: {
            gtin: data.inventoryItem.gtin,
            batch_id: data.inventoryItem.batch_id,
            quantity: quantity + 1,
            channel: channel,
          },
          pullout_id: transaction.id,
        },
      })
        .then((res) => {
          if (
            transaction.pullout_type === "Activation" &&
            !isVoucher &&
            type !== "VOUCHER"
          ) {
            onActivationPulloutByBatches(true, codentify);
          } else {
            updateDeviceLineItems(
              data.inventoryItem,
              updatedTransaction.batch_items || [],
            );
            Notification.success({
              message: `${codentify.serial} scan success`,
            });
          }
          if (transaction?.pullout_type === "Activation") {
            //Pass the updatedTransaction.batch_items for updating the device batch items for table
            getActivationInventory(`${transaction?.pullout_to}`);
          }
        })
        .catch((e) => {
          Notification.error({ message: `${e.message}` });
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
      tag: "",
    });

    setTransaction({
      ...transaction,
      batch_items: updateList,
    });
    setTransactionBatchItems(updateList || []);
  };

  const onActivationPulloutByBatches = (
    isAdd: boolean,
    codentify: {
      serial: string | null | undefined;
      gtin: string | null | undefined;
    },
  ) => {
    const list = transaction.batch_items;
    const itemDesc = dataSKU?.skus?.items?.find(
      (e: WMS.Sku) => e.gtin == codentify.gtin,
    );
    const device5410706851458 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
        e?.gtin == "5410706851458",
    )?.quantity;
    const device4806504615261 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
        e?.gtin == "4806504615261",
    )?.quantity;
    const device4806504615292 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
        e?.gtin == "4806504615292",
    )?.quantity;
    const deviceDesc2 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
        e?.gtin ==
        (itemDesc?.description?.includes("2")
          ? "4806504615278"
          : "4806504615285"),
    )?.quantity;
    const lp02 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) => e?.gtin == "LP02",
    )?.quantity;
    pulloutBatches({
      variables: {
        pullout_id: transaction.id,
        input: [
          {
            gtin: "5410706851458",
            batch_id: "FEFO",
            quantity: isAdd
              ? (device5410706851458 ? device5410706851458 : 0) + 1
              : (device5410706851458 ? device5410706851458 : 1) - 1,
            channel: channel,
          },
          {
            gtin: "4806504615261",
            batch_id: "FEFO",
            quantity: isAdd
              ? (device4806504615261 ? device4806504615261 : 0) + 1
              : (device4806504615261 ? device4806504615261 : 1) - 1,
            channel: channel,
          },
          {
            gtin: "4806504615292",
            batch_id: "FEFO",
            quantity: isAdd
              ? (device4806504615292 ? device4806504615292 : 0) + 1
              : (device4806504615292 ? device4806504615292 : 1) - 1,
            channel: channel,
          },
          {
            gtin: itemDesc.description?.includes("2")
              ? "4806504615278"
              : "4806504615285",
            batch_id: "FEFO",
            quantity: isAdd
              ? (deviceDesc2 ? deviceDesc2 : 0) + 1
              : (deviceDesc2 ? deviceDesc2 : 1) - 1,
            channel: channel,
          },
          {
            gtin: "LP02",
            batch_id: "FEFO",
            quantity: isAdd ? (lp02 ? lp02 : 0) + 1 : (lp02 ? lp02 : 1) - 1,
            channel: channel,
          },
        ],
      },
    })
      .then((res) => {
        setTransaction(res.data.pulloutByBatches);
        const batches = res.data.pulloutByBatches.batch_items;
        setTransactionBatchItems(batches || []);
        Notification.success({ message: `${codentify.serial} scan success` });
        if (transaction?.pullout_type === "Activation") {
          getActivationInventory(`${transaction?.pullout_to}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
      });
  };

  const onScanGTIN = async (gtin: string | number) => {
    const type =
      dataSKU.skus?.items?.find((e: WMS.Sku) => e.gtin === gtin)?.type || "";
    if (type === "DEVICES")
      return Notification.error({
        message: "Cannot scan Device GTIN, use Codentify/Serial",
      });

    if (!form.values.expiration_date && type != WMS.SkuType.Accessories) {
      return form.setFieldError(
        "expiration_date",
        "Please add expiration date",
      );
    }

    let input = form.values;

    if (type === WMS.SkuType.Accessories || type === WMS.SkuType.Devices) {
      input.batch_id = type;
    } else {
      input.batch_id = dayjs(input.expiration_date).format("YYYY-MM-DD");
    }
    const quantity =
      transaction.batch_items?.find(
        (e: WMS.Maybe<WMS.Maybe<WMS.BatchPulloutItems>>) =>
          e?.gtin === gtin && e.batch_id == input.batch_id,
      )?.quantity || 0;
    setIsGTINScanned(true);
    pulloutGTIN({
      variables: {
        pullout_id: transaction?.id,
        input: {
          gtin: gtin,
          batch_id: input.batch_id,
          quantity: quantity + 1,
          channel: channel,
          expiration_date:
            type == WMS.SkuType.Accessories || type == WMS.SkuType.Devices
              ? "-"
              : dayjs(input.expiration_date).format("YYYY-MM-DD"),
        },
      },
    })
      .then((response) => {
        setIsGTINScanned(false);
        setTransaction(response?.data?.pulloutByBatch);
        const batches = response.data.pulloutByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        Notification.success({ message: `${gtin} scan success` });
        if (transaction?.pullout_type === "Activation") {
          getActivationInventory(`${transaction?.pullout_to}`);
        }
      })
      .catch((e) => {
        setIsGTINScanned(false);
        Notification.error({ message: `${e.message}` });
      });
  };

  const resetForm = () => {
    form.setValues({
      ...form.values,
      batch_id: form.values.batch_id,
      codentify: "",
    });
  };

  const onSubmitTransaction = () => {
    const noPulloutTo =
      transaction.pullout_type === "FreebiesSample" ||
      transaction.pullout_type === "BadInventory";
    if (form.validate().hasErrors) {
      if (
        noPulloutTo &&
        form.validate().errors.pullout_to &&
        form.values.remarks
      ) {
      } else {
        return Notification.error({
          message: "Please fill up required fields",
        });
      }
    }
    pulloutUpdate({
      variables: {
        input: {
          status: "COMPLETED",
          id: transaction?.id,
          remarks: form.values.remarks,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
          pullout_to:
            transaction?.pullout_type === "Activation"
              ? `${form.values.activation}_${form.values.outlet}`
              : form.values.pullout_to,
        },
      },
    })
      .then((res) => {
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
        Notification.success({ message: "Pullout Saved" });
      })
      .catch((e) => {
        Notification.error({ message: `${e.message}` });
      });
  };

  const formByType = () => {
    switch (transaction?.pullout_type) {
      case "Activation":
        return (
          <Grid gutter={"lg"}>
            <Grid.Col span={4}>
              <Select
                {...form.getInputProps("activation")}
                label="Activation"
                placeholder="Select Activation"
                data={
                  dataActivations?.activations?.items?.map(
                    (e: RETAIL.Activation) => {
                      return {
                        label: e.id,
                        value: e.id,
                      };
                    },
                  ) || []
                }
                disabled={
                  disable || (transaction?.batch_items?.length || 0) > 0
                }
                onChange={(value: string) =>
                  form.setValues({
                    ...form.values,
                    activation: value,
                    outlet: dataActivations?.activations?.items?.find(
                      (item: RETAIL.Activation) => item.id === value,
                    )?.outlets[0]?.id,
                  })
                }
                onBlur={() => onUpdatePulloutForm()}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Outlet"
                placeholder="Select Outlet"
                {...form.getInputProps("outlet")}
                data={
                  dataActivations?.activations?.items
                    ?.find(
                      (item: RETAIL.Activation) =>
                        item.id === form.values.activation,
                    )
                    ?.outlets?.map((outlet: RETAIL.Outlet) => {
                      return {
                        label: outlet.name,
                        value: outlet.id,
                      };
                    }) || []
                }
                disabled={
                  disable || (transaction?.batch_items?.length || 0) > 0
                }
                onBlur={() => onUpdatePulloutForm()}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("remarks")}
                onBlur={() => onUpdatePulloutForm()}
                label="Remarks"
                required
                placeholder="Enter Remarks"
                disabled={disable}
              />
            </Grid.Col>
          </Grid>
        );

      case "ForSelling":
        return (
          <>
            <Grid gutter={"lg"}>
              <Grid.Col span={6}>
                <Select
                  {...form.getInputProps("pullout_to")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Store"
                  searchable
                  placeholder="Select Store/Warehouse"
                  data={
                    dataWarehouse?.warehouses?.items
                      ?.filter((e: WMS.Warehouse) =>
                        channel === "DIRECT_RETAIL" ||
                        channel === "INDIRECT_CHANNEL"
                          ? e
                          : e.type === "STORE",
                      )
                      ?.map((e: WMS.Warehouse) => {
                        return {
                          label: e.name,
                          value: e.id,
                        };
                      }) || []
                  }
                  disabled={
                    disable || (transaction?.batch_items?.length || 0) > 0
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Input
                  {...form.getInputProps("remarks")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Remarks"
                  placeholder="Enter Remarks"
                  disabled={disable}
                  required
                />
              </Grid.Col>
            </Grid>

            <Grid gutter={"lg"}>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("delivery_type")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Delivery Type"
                  placeholder="PMI Delivery/Lalamove/Other courier provider"
                  disabled={disable}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("box_count")}
                  onBlur={() => onUpdatePulloutForm()}
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
                  onBlur={() => onUpdatePulloutForm()}
                  label="Bundle Count"
                  placeholder="Enter bundle Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("bag_count")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Bag Count"
                  placeholder="Enter Bag Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
            </Grid>
          </>
        );

      case "FreebiesSample":
      case "BadInventory":
        return (
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Input
                {...form.getInputProps("remarks")}
                onBlur={() => onUpdatePulloutForm()}
                disabled={disable}
                label="Remarks"
                required
                placeholder="Enter Remarks"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                {...form.getInputProps("delivery_type")}
                onBlur={() => onUpdatePulloutForm()}
                label="Delivery Type"
                placeholder="PMI Delivery/Lalamove/Other courier provider"
                disabled={disable}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("box_count")}
                onBlur={() => onUpdatePulloutForm()}
                label="Box Count"
                placeholder="Enter Box Count"
                disabled={disable}
                min={0}
                max={1000}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("bundle_count")}
                onBlur={() => onUpdatePulloutForm()}
                label="Bundle Count"
                placeholder="Enter Bundle Count"
                disabled={disable}
                min={0}
                max={1000}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("bag_count")}
                onBlur={() => onUpdatePulloutForm()}
                label="Bag Count"
                placeholder="Enter bag Count"
                disabled={disable}
                min={0}
                max={1000}
              />
            </Grid.Col>
          </Grid>
        );
      case "SalesExpert":
        return (
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Select
                searchable
                {...form.getInputProps("pullout_to")}
                label="Store"
                placeholder="Select Coach"
                disabled={disable}
                data={
                  dataWarehouse?.warehouses?.items
                    ?.filter((e: WMS.Warehouse) => e.status === true)
                    .map((e: WMS.Warehouse) => ({
                      label: e.name ?? "",
                      value: e.id ?? "",
                    })) || []
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                {...form.getInputProps("remarks")}
                onBlur={() => onUpdatePulloutForm()}
                disabled={disable}
                label="Remarks"
                placeholder="Enter Remarks"
              />
            </Grid.Col>
            <Grid gutter={"lg"}>
              <Grid.Col span={6}>
                <Input
                  {...form.getInputProps("delivery_type")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Delivery Type"
                  placeholder="PMI Delivery/Lalamove/Other courier provider"
                  disabled={disable}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("box_count")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Box Count"
                  placeholder="Enter Box Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("bundle_count")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Bundle Count"
                  placeholder="Enter Bundle Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("bag_count")}
                  onBlur={() => onUpdatePulloutForm()}
                  label="Bag Count"
                  placeholder="Enter bag Count"
                  disabled={disable}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
            </Grid>
          </Grid>
        );
      default:
        break;
    }
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
          loadingBatches ||
          (loadingBatch && isGTINScanned)
        }
      />
      <Paper radius={8}>
        <div className={classes.transactionCard}>
          <Group>
            <h2>
              {router.query.warehouse}: Pullout {transaction?.pullout_type}
            </h2>
            {form.values.remarks?.trim() ? (
              <PrintTransaction
                transactionId={String(router.query.transactionId)}
              />
            ) : null}
          </Group>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            {formByType()}
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
                      {...form.getInputProps("batch_id")}
                      description="Batch ID"
                      placeholder="Enter Batch ID"
                    /> */}
                    <DatePicker
                      {...form.getInputProps("expiration_date")}
                      withAsterisk
                      label="Expiration Date"
                    />
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
                    {/* <Input
                      description="Batch ID"
                      placeholder="Enter Batch ID"
                      {...form.getInputProps("batch_id")}
                    /> */}
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
                            expiration_date: dayjs(expirationDate)
                              .toDate(),
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
                        dataSKU?.skus?.items.map(
                          (sku: WMS.Sku, index: Number) => ({
                            value: `${sku.gtin}`,
                            label: `${sku.gtin?.replace("_PMI", "")} - ${
                              sku.description
                            } - ${sku.unit_of_measure}`,
                            description: sku.description,
                          }),
                        ) || []
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
                  </>
                )}
              </Group>
            )}
          </form>
        </div>
      </Paper>
      {transaction.pullout_type === "Activation" ? (
        <ActivationInventory
          id={`${transaction.pullout_to}`}
          batches={dataActivationBatch?.batchesPerWarehouse?.items}
          inventory={dataActivationInventory?.inventoryItems?.items}
          vouchers={dataActivationVoucher?.voucherInventoryItems?.items}
          loading={
            loadingActivationBatch ||
            loadingActivationInventory ||
            loadingActivationVoucher
          }
        />
      ) : undefined}
      <TransactionTable
        loaders={{ batch: loadingBatch, device: loadingSerial }}
        onUpdateQuantity={onUpdateQuantity}
        onUpdateExpDate={onUpdateExpDate}
        onRemoveSerial={onRemoveSerial}
        onRemoveItem={onRemoveItem}
        transaction={transaction}
        skus={dataSKU?.skus?.items}
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
