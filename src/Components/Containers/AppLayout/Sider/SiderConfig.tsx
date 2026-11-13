import React from "react";
import {
  Box,
  Home,
  ReportSearch,
  Users,
  HeartRateMonitor,
  BuildingWarehouse,
  BuildingStore,
  Compass,
} from "tabler-icons-react";
import { UserRoles, userAtom } from "../../../../Store/StoreAtom";
import {
  IconBuildingWarehouse,
  IconCalendar,
  IconCheckupList,
  IconListCheck,
  IconListDetails,
  IconMailCheck,
  IconNotification,
  IconScan,
  IconUpload,
  IconUserCog,
  IconUsers,
  IconMailAi,
  IconLibraryPlus,
  IconReceipt,
  IconWand,
  IconShoppingCartCopy,
  IconMoneybag,
} from "@tabler/icons-react";
import { Admin } from "../../../../GraphQL/_gql/wms/graphql";

export const getInventoryModuleSider = (
  userRoles: UserRoles,
  selectedChannel: string | undefined,
  user?: Admin,
) => [
    {
      icon: <Home size={30} strokeWidth={2} className="icon" />,
      title: "Home",
      route: "/",
      access: true,
    },
    {
      icon: <IconBuildingWarehouse size={30} strokeWidth={2} className="icon" />,
      title: "Inventory",
      route: "/inventory",
      isMainRoute: true,
      access: true,
    },
    {
      icon: <IconListDetails size={30} strokeWidth={2} className="icon" />,
      title: "SKU",
      route: "/inventory/sku",
      id: "sku",
      isMainRoute: false,
      access: true,
    },
    {
      icon: <IconScan size={30} strokeWidth={2} className="icon" />,
      title: "Codentify Scanner",
      route: "/inventory/scanner",
      id: "scanner",
      isMainRoute: false,
      access: true,
    },
    {
      icon: <Box size={30} strokeWidth={2} className="icon" />,
      title: "Promos",
      route: "/inventory/promos",
      id: "promos",
      isMainRoute: false,
      access:
        selectedChannel === "DIRECT_RETAIL" ||
        selectedChannel === "INDIRECT_CHANNEL",
    },
    {
      icon: <IconNotification size={30} strokeWidth={2} className="icon" />,
      title: "Low Stock Notification",
      route: "/inventory/low-stocks",
      id: "low-stocks",
      isMainRoute: false,
      access: user?.username === "Administrator",
    },
    {
      icon: <IconListCheck size={30} strokeWidth={2} className="icon" />,
      title: "DCE Inventory",
      route: "/inventory/dce",
      id: "dce",
      isMainRoute: false,
      access: selectedChannel === "ECOMM",
    },
  ];

