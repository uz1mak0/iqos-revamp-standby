import React, { useState } from "react";
import { ChangePassword } from "../../../Layouts/ChangePassword/ChangePassword";
import { MenuUserInfo } from "../../../Modules/Users/MenuUserInfo";
import { getWebVersion } from "../../../Layouts/Changelogs/Changelogs";
import {
  Button,
  Group,
  Modal,
  SimpleGrid,
  Badge,
  Stack,
  List,
} from "../../../Elements";
import {
  InfoCircle,
  Moon,
  Power,
  Settings,
  Sun,
  SwitchHorizontal,
  UserCircle,
} from "tabler-icons-react";
import { useStyles } from "./Header.styles";
import { useRouter } from "next/router";
import { loginAtom, userAtom } from "../../../../Store/StoreAtom";
import { useAtom } from "jotai";
import {
  ActionIcon,
  Drawer,
  useMantineColorScheme,
  Menu,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Auth } from "../../../../Utilities/Backend";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../../Utilities/Formatter";
import { IconCircle } from "@tabler/icons-react";
import ChannelSelection from "../../../Layouts/NavigationMain/ChannelSelection";

export const HeaderMenu = () => {
  const { classes } = useStyles();
  const [isLogout, setIsLogout] = useState(false);
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const { height, width } = useViewportSize();
  const [userDetails] = useAtom(userAtom);

  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isUserInfo, setIsUserInfo] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const onLogout = () => {
    Auth.signOut();
    setIsLogin(false);
    router.replace("/");
  };

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
        <Button customType="danger" onClick={() => onLogout()}>
          Yes, Logout
        </Button>
      </Group>
    </Modal>
  );

  const content = () => (
    <Menu.Dropdown>
      <Menu.Label>User Info</Menu.Label>
      <Menu.Item
        icon={<UserCircle size={14} />}
        onClick={() => setIsUserInfo(true)}
      >
        {userDetails?.username || "Administrator"}
      </Menu.Item>
      <Menu.Label>
        <div>
          <p>Roles</p>
          <div style={{ maxWidth: 250 }}>
            <SimpleGrid spacing={1} verticalSpacing={3} cols={2}>
              {userDetails?.roles?.map((e) => (
                <Badge key={e}>{e}</Badge>
              ))}
            </SimpleGrid>
          </div>
        </div>
      </Menu.Label>
      <Menu.Divider />
      <Menu.Item
        icon={dark ? <Sun size={18} /> : <Moon size={18} />}
        onClick={() => toggleColorScheme()}
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </Menu.Item>
      <Menu.Item
        icon={<Settings size={14} />}
        onClick={() => setIsChangePassword(true)}
      >
        Change Password
      </Menu.Item>
      <Menu.Item onClick={() => setIsLogout(true)} icon={<Power size={14} />}>
        Logout
      </Menu.Item>
    </Menu.Dropdown>
  );

  return (
    <div>
      {logoutRender()}
      <Drawer
        withCloseButton={false}
        size={"lg"}
        position="bottom"
        onClose={() => setOpened(false)}
        opened={opened && width <= isTabletMobileView}
        padding={"md"}
      >
        <ScrollArea>
          <List spacing={"md"}>
            <List.Item icon={<div></div>}>
              <Text size={"xs"} c="dimmed">
                User information
              </Text>
            </List.Item>
            <List.Item
              onClick={() => {
                setIsUserInfo(true);
                setOpened(false);
              }}
              icon={<UserCircle size={24} />}
            >
              {userDetails?.username || "Administrator"}
            </List.Item>
            <List.Item icon={<div></div>}>
              <div style={{ maxWidth: 250 }}>
                <SimpleGrid spacing={1} cols={2}>
                  {userDetails?.roles?.map((e) => (
                    <Badge key={e}>{e}</Badge>
                  ))}
                </SimpleGrid>
              </div>
            </List.Item>
            <List.Item icon={<></>}>
              <Text size={"xs"} c="dimmed">
                Settings
              </Text>
            </List.Item>
            <List.Item
              icon={dark ? <Sun size={24} /> : <Moon size={24} />}
              onClick={() => toggleColorScheme()}
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </List.Item>
            <List.Item
              icon={<Settings size={24} />}
              onClick={() => {
                setIsChangePassword(true);
                setOpened(false);
              }}
            >
              Change Password
            </List.Item>
            <List.Item
              onClick={() => {
                setIsLogout(true);
                setOpened(false);
              }}
              icon={<Power color="red" size={24} />}
            >
              <Text color="red">Logout</Text>
            </List.Item>
          </List>
        </ScrollArea>
      </Drawer>
      <div data-testid="user-menu" style={{ marginRight: 20 }}>
        <Group align="center" spacing={3}>
          <ChangePassword
            visible={isChangePassword}
            onClose={() => setIsChangePassword(false)}
          />
          <MenuUserInfo
            visible={isUserInfo}
            onClose={() => setIsUserInfo(false)}
          />
          {/* {width <= 319 ? (
            <ActionIcon
              onClick={() => setVisible(true)}
              radius={"lg"}
              color="cyan"
              variant="filled"
            >
              <InfoCircle />
            </ActionIcon>
          ) : (
            <Button compact={true} size="xs" onClick={() => setVisible(true)}>
              {getWebVersion}
            </Button>
          )} */}

          <ChannelSelection isModal={true} />
          <Menu disabled={width <= isTabletMobileView} position={"bottom-end"}>
            <Menu.Target>
              <ActionIcon
                color={dark ? undefined : "cyan"}
                variant="transparent"
                onClick={() => setOpened(true)}
                size={"lg"}
              >
                <UserCircle size={40} strokeWidth={2} />
              </ActionIcon>
            </Menu.Target>
            {content()}
          </Menu>
        </Group>
      </div>
    </div>
  );
};
