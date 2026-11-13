import {
  BuildingWarehouse,
  ChartBar,
  Disabled,
  Map2,
  Package,
  ReportAnalytics,
  Smoking,
  TruckDelivery,
  Users,
} from "tabler-icons-react";
import { UserRoles } from "../../../Store/StoreAtom";
import {
  IconPackages,
  IconReport,
  IconUsersGroup,
  IconMoneybag,
  IconBuildingWarehouse,
  IconUsers,
} from "@tabler/icons-react";

const getOrderPath = (userRoles: UserRoles) => {
  if (
    userRoles.isAdministratorEC ||
    userRoles.isEcomAdmin ||
    userRoles.isEcommUser ||
    userRoles.isPMFTCAdmin
  )
    return "/order-management";
  if (userRoles.isPacker) return "/order-management/pack";
  if (userRoles.isDispatch) return "/order-management/dispatch";
  // if (userRoles.isEcomCSC) return "/order-management";
  // old roles
  if (userRoles.isAdmin) return "/order-management";
  if (userRoles.isDispatcher) return "/order-management/dispatch";
  if (userRoles.isWarehousePersonnel) return "/order-management";
  if (userRoles.isExternal) return "/order-management";
  if (userRoles.isViewOnly) return "/order-management";

  return "/";
};

const getRecordSalesPath = (userRoles: UserRoles) => {
  if (userRoles.isAdminDC || userRoles.isAdminIC) return "/record-sales/";
  // old roles
  if (userRoles.isDirectRetailAdmin) return "/record-sales";
  if (userRoles.isCoach) return "/record-sales";
  return "/record-sales/sales-logs";
};

export const links = (userRoles: UserRoles) => [
  {
    avatar: (
      <IconBuildingWarehouse
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#FB8C24",
    title: "Inventory",
    path: "/inventory",
    access:
      userRoles.isFullAdmin ||
      userRoles.isEcomAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isPMFTCAdmin ||
      userRoles.isCSC ||
      userRoles.isAdministratorEC ||
      userRoles.isEcommUser ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isRider ||
      userRoles.isCSC,
  },
  {
    avatar: (
      <Package className="icon" color="#fff" size={40} strokeWidth={1.5} />
    ),
    color: "#55C45C",
    title: "Order Management",
    path: getOrderPath(userRoles),
    access:
      userRoles.isFullAdmin ||
      userRoles.isEcomAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isPMFTCAdmin ||
      userRoles.isAdministratorEC ||
      //old roles
      userRoles.isAdmin ||
      userRoles.isRider,
  },

  {
    avatar: (
      <IconUsersGroup
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#9830B0",
    title: "Coaches",
    path: "/coaches",
    access:
      userRoles.isFullAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isPMFTCAdmin,
  },
  {
    avatar: (
      <ReportAnalytics
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#264265",
    title: "Reports",
    path: "/reports/download",
    access:
      userRoles.isFullAdmin ||
      userRoles.isDirectRetailAdmin ||
      userRoles.isEcomAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isPMFTCAdmin,
  },
  {
    avatar: (
      <IconReport className="icon" color="#fff" size={40} strokeWidth={1.5} />
    ),
    color: "#F8D127",
    title: "Power BI",
    path: "/power-BI",
    access:
      userRoles.isFullAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isPMFTCAdmin ||
      // old roles
      userRoles.isFullAdmin ||
      userRoles.isAdmin ||
      userRoles.isViewOnly,
  },
  {
    avatar: (
      <IconPackages className="icon" color="#fff" size={40} strokeWidth={1.5} />
    ),
    color: "#D6AE71",
    title: "3rd Party Order Management",
    path: "/third-party-management/glife",
    access:
      userRoles.isFullAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isPMFTCAdmin ||
      // old roles
      userRoles.isFullAdmin ||
      userRoles.isAdmin ||
      userRoles.isViewOnly,
  },
];

export const DRLinks = (userRoles: UserRoles) => [
  {
    avatar: (
      <BuildingWarehouse
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#fc9811",
    title: "Inventory",
    path: "/inventory",
    access:
      userRoles.isFullAdmin ||
      userRoles.isAdminDC ||
      userRoles.isASM ||
      userRoles.isStoreManager ||
      userRoles.isSE ||
      userRoles.isPMFTCAdmin ||
      userRoles.isStoreAdmin ||
      userRoles.isAdminIC ||
      userRoles.isFOM ||
      userRoles.isEcomAdmin ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isPMFTCAdmin,
  },
  {
    avatar: (
      <Package className="icon" color="#fff" size={40} strokeWidth={1.5} />
    ),
    color: "#9830b0",
    title: "Record Sales",
    path: getRecordSalesPath(userRoles),
    access:
      userRoles.isFullAdmin ||
      userRoles.isAdminDC ||
      userRoles.isASM ||
      userRoles.isSE ||
      userRoles.isStoreManager ||
      userRoles.isPMFTCAdmin ||
      userRoles.isStoreAdmin ||
      userRoles.isAdminIC ||
      userRoles.isFOM ||
      userRoles.isEcomAdmin ||
      userRoles.isEcommUser ||
      // old roles
      userRoles.isAdmin,
  },
  {
    avatar: (
      <ReportAnalytics
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#fc9811",
    title: "Reports",
    path: "/reports/download",
    access:
      userRoles.isFullAdmin ||
      userRoles.isDirectRetailAdmin ||
      userRoles.isPMFTCAdmin ||
      userRoles.isAdminDC ||
      userRoles.isASM ||
      userRoles.isSE ||
      userRoles.isStoreAdmin ||
      userRoles.isStoreManager ||
      userRoles.isAdminIC ||
      userRoles.isFOM ||
      userRoles.isEcomAdmin ||
      userRoles.isEcommUser
  },
];

export const HRLink = (userRoles: UserRoles) => [
  {
    avatar: (
      <BuildingWarehouse
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#fc9811",
    title: "Talent Management",
    path: "/human-resource/talents-management/",
    access: userRoles.isFullAdmin || userRoles.isHR,
  },
  {
    avatar: (
      <ReportAnalytics
        className="icon"
        color="#fff"
        size={40}
        strokeWidth={1.5}
      />
    ),
    color: "#000080",
    title: "Reports",
    path: "/reports/download",
    access: userRoles.isFullAdmin || userRoles.isHR,
  },
];
