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
  onNextValidate: (files: FileWithPath[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const NavigationBtns = (props: Props) => {
  const {
    files,
    validating,
    hasError,
    isUploading,
    setFiles,
    setS3Objects,
    setHasError,
    setValidating,
    setIsUploading,
    setErrorDownloadLink,
    setRequestID,
    setDate,
  } = useUploadPortalStore();

  // Reset all states
  const onReset = () => {
    setFiles([]);
    setS3Objects([]);
    setHasError(false);
    setValidating(true);
    setIsUploading(false);
    setErrorDownloadLink(undefined);
    setRequestID(undefined);
    setDate(undefined);
  };

  switch (props.active) {
    case 0: // Step 1: Upload
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
            disabled={files.length === 0 || isUploading}
            onClick={() => props.onNextValidate(files)}
            rightIcon={isUploading ? <Loader size={20} /> : <ChevronRight />}
          >
            Next: Upload CVs
          </Button>
        </Group>
      );

    case 3: // Step 4: Finished
      return (
        <Group position="right">
          <Button
            onClick={() => {
              props.setActive(0);
              onReset();
            }}
            rightIcon={<Upload />}
          >
            Take Another Upload CVs
          </Button>
          <Button
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
