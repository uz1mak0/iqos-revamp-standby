import React from "react";
import { DateRangePicker, Group, Select } from "../../Elements";
import { ORDER } from "../../../GraphQL";
import { RedactionFilterProps } from "./RedactionLogs";
import dayjs from "dayjs";

type Props = {
  filters: RedactionFilterProps;
  onChange: (filters: RedactionFilterProps) => void;
};

export const RedactionFilter = (props: Props) => {
  const onChangeDate = (date: [Date, Date]) => {
    // Must have date[1] (to Date) before calling props.onChange
    // Convert the from and to dates to YYYY-MM-DD format
    // Update the new filter values for date
    if (date[1]) {
      const newFilter: RedactionFilterProps = {
        date: {
          from: dayjs(date[0]).format("YYYY-MM-DD"),
          to: dayjs(date[1]).format("YYYY-MM-DD"),
        },
        status: props.filters.status,
      };
      props.onChange(newFilter);
    }
  };

  const onChangeStatus = (status: string | undefined) => {
    // When status is undefined, get all list  with status SUCCESS and FAILED
    const newFilters = {
      date: props.filters.date,
      status: status,
    };
    props.onChange(newFilters);
  };

  return (
    <div>
      <Group>
        <DateRangePicker
          onChange={onChangeDate}
          description="Date"
          defaultValue={[
            dayjs().startOf("week").toDate(),
            dayjs().endOf("week").toDate(),
          ]}
        />
        <Select
          description="Status"
          placeholder="Select Status"
          onChange={onChangeStatus}
          clearable
          data={[ORDER.RedactStatus.Success, ORDER.RedactStatus.Failed]}
        />
      </Group>
    </div>
  );
};
