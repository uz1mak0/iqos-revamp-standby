import { Group } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Home } from "tabler-icons-react";
import { Card } from "../../Elements/Card";
import { Paper } from "../../Elements/Paper";
import { useStyles } from "./NavigationMain.styles";
import { DRLinks, links, HRLink } from "./NavigationMainConfig";
import router from "next/router";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import ChannelSelection from "./ChannelSelection";

export const NavigationMain = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);

  const [selectedChannel] = useAtom(channelAtom);
  const getChannelLinks = () => {
    switch (selectedChannel) {
      case "ECOMM":
        return links(userRoles);
      case "DIRECT_RETAIL":
      case "INDIRECT_CHANNEL":
        return DRLinks(userRoles);

      case "HR_CHANNEL":
        return HRLink(userRoles);
      default:
        return [];
    }
  };
  return (
    <div>
      <Group position="center" spacing="xl" className={classes.wrapper}>
        {getChannelLinks()
          .filter((e) => e?.access)
          .map((link, i) => (
            <Paper
              key={`nav-${i}`}
              radius={8}
              icon={{
                avatar: link.avatar,
                color: link.color,
                title: link.title,
              }}
              onClick={() => router.push(link.path)}
            />
          ))}
      </Group>
    </div>
  );
};