export const getOrderManagementModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    heading: "ECOMMERCE",
    access:
      userRoles.isEcomAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isPMFTCAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      userRoles.isCSC,
    sublist: [
      {
        title: "Order Mngt",
        route: "/order-management",
        isMainRoute: true,
        access:
          userRoles.isEcomAdmin ||
          userRoles.isPacker ||
          userRoles.isDispatch ||
          userRoles.isPMFTCAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isAdministratorEC,
      },
      {
        title: "Verification",
        route: "/order-management/verification",
        isMainRoute: false,
        access:
          userRoles.isEcomAdmin ||
          userRoles.isPMFTCAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isAdministratorEC,
      },
      {
        title: "Fraud Check",
        route: "/order-management/fraud-check",
        isNew: false,
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isFullAdmin ||
          userRoles.isEcomAdmin,
      },
      {
        title: "Return Mngt",
        route: "/order-management/return",
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
      {
        title: "Pullout Replacement",
        route: "/order-management/pullout-replacement",
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
    ],
  },
  {
    heading: "DISPATCHING",
    access:
      userRoles.isEcomAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isPMFTCAdmin ||
      userRoles.isAdministratorEC ||
      userRoles.isFullAdmin ||
      userRoles.isEcomAdmin,
    sublist: [
      {
        title: "Pack Mngt",
        route: "/order-management/pack",
        isMainRoute: false,
        access:
          userRoles.isEcomAdmin ||
          userRoles.isPacker ||
          userRoles.isPMFTCAdmin || // old roles
          userRoles.isAdministratorEC ||
          userRoles.isFullAdmin ||
          userRoles.isEcomAdmin,
      },
      {
        title: "Dispatch Mngt",
        route: "/order-management/dispatch",
        isMainRoute: false,
        access:
          userRoles.isEcomAdmin ||
          userRoles.isDispatch ||
          userRoles.isPMFTCAdmin || // old roles
          userRoles.isAdministratorEC ||
          userRoles.isFullAdmin ||
          userRoles.isEcomAdmin,
      },
      {
        title: "Logistics Dispatch",
        route: "/order-management/logistics-dispatch",
        isMainRoute: false,
        access:
          userRoles.isEcomAdmin ||
          userRoles.isDispatch ||
          userRoles.isPMFTCAdmin ||
          userRoles.isAdministratorEC ||
          userRoles.isFullAdmin ||
          userRoles.isEcomAdmin,
      },
    ],
  },
  {
    heading: "LENDING",
    access:
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isAdministratorEC ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      userRoles.isPMFTCAdmin,

    sublist: [
      {
        title: "Order Mngt",
        route: "/order-management/lending-order",
        isMainRoute: false,
        access:
          userRoles.isPacker ||
          userRoles.isDispatch ||
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
      {
        title: "Lending Return",
        route: "/order-management/lending-return",
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
    ],
  },
  {
    heading: "SYSTEM LOGS",
    access:
      userRoles.isEcomAdmin || userRoles.isFullAdmin || userRoles.isPMFTCAdmin,
    sublist: [
      {
        title: "Failed Orders",
        route: "/order-management/failed",
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
      {
        title: "PII Redaction",
        route: "/order-management/pii-redaction",
        isMainRoute: false,
        isNew: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
    ],
  },
  {
    heading: "SMS SETTINGS",
    access:
      userRoles.isAdministratorEC ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      userRoles.isPMFTCAdmin,
    sublist: [
      {
        title: "Marketplace",
        route: "/order-management/sms-marketplace",
        isMainRoute: false,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
      {
        title: "Ecommerce",
        route: "/order-management/sms-ecommerce",
        isMainRoute: false,
        isNew: true,
        access:
          userRoles.isAdministratorEC ||
          userRoles.isEcomAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isPMFTCAdmin,
      },
    ],
  },
];

export const getUsersModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <BuildingWarehouse size={30} strokeWidth={2} className="icon" />,
    title: "E-commerce Portal",
    route: "/users/ecommerce",
    isMainRoute: false,
    access:
      userRoles.isAdministratorEC || userRoles.isFullAdmin || userRoles.isHR,
  },
  {
    icon: <BuildingStore size={30} strokeWidth={2} className="icon" />,
    title: "Direct Channel",
    route: "/users/direct",
    isMainRoute: false,
    access:
      userRoles.isDirectRetailAdmin || userRoles.isFullAdmin || userRoles.isHR,
  },
  {
    icon: <BuildingStore size={30} strokeWidth={2} className="icon" />,
    title: "Indirect Channel",
    route: "/users/indirect",
    isMainRoute: false,
    access:
      userRoles.isAdminIC ||
      userRoles.isFullAdmin ||
      userRoles.isFOM ||
      userRoles.isHR,
  },

  {
    icon: <BuildingStore size={30} strokeWidth={2} className="icon" />,
    title: "HR Channel",
    route: "/users/hr",
    isMainRoute: false,
    access: userRoles.isHR || userRoles.isFullAdmin,
  },

  // {
  //   icon: <BuildingStore size={30} strokeWidth={2} className="icon" />,
  //   title: "Human Resource",
  //   route: "/users/indirect",
  //   isMainRoute: false,
  //   access: userRoles.isAdminIC || userRoles.isFullAdmin || userRoles.isFOM,
  // },
  {
    icon: <IconUserCog size={30} strokeWidth={2} className="icon" />,
    title: "Full Admin",
    route: "/users/full-admins",
    isMainRoute: false,
    access: userRoles.isFullAdmin || userRoles.isHR,
  },
];

export const getDRUsersModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <Users size={30} strokeWidth={2} className="icon" />,
    title: "Admins",
    route: "/users/admins",
    isMainRoute: false,
    access: true,
  },
  {
    icon: <Users size={30} strokeWidth={2} className="icon" />,
    title: "Sales Expert",
    route: "/users/sales-expert",
    isMainRoute: false,
    access: true,
  },
];

export const getDRRecordSalesModuleSider = (
  userRoles: UserRoles,
  selectedChannel: string | undefined,
) => [
    {
      icon: <Home size={30} strokeWidth={2} className="icon" />,
      title: "Home",
      route: "/",
      access: true,
    },
    {
      icon: <BuildingWarehouse size={30} strokeWidth={2} className="icon" />,
      title: "Record Sale",
      route: "/record-sales",
      isMainRoute: false,
      access:
        userRoles.isDirectRetailAdmin ||
        userRoles.isAdminIC ||
        userRoles.isFOM ||
        userRoles.isSE ||
        userRoles.isStoreManager,
    },
    {
      icon: <BuildingStore size={30} strokeWidth={2} className="icon" />,
      title: "Sales logs",
      route: "/record-sales/sales-logs",
      isMainRoute: false,
      access: true,
    },
    {
      icon: <IconWand size={30} strokeWidth={2} className="icon" />,
      title: "Lending Mngmt",
      route: "/record-sales/lending-management",
      isMainRoute: false,
      access: selectedChannel !== "INDIRECT_CHANNEL",
    },
    {
      icon: <HeartRateMonitor size={30} strokeWidth={2} className="icon" />,
      title: "Customer Monitoring",
      route: "/record-sales/customer-monitoring",
      isMainRoute: false,
      access:
        selectedChannel !== "INDIRECT_CHANNEL" && userRoles.isDirectRetailAdmin,
    },
    {
      icon: <Compass size={30} strokeWidth={2} className="icon" />,
      title: "Guided Trial",
      route: "/record-sales/guided-trial",
      isMainRoute: false,
      access:
        selectedChannel !== "INDIRECT_CHANNEL" &&
        (userRoles.isDirectRetailAdmin || userRoles.isFOM),
    },
  ];

export const getCoachesModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <Users size={30} strokeWidth={2} className="icon" />,
    title: "Coaches",
    route: "/coaches",
    isMainRoute: true,
    access: true,
  },
];

