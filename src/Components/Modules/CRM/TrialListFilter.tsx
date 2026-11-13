import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "../../Elements";
import { Controller, useForm } from "react-hook-form";
import { Filter } from "tabler-icons-react";
import { Group, Radio, Select, Button as MantineButton } from "@mantine/core";
import { getRegistrationChannels } from "./Config";
import {
  DatePicker,
  DateRangePicker,
  DateRangePickerValue,
} from "@mantine/dates";
import Notification from "../../Elements/Notification/Notification";
import dayjs from "dayjs";

export interface FilterValuesInput {
  date_type: string;
  date_filter: DateRangePickerValue;
  channel: string | null;
  status: string | undefined;
  search: string;
}

type Props = {
  filterValues: FilterValuesInput;
  onFilter: (filter: FilterValuesInput) => void;
};

export const TrialListFilter = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FilterValuesInput>();

  useEffect(() => {
    reset(props.filterValues);
  }, []);

  const onChangeChannel = (value: string) => {
    if (value === "IQOS" || value === "Marlboro" || value === "ALL") {
      setValue("date_type", "datetime_created");
    } else {
      setValue("date_type", "gt_date");
    }
    setValue("channel", value);
  };

  const onSubmit = (data: FilterValuesInput) => {
    if (!data.date_filter[0] || !data.date_filter[1])
      return Notification.error({ message: "Please add date range" });
    props.onFilter({ ...props.filterValues, ...data });
    setVisible(false);
  };

  const filterForm = () => (
    <Modal
      title="Filter Data"
      centered
      opened={visible}
      size={620}
      onClose={() => setVisible(false)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Group position="right">
            <MantineButton
              color="red"
              radius={20}
              onClick={() =>
                reset({
                  status: "ALL",
                  search: "",
                  channel: "ALL",
                  date_type: "datetime_created",
                  date_filter: [
                    dayjs().startOf("month").toDate(),
                    dayjs().endOf("month").toDate(),
                  ],
                })
              }
              variant="light"
            >
              Reset Filter
            </MantineButton>
          </Group>
          <Controller
            name="channel"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                withAsterisk
                radius={8}
                error={errors.channel ? "Required" : undefined}
                label="Registration Channel"
                onChange={onChangeChannel}
                data={["ALL", ...getRegistrationChannels]}
              />
            )}
          />
          <Controller
            name="date_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio
                  data-testid={`filter-date-type-gt`}
                  disabled={
                    watch("channel") === "IQOS" ||
                    watch("channel") === "Marlboro" ||
                    watch("channel") === "ALL"
                  }
                  value={"gt_date"}
                  label="GT Date"
                />
                <Radio
                  data-testid={`filter-date-type-created`}
                  value={"datetime_created"}
                  label="Date Created"
                />
              </Radio.Group>
            )}
          />
          <Controller
            name="date_filter"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <DateRangePicker
                {...field}
                amountOfMonths={2}
                withAsterisk
                radius={8}
                allowSingleDateInRange
                clearable={false}
                error={errors.date_filter ? "Required" : undefined}
                label="Date Range"
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Radio.Group withAsterisk label={"Trial Status"} {...field}>
                <Radio
                  data-testid={`filter-status-all`}
                  value={"ALL"}
                  label="ALL"
                />
                <Radio
                  data-testid={`filter-status-pending`}
                  value={"PENDING"}
                  label="PENDING"
                />
                <Radio
                  data-testid={`filter-status-completed`}
                  value={"COMPLETED"}
                  label="COMPLETED"
                />
              </Radio.Group>
            )}
          />
          <br />
          <Group position="center">
            <Button
              customType="secondary"
              onClick={() => {
                setVisible(false);
                reset(props.filterValues);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => handleSubmit(onSubmit)}
              customType="primary"
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
  return (
    <div>
      {filterForm()}
      <Button icon={<Filter />} onClick={() => setVisible(true)}>
        Filter
      </Button>
    </div>
  );
};
