import {
  Alert,
  Box,
  LoadingOverlay,
  Overlay,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import React, { ReactComponentElement, useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Calendar, DeviceFloppy, Pencil, X } from "tabler-icons-react";
import {
  Badge,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Switch,
} from "../../Elements";
import { IFormInput } from "../../Layouts/CRMTrials/Create/Create";
import CRMTrialConsumerAddress from "../../Layouts/CRMTrials/Create/CRMTrialConsumerAddress";
import { CRMTrialItems } from "../../Layouts/CRMTrials/Create/CRMTrialItems";
import { useStyles } from "../../Layouts/CRMTrials/crmtrials.styles";
import {
  getFeedbackSurveys,
  HypercareFormInput,
  productDislikeChoices,
} from "./Config";
import { HypercareFeedbackMoment } from "./HypercareFeedbackMoment";
import { HypercareScheduleLogs } from "./HypercareScheduleLogs";
import { CancelHypercare } from "./CancelHypercare";
import { IconAlertCircle } from "@tabler/icons-react";

type Props = {
  hypercare: HypercareFormInput | undefined;
  control: Control<IFormInput, any>;
  setValue: UseFormSetValue<IFormInput>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  errors: FieldErrors<IFormInput>;
  reset: UseFormReset<IFormInput>;
  isUpdate?: boolean;
  isLatestWeek?: boolean;
  onSave?: () => void;
};

export const HypercareWeekForm = (props: Props) => {
  const { classes } = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  const { fields: feedbackFields } = useFieldArray({
    control: props.control,
    name: "feedbacks",
  });
  const { fields: morningFields } = useFieldArray({
    control: props.control,
    name: "moments_morning",
  });
  const { fields: afternoonFields } = useFieldArray({
    control: props.control,
    name: "moments_afternoon",
  });
  const { fields: nightFields } = useFieldArray({
    control: props.control,
    name: "moments_night",
  });
  const { fields: othersFields } = useFieldArray({
    control: props.control,
    name: "moments_others",
  });

  const displayView = (description: string, value: string) => {
    return (
      <div>
        <p className={classes.notEditableDescription}>{description}</p>
        <p className={classes.notEditableValue}>
          {value == "Invalid Date" ? "N/A" : value}
        </p>
      </div>
    );
  };

  // useEffect(() => {
  //     if (props.getValues("registration_channel") && props.getValues("week") === "WEEK 1") {
  //         if (props.getValues("status") !== "PENDING" && !isEdit) {
  //             setIsEdit(false);
  //         }else{
  //             if (props.getValues("registration_channel") === "IQOS" || props.getValues("registration_channel") === "Marlboro") {
  //                 setIsEdit(false)
  //             }else{
  //                 setIsEdit(true)
  //             }
  //         }
  //     }
  // }, [props.getValues])

  const onSave = () => {
    if (!props.errors && props.onSave) {
      console.log("TEST");
      props?.onSave();
      setTimeout(() => {
        setIsEdit(false);
      }, 1000);
    } else {
      console.log("TEST 2", props.errors);
    }
  };

  const onEdit = (value: boolean) => {
    if (value) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
      props.reset();
    }
  };

  const noOption = () => (
    <Controller
      name="not_interested_to_zyn"
      control={props.control}
      rules={{ required: props.watch().interested_to_zyn === "NO" }}
      render={({ field }) =>
        props.getValues("status") !== "PENDING" && !isEdit ? (
          displayView(
            "Thank you very much for your participation, if i may ask, what made you want to stop using this product?",
            props.getValues("not_interested_to_zyn") || "",
          )
        ) : (
          <Select
            {...field}
            radius={8}
            error={props.errors.not_interested_to_zyn ? "Required" : undefined}
            label="Thank you very much for your participation, if i may ask, what made you want to stop using this product?"
            data={productDislikeChoices.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
          />
        )
      }
    />
  );

  return (
    <Paper radius={10}>
      <div style={{ width: 400, position: "absolute" }}>
        <LoadingOverlay visible={true} />
      </div>
      <Stack>
        <Group align="center" position="apart">
          <h3>{"Trial Information"}</h3>
          <Group>
            {props.isLatestWeek && props.getValues("status") === "ABANDONED" ? (
              <Switch
                onChange={(e) => onEdit(e.target.checked)}
                size="lg"
                onLabel="Edit"
                offLabel="Edit"
              />
            ) : undefined}
            <HypercareScheduleLogs logs={props.watch("schedule_logs")} />
          </Group>
        </Group>
        <Divider />
        {isEdit ? (
          <Alert color={"cyan"} icon={<IconAlertCircle />}>
            <span>
              {" "}
              Reopening <Badge color="red">ABANDONED</Badge> transactions must
              be <Badge>RESCHEDULE</Badge> first.{" "}
            </span>
          </Alert>
        ) : undefined}

        <Controller
          name="call_info.answered_call"
          control={props.control}
          rules={{ required: true }}
          render={({ field }) =>
            props.getValues("status") !== "PENDING" && !isEdit ? (
              displayView(
                "Consumer answered the call?",
                props.getValues("call_info.answered_call") || "",
              )
            ) : (
              <Radio.Group
                {...field}
                error={
                  props.errors.call_info?.answered_call ? "Required" : undefined
                }
                label={"Consumer answered the call?"}
              >
                <Radio
                  disabled={isEdit && props.getValues("status") === "ABANDONED"}
                  value={"YES"}
                  label="Yes"
                />
                <Radio
                  disabled={
                    ((props.getValues("registration_channel") === "IQOS" ||
                      props.getValues("registration_channel") === "Marlboro") &&
                      props.watch("week") == "WEEK 1") ||
                    (isEdit && props.getValues("status") === "ABANDONED")
                  }
                  value={"NO"}
                  label="No"
                />
              </Radio.Group>
            )
          }
        />
        {props.watch("call_info.answered_call") === undefined ||
        props.watch("call_info.answered_call") === null ? undefined : (
          <div>
            <Grid>
              {props.watch("call_info.answered_call") === "YES" ? undefined : (
                <>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.status"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "If No, Status?",
                            props.getValues("call_info.status") || "",
                          )
                        ) : (
                          <Select
                            {...field}
                            radius={8}
                            error={
                              props.errors.call_info?.status
                                ? "Required"
                                : undefined
                            }
                            label="If No, Status?"
                            data={[
                              { value: "ABANDONED", label: "Abandoned" },
                              {
                                value: "RESCHEDULE",
                                label: `Reschedule (Call Attempted: ${
                                  props
                                    .getValues("schedule_logs")
                                    ?.filter((e) => e.reason === "RESCHEDULE")
                                    .length || 0
                                })`,
                              },
                              { value: "OTHERS", label: "Others" },
                            ]}
                          />
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.reschedule_date"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "Schedule Date",
                            dayjs(
                              props.getValues("call_info.reschedule_date"),
                            ).format("MMMM DD, YYYY"),
                          )
                        ) : (
                          <DatePicker
                            {...field}
                            allowFreeInput
                            excludeDate={(date) =>
                              dayjs().subtract(1, "day").isAfter(date)
                            }
                            error={
                              props.errors.call_info?.reschedule_date
                                ? "Required"
                                : undefined
                            }
                            label="Schedule Date"
                            placeholder="Select date"
                          />
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.reschedule_time"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "Schedule Time",
                            dayjs(
                              props.getValues("call_info.reschedule_time"),
                            ).format("hh:mm A"),
                          )
                        ) : (
                          <TimeInput
                            {...field}
                            error={
                              props.errors.call_info?.reschedule_time
                                ? "Required"
                                : undefined
                            }
                            format="12"
                            label="Schedule Time"
                          />
                        )
                      }
                    />
                  </Grid.Col>
                </>
              )}
            </Grid>
            {props.watch("call_info.answered_call") === "YES" ? (
              <Controller
                name="call_info.has_time"
                control={props.control}
                rules={{ required: true }}
                render={({ field }) =>
                  props.getValues("status") !== "PENDING" && !isEdit ? (
                    displayView(
                      "Consumer has time? If No, Set Another Schedule",
                      props.getValues("call_info.has_time"),
                    )
                  ) : (
                    <Radio.Group
                      {...field}
                      error={
                        props.errors.call_info?.has_time
                          ? "Required"
                          : undefined
                      }
                      label={"Consumer has time? If No, Set Another Schedule"}
                    >
                      <Radio
                        disabled={
                          isEdit && props.getValues("status") === "ABANDONED"
                        }
                        value={"YES"}
                        label="Yes"
                      />
                      <Radio
                        disabled={
                          ((props.getValues("registration_channel") ===
                            "IQOS" ||
                            props.getValues("registration_channel") ===
                              "Marlboro") &&
                            props.watch("week") == "WEEK 1") ||
                          (isEdit && props.getValues("status") === "ABANDONED")
                        }
                        value={"NO"}
                        label="No"
                      />
                    </Radio.Group>
                  )
                }
              />
            ) : undefined}
            {props.watch("call_info.has_time") === "NO" &&
            props.watch("call_info.answered_call") === "YES" ? (
              <Grid>
                <>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.status"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "If No, Status?",
                            props.getValues("call_info.status") || "",
                          )
                        ) : (
                          <Select
                            {...field}
                            radius={8}
                            error={
                              props.errors.call_info?.status
                                ? "Required"
                                : undefined
                            }
                            label="If No, Status?"
                            data={[
                              { value: "ABANDONED", label: "Abandoned" },
                              { value: "RESCHEDULE", label: "Reschedule" },
                              { value: "OTHERS", label: "Others" },
                            ]}
                          />
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.reschedule_date"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "Schedule Date",
                            dayjs(
                              props.getValues("call_info.reschedule_date"),
                            ).format("MMMM DD, YYYY"),
                          )
                        ) : (
                          <DatePicker
                            {...field}
                            allowFreeInput
                            excludeDate={(date) =>
                              dayjs().subtract(1, "day").isAfter(date)
                            }
                            error={
                              props.errors.call_info?.reschedule_date
                                ? "Required"
                                : undefined
                            }
                            label="Schedule Date"
                            placeholder="Select date"
                          />
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Controller
                      name="call_info.reschedule_time"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "Schedule Time",
                            dayjs(
                              props.getValues("call_info.reschedule_time"),
                            ).format("hh:mm A"),
                          )
                        ) : (
                          <TimeInput
                            {...field}
                            error={
                              props.errors.call_info?.reschedule_time
                                ? "Required"
                                : undefined
                            }
                            format="12"
                            label="Schedule Time"
                          />
                        )
                      }
                    />
                  </Grid.Col>
                </>
              </Grid>
            ) : undefined}
            {props.watch("call_info.has_time") === "YES" &&
            props.watch("call_info.answered_call") === "YES" ? (
              <div>
                <Controller
                  name="continue_feedback"
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" && !isEdit ? (
                      displayView(
                        "Consumer willing to continue and capture feedback?",
                        props.getValues("continue_feedback"),
                      )
                    ) : (
                      <Radio.Group
                        {...field}
                        error={
                          props.errors.continue_feedback
                            ? "Required"
                            : undefined
                        }
                        label={
                          "Consumer willing to continue and capture feedback?"
                        }
                      >
                        <Radio value={"YES"} label="Yes" />
                        <Radio
                          disabled={
                            (props.getValues("registration_channel") ===
                              "IQOS" ||
                              props.getValues("registration_channel") ===
                                "Marlboro") &&
                            props.getValues("week") == "WEEK 1"
                          }
                          value={"NO"}
                          label="No"
                        />
                      </Radio.Group>
                    )
                  }
                />
                {props.watch("continue_feedback") === "YES" ? (
                  <div>
                    <Divider label={<h2>Feedback Survey</h2>}></Divider>
                    <Stack>
                      {feedbackFields.map((feedback, i) => (
                        <Controller
                          name={`feedbacks.${i}.response`}
                          control={props.control}
                          rules={{ required: true }}
                          key={`controller-${i}`}
                          render={({ field }) =>
                            props.getValues("status") !== "PENDING" &&
                            !isEdit ? (
                              displayView(
                                feedback.title,
                                props.getValues(`feedbacks.${i}.response`) ||
                                  "",
                              )
                            ) : (
                              <Select
                                {...field}
                                radius={8}
                                key={`feedback-${i}`}
                                withAsterisk
                                error={
                                  props?.errors?.feedbacks &&
                                  props?.errors?.feedbacks[i]?.response
                                    ? "Required"
                                    : undefined
                                }
                                label={`${i + 1}) ${feedback.title}`}
                                data={feedback?.selections?.map((item) => {
                                  return {
                                    label: item,
                                    value: item,
                                  };
                                })}
                              />
                            )
                          }
                        />
                      ))}
                      <HypercareFeedbackMoment
                        fields={{
                          morning: morningFields,
                          afternoon: afternoonFields,
                          night: nightFields,
                          others: othersFields,
                        }}
                        isEdit={isEdit}
                        isUpdate={props.isUpdate}
                        control={props.control}
                        getValues={props.getValues}
                        watch={props.watch}
                      />
                    </Stack>
                    <Controller
                      name="interested_to_zyn"
                      control={props.control}
                      rules={{ required: true }}
                      render={({ field }) =>
                        props.getValues("status") !== "PENDING" && !isEdit ? (
                          displayView(
                            "Interested to keep using Zyn?",
                            props.getValues("interested_to_zyn"),
                          )
                        ) : (
                          <Radio.Group
                            {...field}
                            error={
                              props.errors.interested_to_zyn
                                ? "Required"
                                : undefined
                            }
                            label={"Interested to keep using Zyn?"}
                          >
                            <Radio value={"YES"} label="Yes" />
                            <Radio value={"NO"} label="No" />
                          </Radio.Group>
                        )
                      }
                    />
                    <br />
                    {props.watch("interested_to_zyn") === "YES" &&
                    props.watch("week") !== "WEEK 16" ? (
                      <div>
                        <Divider
                          label={<h2>Extended Adoption Survey</h2>}
                        ></Divider>
                        <Controller
                          name="extended_adoption"
                          control={props.control}
                          rules={{ required: true }}
                          render={({ field }) =>
                            props.getValues("status") !== "PENDING" &&
                            !isEdit ? (
                              displayView(
                                "Interested in Extended Adoption Survey?",
                                props.getValues("extended_adoption"),
                              )
                            ) : (
                              <Radio.Group
                                {...field}
                                error={
                                  props.errors.extended_adoption
                                    ? "Required"
                                    : undefined
                                }
                                label={
                                  "Interested in Extended Adoption Survey?"
                                }
                              >
                                <Radio value={"YES"} label="Yes" />
                                <Radio value={"NO"} label="No" />
                              </Radio.Group>
                            )
                          }
                        />
                      </div>
                    ) : undefined}
                    {props.watch("week") !== "WEEK 16" &&
                    props.watch("extended_adoption") === "YES" &&
                    props.watch("interested_to_zyn") === "YES" &&
                    props.watch("call_info.has_time") === "YES" &&
                    props.watch("call_info.answered_call") === "YES" ? (
                      <div>
                        <CRMTrialConsumerAddress
                          control={props.control}
                          setValue={props.setValue}
                          getValues={props.getValues}
                          watch={props.watch}
                          errors={props.errors}
                          isUpdate={props.isUpdate}
                          isEdit={isEdit}
                        />
                        <CRMTrialItems
                          control={props.control}
                          setValue={props.setValue}
                          getValues={props.getValues}
                          watch={props.watch}
                          errors={props.errors}
                          reset={props.reset}
                          isUpdate={props.isUpdate}
                          isEdit={isEdit}
                        />
                      </div>
                    ) : props.watch("week") !== "WEEK 16" ? (
                      noOption()
                    ) : undefined}
                  </div>
                ) : (
                  noOption()
                )}
              </div>
            ) : undefined}
          </div>
        )}

        {(props.isUpdate && props.getValues("status") == "PENDING") ||
        isEdit ? (
          <Group position="center" justify="cemter" align="center">
            <CancelHypercare onCancel={() => props.reset()} />
            <div data-testid={"TEST-SUBMIT-HYPERCARE"}>
              <Button
                type="submit"
                icon={<DeviceFloppy />}
                onClick={() => {
                  onSave();
                }}
              >
                Submit
              </Button>
            </div>
          </Group>
        ) : undefined}
      </Stack>
    </Paper>
  );
};
