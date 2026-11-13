import React, { useState } from "react";
import { Button, Group, Input, Menu, Text } from "../../../Elements";
import { IconFilter } from "@tabler/icons-react";
import { FilterProps, getSMSType } from "../config";
import { Radio } from "@mantine/core";
import { getWarehouseType } from "../../Inventory/InventoryConfig";
import { Refresh } from "tabler-icons-react";

type Props = {
  onFilter: (values: FilterProps) => void;
};

export const Filter = (props: Props) => {
  const [opened, setOpened] = useState(false);
  const [values, setValues] = useState<FilterProps>({
    by_name_id: undefined,
    by_sms_type: undefined,
    by_warehouse_type: undefined,
  });

  const onBeforeFilter = (value: string, key: string) => {
    const newFilter = { ...values, [key]: value };
    setValues(newFilter);
    props.onFilter(newFilter);
  };

  const onReset = () => {
    const newFilter = {
      by_name_id: undefined,
      by_sms_type: undefined,
      by_warehouse_type: undefined,
    };
    setValues(newFilter);
    props.onFilter(newFilter);
    setOpened(false);
  };

  return (
    <div>
      <Group>
        <Input
          onChange={(e) => onBeforeFilter(e.target.value, "by_name_id")}
          style={{ width: 400 }}
          placeholder="Search by Warehouse Name/ID"
        />
        <Menu
          closeOnClickOutside={true}
          opened={opened}
          closeOnItemClick={false}
          width={200}
        >
          <Menu.Target>
            <div>
              <Button
                onClick={() => setOpened(!opened)}
                customType="secondary"
                icon={<IconFilter />}
              >
                Filter By
              </Button>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              <Group position="apart">
                <Text fw={500}>Add Filters</Text>
                <Button
                  icon={<Refresh size={15} />}
                  variant="light"
                  color="red"
                  customType="custom"
                  onClick={() => onReset()}
                  size="xs"
                >
                  Reset
                </Button>
              </Group>
            </Menu.Label>
            <Menu.Item>
              <Radio.Group
                value={values.by_warehouse_type}
                orientation="vertical"
                label="Warehouse Type"
                onChange={(value) => onBeforeFilter(value, "by_warehouse_type")}
              >
                {getWarehouseType.map((wh, i) => (
                  <Radio value={wh} key={`${wh}-${i}`} label={wh} />
                ))}
              </Radio.Group>
            </Menu.Item>
            <Menu.Item>
              <Radio.Group
                value={values.by_sms_type}
                orientation="vertical"
                label="Message Type"
                onChange={(value) => onBeforeFilter(value, "by_sms_type")}
              >
                {getSMSType.map((sms, i) => (
                  <Radio value={sms} key={`${sms}-${i}`} label={sms} />
                ))}
              </Radio.Group>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};
