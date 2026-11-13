/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import {
  Divider,
  Grid,
  Group,
  Input,
  Paper,
  Select,
  Button,
  LoadingOverlay,
  Modal,
  TextArea,
  Stack,
  DatePicker,
} from "../../Elements";
import {
  getDirectTransfer,
  transferByBatch,
  transferByBatchReceive,
  directTransferItem,
  transferItemReceive,
  transferItemReceiveVoid,
  transferItemVoid,
  updateDirectTransfer,
  cancelTransfer,
  transferItem,
  getStockRequest,
  updateSrfStatus,
} from "../../../GraphQL/TransactionSchema";
import { useStyles } from "./Transaction.syles";
import { TransactionTable } from "./TransactionTable";
import { useForm } from "@mantine/form";
import { getWarehouses, getWarehouse } from "../../../GraphQL/InventorySchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import Notification from "../../Elements/Notification/Notification";
import {
  checkScanRestrictions,
  formatCodentify,
} from "../CodentifyScanner/Config";
import { Check, X, Plus } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { getDRTags } from "./TransactionConfig";
import dayjs from "dayjs";
import { PrintTransaction } from "./PrintTransaction";
import { onScanProductCode } from "../../../Utilities/Formatter";
import { Autocomplete } from "@mantine/core";
import {
  createTransferSRFHandlers,
  onScanSRFData as onScanSRFDataHelper,
} from "./Helpers/Transfer";

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

type DisplayBatchItem = BatchesProps & {
  id?: string;
  isMapped?: boolean;
  mappingReference?: string;
};

type MappedItem = DisplayBatchItem & {
  id: string;
  gtin: string;
  quantity: number;
  req_qty?: number;
  curr_qty?: number;
  sc_qty?: number;
};

