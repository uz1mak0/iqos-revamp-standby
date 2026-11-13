import { NextRouter } from "next/router";

export const getInventoryBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/inventory/sku") {
    return [
      {
        title: "SKU",
        href: "/inventory/sku",
        visible: true,
      },
    ];
  } else if (router.route === "/inventory/scanner") {
    return [
      {
        title: "Codentify Scanner",
        href: "/inventory/scanner",
        visible: true,
      },
    ];
  } else if (router.route === "/inventory/promos") {
    return [
      {
        title: "Promos",
        href: "/inventory/promos",
        visible: true,
      },
    ];
  } else {
    return [
      {
        title: "Inventory",
        href: "/inventory",
        visible: true,
      },
      {
        title: `${router?.query?.warehouse || ""}`,
        href: `/inventory/warehouse?warehouse=${router.query.warehouse}`,
        visible: router.query.warehouse ? true : false,
      },
      {
        title: `${router?.query?.transactionId || ""}`,
        href: router.asPath,
        visible: router.query.transactionId ? true : false,
      },
    ];
  }
};

export const getSalesRecordBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/record-sales") {
    return [
      {
        title: "Record Sales",
        href: "/record-sales",
        visible: true,
      },
    ];
  } else if (router.route === "/record-sales/sales-logs") {
    return [
      {
        title: "Sales Logs",
        href: "/record-sales/sales-logs",
        visible: true,
      },
    ];
  } else if (router.route === "/record-sales/guided-trial") {
    return [
      {
        title: "Guided Trial",
        href: "/record-sales/guided-trial",
        visible: true,
      },
    ];
  } else {
    return [
      {
        title: "Customer Monitoring",
        href: "/record-sales/customer-monitoring",
        visible: true,
      },
      {
        title: `${router?.query?.customerId || ""}`,
        href: `/record-sales/customer-monitoring/customer/?customerId=${router.query.customerId}`,
        visible: router.query.customerId ? true : false,
      },
    ];
  }
};

