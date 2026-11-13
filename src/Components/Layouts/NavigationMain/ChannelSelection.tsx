import React, { useState } from "react";
import { Button, Group, Image, Modal, Stack } from "../../Elements";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { useAtom } from "jotai";
import { Title, Text, Card, Flex, Divider, Center, Space } from "@mantine/core";
import { IconUserCog } from "@tabler/icons-react";
import { ChannelDetail, ChannelsDetails } from "./ChannelSelectionConfig";
import { useStyles } from "./ChannelSelection.styles";
import {
  BuildingStore,
  BuildingWarehouse,
  Home,
  SwitchHorizontal,
} from "tabler-icons-react";
import { IconArrowDownRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

type Props = {
  isModal?: boolean;
};

const ChannelSelection = (props: Props) => {
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);
  const [visible, setVisible] = useState(false);

  const { classes } = useStyles();
  const router = useRouter();

  const onSelectChannel = (id: string) => {
    const channel = ChannelsDetails.find((c) => c.id === id);
    if (!channel || !channel.hasAccess(roles)) return;
    setVisible(false);
    switch (id) {
      case "ECOMM":
      case "DIRECT_RETAIL":
      case "INDIRECT_CHANNEL":
      case "HR_CHANNEL":
        return (
          localStorage.setItem("channel", id),
          setSelectedChannel(id),
          router.push("/")
        );
      case "USERS":
        localStorage.setItem("channel", id);
        setSelectedChannel(id);

        if (roles.isAdministratorEC || roles.isFullAdmin || roles.isEcommUser || roles.isHR) {
          return router.push("/users/ecommerce");
        } else if (roles.isAdminDC) {
          return router.push("/users/direct");
        } else if (roles.isAdminIC || roles.isFOM) {
          return router.push("/users/indirect");
        }
      case "MAIN_WAREHOUSE":
        return (
          localStorage.setItem("channel", "ECOMM"),
          setSelectedChannel("ECOMM"),
          router.push("/inventory/warehouse/?warehouse=PH01")
        );
      default:
        break;
    }
  };

  const ChannelCard = (channel: ChannelDetail) => {
    if (!channel.hasAccess(roles)) return null;

    return (
      <Card
        className={
          selectedChannel === channel.id
            ? classes.channelCardSelected
            : classes.channelCard
        }
        onClick={() => onSelectChannel(channel.id)}
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
      >
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <div
            style={
              props.isModal
                ? { width: 300, height: 212, padding: 24 }
                : { width: 322, height: 340, padding: 24 }
            }
          >
            <div style={{ width: props.isModal ? 64 : 100 }}>
              <Image alt={channel.id} src={channel.icon} />
            </div>
            <br />
            <Title
              color={selectedChannel === channel.id ? "blue" : undefined}
              weight={500}
              order={props.isModal ? 4 : 2}
            >
              {channel.title}
            </Title>
            <Text
              color={selectedChannel === channel.id ? "blue" : undefined}
              c={selectedChannel === channel.id ? undefined : "dimmed"}
            >
              {channel.description}
            </Text>
          </div>
        </Flex>
      </Card>
    );
  };

  const accessibleChannels = ChannelsDetails.filter((channel) =>
    channel.hasAccess(roles),
  );
  const selectedChannelDetails = accessibleChannels.find(
    (e) => selectedChannel === e.id,
  );

  const iconPerChannel = (id: string | undefined) => {
    if (!id) return <></>;
    switch (id) {
      case "ECOMM":
      case "MAIN_WAREHOUSE":
        return (
          <BuildingWarehouse
            style={{ marginLeft: 5 }}
            color={"#228BE6"}
            size={16}
          />
        );
      case "DIRECT_RETAIL":
      case "INDIRECT_CHANNEL":
        return (
          <BuildingStore
            style={{ marginLeft: 5 }}
            color={"#228BE6"}
            size={16}
          />
        );
      case "HR_CHANNEL":
      case "USERS":
        return (
          <IconUserCog style={{ marginLeft: 5 }} color={"#228BE6"} size={16} />
        );
      default:
        break;
    }
  };

  return props.isModal ? (
    <div>
      <Modal
        title="Switch Channel"
        centered
        size={750}
        opened={visible}
        onClose={() => setVisible(false)}
      >
        <Group>
          {ChannelsDetails.map((channel, i) => (
            <ChannelCard key={`${channel.id}-${i}`} {...channel} />
          ))}
        </Group>
      </Modal>
      <div className={classes.channelMenu}>
        <Group spacing={10}>
          <Group spacing={5}>
            {iconPerChannel(selectedChannelDetails?.id)}
            <Text
              className={
                router.pathname === "/"
                  ? classes.channelSelectedTextWhite
                  : classes.channelSelectedText
              }
              fz="xs"
            >
              {selectedChannelDetails?.title}
            </Text>
          </Group>

          <Divider orientation="vertical" />
          <Button
            onClick={() => setVisible(true)}
            customType="custom"
            variant="light"
            styles={{ color: "#23C2D7", backgroundColor: "#DDF8FC" }}
            size="xs"
            rightIcon={<SwitchHorizontal size={15} />}
          >
            Switch Channel
          </Button>
        </Group>
      </div>
    </div>
  ) : (
    <div className={classes.channelSelection}>
      <Center style={{ minHeight: "100vh" }}>
        <Stack>
          <Title className={classes.channelHeader} weight={500} order={1}>
            Welcome, {user.name || user.username}! 👋🏻
          </Title>
          <Text className={classes.channelHeader}>
            Your central hub for managing the e-commerce portal, Direct and
            Indirect Channel, and user access.
          </Text>
          <Space h={40} />
          <Group>
            <Title className={classes.channelHeader} weight={500} order={2}>
              Select a channel to proceed
            </Title>
            <IconArrowDownRight className={classes.channelHeader} size={28} />
          </Group>
          <Group position="center">
            {ChannelsDetails.map((channel, i) => (
              <ChannelCard key={`${channel.id}-${i}`} {...channel} />
            ))}
          </Group>
        </Stack>
      </Center>
    </div>
  );
};

export default ChannelSelection;
