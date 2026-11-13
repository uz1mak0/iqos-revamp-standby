import { Radio, TextInput } from "@mantine/core";
import React, { useState } from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";
import {
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
} from "../../Elements";
import { IFormInput } from "../../Layouts/CRMTrials/Create/Create";
import { useStyles } from "../../Layouts/CRMTrials/crmtrials.styles";

type MomentFields = {
  morning: FieldArrayWithId<IFormInput, "moments_morning", "id">[];
  afternoon: FieldArrayWithId<IFormInput, "moments_afternoon", "id">[];
  night: FieldArrayWithId<IFormInput, "moments_night", "id">[];
  others: FieldArrayWithId<IFormInput, "moments_others", "id">[];
};

type Props = {
  fields: MomentFields;
  control: Control<IFormInput, any>;
  getValues: UseFormGetValues<IFormInput>;
  watch: UseFormWatch<IFormInput>;
  isEdit: boolean;
  isUpdate: boolean | undefined;
};

export const HypercareFeedbackMoment = (props: Props) => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);

  const displayView = (description: string, value: string) => {
    return (
      <Group>
        {/* <p className={classes.notEditableDescription}>{description}</p> */}
        <p className={classes.notEditableValue}>
          {value == "Invalid Date" ? "N/A" : value}
        </p>
      </Group>
    );
  };

  const modalView = () => (
    <Modal
      size={1100}
      title="Moments Questions"
      onClose={() => setVisible(false)}
      opened={visible}
    >
      <Paper radius={10}>
        <Grid>
          <Grid.Col span={4}>
            <span>
              7a) Which occasions/moments/times of the day do you typically use
              this product?
            </span>
          </Grid.Col>
          <Grid.Col span={8}>
            <span>{`7b) [Ask for each NP moment], during your usage of this product [mention moment], did this replace your usual nicotine/tobacco product or this is a new/different moment/occasion/time for this product only?`}</span>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper radius={10}>
        <Divider label={<h3>Morning</h3>}></Divider>
        <Stack>
          {props.fields.morning.map((moment, i) => (
            <Grid align="center" key={`morning-${i}`}>
              <Grid.Col span={4}>
                <span>{moment.title.replace("(MORNING)", "")}</span>
              </Grid.Col>
              <Grid.Col span={8}>
                <Controller
                  name={`moments_morning.${i}.response`}
                  control={props.control}
                  rules={{ required: true }}
                  key={`morning-${i}`}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        moment.title,
                        props.getValues(`moments_morning.${i}.response`) || "",
                      )
                    ) : (
                      <Radio.Group {...field}>
                        {moment.selections.map((item) => (
                          <Radio
                            key={`morning-${item}`}
                            value={item}
                            label={
                              <p data-testid={`morning-${item}`}>{item}</p>
                            }
                          />
                        ))}
                      </Radio.Group>
                    )
                  }
                />
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      </Paper>
      <Paper radius={10}>
        <Divider label={<h3>Afternoon</h3>}></Divider>
        <Stack>
          {props.fields.afternoon.map((moment, i) => (
            <Grid key={`afternoon-${i}`}>
              <Grid.Col span={4}>
                <span>{moment.title.replace("(AFTERNOON)", "")}</span>
              </Grid.Col>
              <Grid.Col span={8}>
                <Controller
                  name={`moments_afternoon.${i}.response`}
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        moment.title,
                        props.getValues(`moments_afternoon.${i}.response`) ||
                          "",
                      )
                    ) : (
                      <Radio.Group {...field}>
                        {moment.selections.map((item) => (
                          <Radio
                            key={`afternoon-${item}`}
                            value={item}
                            label={
                              <p data-testid={`afternoon-${item}`}>{item}</p>
                            }
                          />
                        ))}
                      </Radio.Group>
                    )
                  }
                />
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      </Paper>
      <Paper radius={10}>
        <Divider label={<h3>Night</h3>}></Divider>
        <Stack>
          {props.fields.night.map((moment, i) => (
            <Grid key={`afternoon-${i}`}>
              <Grid.Col span={4}>
                <span>{moment.title.replace("(NIGHT)", "")}</span>
              </Grid.Col>
              <Grid.Col span={8}>
                <Controller
                  name={`moments_night.${i}.response`}
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        moment.title,
                        props.getValues(`moments_night.${i}.response`) || "",
                      )
                    ) : (
                      <Radio.Group {...field}>
                        {moment.selections.map((item) => (
                          <Radio
                            key={`night-${item}`}
                            value={item}
                            label={<p data-testid={`night-${item}`}>{item}</p>}
                          />
                        ))}
                      </Radio.Group>
                    )
                  }
                />
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      </Paper>
      <Paper radius={10}>
        <Divider label={<h3>Others</h3>}></Divider>
        <Stack>
          {props.fields.others.map((moment, i) => (
            <Grid key={`others-${i}`}>
              <Grid.Col span={4}>
                <Controller
                  name={`moments_others.${i}.title`}
                  control={props.control}
                  rules={{ required: true }}
                  defaultValue=""
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        moment.title,
                        props.getValues(`moments_others.${i}.title`) || "",
                      )
                    ) : (
                      <TextInput {...field} radius={8} />
                    )
                  }
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <Controller
                  name={`moments_others.${i}.response`}
                  control={props.control}
                  rules={{ required: true }}
                  render={({ field }) =>
                    props.getValues("status") !== "PENDING" ? (
                      displayView(
                        moment.title,
                        props.getValues(`moments_others.${i}.response`) || "",
                      )
                    ) : (
                      <Radio.Group {...field}>
                        {moment.selections.map((item) => (
                          <Radio
                            key={`others-${item}`}
                            value={item}
                            label={item}
                          />
                        ))}
                      </Radio.Group>
                    )
                  }
                />
              </Grid.Col>
            </Grid>
          ))}
          <Group position="center">
            {props.getValues("status") === "PENDING" ? (
              <Button onClick={() => setVisible(false)}>Save Moments</Button>
            ) : undefined}
          </Group>
        </Stack>
      </Paper>
    </Modal>
  );

  return (
    <div>
      {modalView()}
      <p
        className={classes.notEditableDescription}
      >{`${"7) Questions for a-b"}`}</p>
      <div style={{ margin: 20 }}>
        <Button onClick={() => setVisible(true)}>Fill the Moments</Button>
      </div>
    </div>
  );
};
