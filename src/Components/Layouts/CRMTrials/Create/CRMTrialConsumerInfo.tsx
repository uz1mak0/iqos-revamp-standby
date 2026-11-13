import { Select, TextInput } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { DeviceFloppy, Pencil, X } from "tabler-icons-react";
import { Button, Divider, Grid, Group, Paper, Stack } from "../../../Elements";
import { useStyles } from "../crmtrials.styles";
import { IFormInput } from "./Create";

type Props = {
  control: Control<IFormInput, any>;
  setValue: UseFormSetValue<IFormInput>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  errors: FieldErrors<IFormInput>;
  isUpdate?: boolean;
};

const CRMTrialConsumerInfo = (props: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const { classes } = useStyles();

  const displayView = (
    description: string,
    value: string | undefined | null,
  ) => {
    return (
      <div>
        <p className={classes.notEditableDescription}>{description}</p>
        <p className={classes.notEditableValue}>
          {value === "null" ? "N/A" : value}
        </p>
      </div>
    );
  };
  const onUpdateTrial = () => {};

  console.log(dayjs().format("YYYY"));
  return (
    <Paper radius={10}>
      <Stack>
        <Grid align="center" justify="space-between">
          <Grid.Col span={10}>
            <Divider label={<h2>{"Consumer Information"}</h2>}></Divider>
          </Grid.Col>
          <Grid.Col span={2}>
            {/* {
                        props.isUpdate ? 
                            <Group position='right'>
                                {isEdit  ? <Button customType='secondary' icon={<X/>} onClick={() => setIsEdit(false)}>Cancel</Button> : undefined}
                                {isEdit ? <Button icon={<DeviceFloppy/>} onClick={() => setIsEdit(true)}>Save</Button> : undefined}
                                {isEdit  ? undefined : <Button customType='custom' color={'orange'} icon={<Pencil/>} onClick={() => setIsEdit(true)}>Edit</Button>}
                            </Group>
                    : undefined
                    } */}
          </Grid.Col>
        </Grid>
        <Controller
          name="customer_id"
          control={props.control}
          rules={{ required: true }}
          render={({ field }) =>
            props.isUpdate && !isEdit ? (
              displayView("Customer ID", props.getValues("customer_id"))
            ) : (
              <TextInput
                {...field}
                disabled={process.env.NEXT_PUBLIC_PLATFORM !== "test"}
                withAsterisk
                radius={8}
                error={props.errors.customer_id ? "Required" : undefined}
                label="Consumer ID"
              />
            )
          }
        />
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="first_name"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView("First Name", props.getValues("first_name"))
                ) : (
                  <TextInput
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.first_name ? "Required" : undefined}
                    label="First Name"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="last_name"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView("Last Name", props.getValues("last_name"))
                ) : (
                  <TextInput
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.last_name ? "Required" : undefined}
                    label="Last Name"
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="date_of_birth"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Birth Date",
                    dayjs(props.getValues("date_of_birth")).format(
                      "MMMM DD, YYYY",
                    ),
                  )
                ) : (
                  <DatePicker
                    {...field}
                    withAsterisk
                    allowFreeInput
                    radius={8}
                    excludeDate={(date) =>
                      Number(dayjs().format("YYYY")) -
                        Number(dayjs(date).format("YYYY")) <
                      18
                    }
                    onChange={(date) => {
                      props.setValue("date_of_birth", date);
                      props.setValue(
                        "age",
                        date ? dayjs().diff(date, "years") : 0,
                      );
                    }}
                    error={props.errors.date_of_birth ? "Required" : undefined}
                    label="Birth Date"
                    placeholder="Pick birth date"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="age"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Legal Age Declaration",
                    `${props.getValues("age")}`,
                  )
                ) : (
                  <TextInput
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.age ? "Required" : undefined}
                    label="Legal Age Declaration"
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="contact_no"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView("Contact No.", props.getValues("contact_no"))
                ) : (
                  <TextInput
                    {...field}
                    withAsterisk
                    radius={8}
                    type="number"
                    placeholder="9xxxxxxxxx"
                    icon="+63"
                    error={props.errors.contact_no ? "Required" : undefined}
                    label="Contact No."
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="gender"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView("Gender", props.getValues("gender") || "")
                ) : (
                  <Select
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.gender ? "Required" : undefined}
                    label="Gender"
                    data={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="email"
              control={props.control}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView("Email", props.getValues("email") || "")
                ) : (
                  <TextInput
                    {...field}
                    radius={8}
                    error={props.errors.email ? "Required" : undefined}
                    label="Email"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="primary_nicotine_product"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Primary Nicotine Product",
                    props.getValues("primary_nicotine_product") || "",
                  )
                ) : (
                  <Select
                    {...field}
                    radius={8}
                    withAsterisk
                    error={
                      props.errors.primary_nicotine_product
                        ? "Required"
                        : undefined
                    }
                    label="Primary Nicotine Product"
                    data={[
                      { value: "CC", label: "CC" },
                      { value: "Vape", label: "Vape" },
                      { value: "HnB", label: "HnB" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="marketing_opt_in"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Marketing Opt-in",
                    props.getValues("marketing_opt_in") || "",
                  )
                ) : (
                  <Select
                    {...field}
                    withAsterisk
                    radius={8}
                    error={
                      props.errors.marketing_opt_in ? "Required" : undefined
                    }
                    label="Marketing Opt-in"
                    data={[
                      { value: "AGREE", label: "AGREE" },
                      { value: "DISAGREE", label: "DISAGREE" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="privacy_notice"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Privacy Notice",
                    props.getValues("privacy_notice") || "",
                  )
                ) : (
                  <Select
                    {...field}
                    withAsterisk
                    radius={8}
                    error={props.errors.privacy_notice ? "Required" : undefined}
                    label="Privacy Notice"
                    data={[
                      { value: "AGREE", label: "AGREE" },
                      { value: "DISAGREE", label: "DISAGREE" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="registration_channel"
              control={props.control}
              rules={{ required: true }}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Registration Channel/Source",
                    props.getValues("registration_channel") || "",
                  )
                ) : (
                  <Select
                    {...field}
                    withAsterisk
                    radius={8}
                    error={
                      props.errors.registration_channel ? "Required" : undefined
                    }
                    label="Registration Channel/Source"
                    data={[
                      { value: "IQOS", label: "IQOS" },
                      { value: "Marlboro", label: "Marlboro" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="discontinue_reason"
              control={props.control}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "Reason why don't want to continue?",
                    props.getValues("discontinue_reason") || "",
                  )
                ) : (
                  <Select
                    {...field}
                    disabled
                    radius={8}
                    label="Reason why don't want to continue"
                    data={[
                      { value: "IQOS", label: "IQOS" },
                      { value: "Marlboro", label: "Marlboro" },
                    ]}
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={6}>
            <Controller
              name="gt_date"
              control={props.control}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "GT Date",
                    props.getValues("gt_date")
                      ? dayjs(props.getValues("gt_date")).format(
                          "MMMM DD, YYYY",
                        )
                      : "N/A",
                  )
                ) : (
                  <DatePicker
                    {...field}
                    disabled
                    radius={8}
                    allowFreeInput
                    label="GT Date"
                  />
                )
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name="gt_time"
              control={props.control}
              render={({ field }) =>
                props.isUpdate && !isEdit ? (
                  displayView(
                    "GT Time",
                    props.getValues("gt_time")
                      ? dayjs(props.getValues("gt_time")).format("hh:mm A")
                      : "N/A",
                  )
                ) : (
                  <TimeInput
                    {...field}
                    disabled
                    format="12"
                    radius={8}
                    label="GT Time"
                  />
                )
              }
            />
          </Grid.Col>
        </Grid>
        <br />
      </Stack>
    </Paper>
  );
};

export default CRMTrialConsumerInfo;
