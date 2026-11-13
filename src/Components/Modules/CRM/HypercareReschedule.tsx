import { Divider, Select } from "@mantine/core";
import { TimeInput, DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { DeviceFloppy, X } from "tabler-icons-react";
import { ORDER } from "../../../GraphQL";
import { Button, Grid, Group, Paper } from "../../Elements";
import { IFormInput } from "../../Layouts/CRMTrials/Create/Create";
import { HypercareFormInput } from "./Config";
import { HypercareScheduleLogs } from "./HypercareScheduleLogs";
import { useStyles } from "../../Layouts/CRMTrials/crmtrials.styles";

var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

type Props = {
  hypercare: HypercareFormInput | undefined;
  control: Control<IFormInput, any>;
  setValue: UseFormSetValue<IFormInput>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  errors: FieldErrors<IFormInput>;
  reset: UseFormReset<IFormInput>;
  isUpdate?: boolean;
  order: ORDER.Order;
  onSave?: () => void;
};

export const HypercareReschedule = (props: Props) => {
  const { classes } = useStyles();
  const [isAfterFeedbackDate, setisAfterFeedbackDate] = useState(false);
  useEffect(() => {
    if (!props?.order) {
      props.reset();
    } else {
      setisAfterFeedbackDate(
        dayjs().isAfter(
          dayjs(
            props
              .getValues("schedule_logs")
              ?.some((e) => e.reason === "RESCHEDULE")
              ? props.getValues("call_info.reschedule_date")
              : props.getValues("date"),
          ),
        ),
      );
      props.setValue("call_info.status", "RESCHEDULE");
      props.setValue("call_info.answered_call", "NO");
    }
  }, [props?.order]);

  const onSave = () => {
    if (!props.errors && props.onSave) {
      props?.onSave();
    }
  };
  console.log(isAfterFeedbackDate);
  return (
    <Paper radius={10}>
      <Grid align="start" justify="space-between">
        <Grid.Col span={9}>
          <h2>{"Order not yet delivered."}</h2>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group position="right">
            <HypercareScheduleLogs logs={props.watch("schedule_logs")} />
          </Group>
        </Grid.Col>
      </Grid>
      {}
      <Grid align="center">
        <Grid.Col span={3}>
          <p className={classes.notEditableDescription}>Order ID:</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                `/delivery-tracking/order/?orderID=${props?.order?.id}`,
              );
            }}
          >
            {props?.order?.id || ""}
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <p className={classes.notEditableDescription}>Order Status:</p>
          <p className={classes.notEditableValue}>
            {props?.order?.order_status}
          </p>
        </Grid.Col>
        <Grid.Col span={3}>
          <p className={classes.notEditableDescription}>Feedback Date:</p>
          <p className={classes.notEditableValue}>{`${dayjs(
            props.getValues("date"),
          ).format("MMMM DD, YYYY")}`}</p>
        </Grid.Col>
        <Grid.Col span={3}>
          <p className={classes.notEditableDescription}>Feedback Time:</p>
          <p className={classes.notEditableValue}>{`${dayjs(
            props.getValues("time"),
            "HH:mm",
          ).format("hh:mm A")}`}</p>
        </Grid.Col>
      </Grid>
      <br />
      {isAfterFeedbackDate ? (
        <div>
          <Grid>
            <Grid.Col span={4}>
              <Controller
                name="call_info.status"
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    radius={8}
                    error={
                      props.errors.call_info?.status ? "Required" : undefined
                    }
                    label="Reschedule?"
                    disabled
                    data={[{ value: "RESCHEDULE", label: "Reschedule" }]}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Controller
                name="call_info.reschedule_date"
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    radius={8}
                    excludeDate={(date) =>
                      dayjs().subtract(1, "day").isAfter(date)
                    }
                    error={
                      props.errors.call_info?.reschedule_date
                        ? "Required"
                        : undefined
                    }
                    label="Reschedule Feedback Date"
                    placeholder="Select date"
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Controller
                name="call_info.reschedule_time"
                control={props.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TimeInput
                    {...field}
                    radius={8}
                    error={
                      props.errors.call_info?.reschedule_time
                        ? "Required"
                        : undefined
                    }
                    format="12"
                    label="Reschedule Feedback Time"
                  />
                )}
              />
            </Grid.Col>
          </Grid>
          <br />
          {props.isUpdate && props.getValues("status") == "PENDING" ? (
            <Group position="center" justify="cemter" align="center">
              <Button
                type="submit"
                icon={<DeviceFloppy />}
                onClick={() => {
                  onSave();
                }}
              >
                Reschedule
              </Button>
            </Group>
          ) : undefined}
        </div>
      ) : undefined}
    </Paper>
  );
};
