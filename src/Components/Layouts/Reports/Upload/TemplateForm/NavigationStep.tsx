import React from "react";
import { Button, Group } from "../../../../Elements";
import { ChevronRight, Download, Refresh, Upload } from "tabler-icons-react";
import { Loader, Text } from "@mantine/core";
import { useUploadPortalStore } from "./Store";
import { FileWithPath } from "@mantine/dropzone";

type Props = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  onDownloadErrorReport: () => void;
  onNextValidate: (
    file: FileWithPath | undefined,
    warehouse: string | undefined
  ) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const NavigationStep = (props: Props) => {
  const {
    warehouse,
    file,
    validating,
    hasError,
    isUploading,
    date,
    setFile,
    setWarehouse,
    setS3Object,
    setHasError,
    setValidating,
    setIsUploading,
    setErrorDownloadLink,
    setRequestID,
    setDate,
  } = useUploadPortalStore();

  //Resets all the values stored.
  const onReset = () => {
    setFile(undefined);
    setWarehouse(undefined);
    setS3Object(undefined);
    setHasError(false);
    setValidating(true);
    setIsUploading(false);
    setErrorDownloadLink(undefined);
    setRequestID(undefined);
    setDate(undefined);
  };
  switch (props.active) {
    case 0:
      return (
        <Group position="right">
          <Button
            disabled={isUploading}
            onClick={() => {
              onReset();
              props.onCancel();
            }}
            customType="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={!warehouse || !file || isUploading || !date}
            onClick={() => props.onNextValidate(file, warehouse)}
            rightIcon={isUploading ? <Loader size={20} /> : <ChevronRight />}
          >
            Next: Validate File Uploaded
          </Button>
        </Group>
      );
    case 1:
      return (
        <Group position="apart">
          <Group>
            <Button
              icon={<Refresh />}
              onClick={() => {
                props.setActive(0);
                onReset();
              }}
              customType="secondary"
              disabled={validating || !hasError}
            >
              Re-upload
            </Button>
            <Text size="xs" fs="italic" lineClamp={2} c="dimmed">
              If you encounter a validation issue, please re-upload the file
            </Text>
          </Group>

          <Group>
            {hasError && (
              <Button
                onClick={props.onDownloadErrorReport}
                color="teal"
                customType="custom"
                rightIcon={<Download />}
                disabled={validating}
              >
                Download Error Report
              </Button>
            )}
            {!validating && (
              <Button
                disabled={validating || hasError}
                onClick={props.onConfirm}
              >
                Confirm
              </Button>
            )}
          </Group>
        </Group>
      );
    case 2:
      return (
        <Group position="right">
          {hasError ? (
            <Button
              onClick={() => {
                props.setActive(0);
                onReset();
              }}
              rightIcon={<Upload />}
              disabled={validating}
            >
              Re-upload Downloaded Error Report
            </Button>
          ) : (
            <Button
              disabled={validating}
              onClick={() => {
                props.setActive(3);
              }}
            >
              Complete
            </Button>
          )}
        </Group>
      );
    case 3:
      return (
        <Group position="right">
          <Button
            disabled={validating}
            onClick={() => {
              props.setActive(0);
              onReset();
            }}
            rightIcon={<Upload />}
          >
            Take Another Upload Template
          </Button>
          <Button
            disabled={validating}
            onClick={() => {
              props.onCancel();
              onReset();
            }}
            customType="secondary"
          >
            Close
          </Button>
        </Group>
      );

    default:
      return <div></div>;
  }
};