export const DirectTransfer = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user] = useAtom(rolesAtom);
  const [userDetails] = useAtom(userAtom);
  const [channel] = useAtom(channelAtom);
  const [transaction, setTransaction] = useState<WMS.Transfer>({});
  const [transactionBatchItems, setTransactionBatchItems] = useState<
    DisplayBatchItem[]
  >([]);
  const [disable, setDisable] = useState(true);
  const [isCancel, setIsCancel] = useState(false);
  const [isGTINScanned, setIsGTINScanned] = useState(false);
  const [mappingItems, setMappingItems] = useState<MappedItem[]>([]);
  const [mappingReference, setMappingReference] = useState<{
    id?: string;
    batchId?: string;
  }>({});
  const [pendingMappingId, setPendingMappingId] = useState<string>("");
  const [isApplyingMapping, setIsApplyingMapping] = useState(false);

  const normalizeBatchItems = (
    items?: BatchesProps[] | DisplayBatchItem[],
  ): DisplayBatchItem[] =>
    (items || []).map((item) => ({ ...item, isMapped: false }));

  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });

  const [queryWarehouse] = useLazyQuery(getWarehouse, {
    context: { clientName: "warehouse" },
  });

  const [queryWarehouses] = useLazyQuery(getWarehouses, {
    context: { clientName: "warehouse" },
  });
  const [queryDirectTransfer] = useLazyQuery(getDirectTransfer, {
    context: { clientName: "warehouse" },
  });
  const [refetchSerial, { loading: loadingSerial }] = useLazyQuery(
    getInventoryItem,
    { context: { clientName: "warehouse" } },
  );
  const [getSRF, { loading: loadingSRF, data: srfData }] = useLazyQuery(
    getStockRequest,
    {
      context: { clientName: "warehouse" },
    },
  );

  const [updateMappingStatus, { loading: loadingSrfUpdate }] = useMutation(
    updateSrfStatus,
    { context: { clientName: "warehouse" } },
  );

  const [directTransferUpdate] = useMutation(updateDirectTransfer, {
    context: { clientName: "warehouse" },
  });
  const [transferGTIN, { loading: loadingBatch }] = useMutation(
    transferByBatch,
    { context: { clientName: "warehouse" } },
  );
  const [transferReceiveGTIN, { loading: loadingReceiveBatch }] = useMutation(
    transferByBatchReceive,
    { context: { clientName: "warehouse" } },
  );
  const [directTransferDevice, { loading: loadingDevice }] = useMutation(
    transferItem,
    { context: { clientName: "warehouse" } },
  );
  const [transferReceivedDevice, { loading: loadingReceivedDevice }] =
    useMutation(transferItemReceive, { context: { clientName: "warehouse" } });
  const [voidDeviceSerial, { loading: loadingVoid }] = useMutation(
    transferItemVoid,
    { context: { clientName: "warehouse" } },
  );
  const [voideDeviceReceivedSerial, { loading: loadingReceivedVoid }] =
    useMutation(transferItemReceiveVoid, {
      context: { clientName: "warehouse" },
    });
  const [cancelTransferTransaction, { loading: loadingCancel }] = useMutation(
    cancelTransfer,
    { context: { clientName: "warehouse" } },
  );
  const isReceive = router.query.warehouse === transaction.to_warehouse_id;
  const [cancelReason, setCancelReason] =
    useState<String | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [warehouseList, setWarehouseList] = useState<WMS.Warehouse[]>([]);
  const [warehouse, setWarehouse] =
    useState<WMS.Warehouse | undefined>(undefined);

  const form = useForm({
    initialValues: {
      remarks: "",
      invoice_id: "",
      to_warehouse_id: "",
      batch_id: "",
      codentify: "",
      tag: "",
      delivery_type: "",
      box_count: 0,
      bundle_count: 0,
      bag_count: 0,
      ar_number: "",
      mapping_id: "",
      expiration_date: null as Date | null,
      product_code: "",
    },
    validate: {
      ar_number: (value) => (!value ? "Please add AR Number!" : null),
      invoice_id: (value) => (!value ? "Please add Invoice ID!" : null),
      remarks: (value) => (!value ? "Please add Remarks!" : null),
      to_warehouse_id: (value) => (!value ? "Please add Destination!" : null),
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
    queryWarehouse({
      variables: {
        id: transaction.warehouse_id,
      },
    }).then(({ data }) => {
      setWarehouse(data?.warehouse);
    });

    loadTransfer();
    console.log("id", transaction.warehouse_id);
  }, [transaction.warehouse_id]);

  useEffect(() => {
    if (!form.values.mapping_id) {
      setMappingItems([]);
      setMappingReference({});
      setPendingMappingId("");
    }
  }, [form.values.mapping_id]);

  const accessRole = () => {
    if (
      user.isAdminDC ||
      user.isDirectRetailAdmin ||
      user.isSE ||
      user.isStoreManager ||
      user.isEcomAdmin ||
      user.isFOM ||
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

  const isSubmittedTransfer = (transfer: WMS.DirectTransfer) => {
    if (
      transfer.status === "FLOATING" &&
      transfer.to_warehouse_id !== router.query.warehouse
    ) {
      return true;
    }
    return false;
  };

  const loadTransfer = () => {
    setLoading(true);
    setTimeout(() => {
      queryDirectTransfer({
        variables: {
          id: router.query.transactionId,
        },
        fetchPolicy: "no-cache",
      })
        .then(({ data }) => {
          if (data?.directTransfer) {
            form.setValues({
              remarks:
                data?.directTransfer?.status === "FLOATING" &&
                !data?.directTransfer?.remarks
                  ? data?.directTransfer?.id
                  : data?.directTransfer.remarks || "",
              invoice_id:
                data?.directTransfer?.status === "FLOATING" &&
                !data?.directTransfer?.invoice_id
                  ? data?.directTransfer?.id
                  : data?.directTransfer?.invoice_id || "",
              to_warehouse_id: data?.directTransfer?.to_warehouse_id || "",
              batch_id: "",
              codentify: "",
              tag: "",
              delivery_type: data?.directTransfer?.delivery_type || "",
              box_count: data?.directTransfer?.box_count || 0,
              bundle_count: data?.directTransfer?.bundle_count || 0,
              bag_count: data?.directTransfer?.bag_count || 0,
              ar_number: data?.directTransfer?.ar_number || "",
              expiration_date: data?.directTransfer?.expiration_date || "",
              product_code: data?.directTransfer?.product_code || "",
            });
            setTransaction(data?.directTransfer);
            const batches = data.directTransfer.batch_items;
            setTransactionBatchItems(normalizeBatchItems(batches));
            setDisable(
              data?.directTransfer?.status === "COMPLETED" ||
                data?.directTransfer?.status === "CANCELLED" ||
                accessRole() ||
                isSubmittedTransfer(data.directTransfer)
                ? true
                : false,
            );
          }
          queryWarehouses({
            variables: {
              channel:
                data?.directTransfer?.transfer_type === "ECOMM_TO_RETAIL"
                  ? "DIRECT_RETAIL"
                  : "ECOMM",
            },
          }).then((res) => {
            const warehouses = res?.data?.warehouses?.items || [];
            setWarehouseList(warehouses);
          });
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
    transferGTIN({
      variables: {
        transfer_id: transaction?.id,
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
        setTransaction(res?.data?.transferByBatch);
        const batches = res?.data.transferByBatch.batch_items;
        setTransactionBatchItems(normalizeBatchItems(batches));
        resetForm();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onReceivedQuantity = (
    value: number,
    item:
      | WMS.BatchPulloutItems
      | WMS.BatchTransmittalItems
      | WMS.BatchTransferItems
      | WMS.BatchReturnItems
      | null,
  ) => {
    if (value < 0) return Notification.error({ message: "Invalid Qty value" });
    transferReceiveGTIN({
      variables: {
        transfer_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: item?.quantity,
          received: Number(value),
          channel: channel,
          expiration_date: item?.expiration_date,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transferByBatchReceive);
        const batches = res?.data.transferByBatchReceive.batch_items;
        setTransactionBatchItems(normalizeBatchItems(batches));
        resetForm();
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
      loadingReceiveBatch
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    transferGTIN({
      variables: {
        transfer_id: transaction?.id,
        input: {
          gtin: item?.gtin,
          batch_id: item?.batch_id,
          quantity: 0,
          channel: channel,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.transferByBatch);
        const batches = res?.data.transferByBatch.batch_items;
        setTransactionBatchItems(normalizeBatchItems(batches));
        resetForm();
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

    if (transaction?.status == "FLOATING") {
      voideDeviceReceivedSerial({
        variables: {
          serial: item?.serial,
          transfer_id: transaction.id,
          batch_input: {
            gtin: serialItem.gtin,
            batch_id: serialItem.batch_id,
            quantity: transaction?.batch_items?.find(
              (e) =>
                e?.gtin === serialItem?.gtin &&
                serialItem?.batch_id === e?.batch_id,
            )?.quantity,
            received:
              (transaction?.batch_items?.find(
                (e) =>
                  e?.gtin === serialItem?.gtin &&
                  serialItem?.batch_id === e?.batch_id,
              )?.received || 0) - 1,
            channel: channel,
            expiration_date: "-",
          },
        },
      })
        .then((res) => {
          Notification.success({ message: `${item?.serial} removed` });
          setTransaction(res?.data?.transferItemReceiveVoid);
          const batches = res?.data.transferItemReceiveVoid.batch_items;
          setTransactionBatchItems(normalizeBatchItems(batches));
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    } else {
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
          transfer_id: transaction.id,
          batch_input: {
            gtin: serialItem.gtin,
            batch_id: serialItem.batch_id,
            quantity: Number(quantity) - 1,
            channel: channel,
            expiration_date: "-",
          },
        },
      })
        .then((res) => {
          Notification.success({ message: `${item?.serial} removed` });
          setTransaction(res?.data?.transferItemVoid);
          const batches = res?.data.transferItemVoid.batch_items;
          setTransactionBatchItems(normalizeBatchItems(batches));
        })
        .catch((e) => {
          Notification.error({ message: e.message });
        });
    }
  };

  const onUpdateTransferForm = () => {
    directTransferUpdate({
      variables: {
        input: {
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
          to_warehouse_id: form.values.to_warehouse_id,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bundle_count: form.values.bundle_count,
          bag_count: form.values.bag_count,
          ar_number: form.values.ar_number,
        },
      },
    })
      .then((res) => {
        setTransaction(res?.data?.directTransferUpdate);
        const batches = res?.data.directTransferUpdate.batch_items;
        setTransactionBatchItems(normalizeBatchItems(batches));
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const removeMappingItem = (id: string) => {
    setMappingItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (!filtered.length) {
        setMappingReference({});
      }
      return filtered;
    });
  };

  const applyMappedItems = async (): Promise<boolean> => {
    if (!srfData || !transaction?.id) return true;
    setIsApplyingMapping(true);
    if (srfData?.stockRequest?.warehouse_id != form.values.to_warehouse_id) {
      Notification.error({
        title: "Mapping ID",
        message:
          "you selected the wrong warehouse destination, please use the correct one base on stock request",
      });
      return false;
    }
    try {
      updateMappingStatus({
        variables: {
          input: {
            id: srfData?.stockRequest?.id,
            transfer_id: router.query.transactionId,
            status: "CLOSED",
            items: [],
          },
        },
      });

      setMappingItems([]);
      setMappingReference({});
      return true;
    } catch (e: any) {
      Notification.error({ message: e.message });
      return false;
    } finally {
      setIsApplyingMapping(false);
    }
  };

  const onSubmitTransaction = async () => {
    // console.log(form.validate().errors);

    if (form.validate().hasErrors)
      return Notification.error({ message: "Please fill up required fields" });
    if (
      !transaction.batch_items?.some((e) => e?.received) &&
      transaction.status === "FLOATING"
    )
      return Notification.error({ message: "No received quantity" });
    const mappingApplied = await applyMappedItems();
    if (!mappingApplied) return;
    directTransferUpdate({
      variables: {
        input: {
          status:
            transaction.to_warehouse_id === router.query.warehouse
              ? "COMPLETED"
              : "FLOATING",
          id: transaction?.id,
          remarks: form.values.remarks,
          invoice_id: form.values.invoice_id,
          to_warehouse_id: form.values.to_warehouse_id,
          delivery_type: form.values.delivery_type,
          box_count: form.values.box_count,
          bag_count: form.values.bag_count,
          srf_id:
            srfData?.stockRequest == undefined ? "-" : form.values.mapping_id,
        },
      },
    })
      .then((res) => {
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
        Notification.success({ message: "Transfer Saved" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
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

  const onScan = async () => {
    if (
      loading ||
      loadingDevice ||
      loadingSerial ||
      loadingVoid ||
      loadingBatch ||
      loadingReceiveBatch
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });

    if (!transaction.to_warehouse_id)
      return Notification.error({
        message: "Please select inventory destination first!",
      });

    const input = form.values;
    const isSerial = await serialChecker(input.codentify);
    const codentify = isSerial ? isSerial : formatCodentify(input.codentify);

    if (codentify) {
      onScanCodentify(codentify);
    } else {
      let gtin =
        input.tag && channel === "DIRECT_RETAIL"
          ? updateDRTag(input.codentify, input.tag)
          : input.codentify;

      if (checkScanRestrictions(`${gtin}`))
        return Notification.error({
          message: "Invalid GTIN format",
        });

      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
        console.log("first check");
        gtin = gtin + "_PMI";

        if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
          return Notification.error({
            title: "Error",
            message: "SKU/GTIN not found",
          });
        } else {
          onScanGTIN(gtin);
        }
      } else {
        onScanGTIN(gtin);
      }
    }
  };

  const serialChecker = async (serial: string) => {
    if (serial.length >= 12 && serial.length <= 16) {
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

  // Query transaction and return the data to be used for scanning codentify
  const getLatestTransactionValues = async () => {
    return queryDirectTransfer({
      variables: {
        id: router.query.transactionId,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      return data.directTransfer;
    });
  };

  const onScanCodentify = async (codentify: CodentifyProps) => {
    console.log("HIT!");
    //Get the latest quantities and batch items added to transactions
    const updatedTransaction = await getLatestTransactionValues();
    const { data } = await refetchSerial({
      variables: { serial: codentify.serial },
      fetchPolicy: "no-cache",
    });
    if (transaction.status == "FLOATING") {
      const item = transaction?.batch_items?.find(
        (e) =>
          e?.gtin === data?.inventoryItem?.gtin &&
          data?.inventoryItem?.batch_id === e?.batch_id,
      );
      if (!item)
        return Notification.error({ message: "Invalid serial scanned" });
      if (
        !item?.inventory?.items?.some(
          (e) => e?.serial === data.inventoryItem.serial,
        )
      )
        return Notification.error({
          message: "Invalid serial for this transaction",
        });
      if ((item?.quantity || 0) < (item?.received || 0) + 1)
        return Notification.error({
          message: "Scanned items already exceeded",
        });
      if (
        item.inventory.items.some(
          (e) => e?.serial === data.inventoryItem?.serial,
        ) &&
        data.inventoryItem?.warehouse_id === router.query.warehouse
      )
        return Notification.error({
          message: `${codentify.serial} already scanned`,
        });
    }
    if (
      data?.inventoryItem?.warehouse_id !== router.query.warehouse &&
      !isReceive
    )
      return Notification.error({
        message: "Serial is not from this warehouse",
      });
    if (
      transaction.batch_items?.some(
        (e) =>
          e?.inventory?.items?.some(
            (e) => e?.serial === data?.inventoryItem?.serial,
          ) && !isReceive,
      )
    )
      return Notification.error({
        message: `${codentify.serial} already scanned`,
      });
    if (
      !data.inventoryItem ||
      (data?.inventoryItem?.item_status !== "AVAILABLE" &&
        transaction.status !== "FLOATING")
    ) {
      Notification.error({ message: `${codentify.serial} not available` });
      resetForm();
    } else {
      if (transaction?.status == "FLOATING") {
        return transferReceivedDevice({
          variables: {
            serial: data.inventoryItem.serial,
            gtin: data.inventoryItem.gtin,
            batch_id: data.inventoryItem.batch_id,
            type: dataSKU?.skus?.items?.find(
              (e: WMS.Sku) => e.gtin === data.inventoryItem.gtin,
            )?.type,
            batch_input: {
              gtin: data.inventoryItem.gtin,
              batch_id: data.inventoryItem.batch_id,
              quantity: transaction?.batch_items?.find(
                (e) =>
                  e?.gtin === data.inventoryItem?.gtin &&
                  data?.inventoryItem?.batch_id === e?.batch_id,
              )?.inventory?.items?.length,
              received:
                (transaction?.batch_items?.find(
                  (e) =>
                    e?.gtin === data.inventoryItem?.gtin &&
                    data?.inventoryItem?.batch_id === e?.batch_id,
                )?.received || 0) + 1,
              channel: channel,
              expiration_date: "-",
            },
            transfer_id: transaction.id,
          },
        })
          .then(() => {
            updateDeviceLineItems(
              data.inventoryItem,
              updatedTransaction.batch_items || [],
            );
            Notification.success({
              message: `${codentify.serial} scan success`,
            });
          })
          .catch((e) => {
            Notification.error({ message: e.message });
          });
      } else {
        const input = form.values;
        // Get the updated quantity form the result (updatedTransaction) of getLatestTransactionValues function
        const quantity =
          updatedTransaction?.batch_items?.find(
            (e: WMS.BatchItems) =>
              e?.gtin === data?.inventoryItem?.gtin &&
              e?.batch_id == data?.inventoryItem?.batch_id,
          )?.quantity || 0;
        return directTransferDevice({
          variables: {
            serial: data.inventoryItem.serial,
            gtin: data.inventoryItem.gtin,
            batch_id: data.inventoryItem.batch_id,
            type: dataSKU?.skus?.items?.find(
              (e: WMS.Sku) => e.gtin === data.inventoryItem.gtin,
            )?.type,
            batch_input: {
              gtin: data.inventoryItem.gtin,
              batch_id: data.inventoryItem.batch_id,
              quantity: quantity + 1,
              channel: channel,
              expiration_date: "-",
            },
            transfer_id: transaction.id,
          },
        })
          .then(() => {
            updateDeviceLineItems(
              data.inventoryItem,
              updatedTransaction.batch_items || [],
            );
            Notification.success({
              message: `${codentify.serial} scan success`,
            });
          })
          .catch((e) => {
            Notification.error({ message: e.message });
          });
      }
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
      if (transaction.status === "FLOATING") {
        const updateReceivedItems = updateList[index].inventory?.items || [];
        const receivedItemIndex = updateReceivedItems?.findIndex(
          (e) => e?.serial === device.serial,
        );
        if (receivedItemIndex > -1) {
          updateReceivedItems[receivedItemIndex] = {
            ...updateReceivedItems[receivedItemIndex],
            warehouse_id: transaction.to_warehouse_id,
          };
        }
        updateList[index] = {
          ...updateList[index],
          received: (updateList[index].received || 0) + 1,
          inventory: {
            items: updateReceivedItems,
          },
        };
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
    setTransactionBatchItems(normalizeBatchItems(updateList));
  };

  const onScanGTIN = async (gtin: string | number) => {
    const gtinValue = String(gtin);

    const type =
      dataSKU.skus?.items?.find((e: WMS.Sku) => String(e.gtin) === gtinValue)
        ?.type || "";

    if (type === "DEVICES" || type === "VOUCHER")
      return Notification.error({
        message: "Cannot scan Device GTIN, use Codentify/Serial",
      });

    const input = form.values;
    if (type === WMS.SkuType.Accessories || type === WMS.SkuType.Devices) {
      input.batch_id = type;
    } else {
      if (!input.expiration_date) {
        return form.setFieldError(
          "expiration_date",
          "Please input expiration date",
        );
      }
      input.batch_id = dayjs(input.expiration_date).format("YYYY-MM-DD");
    }
    const quantity =
      transaction?.batch_items?.find(
        (e) => String(e?.gtin) === gtinValue && e?.batch_id == input.batch_id,
      )?.quantity || 0;

    setIsGTINScanned(true);

    const transfer = async (scanGTIN: string) => {
      return transferGTIN({
        variables: {
          transfer_id: transaction?.id,
          input: {
            gtin: scanGTIN,
            batch_id: input.batch_id,
            quantity: quantity + 1,
            channel: channel,
          expiration_date:
            type == WMS.SkuType.Accessories || type == WMS.SkuType.Devices
              ? "-"
              : dayjs(input.expiration_date).format("YYYY-MM-DD"),
          },
        },
      });
    };

    try {
      let response;

      try {
        response = await transfer(gtinValue);
      } catch (error) {
        response = await transfer(`${gtinValue}_PMI`);
      }

      setTransaction(response?.data?.transferByBatch);

      const batches = response?.data?.transferByBatch?.batch_items;

      setTransactionBatchItems(normalizeBatchItems(batches));

      resetForm();

      Notification.success({
        message: `${gtinValue} scan success`,
      });
    } catch (e: any) {
      Notification.error({
        message: e?.message || "Failed to transfer GTIN",
      });
    } finally {
      setIsGTINScanned(false);
    }
  };

  const onScanReceivedGTIN = async (gtin: string | number) => {
    const item = transaction?.batch_items?.find(
      (e) => e?.gtin === gtin && e.quantity !== e.received,
    );
    if (!item)
      return Notification.info({
        message: "Item already at max received quantity",
      });
    setIsGTINScanned(true);
    transferReceiveGTIN({
      variables: {
        transfer_id: transaction?.id,
        input: {
          gtin: gtin,
          batch_id: item?.batch_id,
          quantity: item?.quantity,
          received: Number(item?.received || 0) + 1,
          channel: channel,
          expiration_date: item.expiration_date,
        },
      },
    })
      .then((response) => {
        setIsGTINScanned(false);
        setTransaction(response?.data?.transferByBatchReceive);
        const batches = response?.data.transferByBatchReceive.batch_items;
        setTransactionBatchItems(normalizeBatchItems(batches));
        resetForm();
        Notification.success({ message: `${gtin} scan success` });
      })
      .catch((e) => {
        setIsGTINScanned(false);
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

  const onScanToEditReceive = async (value: string) => {
    if (
      loading ||
      loadingDevice ||
      loadingSerial ||
      loadingVoid ||
      loadingBatch ||
      loadingReceiveBatch
    )
      return Notification.info({
        message: "Scanning on process. Please wait.",
      });
    const isSerial = await serialChecker(value);
    const codentify = isSerial ? isSerial : formatCodentify(value);
    if (codentify) {
      onScanCodentify(codentify);
    } else {
      if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === value)) {
        return Notification.error({
          title: "Error",
          message: "SKU/GTIN not found",
        });
      } else {
        const item: WMS.Sku = dataSKU?.skus?.items.find(
          (e: WMS.Sku) => e.gtin === value,
        );
        if (item.type === "DEVICES" || item.type === "VOUCHER")
          return Notification.error({ message: "Cannot scan device GTIN" });
        onScanReceivedGTIN(value);
      }
    }

    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
  };

  const onCancelTransfer = () => {
    if (!cancelReason)
      return Notification.error({ message: "Please add reason for cancel!" });
    cancelTransferTransaction({
      variables: {
        id: transaction?.id,
        reason_for_cancel: cancelReason,
      },
    })
      .then((res) => {
        Notification.success({ message: "Transfer Cancelled" });
        router.push(`/inventory/warehouse?warehouse=${router.query.warehouse}`);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      })
      .finally(() => {
        setIsCancel(false);
        setCancelReason(undefined);
      });
  };

  const cancelModalRender = () => {
    return (
      <Modal
        centered
        opened={isCancel}
        onClose={() => setIsCancel(false)}
        title="Cancel Transfer"
      >
        <p>Are you sure you want to cancel this transaction?</p>
        <TextArea
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="If yes, enter reason for cancel"
        />
        <br />
        <Group position="center">
          <Button
            onClick={() => onCancelTransfer()}
            customType="primary"
            size="xs"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setIsCancel(false);
              setCancelReason(undefined);
            }}
            customType="secondary"
            size="xs"
          >
            No
          </Button>
        </Group>
      </Modal>
    );
  };

  const onScanSRFData = (data: WMS.StockRequestItem) =>
    onScanSRFDataHelper({
      data,
      loading,
      loadingDevice,
      loadingSerial,
      loadingVoid,
      loadingBatch,
      loadingReceiveBatch,
      transaction,
      dataSKU,
      channel,
      transferGTIN,
      setIsGTINScanned,
      setTransaction,
      setTransactionBatchItems,
      normalizeBatchItems,
      resetForm,
      serialChecker,
      onScanCodentify,
      formatCodentify,
      checkScanRestrictions,
      blockedGtinTypes: ["DEVICES", "VOUCHER"],
      usePmiGtin: false,
      deviceScanDelayMs: 0,
      logCodentify: false,
    });

  const { loadSRF } = createTransferSRFHandlers({
    form,
    getSRF,
    loadingSRF,
    pendingMappingId,
    setPendingMappingId,
    setMappingItems,
    setMappingReference,
    setLoading,
    routerTransaction: router.query.transaction,
    routerWarehouse: router.query.warehouse,
    channel,
    incompatibleChannels: ["ECOMM", "INDIRECT_CHANNEL"],
    transactionType: "direct_transfer",
    requiredWarehouse: null,
    onScanSRFData,
  });

  const displayedBatchItems = [...transactionBatchItems, ...mappingItems];
  const hasBatchOrMappingItems =
    (transaction?.batch_items?.length || 0) > 0 || mappingItems.length > 0;
  const hasPendingUnreceived =
    isReceive && transaction?.batch_items?.some((e) => !e?.received);
  const disableDoneButton =
    !hasBatchOrMappingItems || disable || hasPendingUnreceived;

  return (
    <div>
      <LoadingOverlay
        overlayOpacity={0.4}
        visible={
          loading ||
          loadingCancel ||
          loadingDevice ||
          loadingSerial ||
          loadingVoid ||
          loadingReceivedDevice ||
          loadingReceivedVoid ||
          (loadingBatch && isGTINScanned) ||
          (loadingReceiveBatch && isGTINScanned)
        }
      />
      <Paper radius={8}>
        <div className={classes.transactionCard}>
          {cancelModalRender()}
          <Group position="apart">
            <Group>
              <h2>{router.query.warehouse}: Direct Transfer</h2>
              {form.values.invoice_id?.trim() ? (
                <PrintTransaction
                  transactionId={String(router.query.transactionId)}
                />
              ) : null}
            </Group>
            {isReceive && !disable ? (
              <Button
                customType="danger"
                disabled={
                  !(
                    isReceive &&
                    !transaction?.batch_items?.some((e) => e?.received)
                  )
                }
                onClick={() => setIsCancel(true)}
                icon={<X />}
              >
                CANCEL TRANSFER
              </Button>
            ) : undefined}
          </Group>
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Grid gutter={"lg"}>
              <Grid.Col span={6}>
                <Input
                  value={warehouse?.name?.toString()}
                  disabled={true}
                  label="Source Warehouse"
                  placeholder="Source Warehouse"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  {...form.getInputProps("to_warehouse_id")}
                  searchable
                  label="Inventory Destination"
                  placeholder="Select destination"
                  required
                  data={
                    warehouseList
                      ?.filter(
                        (e: WMS.Warehouse) =>
                          e.status === true &&
                          (transaction.status === "PENDING"
                            ? e.id !== router.query.warehouse
                            : true),
                      )
                      .map((e: WMS.Warehouse) => ({
                        label: e.name ?? "",
                        value: e.id ?? "",
                      })) || []
                  }
                  onBlur={() => onUpdateTransferForm()}
                  disabled={
                    disable || (transaction?.batch_items?.length || 0) > 0
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Input
                  value={dayjs(
                    Number(transaction?.date_created)?.toString().length === 13
                      ? Number(transaction?.date_created)
                      : Number(transaction?.date_created) * 1000,
                  ).format("MMM D, YYYY h:mm A")}
                  disabled={true}
                  label="Date Created"
                  placeholder="Date Created"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Input
                  value={dayjs(
                    Number(transaction?.date_updated)?.toString().length === 13
                      ? Number(transaction?.date_updated)
                      : Number(transaction?.date_updated) * 1000,
                  ).format("MMM D, YYYY h:mm A")}
                  disabled={true}
                  label="Date Updated"
                  placeholder="Date Updated"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("remarks")}
                  required
                  onBlur={() => onUpdateTransferForm()}
                  disabled={disable || transaction.status === "FLOATING"}
                  label="Remarks"
                  placeholder="Enter Remarks"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("invoice_id")}
                  onBlur={() => onUpdateTransferForm()}
                  disabled={true}
                  label="Invoice ID"
                  placeholder="Enter Invoice ID"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Input
                  {...form.getInputProps("ar_number")}
                  required
                  onBlur={() => onUpdateTransferForm()}
                  disabled={disable || transaction.status === "FLOATING"}
                  label="AR Number"
                  placeholder="Enter AR Number"
                />
              </Grid.Col>
            </Grid>
            <Grid gutter={"lg"}>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("delivery_type")}
                  onBlur={(e) => onUpdateTransferForm()}
                  label="Delivery Type"
                  placeholder="PMI Delivery/Lalamove/Other courier provider"
                  disabled={disable || transaction.status === "FLOATING"}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("box_count")}
                  onBlur={(e) => onUpdateTransferForm()}
                  label="Box Count"
                  placeholder="Enter Box Count"
                  disabled={disable || transaction.status === "FLOATING"}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("bundle_count")}
                  onBlur={(e) => onUpdateTransferForm()}
                  label="Bundle Count"
                  placeholder="Enter Bundle Count"
                  disabled={disable || transaction.status === "FLOATING"}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Input
                  {...form.getInputProps("bag_count")}
                  onBlur={(e) => onUpdateTransferForm()}
                  label="Bag Count"
                  placeholder="Enter Bag Count"
                  disabled={disable || transaction.status === "FLOATING"}
                  min={0}
                  max={1000}
                />
              </Grid.Col>
            </Grid>
            <Divider my="lg" />
            {disable ? undefined : (
              <>
                <Group>
                  {transaction.status === "FLOATING" ? undefined : (
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
                      <Group align="end">
                        <Input
                          description="Input Mapping ID"
                          placeholder="Enter Mapping ID"
                          {...form.getInputProps("mapping_id")}
                        />
                        <Button radius={"md"} onClick={loadSRF}>
                          Load the SRF
                        </Button>
                      </Group>
                    </>
                  )}
                </Group>
              </>
            )}
          </form>
          {transaction.status === "CANCELLED" ? (
            <h4 style={{ margin: 0 }}>
              REASON FOR CANCEL : {transaction.reason_for_cancel}
            </h4>
          ) : undefined}
        </div>
      </Paper>
      <Stack>
        {transaction?.id?.includes("TRANSFER") &&
        transaction?.status == "FLOATING" ? (
          <Input
            innerref={inputRef}
            style={{ width: 500 }}
            onKeyPress={(e) =>
              e.key === "Enter"
                ? onScanToEditReceive(e.target.value)
                : undefined
            }
            disabled={disable}
            description="CODENTIFY/GTIN"
            placeholder="Scan CODENTIFY/GTIN receive"
          />
        ) : undefined}
        <TransactionTable
          loaders={{
            batch: loadingBatch || loadingReceiveBatch,
            device: loadingSerial,
          }}
          onUpdateQuantity={onUpdateQuantity}
          onUpdateExpDate={onUpdateExpDate}
          onRemoveSerial={onRemoveSerial}
          onRemoveItem={onRemoveItem}
          onReceivedQuantity={onReceivedQuantity}
          transaction={transaction}
          skus={dataSKU?.skus?.items}
          list={displayedBatchItems}
          onRemoveMappedItem={removeMappingItem}
        />
        <br />
        <Group position="center">
          <Button
            loading={
              loading ||
              loadingDevice ||
              loadingSerial ||
              loadingVoid ||
              (loadingBatch && isGTINScanned) ||
              (loadingReceiveBatch && isGTINScanned) ||
              isApplyingMapping
            }
            disabled={disableDoneButton}
            onClick={() => onSubmitTransaction()}
            icon={<Check />}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </div>
  );
};
