import Notification from "../../../Elements/Notification/Notification";
import { WMS } from "../../../../GraphQL";

type FormLike = {
  values: {
    mapping_id?: string;
  };
  setFieldValue: (field: string, value: string) => void;
};

type CodentifyProps = {
  gtin: string | undefined;
  serial: string | undefined;
  sku: string | undefined;
};

type LoadTransferSRFArgs = {
  form: FormLike;
  getSRF: (options: {
    variables: {
      id: string;
    };
  }) => Promise<{ data: any }>;
  loadingSRF: boolean;
  pendingMappingId: string;
  setPendingMappingId: (value: string) => void;
  setMappingItems: (value: any[]) => void;
  setMappingReference: (value: { id?: string }) => void;
  setLoading: (value: boolean) => void;
  routerTransaction?: string | string[];
  routerWarehouse?: string | string[];
  channel?: string;
  incompatibleChannels?: string[];
  transactionType?: string;
  requiredWarehouse?: string | null;
  validateSameChannel?: boolean;
  setWarehouseBeforeScan?: boolean;
  onScanSRFData: (data: WMS.StockRequestItem) => Promise<void>;
};

type TransferSRFScanArgs = {
  loading: boolean;
  loadingDevice: boolean;
  loadingSerial: boolean;
  loadingVoid: boolean;
  loadingBatch: boolean;
  loadingReceiveBatch: boolean;
  transaction: WMS.Transfer;
  dataSKU: any;
  channel: string | undefined;
  transferGTIN: (payload: {
    variables: {
      transfer_id?: string;
      input: {
        gtin: string;
        batch_id?: string;
        quantity: number;
        channel?: string;
        expiration_date?: string;
      };
    };
  }) => Promise<any>;
  setIsGTINScanned: (value: boolean) => void;
  setTransaction: (value: WMS.Transfer) => void;
  setTransactionBatchItems: (value: any[]) => void;
  normalizeBatchItems: (items?: any[]) => any[];
  resetForm: () => void;
  serialChecker: (serial: string) => Promise<CodentifyProps | undefined>;
  onScanCodentify: (codentify: CodentifyProps) => Promise<void>;
  formatCodentify: (value: string | undefined) => CodentifyProps | false;
  checkScanRestrictions: (value: string) => boolean;
  blockedGtinTypes?: string[];
  usePmiGtin?: boolean;
  deviceScanDelayMs?: number;
  logCodentify?: boolean;
};

const getRouteValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const loadTransferSRF = async ({
  form,
  getSRF,
  loadingSRF,
  pendingMappingId,
  setPendingMappingId,
  setMappingItems,
  setMappingReference,
  setLoading,
  routerTransaction,
  routerWarehouse,
  channel,
  incompatibleChannels = ["DIRECT_RETAIL", "INDIRECT_CHANNEL"],
  transactionType = "transfer",
  requiredWarehouse = "PH01",
  validateSameChannel = false,
  setWarehouseBeforeScan = false,
  onScanSRFData,
}: LoadTransferSRFArgs) => {
  if (!form.values.mapping_id) {
    return Notification.error({
      title: "Invalid Mapping ID",
      message: "Please enter a Mapping ID before searching.",
    });
  }

  setPendingMappingId(form.values.mapping_id);

  try {
    const { data } = await getSRF({
      variables: {
        id: form.values.mapping_id,
      },
    });

    const SRF = data;

    if (!SRF?.stockRequest) {
      setMappingItems([]);
      setMappingReference({});

      if (pendingMappingId && !loadingSRF) {
        Notification.error({
          title: "Invalid SRF ID",
          message: `SRF id ${pendingMappingId} is invalid or not found.`,
        });
        setPendingMappingId("");
      }
      return;
    }

    if (
      incompatibleChannels.includes(SRF.stockRequest.channel) &&
      getRouteValue(routerTransaction) == transactionType
    ) {
      return Notification.error({
        title: "Mapping ID",
        message: "ERROR: incompatible transfer channel",
      });
    }

    if (
      requiredWarehouse &&
      getRouteValue(routerWarehouse) != requiredWarehouse
    ) {
      return Notification.info({
        title: "Mapping ID",
        message: "ERROR: This warehouse is not allowed to use SRF",
      });
    }

    if (SRF.stockRequest.status === "CLOSED") {
      return Notification.info({
        title: "Mapping ID",
        message: "This mapping id is closed",
      });
    }

    if (SRF.stockRequest.status !== "AVAILABLE") {
      return Notification.error({
        title: "Mapping ID",
        message: "This mapping id is for review",
      });
    }

    const mappingIdValue = form.values.mapping_id?.trim();
    if (!mappingIdValue) return;

    const stockRequest = SRF.stockRequest;

    const referenceId =
      stockRequest.transaction_id || stockRequest.id || mappingIdValue || "";

    if (setWarehouseBeforeScan) {
      form.setFieldValue(
        "to_warehouse_id",
        SRF.stockRequest.warehouse_id || "",
      );
    }

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    setLoading(true);
    for (const data of stockRequest.items || []) {
      if (data?.wh_qty == null || data?.wh_qty == 0) continue;

      await onScanSRFData(data);
    }

    setMappingReference({ id: referenceId });
    setPendingMappingId("");
    if (!setWarehouseBeforeScan) {
      form.setFieldValue(
        "to_warehouse_id",
        SRF.stockRequest.warehouse_id || "",
      );
    }
    setLoading(false);
  } catch (err: any) {
    setLoading(false);
    Notification.error({
      title: "Error",
      message: err.message,
    });
  }
};

