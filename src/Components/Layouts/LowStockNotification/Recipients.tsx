import React from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  TextInput,
  Switch,
  Group,
  ActionIcon,
  Title,
  Text,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { Button, Paper } from "../../Elements";
import { Plus } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";

type Props = {
  form: UseFormReturnType<
    {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    },
    (values: {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }) => {
      thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
      recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
    }
  >;
};

export const Recipients = ({ form }: Props) => {
  const fields = (form.values.recipients || []).map((item, index) => (
    <Group key={`recipient-${index}`} mt="xs">
      <TextInput
        placeholder="Enter email address"
        type="email"
        withAsterisk
        sx={{ flex: 1 }}
        value={item || ""}
        onChange={(event) => {
          const newRecipients = [...(form.values.recipients || [])];
          newRecipients[index] = event.currentTarget.value;
          form.setValues({ ...form.values, recipients: newRecipients });
        }}
      />

      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("recipients", index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));

  return (
    <Paper radius={8}>
      <Title order={3}>Recipients</Title>
      {fields.length ? (
        fields
      ) : (
        <Group position="center">
          <Text c={"dimmed"}>No recipients added</Text>
        </Group>
      )}
      <Group position="center" mt="md">
        <Button
          icon={<Plus />}
          onClick={() => form.insertListItem("recipients", "")}
        >
          Add recipients
        </Button>
      </Group>
    </Paper>
  );
};
