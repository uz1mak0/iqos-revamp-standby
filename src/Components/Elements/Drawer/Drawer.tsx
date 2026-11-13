import React from "react";
import {
  Drawer as MantineDrawer,
  Text,
  Group,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { X } from "tabler-icons-react";

type Props = {
  padding?: number | "xs" | "sm" | "md" | "lg" | "xl";
  title?: React.ReactNode;
  size?: string | number;
  position?: "bottom" | "left" | "right" | "top";
  opened: boolean;
  onClose: () => void;
  removeCloseButton?: boolean;
  children: React.ReactNode;
};

export const Drawer = (props: Props) => {
  return (
    <MantineDrawer {...props} title={undefined} withCloseButton={false}>
      <Stack>
        <Group position="apart">
          <Text fz="xl" fw={700}>
            {props.title}
          </Text>
          <div>
            {props.removeCloseButton ? undefined : (
              <ActionIcon onClick={() => props.onClose()} variant="default">
                <X />
              </ActionIcon>
            )}
          </div>
        </Group>
        {props.children}
      </Stack>
    </MantineDrawer>
  );
};
