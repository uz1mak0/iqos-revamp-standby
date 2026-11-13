/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Check, Plus } from "tabler-icons-react";
import {
  Checkbox,
  Button,
  Divider,
  Grid,
  Group,
  Input,
  Paper,
  LoadingOverlay,
  Select,
  DatePicker,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import {
  checkScanRestrictions,
  formatCodentify,
} from "../CodentifyScanner/Config";
import {
  getInventoryItem,
  getInventoryItems,
} from "../../../GraphQL/CodentifyScannerSchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import {
  getActivations,
  getReturn,
  returnByBatch,
  returnByBatches,
  returnItem,
  returnItemVoid,
  updateReturn,
} from "../../../GraphQL/TransactionSchema";
import { useStyles } from "./Transaction.syles";
import { TransactionTable } from "./TransactionTable";
import { RETAIL, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { getDRTags } from "./TransactionConfig";
import {
  getVouchers,
  getWarehouseInventory,
} from "../../../GraphQL/InventorySchema";
import { ActivationInventory } from "../../Modules/Activation/ActivationInventory";
import dayjs from "dayjs";
import { PrintTransaction } from "./PrintTransaction";
import { Autocomplete } from "@mantine/core";
import { formatProductionDate } from "../../../Utilities/Formatter";

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

export const Return = () => {
  const [isVoucher, setIsVoucher] = useState<boolean>(false);
  const { classes } = useStyles();
  const [user] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);
  const [transaction, setTransaction] = useState<WMS.Return>({});
  const [transactionBatchItems, setTransactionBatchItems] = useState<
    BatchesProps[]
  >([]);
  const [disable, setDisable] = useState(true);
  const [isBundle, setIsBundle] = useState(false);
  const [isGTINScanned, setIsGTINScanned] = useState(false);
  const router = useRouter();
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel === "INDIRECT_CHANNEL" ? "DIRECT_RETAIL" : channel,
    },
  });
  const [queryReturn] = useLazyQuery(getReturn, {
    context: { clientName: "warehouse" },
  });
  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );
  const { data: dataActivations } = useQuery(getActivations, {
    context: { clientName: "retail" },
  });
  const [returnUpdate] = useMutation(updateReturn, {
    context: { clientName: "warehouse" },
  });
  const [returnGTIN, { loading: loadingBatch }] = useMutation(returnByBatch, {
    context: { clientName: "warehouse" },
  });
  const [returnDevice, { loading: loadingDevice }] = useMutation(returnItem, {
    context: { clientName: "warehouse" },
  });
  const [voidDeviceSerial, { loading: loadingVoid }] = useMutation(
    returnItemVoid,
    { context: { clientName: "warehouse" } },
  );
  const [returnBatches, { loading: loadingBatches }] = useMutation(
    returnByBatches,
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
      return_from: "",
      batch_id: "",
      codentify: "",
      activation: "",
      outlet: "",
      tag: "",
      delivery_type: "",
      box_count: 0,
      bundle_count: 0,
      bag_count: 0,
      expiration_date: new Date(),
      product_code: "",
    },
    validate: {
      remarks: (value) => (!value ? "Please add Remarks!" : null),
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
    loadReturn();
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

  const loadReturn = () => {
    setLoading(false);
    setTimeout(() => {
      queryReturn({
        variables: {
          id: router.query.transactionId,
        },
        fetchPolicy: "no-cache",
      })
        .then(({ data }) => {
          if (data?.return) {
            const outlet = data.return.return_from?.replace(/(?:.*?_){2}/, "");
            const activation = data.return.return_from?.substring(
              0,
              outlet.length,
            );
            form.setValues({
              remarks: data?.return.remarks || "",
              invoice_id: data?.return?.invoice_id || "",
              return_from: data?.return?.return_from || "",
              delivery_type: data?.return?.delivery_type || "",
              box_count: data?.return?.box_count || 0,
              bundle_count: data?.return?.bundle_count || 0,
              bag_count: data?.return?.bag_count || 0,
              batch_id: "",
              codentify: "",
              activation:
                data?.return?.return_type == "Activation" ? activation : "",
              outlet: data?.return?.return_type == "Activation" ? outlet : "",
              tag: "",
            });
            setTransaction(data?.return);
            const batches = data.return.batch_items;
            setTransactionBatchItems(batches || []);
            setDisable(
              data?.return?.status === "COMPLETED" || accessRole()
                ? true
                : false,
            );
            if (data?.return?.return_type === "Activation") {
              getActivationInventory(`${data.return.return_from}`);
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
    const batchItem = transaction.batch_items?.find(
      (e) => e?.batch_id === item?.batch_id && item?.gtin === e?.gtin,
    );
    returnGTIN({
      variables: {
        return_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: value,
          channel: channel,
          expiration_date: batchItem?.expiration_date,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.returnByBatch);
        const batches = res?.data?.returnByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        if (transaction?.return_type === "Activation") {
          getActivationInventory(`${transaction.return_from}`);
        }
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
    returnGTIN({
      variables: {
        return_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: 0,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.returnByBatch);
        const batches = res?.data.returnByBatch?.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        Notification.success({ message: `${item?.gtin} removed` });
        if (transaction?.return_type === "Activation") {
          getActivationInventory(`${transaction.return_from}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
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
        return_id: transaction.id,
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
          transaction.return_type === "Activation" &&
          !isVoucher &&
          isBundle &&
          type !== "VOUCHER"
        ) {
          onActivationReturnByBatches(false, {
            serial: item?.serial,
            gtin: serialItem.gtin,
          });
        } else {
          Notification.success({ message: `${item.serial} removed` });
          setTransaction(res?.data?.returnItemVoid);
          const batches = res.data.returnItemVoid.batch_items;
          setTransactionBatchItems(batches || []);
        }
        if (transaction?.return_type === "Activation") {
          getActivationInventory(`${transaction.return_from}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const serialChecker = async (serial: string) => {
    if (serial.length == 12) {
      return refetchSerial({
        variables: { serial: serial },
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

  const onScanProductCode = () => {
    const productCode = form.values.product_code.trim();
    const productionDate = formatProductionDate(productCode);
    if (productCode === "" || !productCode)
      return form.setFieldError("product_code", "Please add product code");

    if (productCode.length != 10 || !productionDate)
      return Notification.error({
        message: "Invalid product code. Please check the code and try again.",
      });

    form.setValues({
      expiration_date: dayjs(productionDate).add(1, "year").toDate(),
    });
    Notification.success({
      message: "Product code added",
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
      if (checkScanRestrictions(`${gtin}`))
        return Notification.error({
          message: "Invalid GTIN format",
        });
      if (!input.expiration_date)
        return form.setFieldError(
          "expiration_date",
          "Please input expiration date",
        );
      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      } else {
        onScanGTIN(gtin);
      }
    }
  };

  // Query transaction and return the data to be used for scanning codentify
  const getLatestTransactionValues = async () => {
    return queryReturn({
      variables: {
        id: router.query.transactionId,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      return data.return;
    });
  };

  const onScanCodentify = async (codentify: CodentifyProps) => {
    //Get the latest quantities and batch items added to transactions
    const updatedTransaction = await getLatestTransactionValues();
    const input = form.values;
    const { data } = await refetchSerial({
      variables: { serial: codentify.serial },
      fetchPolicy: "no-cache",
    });
    // Get the updated quantity form the result (updatedTransaction) of getLatestTransactionValues function
    const quantity =
      updatedTransaction?.batch_items?.find(
        (e: WMS.BatchItems) =>
          e?.gtin === data?.inventoryItem?.gtin &&
          e?.batch_id == data?.inventoryItem?.batch_id,
      )?.quantity || 0;

    if (!data.inventoryItem) {
      Notification.error({ message: `${codentify.serial} not available` });
      resetForm();
    } else {
      if (
        data?.inventoryItem?.warehouse_id !== router.query.warehouse &&
        transaction.return_type !== "Activation"
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
      if (data.inventoryItem.item_status === "AVAILABLE")
        return Notification.error({
          message: `Return failed. Item Status: ${data?.inventoryItem?.item_status}`,
        });
      if (
        !data.inventoryItem.warehouse_id.includes(form.values.activation) &&
        !data.inventoryItem.warehouse_id.includes(form.values.outlet) &&
        transaction.return_type === "Activation"
      ) {
        const activation = dataActivations?.activations?.items?.find(
          (e: RETAIL.Activation) =>
            data.inventoryItem.warehouse_id.includes(e.id),
        );
        const outlet = activation?.outlets?.find((e: RETAIL.Outlet) =>
          data.inventoryItem.warehouse_id.includes(e.id),
        );
        return Notification.error({
          title: "Invalid Return",
          message: `Return to ${activation?.id}: ${outlet?.name} ${outlet?.location} `,
        });
      }

      returnDevice({
        variables: {
          serial: data.inventoryItem.serial,
          gtin: data.inventoryItem.gtin,
          batch_id: data.inventoryItem.batch_id,
          batch_input: {
            gtin: data.inventoryItem.gtin,
            batch_id: data.inventoryItem.batch_id,
            quantity: quantity + 1,
            channel: channel,
          },
          return_id: transaction.id,
        },
      })
        .then(() => {
          if (
            transaction.return_type === "Activation" &&
            !isVoucher &&
            isBundle
          ) {
            onActivationReturnByBatches(true, codentify);
          } else {
            // loadReturn();
            updateDeviceLineItems(
              data.inventoryItem,
              updatedTransaction.batch_items || [],
            );
            Notification.success({
              message: `${codentify.serial} scan success`,
            });
          }
          if (data?.return?.return_type === "Activation") {
            getActivationInventory(`${data.return.return_from}`);
          }
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
      tag: "",
    });

    setTransaction({
      ...transaction,
      batch_items: updateList,
    });
    setTransactionBatchItems(updateList || []);
  };

  const onScanGTIN = async (gtin: string | number) => {
    const type =
      dataSKU.skus?.items?.find((e: WMS.Sku) => e.gtin === gtin)?.type || "";
    // if (type === "DEVICES" || type === "VOUCHER")
    //   return Notification.error({
    //     message: "Cannot scan Device GTIN, use Codentify/Serial",
    //   });
    const input = form.values;
    if (type === WMS.SkuType.Accessories || type === WMS.SkuType.Devices) {
      input.batch_id = type;
    } else {
      input.batch_id = dayjs(input.expiration_date).format("YYYY-MM-DD");
    }
    const quantity =
      transaction.batch_items?.find(
        (e) => e?.gtin === gtin && e?.batch_id == input.batch_id,
      )?.quantity || 0;
    setIsGTINScanned(true);
    returnGTIN({
      variables: {
        return_id: transaction?.id,
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
        setTransaction(response?.data?.returnByBatch);
        const batches = response.data.returnByBatch.batch_items;
        setTransactionBatchItems(batches || []);
        resetForm();
        Notification.success({ message: `${gtin} scan success` });
        if (transaction?.return_type === "Activation") {
          getActivationInventory(`${transaction.return_from}`);
        }
      })
      .catch((e) => {
        setIsGTINScanned(false);
        Notification.error({ message: e.message });
      });
  };

  const onActivationReturnByBatches = (
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
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchReturnItems>>) =>
        e?.gtin == "5410706851458",
    )?.quantity;
    const device4806504615261 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchReturnItems>>) =>
        e?.gtin == "4806504615261",
    )?.quantity;
    const device4806504615292 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchReturnItems>>) =>
        e?.gtin == "4806504615292",
    )?.quantity;
    const deviceDesc2 = list?.find(
      (e: WMS.Maybe<WMS.Maybe<WMS.BatchReturnItems>>) =>
        e?.gtin ==
        (itemDesc?.description?.includes("2")
          ? "4806504615278"
          : "4806504615285"),
    )?.quantity;
    returnBatches({
      variables: {
        return_id: transaction.id,
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
        ],
      },
    }).then((res) => {
      setTransaction(res.data.returnByBatches);
      const batches = res.data.returnByBatches.batch_items;
      setTransactionBatchItems(batches || []);
      Notification.success({ message: `${codentify.serial} scan success` });
      if (transaction?.return_type === "Activation") {
        getActivationInventory(`${transaction.return_from}`);
      }
    });
  };

  const onUpdateReturnForm = () => {
    returnUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
          return_from:
            transaction?.return_type === "Activation"
              ? `${form.values.activation}_${form.values.outlet}`
              : form.values.return_from,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.returnUpdate);
        const batches = res?.data?.returnUpdate.batch_items;
        setTransactionBatchItems(batches || []);
        if (transaction?.return_type === "Activation") {
          getActivationInventory(`${transaction.return_from}`);
        }
      })
      .catch((e) => {
        Notification.error({ message: e.message });
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
    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields" });
    returnUpdate({
      variables: {
        input: {
          status: "COMPLETED",
          id: transaction?.id,
          remarks: form.values.remarks,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
          return_from:
            transaction?.return_type === "Activation"
              ? `${form.values.activation}_${form.values.outlet}`
              : form.values.return_from,
        },
      },
    })
      .then((res) => {
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
        Notification.success({ message: "Return Saved" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const formByType = () => {
    switch (transaction?.return_type) {
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
                onBlur={() => onUpdateReturnForm()}
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
                onBlur={() => onUpdateReturnForm()}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("remarks")}
                onBlur={() => onUpdateReturnForm()}
                label="Remarks"
                placeholder="Enter Remarks"
                disabled={disable}
                required
              />
            </Grid.Col>
          </Grid>
        );
      case "ReturnInventory":
        return (
          <Grid gutter={"lg"}>
            <Grid.Col span={6}>
              <Input
                {...form.getInputProps("remarks")}
                onBlur={() => onUpdateReturnForm()}
                label="Remarks"
                placeholder="Enter Remarks"
                disabled={disable}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Input
                {...form.getInputProps("delivery_type")}
                onBlur={() => onUpdateReturnForm()}
                label="Delivery Type"
                placeholder="PMI Delivery/Lalamove/Other courier provider"
                disabled={disable}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                {...form.getInputProps("box_count")}
                onBlur={() => onUpdateReturnForm()}
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
                onBlur={() => onUpdateReturnForm()}
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
                onBlur={() => onUpdateReturnForm()}
                label="Bag Count"
                placeholder="Enter Bag Count"
                disabled={disable}
                min={0}
                max={1000}
              />
            </Grid.Col>
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
              {router.query.warehouse}: Return {transaction?.return_type}
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
                {channel === "DIRECT_RETAIL" ||
                transaction.return_type !== "Activation" ? undefined : (
                  <Checkbox
                    onChange={(e) => setIsVoucher(e.target.checked)}
                    label="Voucher"
                  />
                )}
                {isVoucher && transaction.return_type === "Activation" ? (
                  <>
                    <Input
                      {...form.getInputProps("batch_id")}
                      description="Batch ID"
                      placeholder="Enter Batch ID"
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
                    <Input
                      {...form.getInputProps("product_code")}
                      label="Product Code"
                      placeholder="Enter Product Code"
                      required
                      withAsterisk
                      icon-={<Plus />}
                      onKeyPress={(e) =>
                        e.key === "Enter" ? onScanProductCode() : undefined
                      }
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
                {transaction.return_type === "Activation" ? (
                  <Checkbox
                    onChange={(e) => setIsBundle(e.target.checked)}
                    label="Bundle"
                  />
                ) : undefined}
              </Group>
            )}
          </form>
        </div>
      </Paper>
      {transaction.return_type === "Activation" ? (
        <ActivationInventory
          id={`${transaction.return_type}`}
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
