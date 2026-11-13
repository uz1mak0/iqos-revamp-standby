import React from "react";
import { Divider, List, Paper, Stack } from "../../Elements";
import { Calendar, Check, InfoCircle } from "tabler-icons-react";
import { Button, Text } from "@mantine/core";

type LogsProps = {
  title: string;
  sub_list: string[];
};

type ChangelogProps = {
  version: string;
  date: string;
  logs: LogsProps[];
};

type Props = {
  changelog: ChangelogProps;
};
export const ChangelogCard = (props: Props) => {
  return (
    <Paper radius={10}>
      <Stack spacing={1}>
        <Divider
          label={
            <Button
              compact
              radius={20}
              size="xs"
              leftIcon={<InfoCircle strokeWidth={3} />}
              variant="light"
            >
              <Text fw={"bold"}>Version: {props.changelog.version}</Text>
            </Button>
          }
        />
        <div>
          <Button compact size="xs" leftIcon={<Calendar />} variant="subtle">
            Release Date: {props.changelog.date}
          </Button>
          <List size={"xs"} withPadding>
            {props.changelog.logs.map((item, i) => (
              <List.Item key={`item-${i}`}>
                {item.title}
                {item.sub_list.length > 0 ? (
                  <List size={"xs"}>
                    {item.sub_list.map((subItem, i) => (
                      <List.Item key={`sub${i}`}>{subItem}</List.Item>
                    ))}
                  </List>
                ) : undefined}
              </List.Item>
            ))}
          </List>
        </div>
      </Stack>
    </Paper>
  );
};
