import {
  Anchor,
  Breadcrumbs,
  Burger,
  Button,
  MediaQuery,
  useMantineColorScheme,
} from "@mantine/core";
import { NextRouter } from "next/router";
import { title } from "process";
import React, { useLayoutEffect, useState } from "react";
import {
  get3rdPartyBreadCrumbs,
  getCRMBreadCrumbs,
  getCoachesBreadCrumbs,
  getInventoryBreadCrumbs,
  getOrderMangementBreadCrumbs,
  getReportsBreadCrumbs,
  getSalesRecordBreadCrumbs,
  getUsersBreadCrumbs,
  getHRCrumbs,
} from "./Config";
import { Divider, Group, ScrollArea } from "../../../Elements";
import { HeaderMenu } from "../Header/HeaderMenu";
import { MobileHeader } from "../Header/MobileHeader";
import { isTabletMobileView } from "../../../../Utilities/Formatter";
import { useViewportSize } from "@mantine/hooks";

type Props = {
  router: NextRouter;
};

const BreadCrumbs = (props: Props) => {
  const [items, setItems] = useState<
    { title: string; href: string; visible: boolean }[]
  >([]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { height, width } = useViewportSize();

  useLayoutEffect(() => {
    if (props.router) {
      updateRoute();
    }
  }, [props.router]);

  const updateRoute = () => {
    if (props.router.route.includes("/inventory")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getInventoryBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/order-management")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getOrderMangementBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/crm")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getCRMBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/users")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getUsersBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/third-party")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...get3rdPartyBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/reports")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getReportsBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/coaches")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getCoachesBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/record-sales")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getSalesRecordBreadCrumbs(props.router),
      ]);
    }
    if (props.router.route.includes("/human-resource")) {
      setItems([
        { title: "Home", href: "/", visible: true },
        ...getHRCrumbs(props.router),
      ]);
    }
  };

  return (
    <>
      <div
        style={{
          marginBottom: 10,
          margin: "-20px",
          borderBottom: dark ? "1px solid #303338" : undefined,
          boxShadow:
            "0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)",
          position: "sticky",
          backgroundColor: dark ? "#191A1C" : "#FFFFFF",
          top: 0,
          zIndex: 2,
        }}
      >
        <MobileHeader />
        <Group position="apart">
          <Group>
            <div style={{ padding: 15 }}>
              <ScrollArea
                scrollbarSize={5}
                style={{ width: width <= 400 ? 150 : undefined }}
              >
                <Breadcrumbs separator=">">
                  {items
                    .filter((e) => e.visible)
                    .map((item, index) => (
                      <Anchor
                        onClick={() => props.router.push(item.href)}
                        key={index}
                      >
                        <Button compact variant="subtle">
                          {item.title}
                        </Button>
                      </Anchor>
                    ))}
                </Breadcrumbs>
              </ScrollArea>
            </div>
          </Group>
          <HeaderMenu />
        </Group>
      </div>
      <br />
      <br />
    </>
  );
};

export default BreadCrumbs;
