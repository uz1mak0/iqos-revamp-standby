import { WMS } from "../../../../../GraphQL";
import type { Dispatch, SetStateAction } from "react";
import { formatCodentify } from "../../../CodentifyScanner/Config";
import Notification from "../../../../Elements/Notification/Notification";

type SetCurrentSRF = Dispatch<SetStateAction<WMS.SRFs | undefined>>;
type RefetchSerialFn = (options: any) => Promise<any>;

export type CodentifyProps = {
  gtin: string | undefined;
  serial: string | undefined;
  sku: string | undefined;
};

type SkuLookupData = {
  skus?: {
    items?: WMS.Sku[] | null;
  } | null;
};

export const sanitizeStockRequestItems = (
  items?: (WMS.StockRequestItem | null)[] | null,
): WMS.StockRequestItemInput[] => {
  if (!items) return [];

  return items.filter(Boolean).map((item) => {
    const { __typename, is_new, ...cleanItem } = item as any;

    const inventoryType = cleanItem.inventory_type as WMS.SkuType;

    const isAccessoryOrDevice =
      inventoryType === WMS.SkuType.Accessories ||
      inventoryType === WMS.SkuType.Devices;

    const batch_id = isAccessoryOrDevice ? inventoryType : cleanItem.batch_id;

    return {
      ...cleanItem,
      batch_id,
      serial: Array.isArray(cleanItem.serial)
        ? cleanItem.serial.filter(Boolean)
        : [],
    };
  });
};

export const parseSerials = (serial: unknown): string[] => {
  if (!serial) return [];

  if (Array.isArray(serial)) {
    return serial.filter(Boolean).map(String);
  }

  if (typeof serial === "string") {
    return serial
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

export const updateItemField = (
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  setCurrentSRF: SetCurrentSRF,
  index: number,
  changes: Partial<WMS.StockRequestItemInput>,
) => {
  setHasUnsavedChanges(true);

  setCurrentSRF((prev) => {
    if (!prev?.items) return prev;

    const updatedItems = prev.items.map((item, itemIndex) => {
      if (itemIndex !== index || !item) return item;

      return {
        ...item,
        ...changes,
      };
    });

    return { ...prev, items: updatedItems };
  });
};

export const handleQtyChange = (
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  setCurrentSRF: SetCurrentSRF,
  index: number,
  field: "sc" | "wh",
  value: number,
) => {
  if (Number.isNaN(value)) return;

  updateItemField(
    setHasUnsavedChanges,
    setCurrentSRF,
    index,
    field === "sc" ? { sc_qty: value } : { wh_qty: value },
  );
};

export const handleBatchChange = (
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  setCurrentSRF: SetCurrentSRF,
  index: number,
  value: string,
) => {
  updateItemField(setHasUnsavedChanges, setCurrentSRF, index, {
    batch_id: value,
  });
};

export const toggleExpand = (
  setExpanded: Dispatch<SetStateAction<Set<string>>>,
  id: string,
) => {
  setExpanded((prev) => {
    const copy = new Set(prev);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    return copy;
  });
};

export const handleDeleteItem = (
  setCurrentSRF: SetCurrentSRF,
  index: number,
) => {
  setCurrentSRF((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      items: prev.items?.filter((_, i) => i !== index),
    };
  });
};

export const handleDeleteSerial = (
  setCurrentSRF: SetCurrentSRF,
  sku: string,
  serialToRemove: string,
) => {
  setCurrentSRF((prev) => {
    if (!prev) return prev;

    const items = [...(prev.items ?? [])];

    const index = items.findIndex((i) => i?.sku === sku);
    if (index === -1) return prev;

    const item = items[index];

    const existingSerials = Array.isArray(item?.serial)
      ? item.serial
      : item?.serial
      ? [item.serial]
      : [];

    const updatedSerials = existingSerials.filter((s) => s !== serialToRemove);

    const whQty = item?.wh_qty || 0;

    items[index] = {
      ...item,
      serial: updatedSerials,
      wh_qty: Math.max(whQty - 1, 0),
    };

    Notification.error({ message: " Serial Removed Successfully" });

    return {
      ...prev,
      items,
    };
  });
};

export const validateBeforeSave = (
  currentStatus: WMS.StockRequestStatus | undefined,
  items?: (WMS.StockRequestItem | null)[] | null,
) => {
  if (currentStatus == WMS.StockRequestStatus.FOR_REVIEW_SC) return true;

  if (!items) return true;

  for (const item of items) {
    if (!item) continue;

    const type = item.inventory_type as WMS.SkuType;

    const requiresBatch =
      type === WMS.SkuType.Heets || type === WMS.SkuType.Zyn;

    if (requiresBatch && !item.batch_id?.trim() && item.wh_qty != 0) {
      Notification.error({
        title: "Expiration Required",
        message: `${item.gtin} items require Expiration`,
      });

      return false;
    }

    if (type === WMS.SkuType.Devices) {
      const serialList = Array.isArray(item.serial)
        ? item.serial
        : item.serial
        ? [item.serial]
        : [];

      const whQty = item.wh_qty || 0;

      if (serialList.length === 0) {
        Notification.error({
          title: "Serial Required",
          message: `${item.gtin} requires serials`,
        });

        return false;
      }

      if (serialList.length !== whQty) {
        Notification.error({
          title: "Serial Count Mismatch",
          message: `${item.gtin} serial count must match WH QTY`,
        });

        return false;
      }
    }
  }

  return true;
};

export const saveSrfItems = async (
  currentSRF: WMS.SRFs | undefined,
  srf: WMS.SRFs | undefined,
  updateSrfItemQty: (options: any) => Promise<any>,
  onUpdate: ((updated: WMS.SRFs) => void) | undefined,
  setCurrentSRF: SetCurrentSRF,
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    if (
      !validateBeforeSave(
        currentSRF?.status ?? undefined,
        currentSRF?.items ?? undefined,
      )
    )
      return;

    const { data } = await updateSrfItemQty({
      variables: {
        id: currentSRF?.id ?? srf?.id,
        items: sanitizeStockRequestItems(currentSRF?.items),
      },
    });

    const updated = data?.srfQtyUpdate;

    if (updated) {
      setCurrentSRF(updated);
      onUpdate?.(updated);
    }

    setHasUnsavedChanges(false);
    setIsEditing(false);

    return Notification.success({
      title: "SRF",
      message: "Success: Updated SRF",
    });
  } catch (error) {
    return Notification.error({
      title: "SRF",
      message: "Edit qty failed",
    });
  }
};

