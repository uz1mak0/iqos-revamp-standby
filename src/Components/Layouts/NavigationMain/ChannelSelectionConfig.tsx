import DirectChannelLogo from "../../../../assets/channel/direct-logo.png";
import UsersChannelLogo from "../../../../assets/channel/users-logo.png";
import EcommChannelLogo from "../../../../assets/channel/ecom-logo.png";
import WarehouseChannelLogo from "../../../../assets/channel/warehouse-logo.png";
import { UserRoles } from "../../../Store/StoreAtom";


export type ChannelDetail = {
  id: string;
  title: string;
  description: string;
  icon: string;
  hasAccess: (roles: UserRoles, user?: any) => boolean;

};

export const ChannelsDetails: ChannelDetail[] = [
  {
    id: "MAIN_WAREHOUSE",
    title: "Main Warehouse Inventory (PH01)",
    description: "Efficiently track and manage stock in your central warehouse",
    icon: WarehouseChannelLogo,
    hasAccess: (roles, user) => {

      const isKitchenCityUser =
        user?.office_id === "PH1204" ||
        user?.office_ids?.includes("PH1204") ||
        user?.office_name?.toLowerCase().includes("kitchen city");

      if (isKitchenCityUser) {
        return false;
      }

      return roles.isFullAdmin;
    },
  },
  {
    id: "ECOMM",
    title: "E-Commerce Portal",
    description:
      "WMS for eCommerce, optimizing inventory and order fulfillment",
    icon: EcommChannelLogo,
    hasAccess: (roles) =>
      roles.isFullAdmin ||
      roles.isAdministratorEC ||
      roles.isEcomAdmin ||
      roles.isPacker ||
      roles.isDispatch ||
      (roles.isEcommUser && roles.isPMFTCAdmin),
  },
  {
    id: "DIRECT_RETAIL",
    title: "Direct Retail Channel",
    description: "WMS for direct sales, streamlining inventory and orders",
    icon: DirectChannelLogo,
    hasAccess: (roles, user) => {
      const isKitchenCity =
        user?.office_name?.toLowerCase().includes("kitchen city") ||
        user?.office_id === "PH1204" ||
        user?.office_ids?.includes("PH1204");
      if (isKitchenCity && !roles.isFullAdmin) return false;

      return (
        roles.isFullAdmin ||
        roles.isASM ||
        roles.isStoreManager ||
        (roles.isDirectRetailUser && roles.isPMFTCAdmin) ||
        (roles.isDirectRetailUser && roles.isSE) ||
        (roles.isDirectRetailUser && roles.isAdminDC) ||
        roles.isStoreAdmin ||
        roles.isAdminDC
      );
    },
  },
  {
    id: "INDIRECT_CHANNEL",
    title: "Indirect Channel",
    description: "WMS for indirect sales, streamlining inventory and orders",
    icon: DirectChannelLogo,
    hasAccess: (roles, user) => {
      const isKitchenCity =
        user?.office_name?.toLowerCase().includes("kitchen city") ||
        user?.office_id === "PH1204" ||
        user?.office_ids?.includes("PH1204");

      return (
        roles.isFullAdmin ||
        roles.isAdminIC ||
        roles.isFOM ||
        (roles.isIndirectChannelUser && roles.isSE) ||
        (roles.isIndirectChannelUser && roles.isPMFTCAdmin) ||
        (roles.isDirectRetailUser && Boolean(isKitchenCity))
      );
    },
  },
  {
    id: "HR_CHANNEL",
    title: "Human Resource",
    description: "Manage applicants and automated screening process",
    icon: UsersChannelLogo,
    hasAccess: (roles) => roles.isFullAdmin || (roles.isHR ?? false),
  },
  {
    id: "USERS",
    title: "Users Management",
    description:
      "Feature to manage user accounts, roles and access permissions",
    icon: UsersChannelLogo,
    hasAccess: (roles) =>
      roles.isFullAdmin ||
      roles.isDirectRetailAdmin ||
      roles.isAdministratorEC ||
      roles.isAdminDC ||
      roles.isFOM ||
      roles.isHR ||
      roles.isAdminIC,
  },
];
