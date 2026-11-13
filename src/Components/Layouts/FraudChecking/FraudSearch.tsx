import React, { useRef, useState } from "react";
import { Badge, Button, Grid, Group, Input, Stack } from "../../Elements";
import { Refresh } from "tabler-icons-react";
import { ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  onSearch: (value: string) => void;
  onResetSearch: () => void;
  onUpdateSearch: (value: string) => void;
};

export const FraudSearch = (props: Props) => {
  const [searchValue, setSearchValue] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBeforeSearch = (value: string) => {
    const updateSearchValues = [...searchValue];
    if (!value) return Notification.error({ message: "Invalid value" });
    if (searchValue.includes(value)) {
      Notification.info({ title: "Notice", message: `${value} already added` });
    } else {
      updateSearchValues.push(value);
      setSearchValue(updateSearchValues);
      props.onSearch(value);
    }
    if (inputRef.current?.value) return (inputRef.current.value = "");
  };

  const onReset = () => {
    setSearchValue([]);
    props.onResetSearch();
    if (inputRef.current?.value) return (inputRef.current.value = "");
  };

  const onRemoveSearchValue = (value: string) => {
    setSearchValue(searchValue.filter((search) => search !== value));
    props.onUpdateSearch(value);
  };

  return (
    <Stack>
      <Grid>
        <Grid.Col span={"auto"}>
          <Input
            innerref={inputRef}
            onKeyPress={(e) =>
              e.key === "Enter" ? onBeforeSearch(e.target.value) : undefined
            }
            placeholder="Search by name/phone number/order ID"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Button
            fullWidth
            customType="custom"
            color="red"
            variant="light"
            icon={<Refresh />}
            radius={"sm"}
            onClick={onReset}
          >
            Reset
          </Button>
        </Grid.Col>
      </Grid>
      <div>
        <Group>
          {searchValue.length >= 1
            ? searchValue.map((value, i) => (
                <Badge
                  rightSection={
                    <ActionIcon color="blue" variant="transparent" size={"xs"}>
                      <IconX
                        onClick={() => onRemoveSearchValue(value)}
                        size={13}
                      />
                    </ActionIcon>
                  }
                  key={i}
                >
                  {value}
                </Badge>
              ))
            : undefined}
        </Group>
      </div>
    </Stack>
  );
};
