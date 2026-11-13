import React, { useState } from "react";
import {
  useMantineColorScheme,
  MediaQuery,
  Header,
  Image,
} from "@mantine/core";
import { useStyles } from "./Header.styles";
import Logo from "../../../../../assets/LOGO_SIMPLE.png";
import { Badge, Button, Group, Menu, Modal } from "../../../Elements";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { channelAtom } from "../../../../Store/StoreAtom";
import { HeaderMenu } from "./HeaderMenu";

type Props = {
  onLogout: () => void;
  opened: boolean;
  onClickBurger: () => void;
};

export const HeaderBar = (props: Props) => {
  const { classes } = useStyles();
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);
  const logoutRender = () => (
    <Modal
      title="Logout"
      size={500}
      centered
      opened={isLogout}
      onClose={() => setIsLogout(false)}
    >
      <p>Are you sure you want to logout?</p>
      <Group position="center">
        <Button onClick={() => setIsLogout(false)} customType="secondary">
          Cancel
        </Button>
        <Button onClick={() => props.onLogout()}>Okay</Button>
      </Group>
    </Modal>
  );

  const onLogoClick = () => {
    router.push("/");
    setSelectedChannel(undefined);
  };

  return (
    <Header className={classes.header} height={90}>
      {logoutRender()}
      <Group position="apart">
        <Group>
          <MediaQuery largerThan="md" styles={{ padding: 8, marginLeft: 20 }}>
            <div onClick={() => onLogoClick()} style={{ padding: 8 }}>
              <Image
                src={Logo}
                alt="LOGO"
                width={130}
                styles={{
                  image: { margin: "1em auto" },
                }}
              />
            </div>
          </MediaQuery>
        </Group>
        <HeaderMenu />
      </Group>
    </Header>
  );
};
