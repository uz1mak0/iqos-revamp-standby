import React, { useState } from "react";
import { Select } from "@mantine/core";
import { Group } from "../Group";
import dayjs from "dayjs";

type Props = {
  onChange: (value: string | null) => void;
};

export const MonthPicker = ({ onChange }: Props) => {
  // Manually define month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = dayjs().format("YYYY");

  const [date, setDate] = useState<{
    month: string | null;
    year: string | null;
  }>({
    month: null,
    year: currentYear,
  });

  const years = Array.from(
    { length: 100 },
    (_, i) => `${Number(currentYear) - 50 + i}`
  ); // Generates 50 years centered on the current year

  return (
    <Group spacing={"xs"}>
      <Select
        style={{ width: 150 }}
        description="Month"
        placeholder="Choose a month"
        data={months}
        value={date.month}
        onChange={(val) => {
          setDate({ ...date, month: val });
          onChange(`${val} ${date.year}`);
        }}
      />
      <Select
        style={{ width: 150 }}
        description="Year"
        placeholder="Choose a year"
        data={years}
        value={date.year}
        onChange={(val) => {
          setDate({ ...date, year: val });
          onChange(`${date.month} ${val}`);
        }}
      />
    </Group>
  );
};
