import React, { useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Stack,
} from "../../Elements";
import { useStyles } from "./Changelogs.styles";
import { ChangelogCard } from "./ChangelogCard";
import { getChangelogs } from "./Config";
import { IconHistory } from "@tabler/icons-react";
import { Text } from "@mantine/core";

export const getWebVersion = `1.9.49b`;

export const Changelogs = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(
    getWebVersion === localStorage.getItem("iqos-web-version") ? false : true
  );
  const onClose = () => {
    localStorage.setItem("iqos-web-version", getWebVersion);
    setVisible(false);
  };
  return (
    <div>
      <Modal
        title={
          <div>
            <Text fw={700} fz="lg">
              {`What's new?`} ✨
            </Text>
            <Text fz="xs" c="dimmed">
              Latest updates, features and fixes to enhance your experience.
              Stay Informed!
            </Text>
          </div>
        }
        centered
        size={"lg"}
        onClose={() => onClose()}
        opened={visible}
      >
        <Stack>
          <ScrollArea scrollbarSize={5} style={{ height: 500 }}>
            {getChangelogs.map((item, i) => (
              <ChangelogCard key={`changelogs-${i}`} changelog={item} />
            ))}
          </ScrollArea>
          <Group position="right">
            <Button onClick={() => onClose()}>Okay</Button>
          </Group>
        </Stack>
      </Modal>
      <Button
        customType="custom"
        styles={{ color: "#3793A1", backgroundColor: "#38393B" }}
        color="#38393B"
        onClick={() => setVisible(true)}
        size="xs"
        icon={<IconHistory size={15} />}
        fullWidth
      >
        {getWebVersion}
      </Button>
    </div>
  );
};
