import { Radio, Select, TextInput } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { DeviceFloppy, Pencil, X } from "tabler-icons-react";
import { Button, Divider, Grid, Group, Paper, Stack } from "../../../Elements";
import { HypercareFormInput } from "../../../Modules/CRM/Config";
import { useStyles } from "../crmtrials.styles";
import { IFormInput } from "./Create";

type RegionProps = { name: string; key: string; long: string };
type ProvinceProps = { name: string; key: string; region: string };
type CityProps = { name: string; province: string; region: string };

type Props = {
  control: Control<IFormInput, any>;
  setValue: UseFormSetValue<IFormInput>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  errors: FieldErrors<IFormInput>;
  isUpdate?: boolean;
  isEdit?: boolean;
};

const CRMTrialConsumerAddress = (props: Props) => {
  const { classes } = useStyles();
  var regions = require("philippines/regions");
  var provinces = require("philippines/provinces");
  var cities = require("philippines/cities");

  const displayView = (description: string, value: string) => {
    return (
      <div>
        <p className={classes.notEditableDescription}>{description}</p>
        <p className={classes.notEditableValue}>{value}</p>
      </div>
    );
  };

  return (
    <div>
      <Stack>
        <Grid align="center" justify="space-between">
          <Grid.Col span={12}>
            <Divider label={<h2>{"Consumer Address"}</h2>}></Divider>
          </Grid.Col>
        </Grid>
        {props.getValues("week") !== "WEEK 1" ? (
          <Controller
            name="different_address"
            control={props.control}
            rules={{ required: true }}
            render={({ field }) =>
              props.getValues("status") !== "PENDING" ? (
                displayView(
                  "Different from registered Address?",
                  props.getValues("different_address"),
                )
              ) : (
                <Radio.Group
                  {...field}
                  error={
                    props.errors.different_address ? "Required" : undefined
                  }
                  label={"Different from registered Address?"}
                >
                  <Radio value={"YES"} label="Yes" />
                  <Radio value={"NO"} label="No" />
                </Radio.Group>
              )
            }
          />
        ) : undefined}
        {
          // props.watch("different_address") === "YES" ?
          <div>
            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.unit"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Unit & Building",
                        props.getValues("consumer_address.unit") || "",
                      )
                    ) : (
                      <TextInput
                        {...field}
                        withAsterisk
                        radius={8}
                        disabled={props.watch("different_address") === "NO"}
                        error={
                          props?.errors?.consumer_address?.unit
                            ? "Required"
                            : undefined
                        }
                        label="Unit & Building"
                      />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.region"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Region",
                        props.getValues("consumer_address.region"),
                      )
                    ) : (
                      <Select
                        {...field}
                        searchable
                        radius={8}
                        disabled={props.watch("different_address") === "NO"}
                        error={
                          props?.errors?.consumer_address?.region
                            ? "Required"
                            : undefined
                        }
                        label="Region"
                        withAsterisk
                        placeholder="Select region"
                        onChange={(value) => {
                          if (value) {
                            props.setValue("consumer_address.region", value);
                            props.setValue("consumer_address.province", "");
                            props.setValue("consumer_address.city", "");
                          }
                        }}
                        data={regions.map((e: RegionProps) => {
                          return {
                            label: `${e.name} : ${e.long}`,
                            value: e.key,
                          };
                        })}
                      />
                    )
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.address1"
                  control={props.control}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Address Extension",
                        props.getValues("consumer_address.address1"),
                      )
                    ) : (
                      <TextInput
                        {...field}
                        radius={8}
                        disabled={props.watch("different_address") === "NO"}
                        label="Address Extension"
                      />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.province"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Province",
                        props.getValues("consumer_address.province"),
                      )
                    ) : (
                      <Select
                        {...field}
                        searchable
                        withAsterisk
                        radius={8}
                        error={
                          props?.errors?.consumer_address?.province
                            ? "Required"
                            : undefined
                        }
                        disabled={
                          props.watch("consumer_address.region") === "" ||
                          props.watch("different_address") === "NO"
                        }
                        label="Province"
                        placeholder="Select province"
                        onChange={(value) => {
                          if (value) {
                            props.setValue("consumer_address.province", value);
                            props.setValue("consumer_address.city", "");
                          }
                        }}
                        data={provinces
                          .filter(
                            (e: ProvinceProps) =>
                              e.region ===
                              props.watch("consumer_address.region"),
                          )
                          .map((e: ProvinceProps) => {
                            return {
                              label: `${e.name}`,
                              value: e.key,
                            };
                          })}
                      />
                    )
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.address2"
                  control={props.control}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Address Line 2",
                        props.getValues("consumer_address.address2"),
                      )
                    ) : (
                      <TextInput
                        {...field}
                        radius={8}
                        disabled={props.watch("different_address") === "NO"}
                        label="Address Line 2"
                      />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.city"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "City",
                        props.getValues("consumer_address.city"),
                      )
                    ) : (
                      <Select
                        {...field}
                        searchable
                        label="City"
                        radius={8}
                        withAsterisk
                        error={
                          props.errors?.consumer_address?.city
                            ? "Required"
                            : undefined
                        }
                        disabled={
                          props.watch("consumer_address.province") === "" ||
                          props.watch("different_address") === "NO"
                        }
                        placeholder="Select city"
                        onChange={(value) => {
                          if (value) {
                            props.setValue("consumer_address.city", value);
                          }
                        }}
                        data={cities
                          .filter(
                            (e: CityProps) =>
                              e.province ===
                              props.watch("consumer_address.province"),
                          )
                          .map((e: CityProps) => {
                            return {
                              label: `${e.name}`,
                              value: e.name,
                            };
                          })}
                      />
                    )
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.zip_code"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Zip Code",
                        props.getValues("consumer_address.zip_code"),
                      )
                    ) : (
                      <TextInput
                        {...field}
                        radius={8}
                        withAsterisk
                        disabled={props.watch("different_address") === "NO"}
                        error={
                          props?.errors?.consumer_address?.zip_code
                            ? "Required"
                            : undefined
                        }
                        label="Zip Code"
                      />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="consumer_address.barangay"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        "Barangay",
                        props.getValues("consumer_address.barangay"),
                      )
                    ) : (
                      <TextInput
                        {...field}
                        withAsterisk
                        radius={8}
                        disabled={props.watch("different_address") === "NO"}
                        error={
                          props?.errors?.consumer_address?.barangay
                            ? "Required"
                            : undefined
                        }
                        label="Barangay"
                      />
                    )
                  }
                />
              </Grid.Col>
            </Grid>
          </div>
          // : undefined
        }
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="delivery_date"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.getValues("status") !== "PENDING" ? (
                  displayView(
                    "Delivery Date",
                    dayjs(props.getValues("delivery_date")).format(
                      "MMMM DD, YYYY",
                    ),
                  )
                ) : (
                  <DatePicker
                    {...field}
                    withAsterisk
                    allowLevelChange
                    radius={8}
                    allowFreeInput
                    excludeDate={(date) =>
                      dayjs().subtract(1, "day").isAfter(date)
                    }
                    error={props.errors.delivery_date ? "Required" : undefined}
                    label="Delivery Date"
                    placeholder="Select date"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="delivery_time"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.getValues("status") !== "PENDING" ? (
                  displayView(
                    "Delivery Time",
                    dayjs(props.getValues("delivery_time")).format("hh:mm A"),
                  )
                ) : (
                  <TimeInput
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.delivery_time ? "Required" : undefined}
                    format="12"
                    label="Delivery Time"
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="feedback_date"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.getValues("status") !== "PENDING" ? (
                  displayView(
                    "Feedback Date",
                    dayjs(props.getValues("feedback_date")).format(
                      "MMMM DD, YYYY",
                    ),
                  )
                ) : (
                  <DatePicker
                    {...field}
                    withAsterisk
                    radius={8}
                    allowFreeInput
                    disabled={!props.watch("delivery_date")}
                    excludeDate={(date) =>
                      dayjs(props.watch("delivery_date")).isAfter(date)
                    }
                    error={props.errors.feedback_date ? "Required" : undefined}
                    label="Feedback Date"
                    placeholder="Select date"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="feedback_time"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.getValues("status") !== "PENDING" ? (
                  displayView(
                    "Feedback Time",
                    dayjs(props.getValues("feedback_time")).format("hh:mm A"),
                  )
                ) : (
                  <TimeInput
                    {...field}
                    radius={8}
                    withAsterisk
                    error={props.errors.feedback_time ? "Required" : undefined}
                    format="12"
                    label="Feedback Time"
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <br />
      </Stack>
    </div>
  );
};

export default CRMTrialConsumerAddress;
