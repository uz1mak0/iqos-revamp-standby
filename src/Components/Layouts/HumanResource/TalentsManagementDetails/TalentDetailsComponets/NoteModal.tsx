import { useState } from "react";
import { HR } from "../../../../../GraphQL";
import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Modal,
  Badge,
  Divider,
} from "../../../../Elements";
import { Notebook } from "tabler-icons-react";

type Props = {
  candidate?: HR.Maybe<HR.Talent>;
};

export const NoteModal = ({ candidate }: Props) => {
  const [opened, setOpened] = useState(false);
  const remarks = candidate?.remarks || [];
  return (
    <>
      <Button icon={<Notebook />} radius="md" onClick={() => setOpened(true)}>
        View Notes
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Candidate Notes"
        size="lg"
        centered
      >
        <Stack>
          <Text>Name: {candidate?.details?.name?.replace("_", " ")}</Text>

          {remarks.length === 0 && (
            <Text size="sm" color="dimmed">
              No remarks available.
            </Text>
          )}

          {remarks.map((item, index) => {
            return (
              <Paper key={index} withBorder>
                <Stack spacing={4}>
                  <Group position="apart">
                    <Text size="sm">Remark by: {item?.remark_by || "-"}</Text>
                    <Badge>{item?.interview_stage?.replace("_", " ")}</Badge>
                  </Group>

                  <Text size="sm">
                    {(item?.remark ?? "").split("\n").map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </Text>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Modal>
    </>
  );
};
