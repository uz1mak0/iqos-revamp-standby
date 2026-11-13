import React, { useState } from "react";
import { Modal as MantinModal, Button, Group, ActionIcon } from "@mantine/core";
import { X } from "tabler-icons-react";
import { Text } from "../Text";
import { Stack } from "../Stack";

type Props = {
  opened: boolean | false;
  children?: React.ReactNode;
  onClose: () => void;
  centered?: boolean;
  size?: string | number;
  title?: React.ReactNode;
  removeCloseButton?: boolean;
  zIndex?: number;
  fullScreen?: boolean;
  ref?:
    | ((instance: HTMLButtonElement | null) => void)
    | React.RefObject<HTMLButtonElement>
    | null
    | undefined;
  overflow?: "inside" | "outside";
};

export const Modal = (props: Props) => {
  return (
    <MantinModal
      {...props}
      title={undefined}
      closeOnClickOutside={false}
      transitionDuration={500}
      transitionTimingFunction="ease"
      withCloseButton={false}
      transition={"fade"}
    >
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
    </MantinModal>
  );
};
