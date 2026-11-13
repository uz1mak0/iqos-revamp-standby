import { atom } from "jotai";
import { WMS } from "../GraphQL";
export type UserRoles = {
  // Ecom roles
  isAdministratorEC: boolean;
  isEcomAdmin: boolean;
  isPacker: boolean;
  isDispatch: boolean;
  isCSC: boolean;
  isEcommUser: boolean;

  // DC (Direct Retail) roles
  isAdminDC: boolean;
  isASM: boolean;
  isStoreManager: boolean;
  isStoreAdmin: boolean;
  isDirectRetailAdmin?: boolean;
  isDirectRetailUser: boolean;

  //IC roles
  isAdminIC: boolean;
  isFOM: boolean;
  isIndirectChannelUser: boolean;

  //IC and DC shared roles
  isSE: boolean;

  // Shared roles
  isPMFTCAdmin: boolean; // old roles

  // Full access
  isFullAdmin: boolean;
  isWarehouseFullAdmin?: boolean;
  isSupplyChainFullAdmin?: boolean;

  // HR Access
  isHR?: boolean;

  // old roles
  isAdmin: boolean;
  isRider: boolean;
  isEcomDC: boolean;
  isViewOnly?: boolean;
  isDispatcher?: boolean;
  isWarehousePersonnel?: boolean;
  isExternal?: boolean;
  isSalesExpert?: boolean;
  isSalesExecutive?: boolean;
  isExecutive?: boolean;
  isCoach?: boolean;
  isCRMAdmin?: boolean;
  isEcomCSC?: boolean;
};

export const rolesAtom = atom<UserRoles>({
  // Ecom roles
  isAdministratorEC: false,
  isEcomAdmin: false,
  isPacker: false,
  isDispatch: false,
  isCSC: false,
  isEcommUser: false,

  // DC (Direct Retail) roles
  isAdminDC: false,
  isASM: false,
  isStoreManager: false,
  isStoreAdmin: false,
  isDirectRetailAdmin: false,
  isDirectRetailUser: false,

  // IC roles
  isAdminIC: false,
  isFOM: false,
  isIndirectChannelUser: false,

  //IC and DC shared roles
  isSE: false,

  // Shared roles
  isPMFTCAdmin: false,

  // Full admin
  isFullAdmin: false,
  isWarehouseFullAdmin: false,
  isSupplyChainFullAdmin: false,

  //  Talent Management Access
  isHR: false,

  // old roles

  isAdmin: false,
  isRider: false,
  isEcomDC: false,
  isViewOnly: false,
  isDispatcher: false,
  isWarehousePersonnel: false,
  isExternal: false,
  isSalesExpert: false,
  isSalesExecutive: false,
  isExecutive: false,
  isCoach: false,
  isCRMAdmin: false,
  isEcomCSC: false,
});

export const userAtom = atom<WMS.Admin>({});

export const loginAtom = atom<boolean>(false);
export const burgernAtom = atom<boolean>(false);
export const dceUsersAtom = atom<string[] | undefined>(undefined);
const channel =
  typeof window !== "undefined" ? localStorage.getItem("channel") : undefined;
export const channelAtom = atom<string | undefined>(channel || undefined);
