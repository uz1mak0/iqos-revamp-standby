import React from "react";

import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../../Utilities/Formatter";
import { Group } from "../../../Elements";
import { MediaQuery, Image, Header } from "@mantine/core";
import Logo from "../../../../../assets/LOGO_SIMPLE.png";
import { SiderMenu } from "../SiderMenu/SiderMenu";
import { useStyles } from "./Header.styles";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs";
import { useRouter } from "next/router";
import { channelAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";

export const MobileHeader = () => {
  const router = useRouter();
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);

  const onLogoClick = () => {
    router.push("/");
    setSelectedChannel(undefined);
  };

  if (width >= isTabletMobileView) return <div></div>;
  return (
    <div className={classes.mobileHeader}>
      <Group position="apart">
        <Group>
          <MediaQuery largerThan="md" styles={{ padding: 8, marginLeft: 20 }}>
            <div style={{ padding: 8 }}>
              <Image
                src={Logo}
                alt="LOGO"
                onClick={() => onLogoClick()}
                width={130}
                styles={{
                  image: { margin: "1em auto" },
                }}
              />
            </div>
          </MediaQuery>
        </Group>
        <div style={{ paddingRight: 20 }}>
          <SiderMenu />
        </div>
      </Group>
    </div>
  );
};
