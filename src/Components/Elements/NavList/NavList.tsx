import {
  Avatar,
  Card,
  Indicator,
  List,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { BuildingWarehouse } from "tabler-icons-react";
import { useStyles } from "./NavList.styles";
import { useAtom } from "jotai";
import { channelAtom } from "../../../Store/StoreAtom";

type Props = {
  onClose: () => void;
  list?: Array<{
    color?: string;
    icon?: React.ReactNode;

    heading?: string;
    sublist?: Array<{
      title?: string;
      route?: any;
      access?: boolean;
      isNew?: boolean;
    }>;
    title?: string;
    route?: any;
  }>;
};

export const NavList = (props: Props) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [selected, setSelected] = useState(router.pathname);
  const [channel, setChannel] = useAtom(channelAtom);

  useEffect(() => {
    updateSelectedPath();
  }, []);

  const updateSelectedPath = () => {
    const list = router.pathname.includes(`order-management`)
      ? props?.list
          ?.flatMap((e) => e.sublist)
          .filter((e) => router.pathname.includes(e?.route))
          .map((e) => e?.route)
      : props?.list
          ?.filter((e) => router.pathname.includes(e.route))
          .map((e) => e?.route);
    const selectedPath = list?.length
      ? list?.reduce((a, b) => (b.length > a.length ? b : a))
      : "";
    setSelected(selectedPath);
  };

  const selectedStyle = (route: string) => {
    const getList = props?.list?.filter((e) => e.route !== "/");
    if (getList?.some((e) => e.heading)) {
      return undefined;
    } else {
      if (selected === route) {
        return classes.selected;
      } else {
        return undefined;
      }
    }
  };

  const onClickSideRoute = (list: {
    title?: string;
    route?: any;
    access?: boolean;
    isNew?: boolean;
  }) => {
    if ((channel === "USERS" || channel === "HR_CHANNEL") && list.route === "/") {
      setChannel(undefined);
      localStorage.removeItem("channel");
    }
    router.push(list.route);
    setSelected(list.route);
    props.onClose();
  };
  return (
    <List p="xs">
      <ScrollArea scrollbarSize={5} style={{ height: "85vh" }}>
        {props.list?.map((item, i) => (
          <div
            className={selectedStyle(item.route)}
            style={{ marginBlock: 14 }}
            key={`nav-${i}`}
          >
            {item?.heading ? (
              <>
                <Text size="md" color="white">
                  {item?.heading}
                </Text>
                {item?.sublist
                  ?.filter((e) => e.access)
                  .map((list, index) => (
                    <div
                      className={
                        selected === list.route ? classes.selected : undefined
                      }
                      key={index}
                    >
                      <List.Item
                        className={classes.menuItem}
                        key={index}
                        onClick={() => {
                          onClickSideRoute(list);
                        }}
                      >
                        <Indicator
                          disabled={list?.isNew ? false : true}
                          color="teal"
                          offset={-5}
                          radius={"sm"}
                          withBorder={false}
                          inline
                          label="New"
                          size={20}
                        >
                          <Text
                            size="sm"
                            color={
                              selected == list.route ? "#00bacf" : item?.color
                            }
                          >
                            {list.title}
                          </Text>
                        </Indicator>
                      </List.Item>
                    </div>
                  ))}
              </>
            ) : (
              <List.Item
                className={classes.menuItem}
                onClick={() => {
                  onClickSideRoute(item);
                }}
              >
                <div style={{ width: "100%" }}>{item?.icon}</div>
                <Text
                  size="sm"
                  color={selected == item.route ? "#00bacf" : item?.color}
                >
                  {item?.title}
                </Text>
              </List.Item>
            )}
          </div>
        ))}
      </ScrollArea>
    </List>
  );
};
