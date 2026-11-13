import React, { useState } from "react";
import { Select as MantineSelect } from "@mantine/core";
import { useStyles } from "./TimePicker.styles";
import { getTimeSelections } from "./TimePickerConfig";

type Props = {
  onChange?: (value: string) => void;
  halfHour?: boolean;
  label?: string;
  defaultValue?: string;
};
export const TimePicker = (props: Props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.mainStyle}>
      <MantineSelect
        label={props.label}
        onChange={props.onChange}
        searchable
        clearable
        defaultValue={props.defaultValue}
        className={classes.timeSelectStyle}
        size="sm"
        placeholder="Select Time"
        data={getTimeSelections
          .filter((e) => (props.halfHour ? e : !e.includes("30")))
          .map((time) => {
            return {
              value: time,
              label: time,
            };
          })}
      />
    </div>
  );
};
