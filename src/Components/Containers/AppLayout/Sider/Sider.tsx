import React from "react";
import {
  Navbar,
  Header,
  Aside,
  Footer,
  Image,
  Transition,
  Center,
} from "@mantine/core";
import { useStyles } from "./Sider.styles";
import { NavList } from "../../../Elements/NavList";
import { Home } from "tabler-icons-react";
import Logo from "../../../../../assets/LOGO_SIMPLE.png";
import { useRouter } from "next/router";
import {
  getCoachesModuleSider,
  getCRMModuleSider,
  getDRRecordSalesModuleSider,
  getDRUsersModuleSider,
  getFinanceModuleSider,
  getInventoryModuleSider,
  getOrderManagementModuleSider,
  getReportsModuleSider,
  getThirdPartyManagementModuleSider,
  getUsersModuleSider,
  getHRModuleSider,
} from "./SiderConfig";

import { useAtom } from "jotai";
import {
  burgernAtom,
  dceUsersAtom,
  channelAtom,
  rolesAtom,
  userAtom,
} from "../../../../Store/StoreAtom";
import { useViewportSize } from "@mantine/hooks";
import { Button, Grid, Stack } from "../../../Elements";
import { SiderMenu } from "../SiderMenu/SiderMenu";
import { isTabletMobileView } from "../../../../Utilities/Formatter";
import { Changelogs } from "../../../Layouts/Changelogs/Changelogs";

type Props = {
  opened?: boolean;
  onClose: () => void;
};

type SubListProps = {
  title: string;
  route: string;
  isMainRoute?: boolean;
  access?: boolean;
};

type SiderProps = {
  icon?: React.ReactNode;
  title?: string;
  route?: string;
  id?: string;
  isMainRoute?: boolean;
  access?: boolean;
  heading?: string;
  sublist?: SubListProps[];
};

export const Sider = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const [usersDCE] = useAtom(dceUsersAtom);
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const router = useRouter();
  const [opened, setOpened] = useAtom(burgernAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);
  const list = [
    {
      icon: <Home size={30} strokeWidth={1} className="icon" />,
      title: "Home",
      route: "/",
    },
  ];

  const filterRoles = (list: SiderProps[]) => {
    return list.filter((e) => e.access);
  };

  const onLogoClick = () => {
    router.push("/");
    setSelectedChannel(undefined);
  };

  console.log(usersDCE);
  const getListByRouter = () => {
    if (router.pathname.includes("/inventory"))
      return selectedChannel === "DIRECT_RETAIL" || selectedChannel === "INDIRECT_CHANNEL"
        ? filterRoles(
            getInventoryModuleSider(userRoles, selectedChannel, user).filter(
              (e) => !e.title.includes("DCE")
            )
          )
        : filterRoles(
            getInventoryModuleSider(userRoles, selectedChannel, user)
              .filter((e) => e.title !== "Promos")
              .filter((e) =>
                usersDCE?.some(
                  (admin) =>
                    user.username === admin && selectedChannel === "ECOMM"
                )
                  ? e
                  : !e.title.includes("DCE")
              )
          );
          
    if (router.pathname.includes("/order-management"))
      return filterRoles(getOrderManagementModuleSider(userRoles));
    if (router.pathname.includes("/users"))
      return filterRoles(getUsersModuleSider(userRoles));
    if (router.pathname.includes("/record-sales"))
      return filterRoles(getDRRecordSalesModuleSider(userRoles, selectedChannel));
    if (router.pathname.includes("/coaches"))
      return filterRoles(getCoachesModuleSider(userRoles));
    if (router.pathname.includes("/finance"))
      return filterRoles(getFinanceModuleSider(userRoles));
    if (router.pathname.includes("/reports"))
      return filterRoles(getReportsModuleSider(userRoles, selectedChannel));
    if (router.pathname.includes("/third-party-management"))
      return filterRoles(getThirdPartyManagementModuleSider(userRoles));
    if (router.pathname.includes("/crm"))
      return filterRoles(getCRMModuleSider(userRoles));
    if (router.pathname.includes("/human-resource"))
      return filterRoles(getHRModuleSider(userRoles));
    return list;
  };

  return (
    <Transition
      mounted={width <= isTabletMobileView ? opened || false : true}
      transition="slide-right"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Navbar
          style={styles}
          styles={{ marginTop: 20 }}
          hiddenBreakpoint="md"
          hidden={!opened}
          className={classes.sider}
          width={{ sm: 200, lg: 200 }}
        >
          <Navbar.Section mt="md">
            <Grid align="center" columns={12}>
              <Grid.Col span={3}></Grid.Col>
              <Grid.Col span={6}>
                <div>
                  <Center>
                    <Stack>
                      <Image
                        onClick={onLogoClick}
                        src={Logo}
                        alt="LOGO"
                        width={130}
                      />
                      <Changelogs />
                    </Stack>
                  </Center>
                </div>
              </Grid.Col>
              <Grid.Col style={{ textAlign: "right", padding: 25 }} span={3}>
                {width <= isTabletMobileView ? <SiderMenu /> : undefined}
              </Grid.Col>
            </Grid>
            {selectedChannel !== "MAIN_WAREHOUSE" && (
              <NavList
                onClose={() => setOpened(false)}
                list={getListByRouter()}
              />
            )}
          </Navbar.Section>
        </Navbar>
      )}
    </Transition>
  );
};