export const onScanSRFGTIN = async ({
  data,
  dataSKU,
  transaction,
  channel,
  transferGTIN,
  setIsGTINScanned,
  setTransaction,
  setTransactionBatchItems,
  normalizeBatchItems,
  resetForm,
  blockedGtinTypes = ["DEVICES"],
  usePmiGtin = true,
}: {
  data: WMS.StockRequestItem;
  dataSKU: any;
  transaction: WMS.Transfer;
  channel: string | undefined;
  transferGTIN: TransferSRFScanArgs["transferGTIN"];
  setIsGTINScanned: (value: boolean) => void;
  setTransaction: (value: WMS.Transfer) => void;
  setTransactionBatchItems: (value: any[]) => void;
  normalizeBatchItems: (items?: any[]) => any[];
  resetForm: () => void;
  blockedGtinTypes?: string[];
  usePmiGtin?: boolean;
}) => {
  const type =
    dataSKU.skus?.items?.find((e: WMS.Sku) => e.gtin === data.gtin)?.type || "";
  if (blockedGtinTypes.includes(type))
    return Notification.error({
      message: "Cannot scan Device GTIN, use Codentify/Serial",
    });

  setIsGTINScanned(true);

  const newGtin =
    dataSKU.skus?.items?.find((e: WMS.Sku) => e.gtin === data.gtin + "_PMI")
      ?.gtin || "";

  return transferGTIN({
    variables: {
      transfer_id: transaction?.id ?? "",
      input: {
        gtin: usePmiGtin ? newGtin || data.gtin : data.gtin,
        batch_id: data.batch_id ?? "",
        quantity: data?.wh_qty ?? 0 + 1,
        channel: channel,
        expiration_date:
          type == WMS.SkuType.Accessories || type == WMS.SkuType.Devices
            ? "-"
            : data.batch_id ?? "",
      },
    },
  })
    .then((response) => {
      setIsGTINScanned(false);
      setTransaction(response?.data?.transferByBatch);
      const batches = response?.data.transferByBatch.batch_items;
      setTransactionBatchItems(normalizeBatchItems(batches));
      resetForm();
      Notification.success({ message: `${data.gtin} scan success` });
    })
    .catch((e) => {
      setIsGTINScanned(false);
      Notification.error({ message: e.message });
    });
};

export const onScanSRFData = async ({
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
  blockedGtinTypes,
  usePmiGtin,
  deviceScanDelayMs = 1500,
  logCodentify = true,
}: {
  data: WMS.StockRequestItem;
} & TransferSRFScanArgs) => {
  if (
    loading ||
    loadingDevice ||
    loadingSerial ||
    loadingVoid ||
    loadingBatch ||
    loadingReceiveBatch
  ) {
    return Notification.info({
      message: "Scanning on process. Please wait.",
    });
  }

  if (!transaction.to_warehouse_id) {
    return Notification.error({
      message: "Please select inventory destination first!",
    });
  }

  if (data.inventory_type === WMS.SkuType.Devices) {
    const serials = Array.isArray(data.serial)
      ? data.serial.filter(Boolean)
      : [];

    for (const serial of serials) {
      const isSerial = await serialChecker(serial);

      const codentify = isSerial ? isSerial : formatCodentify(data.gtin ?? "");

      if (logCodentify) console.log(isSerial, codentify);
      if (codentify) {
        await onScanCodentify(codentify);
      }
    }
    return;
  }

  let gtin = data.gtin ?? "";

  if (checkScanRestrictions(`${gtin}`)) {
    return Notification.error({
      message: "Invalid GTIN format",
    });
  }

  if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
    console.log("first check");

    gtin = gtin + "_PMI";

    if (!dataSKU?.skus?.items.some((e: WMS.Sku) => e.gtin === gtin)) {
      return Notification.error({
        title: "Error",
        message: "SKU/GTIN not found",
      });
    } else {
      return await onScanSRFGTIN({
        data,
        dataSKU,
        transaction,
        channel,
        transferGTIN,
        setIsGTINScanned,
        setTransaction,
        setTransactionBatchItems,
        normalizeBatchItems,
        resetForm,
        blockedGtinTypes,
        usePmiGtin,
      });
    }
  } else {
    await onScanSRFGTIN({
      data,
      dataSKU,
      transaction,
      channel,
      transferGTIN,
      setIsGTINScanned,
      setTransaction,
      setTransactionBatchItems,
      normalizeBatchItems,
      resetForm,
      blockedGtinTypes,
      usePmiGtin,
    });
  }
};

export const createTransferSRFHandlers = (args: LoadTransferSRFArgs) => ({
  loadSRF: () => loadTransferSRF(args),
});
