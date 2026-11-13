import { UserRoles } from "../Store/StoreAtom";

// Ecom: Admin, Ecom Admin, PMFTC Administrator
// DC: Admin DC, Admin, PMFTC Administrator
export const hasReconcileAccess = (user: UserRoles) => {
  if (
    user.isEcomAdmin ||
    user.isPMFTCAdmin ||
    user.isAdminDC ||
    user.isAdministratorEC ||
    // old roles
    user.isAdmin ||
    user.isEcomAdmin ||
    user.isPMFTCAdmin ||
    user.isAdminDC
  )
    return true;
  return false;
};

// Ecom: Admin, Ecom Admin, Packer, Dispatch, Rider, PMFTC Administrator
// DC: Admin DC, Admin, ASM, Store Manager/Asst. Store Manager, SE, PMFTC Administrator
export const hasCreateTransactionAccess = (user: UserRoles) => {
  if (
    user.isEcomAdmin ||
    user.isAdminDC ||
    user.isASM ||
    user.isStoreManager ||
    user.isAdministratorEC ||
    user.isSE ||
    user.isStoreAdmin ||
    user.isAdminIC ||
    user.isFOM ||
    user.isFullAdmin ||
    // old roles
    user.isAdmin ||
    user.isPacker ||
    user.isDispatcher ||
    user.isRider
  )
    return true;
  return false;
};

// DC: Admin DC, Admin, ASM, Store Manager/Asst. Store Manager, SE, PMFTC Administrator
export const hasRecordSalesLogsAccess = (user: UserRoles) => {
  if (
    user.isAdminDC ||
    user.isASM ||
    user.isStoreManager ||
    user.isSE ||
    user.isPMFTCAdmin ||
    user.isStoreAdmin ||
    // old roles
    user.isAdmin ||
    user.isPMFTCAdmin
  )
    return true;
  return false;
};

// DC: Admin DC, Admin
export const canUpdateSalesLogs = (user: UserRoles) => {
  if (
    user.isAdminDC ||
    user.isASM ||
    user.isFOM ||
    // old roles
    user.isAdmin
  )
    return true;
  return false;
};

export const hasReportsPermission = (
  type: string,
  user: UserRoles,
  selectedChannel: string | undefined,
) => {
  switch (type) {
    case "INVENTORY_SNAPSHOT":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isEcomAdmin ||
          user.isAdminDC ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isStoreManager ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM"
      );
    case "TRANSACTIONS":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isEcomAdmin ||
          user.isAdminDC ||
          user.isASM ||
          user.isAdminIC ||
          user.isStoreManager ||
          user.isFOM ||
          user.isFullAdmin ||
          user.isSE) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM"
      );

    case "SALES":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isStoreManager ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL"
      );
    case "EOD":
    case "OSA":
    case "PO":
    case "SRF":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isEcomAdmin ||
          user.isAdminDC ||
          user.isStoreManager ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM"
      );
    case "FOM_LOGS":
      return (
        (user.isAdminIC || user.isFullAdmin || user.isFOM) &&
        selectedChannel === "INDIRECT_CHANNEL"
      );
    case "GUIDED_TRIAL":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isAdminDC ||
          user.isStoreManager ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin ||
          // old roles
          user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isExecutive) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_RETAIL"
      );
    case "SALES_ZIP":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isAdminDC ||
          user.isAdminDC ||
          user.isStoreManager ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin ||
          // old roles
          user.isDirectRetailAdmin ||
          user.isExecutive ||
          user.isPMFTCAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_RETAIL"
      );
    case "NEW_ORDER_SUMMARY":
    case "ORDER_SUMMARY":
    case "LENDING_ORDERS":
    case "GLIFE":
      return (
        (user.isAdministratorEC ||
          user.isEcomAdmin ||
          user.isFullAdmin ||
          // old roles
          user.isAdmin ||
          user.isViewOnly) &&
        selectedChannel === "ECOMM"
      );
    // case "CLS":
    //   return user.isCRMAdmin;
    case "HAV":
      return (
        user.isAdministratorEC &&
        !user.isDirectRetailUser &&
        selectedChannel === "ECOMM"
      );
    case "IMS_REPORT":
      return (
        ((user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isEcomAdmin ||
          user.isAdminDC ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isAdminIC ||
          user.isFOM ||
          user.isStoreManager ||
          user.isFullAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM"
      );

    case "HR":
      return (
        (user.isDirectRetailAdmin ||
          user.isPMFTCAdmin ||
          user.isAdminDC ||
          user.isAdminDC ||
          user.isStoreManager ||
          user.isASM ||
          user.isSE ||
          user.isStoreAdmin ||
          user.isAdminIC ||
          user.isFOM ||
          user.isFullAdmin ||
          user.isHR) &&
        selectedChannel === "HR_CHANNEL"
      );
    default:
      return false;
  }
};

export const hasAccessToEditExpiration = (
  user: UserRoles,
  selectedChannel: string | undefined,
) => {
  switch (selectedChannel) {
    case "ECOMM":
      if (user.isEcomAdmin || user.isFullAdmin || user.isAdministratorEC)
        return true;
      break;
    case "DIRECT_RETAIL":
      if (user.isAdminDC || user.isFullAdmin || user.isStoreManager)
        return true;
      break;
    case "INDIRECT_CHANNEL":
      if (user.isAdminIC) return true;
    default:
      return false;
  }
};