type RoleState = {
  isEcomAdmin?: boolean;
  isAdministratorEC?: boolean;
  isDirectRetailAdmin?: boolean;
  isFullAdmin?: boolean;
};

export const accessRole = (role: RoleState) => {
  if (
    role.isEcomAdmin ||
    role.isAdministratorEC ||
    role.isDirectRetailAdmin ||
    role.isFullAdmin
  ) {
    return false;
  }

  return true;
};

export const handleCopyId = async (id: string | undefined) => {
  if (!id) return;

  try {
    await navigator.clipboard?.writeText(id);
    Notification.success({
      title: "SRF",
      message: "ID copied to clipboard",
    });
  } catch (error) {
    return Notification.error({
      title: "SRF",
      message: "Unable to copy ID",
    });
  }
};

export const onScanGTIN = async (
  gtin: string,
  dataSKU: SkuLookupData | undefined,
  currentStatus: WMS.StockRequestStatus | undefined,
  setCurrentSRF: SetCurrentSRF,
  isNewGtin: boolean,
) => {
  const sku = dataSKU?.skus?.items?.find((e: WMS.Sku) => e.gtin === gtin);

  if (!sku) {
    return Notification.error({
      message: "GTIN not found",
    });
  }

  if (sku.type == WMS.SkuType.Devices) {
    return Notification.error({
      title: "Error",
      message: "Error: cannot scan devices using GTIN",
    });
  }

  setCurrentSRF((prev) => {
    if (!prev) return prev;

    const items = [...(prev.items ?? [])];

    console.log(
      "looking for:",
      JSON.stringify(sku.gtin),
      JSON.stringify(sku.sku),
    );
    console.log(
      "existing items:",
      items.map((i) => ({
        gtin: JSON.stringify(i?.gtin),
        sku: JSON.stringify(i?.sku),
      })),
    );

    let existingIndex = -1;
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i]?.gtin === sku.gtin ) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex !== -1) {
      const item = items[existingIndex];

      if (!item) return;

      const scQty = item.sc_qty || 0;
      const whQty = item.wh_qty || 0;

      switch (currentStatus) {
        case WMS.StockRequestStatus.FOR_REVIEW_SC: {
          items[existingIndex] = {
            ...item,
            sc_qty: scQty + 1,
          };
          break;
        }

        case (WMS.StockRequestStatus.AVAILABLE,
        WMS.StockRequestStatus.FOR_REVIEW_WH): {
          if (isNewGtin) {
            const remainingSc = Math.max(scQty - whQty, 0);

            const data: WMS.StockRequestItemInput = {
              batch_id: "",
              description: sku.description,
              gtin: sku.gtin,
              sku: sku.sku,
              req_qty: 0,
              curr_qty: 0,
              sc_qty: remainingSc,
              wh_qty: 0,
              reason: WMS.Reason.NEW_REQUEST,
              serial: [],
              is_new: true,
              inventory_type: sku.type,
            };

            items[existingIndex] = {
              ...item,
              sc_qty: whQty,
            };

            items.splice(existingIndex + 1, 0, data);
          } else {
            if (whQty >= scQty) {
              Notification.error({
                title: "Error",
                message: "Error: WH QTY cap reached",
              });
              break;
            }
            items[existingIndex] = {
              ...item,
              wh_qty: whQty + 1,
            };
          }

          break;
        }

        default:
          break;
      }
    } else {
      if (currentStatus == WMS.StockRequestStatus.FOR_REVIEW_SC) {
        const data: WMS.StockRequestItemInput = {
          batch_id: "",
          description: sku.description,
          gtin: sku.gtin,
          sku: sku.sku,
          req_qty: 0,
          curr_qty: 0,
          sc_qty: 1,
          wh_qty: 0,
          reason: WMS.Reason.NEW_REQUEST,
          serial: [],
          is_new: true,
          inventory_type: sku.type,
        };

        items.push(data);
      } else {
        Notification.error({
          title: "Error",
          message: "Error: Cannot Add new GTIN/SKU in current status",
        });
      }
    }

    return {
      ...prev,
      items,
    };
  });
};

