import React, { ReactNode, useEffect, useState } from "react";
import { AppShell } from "@mantine/core";
import { Sider } from "./Sider";
import { HeaderBar } from "./Header";
import { useStyles } from "./AppLayout.styles";
import { useRouter } from "next/router";
// import { useStore } from "../../../Store/Store";
import { Amplify, Auth, Storage } from "../../../Utilities/Backend";
import { Login } from "../../Layouts/Login";
import { useAtom } from "jotai";
import {
  UserRoles,
  channelAtom,
  dceUsersAtom,
  loginAtom,
  rolesAtom,
  userAtom,
} from "../../../Store/StoreAtom";
import { useLazyQuery } from "@apollo/client";
import { getAdminInfo } from "../../../GraphQL/UserSchema";
import { default as Loading } from "./Loading/Loading";
import Head from "next/head";

import { useViewportSize } from "@mantine/hooks";
import BreadCrumbs from "./BreadCrumbs/BreadCrumbs";
import Notification from "../../Elements/Notification/Notification";
import { WMS } from "../../../GraphQL";
import { MobileHeader } from "./Header/MobileHeader";
import { isTabletMobileView } from "../../../Utilities/Formatter";
type Props = {
  children: ReactNode;
};

Amplify.configure({
  Auth: {
    userPoolId: process.env.NEXT_PUBLIC_USERPOOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USERPOOL_WEB_CLIENT,
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITYPOOL_ID,
    region: process.env.NEXT_PUBLIC_REGION,
  },
  Storage: {
    bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
    region: process.env.NEXT_PUBLIC_REGION,
  },
});

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  const noSideBar =
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/delivery-tracking" ||
    router.pathname === "/human-resource/talent-manager-access" ||
    router.pathname.includes("/delivery-tracking/order")
      ? true
      : false;

  const [queryUser, { loading: loadingUser }] = useLazyQuery(getAdminInfo);

  const { classes } = useStyles();
  const pathName = router.pathname;
  const [loading, setLoading] = useState(true);
  const [deliveryTracking, setDeliveryTracking] = useState(false);
  const [roles, setRoles] = useAtom(rolesAtom);
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const [userDetails, setUserDetails] = useAtom(userAtom);
  const [usersDCE, setUsersDCE] = useAtom(dceUsersAtom);
  const [opened, setOpened] = useState(false);
  const { height, width } = useViewportSize();
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);
  const noHeader = router.pathname !== "/" || !selectedChannel ? true : false;

  useEffect(() => {
    if (router.pathname === "/human-resource/talent-manager-access") {
      setLoading(false);
      setIsLogin(true);
      return;
    }

    if (router.pathname.includes("/delivery-tracking")) {
      setDeliveryTracking(true);
      setLoading(false);
      return;
    } else {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          console.log(user);
          const customRoles = user.attributes["custom:roles"]?.split(".") || [];
          const cognitoGroups =
            user?.signInUserSession?.idToken?.payload?.["cognito:groups"] || [];
          const groupRoles = Array.isArray(cognitoGroups)
            ? cognitoGroups
            : [cognitoGroups];
          const roles = Array.from(
            new Set([...(customRoles || []), ...(groupRoles || [])].filter(Boolean)),
          );
          const fullAdminAccess =
            user?.username === "Administrator" ||
            roles.includes("FULL_ADMIN") ||
            user?.attributes["custom:channel"]
              ?.split(".")
              .includes("FULL_ADMIN") ||
            false;
          getUserInfo(user.username);
          const accessRole: any = {
            // Ecom roles
            isAdministratorEC: roles.includes("AdministratorEC"),
            isEcomAdmin: roles.includes("EcomAdmin"),
            isPacker: roles.includes("Packer"),
            isDispatch: roles.includes("Dispatch"),
            isCSC: roles.includes("AdminCSC"), // old roles
            isEcommUser:
              user?.attributes["custom:channel"]
                ?.split(".")
                .includes("ECOMM") ||
              fullAdminAccess ||
              false,

            //DC roles
            isAdminDC: roles?.includes("AdminDC"),
            isASM: roles?.includes("ASM"),
            isStoreManager: roles?.includes("StoreManager"),
            isStoreAdmin: roles?.includes("StoreAdmin"),
            isSE: roles?.includes("SE"),
            isDirectRetailAdmin: fullAdminAccess || roles?.includes("AdminDC"), // old
            isDirectRetailUser:
              user?.attributes["custom:channel"]
                ?.split(".")
                .includes("DIRECT_RETAIL") ||
              fullAdminAccess ||
              false,

            //IC roles
            isAdminIC: roles?.includes("AdminIC"),
            isFOM: roles?.includes("FOM"),
            isIndirectChannelUser:
              user?.attributes["custom:channel"]
                ?.split(".")
                .includes("INDIRECT_CHANNEL") ||
              fullAdminAccess ||
              false,

            // Shared roles
            isPMFTCAdmin: roles?.includes("PMFTCAdministrator"), // old roles

            // Full access
            isWarehouseFullAdmin:
              roles?.includes("WHFullAdmin") ||
              roles?.includes("WarehouseFullAdmin"),
            isSupplyChainFullAdmin:
              roles?.includes("SCFullAdmin") ||
              roles?.includes("SupplyChainFullAdmin"),
            isFullAdmin:
              fullAdminAccess ||
              roles?.includes("WHFullAdmin") ||
              roles?.includes("WarehouseFullAdmin") ||
              roles?.includes("SCFullAdmin") ||
              roles?.includes("SupplyChainFullAdmin"),
                      
            //HR roles
            isHR: roles?.includes("HR"),

            //old roles
            isAdmin:
              roles.some((role: string) => role === "Admin") || fullAdminAccess,
            isViewOnly:
              roles?.includes("AdminViewOnly") || roles?.includes("External"),
            isDispatcher: roles?.includes("Dispatcher"),
            isWarehousePersonnel: roles?.includes("WarehousePersonnel"),
            isExternal: roles?.includes("External"),
            isSalesExpert: roles?.includes("SalesExpert"),
            isEcomCSC: roles?.some((role: WMS.Role) => role === WMS.Role.Csc),
            isSalesExecutive:
              roles?.includes("SalesExecutive") ||
              roles?.includes("SalesExpert"),
            isExecutive: roles?.includes("Executive"),
            isCoach: roles?.includes("Coach"),
            isCRMAdmin: roles?.includes("AdminCRM"),
          };
          setRoles(accessRole);
          setDeliveryTracking(false);
          setIsLogin(true);
          updateBrowserAccess(accessRole);
          setLoading(false);
          getDCEUsers();
        })
        .catch((err) => {
          router.push("/");
          setDeliveryTracking(false);
          setLoading(false);
          setIsLogin(false);
        });
    }
  }, [router.pathname]);

  // Users that have access to the DCE inventory are stored to S3 bucket. Here's the key dce/dce_access.json
  // Update the .json file and add the username of the user on the list to be able to have DCE inventory access.
  // Save the DCE users access list for global state.
  const getDCEUsers = () => {
    Storage.get("dce/dce_access.json")
      .then((data) => {
        fetch(data)
          .then((response) => response.json())
          .then((data) => setUsersDCE(data))
          .catch((error) => console.log(error));
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const resetChannel = () => {
    Notification.info({
      title: "Invalid Access",
      message: "Please select channel first",
    });
    router.replace("/");
    setSelectedChannel(undefined);
    localStorage.removeItem("channel");
  };

  const updateBrowserAccess = (roles: UserRoles) => {
    if (!selectedChannel && router.pathname !== "/") {
      return resetChannel();
    }
    if (!router.pathname.includes("/users") && selectedChannel == "USERS") {
      return resetChannel();
    }
    if (router.pathname.includes("/users") && selectedChannel !== "USERS") {
      return resetChannel();
    }
    if (router.query.warehouse === "PH01" && selectedChannel !== "ECOMM") {
      return resetChannel();
    }

    if (
      router.pathname.includes("/record-sales") &&
      selectedChannel === "ECOMM"
    ) {
      return resetChannel();
    }
    if (
      (router.pathname.includes("/order-management") ||
        router.pathname.includes("/third-party-management") ||
        router.pathname.includes("/coaches") ||
        router.pathname.includes("/power-BI") ||
        router.pathname.includes("/crm")) &&
      selectedChannel !== "ECOMM"
    ) {
      return resetChannel();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getUserInfo = (username: string) => {
    queryUser({
      variables: {
        username: username,
      },
      context: { clientName: "warehouse" },
    })
      .then((res) => {
        if (!userDetails.username) {
          setUserDetails({ ...res.data.admin, username: username });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onLogout = () => {
    Auth.signOut();
    setIsLogin(false);
  };

  const getBrowserTitle = () => {
    if (router.pathname.includes("/inventory")) return "Inventory";
    if (router.pathname.includes("/order-management")) return "Order Mngt";
    if (router.pathname.includes("/users")) return "Users";
    if (router.pathname.includes("/record-sales")) return "Record Sales";
    if (router.pathname.includes("/coaches")) return "Coaches";
    if (router.pathname.includes("/finance")) return "Finance";
    if (router.pathname.includes("/reports")) return "Reports";
    if (router.pathname.includes("/third-party-management"))
      return "3rd Party Mngt";
    if (router.pathname.includes("/power-BI")) return "Power BI";
    if (router.pathname.includes("/crm")) return "CLS";
    return "Home";
  };

  if (loading) return <Loading />;
  if (!isLogin && !deliveryTracking) return <Login />;
  return (
    <AppShell
      padding={!selectedChannel ? 0 : "md"}
      style={{ position: "relative" }}
      navbarOffsetBreakpoint="md"
      navbar={
        noSideBar ? undefined : (
          <Sider onClose={() => setOpened(false)} opened={opened} />
        )
      }
      header={
        noHeader ? undefined : (
          <HeaderBar
            onClickBurger={() => setOpened(!opened)}
            opened={opened}
            onLogout={() => onLogout()}
          />
        )
      }
    >
      <Head>
        <title>IQOS | {getBrowserTitle()}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={noHeader ? "" : classes.content}>
        {!noSideBar ? <BreadCrumbs router={router} /> : undefined}
        {children}
      </div>
    </AppShell>
  );
};

export { AppLayout };
