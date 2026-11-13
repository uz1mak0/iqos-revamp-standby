import { Stack, Group, Text, Loader } from "@mantine/core";

export const LoadingUpload = () => {
  return (
    <Stack spacing="xl" align="center">
      <Group spacing="sm" align="center">
        <Loader size={30} />
        <Text fz="lg" c="teal" fw={700}>
          Uploading, please wait...
        </Text>
      </Group>

      <Text fz="xs" c="dimmed" align="center">
        Please do not leave this page while the validation process is ongoing
      </Text>
    </Stack>
  );
};