export const serialChecker = async (
  refetchSerial: RefetchSerialFn,
  serial: string,
) => {
  if (serial.length >= 12 && serial.length <= 16) {
    return refetchSerial({
      variables: { serial },
      fetchPolicy: "no-cache",
    }).then((res: any) => {
      return res.data.inventoryItem
        ? {
            gtin: res.data.inventoryItem.gtin,
            serial: res.data.inventoryItem.serial,
            sku: res.data.inventoryItem.sku,
            warehouse_id: res.data.inventoryItem.warehouse_id,
          }
        : undefined;
    });
  }

  return undefined;
};

export const onScanWHReview = async (
  refetchSerial: RefetchSerialFn,
  codentify: CodentifyProps,
  setCurrentSRF: SetCurrentSRF,
) => {
  const { data } = await refetchSerial({
    variables: { serial: codentify.serial },
    fetchPolicy: "no-cache",
  });

  if (!data.inventoryItem)
    return Notification.error({ message: "Invalid serial scanned" });

  if (data.inventoryItem.item_status !== "AVAILABLE") {
    return Notification.error({ message: "Serial is not available" });
  }

  const gtin = data.inventoryItem.gtin;
  const serial = codentify.serial ?? "";

  setCurrentSRF((prev) => {
    if (!prev) return prev;

    const items = [...(prev.items ?? [])];

    const index = items.findIndex((i) => i?.gtin === gtin);
    if (index === -1) {
      Notification.error({
        message: "GTIN not found in SRF",
      });
      return prev;
    }

    const item = items[index];

    const scQty = item?.sc_qty || 0;
    const whQty = item?.wh_qty || 0;

    const existingSerials = item?.serial || [];

    if (existingSerials.includes(serial)) {
      Notification.error({
        message: "Serial already scanned",
      });
      return prev;
    }

    if (whQty >= scQty) {
      Notification.error({
        title: "Error",
        message: "Error: WH QTY cap reached",
      });
      return prev;
    }

    items[index] = {
      ...item,
      serial: [...existingSerials, serial],
      wh_qty: whQty + 1,
    };
    Notification.success({ message: "Scanned Succesfully" });

    return {
      ...prev,
      items,
    };
  });
};

export const onScan = async (
  codentify: string,
  currentStatus: WMS.StockRequestStatus | undefined,
  dataSKU: SkuLookupData | undefined,
  refetchSerial: RefetchSerialFn,
  setCurrentSRF: SetCurrentSRF,
  isNewGtin: boolean,
) => {
  let gtin = codentify;

  if (
    currentStatus == WMS.StockRequestStatus.FOR_REVIEW_WH ||
    currentStatus == WMS.StockRequestStatus.AVAILABLE
  ) {
    const isSerial = await serialChecker(refetchSerial, gtin);

    const isCodentify = isSerial ? isSerial : formatCodentify(gtin);

    if (isSerial) {
      if (isSerial.warehouse_id !== "PH01") {
        return Notification.error({
          title: "Error",
          message: `Error: This Serial ${isSerial.serial} is not from PH01 or Main Warehouse`,
        });
      }
    }

    console.log("serial", isSerial);
    console.log("isCodentify", isCodentify);

    if (isCodentify) {
      onScanWHReview(refetchSerial, isCodentify, setCurrentSRF);
    } else {
      onScanGTIN(gtin, dataSKU, currentStatus, setCurrentSRF, isNewGtin);
    }
    return;
  }

  if (!dataSKU?.skus?.items?.some((e: WMS.Sku) => e.gtin === gtin)) {
    console.log("first check");
    gtin = gtin + "_PMI";
    console.log(gtin);

    if (!dataSKU?.skus?.items?.some((e: WMS.Sku) => e.gtin === gtin)) {
      return Notification.error({
        title: "Error",
        message: "SKU/GTIN not found",
      });
    } else {
      onScanGTIN(gtin, dataSKU, currentStatus, setCurrentSRF, isNewGtin);
    }
  } else {
    onScanGTIN(gtin, dataSKU, currentStatus, setCurrentSRF, isNewGtin);
  }
};
