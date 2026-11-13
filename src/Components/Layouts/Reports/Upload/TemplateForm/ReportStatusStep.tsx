import React, { useEffect, useState } from "react";
import { Alert, Center, Flex, RingProgress, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconChecklist,
  IconDiscountCheck,
} from "@tabler/icons-react";
import { Stack } from "../../../../Elements";
import { useUploadPortalStore } from "./Store";

type Props = {
  isDownloadReport?: boolean;
};

export const ReportStatusStep = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { errorDownloadLink } = useUploadPortalStore();

  useEffect(() => {
    if (props.isDownloadReport) {
      setIsLoading(true);
      setTimeout(() => {
        window.open(errorDownloadLink, "_blank");
        setIsLoading(false);
      }, 2000);
    }
  }, [props.isDownloadReport]);

  if (props.isDownloadReport)
    return (
      <Stack>
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <RingProgress
            size={200}
            thickness={12}
            roundCaps
            sections={[{ value: isLoading ? 75 : 100, color: "teal" }]}
            label={
              isLoading ? (
                <Text weight={700} align="center" size="xl">
                  Loading...
                </Text>
              ) : (
                <Center>
                  <IconChecklist stroke={2} color="#12B886" size={80} />
                </Center>
              )
            }
          />
          <Text fw={700}>
            {isLoading
              ? `Downloading your error report... Please wait`
              : `Download Error Report Succuessfully!`}
          </Text>
        </Flex>
        {!isLoading && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="yellow"
            title="ACTION NEEDED"
          >
            <Text color="black">
              To proceed with resolving the issues, please re-upload the error
              report file from the validation.
            </Text>
          </Alert>
        )}
      </Stack>
    );

  return (
    <div>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <RingProgress
          size={200}
          thickness={12}
          roundCaps
          sections={[{ value: 100, color: "teal" }]}
          label={
            <Center>
              <IconCheck stroke={3} color="#12B886" size={80} />
            </Center>
          }
        />
        <Stack spacing={1}>
          <Text fw={700}>
            Congratulations! No errors found during file validation
          </Text>
          <Text align="center" fz={"xs"} c="dimmed">
            A sales transation record has been created from the validated file.
          </Text>
        </Stack>
      </Flex>
    </div>
  );
};