export const getOrderMangementBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/order-management/failed") {
    return [
      {
        title: "Failed Orders",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/order-management/pullout-replacement") {
    return [
      {
        title: "Pullout Replacement",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route.includes("/order-management/return")) {
    return [
      {
        title: "Return Mngt",
        href: "/order-management/return",
        visible: true,
      },
      {
        title: `${router.query.returnID || ""}`,
        href: router.asPath,
        visible: router.query.returnID ? true : false,
      },
    ];
  }

  if (router.route.includes("/order-management/return")) {
    return [
      {
        title: "Return Mngt",
        href: "/order-management/return",
        visible: true,
      },
      {
        title: `${router.query.returnID || ""}`,
        href: router.asPath,
        visible: router.query.returnID ? true : false,
      },
    ];
  }

  if (router.route.includes("/order-management/pack")) {
    return [
      {
        title: "Pack Mngt",
        href: "/order-management/pack",
        visible: true,
      },
      {
        title: `${router.query.pack || ""}`,
        href: router.asPath,
        visible: router.query.pack ? true : false,
      },
    ];
  }

  if (router.route.includes("/order-management/verification")) {
    return [
      {
        title: "Verification",
        href: "/order-management/verification",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/order-management/lending-order")) {
    return [
      {
        title: "Lending Order Mngt",
        href: "/order-management/lending-order",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/order-management/lending-return")) {
    return [
      {
        title: "Lending Return Mngt",
        href: "/order-management/lending-order",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/order-management/dispatch")) {
    return [
      {
        title: "Dispatch Mngt",
        href: "/order-management/dispatch",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/order-management/logistics-dispatch")) {
    return [
      {
        title: "Logistics Dispatch",
        href: "/order-management/logistics-dispatch",
        visible: true,
      },
    ];
  }

  return [
    {
      title: "Order Mgnt",
      href: "/order-management",
      visible: true,
    },
    {
      title: `${router.query.orderID || ""}`,
      href: router.asPath,
      visible: router.query.orderID ? true : false,
    },
  ];
};

export const getCRMBreadCrumbs = (router: NextRouter) => {
  if (router.route.includes("/crm/trial-management")) {
    return [
      {
        title: "Trial Mngt",
        href: "/crm/trial-management",
        visible: true,
      },
      {
        title: `${router.query.orderID || ""}`,
        href: router.asPath,
        visible: router.query.orderID ? true : false,
      },
    ];
  }

  if (router.route.includes("/crm/calendar")) {
    return [
      {
        title: "Calendar",
        href: router.route,
        visible: true,
      },
    ];
  }

  if (router.route.includes("/crm/hypercare")) {
    return [
      {
        title: "Hypercare",
        href: "/crm/hypercare",
        visible: true,
      },
      {
        title: `${router.query.orderID || ""}`,
        href: router.asPath,
        visible: router.query.orderID ? true : false,
      },
    ];
  }
  return [];
};

export const getUsersBreadCrumbs = (router: NextRouter) => {
  if (router.route.includes("/users/ecommerce")) {
    return [
      {
        title: "Ecommerce Portal",
        href: "/users/ecommerce",
        visible: true,
      },
    ];
  }
  if (router.route.includes("/users/direct")) {
    return [
      {
        title: "Direct Channel",
        href: "/users/direct",
        visible: true,
      },
    ];
  }
  if (router.route.includes("/users/indirect")) {
    return [
      {
        title: "Indirect Channel",
        href: "/users/indirect",
        visible: true,
      },
    ];
  }
  if (router.route.includes("/users/full-admin")) {
    return [
      {
        title: "Full Admin",
        href: "/users/full-admin",
        visible: true,
      },
    ];
  }
  if (router.route.includes("/users/FomProfile/Profile")) {
    return [
      {
        title: "FOM Profile",
        href: "/users/full-admin",
        visible: true,
      },
    ];
  }
  return [];
};

export const getCoachesBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/coaches") {
    return [
      {
        title: "Coaches",
        href: router.route,
        visible: true,
      },
    ];
  }
  return [];
};

export const get3rdPartyBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/third-party-management/glife") {
    return [
      {
        title: "GLife",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/third-party-management/zyn") {
    return [
      {
        title: "ZYN",
        href: router.route,
        visible: true,
      },
    ];
  }
  return [];
};

export const getReportsBreadCrumbs = (router: NextRouter) => {
  if (router.route == "/reports/download") {
    return [
      {
        title: "Download Report",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/reports/submit") {
    return [
      {
        title: "Submit Report",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/reports/icsubmit") {
    return [
      {
        title: "Submit Report",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/reports/eodFinance") {
    return [
      {
        title: "Submit Finance Report",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/reports/poSubmit") {
    return [
      {
        title: "PMFTC Delivery Report",
        href: router.route,
        visible: true,
      },
    ];
  }
  if (router.route == "/reports/osa") {
    return [
      {
        title: "On Shelf Availability",
        href: router.route,
        visible: true,
      },
    ];
  }
  return [];
};

export const getHRCrumbs = (router: NextRouter) => {
  if (router.route.includes("/human-resource/talents-management")) {
    return [
      {
        title: "Talents Management",
        href: "/human-resource/talents-management",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/human-resource/upload-cv")) {
    return [
      {
        title: "Upload CV",
        href: "/human-resource/upload-cv",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/human-resource/talents-details")) {
    return [
      {
        title: "Talents Details",
        href: "/human-resource/talents-management",
        visible: true,
      },
      {
        title: `${router.query.transactionID || ""}`,
        href: "/human-resource/talents-management",
        visible: true,
      },
    ];
  }

  if (router.route.includes("/human-resource/talent-manager-access")) {
    return [
      {
        title: "Applicant Details",
        href: "/human-resource/talent-manager-access",
        visible: true,
      },
    ];
  }

  return [];
};
