import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "tabler-icons-react";
import { ActionIcon, Grid, Group, Modal, Paper } from "../../Elements";

type Props = {
  onSelectDate: (date: string) => void;
};

export const CalendarNavgation = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("MMMM DD, YYYY"),
  );
  const [visible, setVisible] = useState(false);

  const onSelectDate = (date: Date | null) => {
    setSelectedDate(dayjs(date).format("MMMM DD, YYYY"));
    props.onSelectDate(dayjs(date).format("YYYY-MM-DD"));
    setVisible(false);
  };

  const onNavigateDate = (navigate: string) => {
    var updateDate;
    if (navigate === "left") {
      updateDate = dayjs(selectedDate)
        .subtract(1, "day")
        .format("MMMM DD, YYYY");
    } else {
      updateDate = dayjs(selectedDate).add(1, "day").format("MMMM DD, YYYY");
    }
    setSelectedDate(updateDate);
    props.onSelectDate(dayjs(updateDate, "MMMM DD, YYYY").format("YYYY-MM-DD"));
  };
  return (
    <div>
      <Modal
        centered
        opened={visible}
        title="Select Date"
        size={300}
        onClose={() => setVisible(false)}
      >
        <Calendar
          initialMonth={dayjs(selectedDate).toDate()}
          value={dayjs(selectedDate).toDate()}
          onChange={(date) => onSelectDate(date)}
        />
      </Modal>
      <Paper radius={10}>
        <Grid align="center" justify="center">
          <Grid.Col span={"content"}>
            <div data-testid={"nav-left"}>
              <ActionIcon
                onClick={() => onNavigateDate("left")}
                size={"xl"}
                radius={20}
                variant="filled"
              >
                <ArrowLeft />
              </ActionIcon>
            </div>
          </Grid.Col>
          <Grid.Col onClick={() => setVisible(true)} span={10}>
            <Group position="center">
              <h2>{`Today's Schedule - ${selectedDate}`}</h2>
            </Group>
          </Grid.Col>
          <Grid.Col span={"content"}>
            <div data-testid={"nav-right"}>
              <ActionIcon
                onClick={() => onNavigateDate("right")}
                size={"xl"}
                radius={20}
                variant="filled"
              >
                <ArrowRight />
              </ActionIcon>
            </div>
          </Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
};
