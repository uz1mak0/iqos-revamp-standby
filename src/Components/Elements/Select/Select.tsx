import React, { useState } from "react";
import {
  Select as MantineSelect,
  MultiSelect as MantineMultiSelect,
  Button,
  Drawer,
  Stack,
  ScrollArea,
  Paper,
  Text,
  DefaultProps,
  Styles,
} from "@mantine/core";

import { IconChevronDown } from "@tabler/icons-react";
import { Selector } from "tabler-icons-react";
import { BaseSelectStylesNames } from "@mantine/core/lib/Select/types";

type SelectData = {
  label: string;
  value: string;
};
type Props = {
  label?: string;
  placeholder?: string;
  data: SelectData[] | string[];
  clearable?: boolean;
  onChange?: (value: string) => void;
  required?: boolean;
  searchable?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  value?: string;
  defaultValue?: string | undefined | null;
  multiple?: boolean;
  description?: string;
  style?: any;
  disabled?: boolean;
  onBlur?: () => void;
  icon?: React.ReactNode;
  isPullUpSelect?: boolean;
  onSelectFromPullUp?: (value: string) => void;
  withAsterisk?: boolean;
  variant?: "unstyled" | "default" | "filled";
};

type MultiProps = {
  label?: string;
  placeholder?: string;
  data: SelectData[];
  clearable?: boolean;
  onChange?: (value: string[]) => void;
  required?: boolean;
  searchable?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  value?: string[];
  defaultValue?: string[];
  multiple?: boolean;
  description?: string;
  style?: any;
  onBlur?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  withAsterisk?: boolean;
};

const isSelectDataArray = (
  data: SelectData[] | string[],
): data is SelectData[] => {
  return data.length > 0 && typeof data[0] === "object" && "label" in data[0];
};

const PullUpSelect = (
  props: Props,
  onSelectFromPullUp: ((value: string) => void) | undefined
) => {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <Drawer
        position="bottom"
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xs"
        withCloseButton={false}
      >
        <ScrollArea style={{ height: 300 }}>
          <Stack spacing={7}>
            {isSelectDataArray(props.data)
              ? props.data.map((data) => (
                  <Paper
                    p={5}
                    style={
                      props.value === data.value
                        ? { backgroundColor: `#228BE6`, color: "white" }
                        : undefined
                    }
                    onClick={() => {
                      onSelectFromPullUp
                        ? onSelectFromPullUp(data.value)
                        : undefined;
                      setOpened(false);
                    }}
                    // variant={props.value === data.value ? undefined : "subtle"}
                    key={data.value}
                  >
                    <Text fz="sm">{data.label}</Text>
                  </Paper>
                ))
              : props.data.map((item, index) => (
                  <Button key={index}>{item}</Button>
                ))}
          </Stack>
        </ScrollArea>
      </Drawer>
      <MantineSelect
        {...props}
        readOnly
        data={props.data}
        onClick={() => setOpened(!opened)}
        radius={8}
        rightSection={<Selector size={15} />}
      ></MantineSelect>
    </div>
  );
};

export const Select = (props: Props) => {
  const { isPullUpSelect, onSelectFromPullUp, ...restProps } = props;
  if (isPullUpSelect) return PullUpSelect(restProps, onSelectFromPullUp);
  return <MantineSelect {...restProps} radius={8} />;
};

export const MultiSelect = (multiProps: MultiProps) => {
  return <MantineMultiSelect {...multiProps} radius={8} />;
};