export const getFinanceModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
    title: "Audit",
    route: "/finance/audit",
    access: true,
  },
  {
    icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
    title: "Dispatcher's Wallet",
    route: "/finance/dispatchers",
    access: true,
  },
  {
    icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
    title: "Rider's Wallet",
    route: "/finance/riders",
    access: true,
  },
];

export const getReportsModuleSider = (
  userRoles: UserRoles,
  selectedChannel: string | undefined,
) => [
    {
      icon: <Home size={30} strokeWidth={2} className="icon" />,
      title: "Home",
      route: "/",
      access: true,
    },
    {
      icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
      title: "Download",
      route: "/reports/download",
      isMainRoute: false,
      access:
        userRoles.isPMFTCAdmin ||
        userRoles.isDirectRetailAdmin ||
        userRoles.isEcomAdmin ||
        userRoles.isAdminDC ||
        userRoles.isASM ||
        userRoles.isSE ||
        userRoles.isStoreManager ||
        userRoles.isStoreAdmin ||
        userRoles.isFullAdmin ||
        userRoles.isAdminIC ||
        userRoles.isFOM ||
        userRoles.isHR,
    },
    {
      icon: <IconUpload size={30} strokeWidth={2} className="icon" />,
      title: "Upload CEGID",
      route: "/reports/eod",
      isMainRoute: false,
      access:
        (userRoles.isDirectRetailAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isFullAdmin) &&
        selectedChannel === "DIRECT_RETAIL",
    },
    {
      icon: <IconMailCheck size={30} strokeWidth={2} className="icon" />,
      title: "Submit EOD Report",
      route: "/reports/submit",
      isMainRoute: false,
      access:
        (userRoles.isDirectRetailAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isFullAdmin) &&
        selectedChannel === "DIRECT_RETAIL",
    },

    {
      icon: <IconMailCheck size={30} strokeWidth={2} className="icon" />,
      title: "Submit EOD Report",
      route: "/reports/icSubmit",
      isMainRoute: false,
      access:
        (userRoles.isDirectRetailAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isFullAdmin) &&
        selectedChannel === "INDIRECT_CHANNEL",
    },
    {
      icon: <IconMoneybag size={30} strokeWidth={2} className="icon" />,
      title: "Submit EOD Finance Report",
      route: "/reports/eodFinance",
      isMainRoute: false,
      access:
        ((userRoles.isDirectRetailAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreAdmin ||
          userRoles.isFullAdmin ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isFullAdmin) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL",
    },
    {
      icon: <IconReceipt size={30} strokeWidth={2} className="icon" />,
      title: "PMFTC Delivery Report",
      route: "/reports/poSubmit",
      isMainRoute: false,
      access:
        ((userRoles.isFullAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isStoreAdmin ||
          userRoles.isAdminIC ||
          userRoles.isFullAdmin ||
          userRoles.isFOM) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM",
    },
    {
      icon: <IconShoppingCartCopy size={30} strokeWidth={2} className="icon" />,
      title: "OSA Form",
      route: "/reports/osa",
      isMainRoute: false,
      access:
        ((userRoles.isFullAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isStoreAdmin ||
          userRoles.isAdminIC ||
          userRoles.isFullAdmin ||
          userRoles.isFOM) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM",
    },
    {
      icon: <IconReceipt size={30} strokeWidth={2} className="icon" />,
      title: "Stock Request Form",
      route: "/reports/srf",
      isMainRoute: false,
      access:
        ((userRoles.isFullAdmin ||
          userRoles.isAdminDC ||
          userRoles.isASM ||
          userRoles.isStoreManager ||
          userRoles.isSE ||
          userRoles.isStoreAdmin ||
          userRoles.isAdminIC ||
          userRoles.isFOM) &&
          selectedChannel === "DIRECT_RETAIL") ||
        selectedChannel === "INDIRECT_CHANNEL" ||
        selectedChannel === "ECOMM",
    },
  ];

export const getThirdPartyManagementModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
    title: "GLife",
    route: "/third-party-management/glife",
    isMainRoute: false,
    access: userRoles.isFullAdmin,
  },
  {
    icon: <ReportSearch size={30} strokeWidth={2} className="icon" />,
    title: "ZYN",
    route: "/third-party-management/zyn",
    isMainRoute: false,
    access: true,
  },
];

export const getCRMModuleSider = (userRoles: UserRoles) => [
  {
    icon: <Home size={30} strokeWidth={2} className="icon" />,
    title: "Home",
    route: "/",
    access: true,
  },
  {
    icon: <IconUsers size={30} strokeWidth={2} className="icon" />,
    title: "Trial Management",
    route: "/crm/trial-management",
    isMainRoute: false,
    access: true,
  },
  {
    icon: <IconCalendar size={30} strokeWidth={2} className="icon" />,
    title: "Calendar",
    route: "/crm/calendar",
    isMainRoute: false,
    access: true,
  },
  {
    icon: <IconCheckupList size={30} strokeWidth={2} className="icon" />,
    title: "Hypercare",
    route: "/crm/hypercare",
    isMainRoute: false,
    access: true,
  },
];

export const getHRModuleSider = (userRoles: UserRoles) => {
  // const talentManagementApprovedEmails = [
  //   'rowena.munoz@activasia.com',
  //   'emily.tesoro@activasia.com',
  //   'mirlo.sustiguer@activasia.com',
  //   'rodelyn.gutierrez@activasiarbu.com',
  //   'annamorena.azana@activasia.com',
  //   'norjane.Cagalitan@activasia.com',
  // ];

  return [
    // {
    //   icon: <Home size={30} strokeWidth={2} className="icon" />,
    //   title: "Home",
    //   route: "/",
    //   access: true,
    // },
    {
      icon: <IconLibraryPlus size={30} strokeWidth={2} className="icon" />,
      title: "Applicant Mngt",
      route: "/human-resource/talents-management/",
      isMainRoute: false,
      access: userRoles.isFullAdmin || userRoles.isHR,
    },
    {
      icon: <IconMailAi size={30} strokeWidth={2} className="icon" />,
      title: "Upload CV",
      route: "/human-resource/upload-cv",
      isMainRoute: false,
      access: userRoles.isFullAdmin || userRoles.isHR,
    },
    //   {
    //   icon: <IconUserCog size={30} strokeWidth={2} className="icon" />,
    //   title: "Settings",
    //   route: "/",
    //   isMainRoute: false,
    //   access: userRoles.isFullAdmin,
    // },
  ];
};
