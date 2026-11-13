import dayjs from "dayjs";
import React, { useState } from "react";
import { DatePicker } from "../../../Elements/DatePicker/DatePicker";
import { Grid, Loader } from "@mantine/core";

type Props = {
  onFilter: (event: {
    date: { from: string; to: string };
    monthChanged: boolean;
  }) => void;
  defaultValues: {
    date: { from: string; to: string };
  };
  isLoading?: boolean;
  customField?: React.ReactNode;
};

export const Applicantilter = (props: Props) => {
  const [filters, setFilters] = useState({
    date: props.defaultValues.date,
  });

  return (
    <Grid>
      <Grid.Col md={6} lg={3}>
        <DatePicker
          fullWidth
          defaultValue={dayjs(filters.date.to).toDate()}
          icon={props.isLoading ? <Loader size={"xs"} /> : undefined}
          disabled={props.isLoading}
          onChange={(e) => {
            if (!e) return;

            const newDate = {
              from: dayjs(e).format("YYYY-MM-DD"),
              to: dayjs(e).format("YYYY-MM-DD"),
            };

            const monthChanged =
              dayjs(e).month() !== dayjs(filters.date.to).month() ||
              dayjs(e).year() !== dayjs(filters.date.to).year();

            setFilters({ date: newDate });

            props.onFilter({
              date: newDate,
              monthChanged,
            });
          }}
        />
      </Grid.Col>

      <Grid.Col md={6} lg={3}>
        {props.customField}
      </Grid.Col>
    </Grid>
  );
};
