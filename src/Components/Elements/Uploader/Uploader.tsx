import React, { useState } from "react";
import {
  Text,
  Group,
  Button,
  Stack,
  Badge,
  ThemeIcon,
  Transition,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { IconPlus, IconTrash, IconX, IconFiles } from "@tabler/icons-react";
import { ImagePreview } from "./ImagePreview";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  uploadText?: string;
  defaultImages?: FileWithPath[];
  onSave: (files: FileWithPath[]) => void;
  onRemove?: () => void;
  maxFiles?: number;
  removeActionButtons?: boolean;
  accept?: string[] | undefined;
  disabled?: boolean;
  renderFileIcon?: (file: FileWithPath) => React.ReactNode;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

type FileSummaryBarProps = {
  files: FileWithPath[];
  disabled?: boolean;
  onClear: () => void;
};

const FileSummaryBar = ({ files, disabled, onClear }: FileSummaryBarProps) => {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <Transition
      mounted={files.length > 0}
      transition="slide-down"
      duration={250}
      timingFunction="ease"
    >
      {(styles) => (
        <Group
          position="apart"
          px="md"
          py="xs"
          style={{
            ...styles,
            borderRadius: 10,
            background: "rgba(18, 184, 134, 0.08)",
            border: "1px solid rgba(18, 184, 134, 0.25)",
          }}
        >
          <Group spacing="sm">
            <ThemeIcon variant="light" color="teal" radius="md" size="lg">
              <IconFiles size={18} />
            </ThemeIcon>
            <Text size="sm" weight={600}>
              {files.length} {files.length === 1 ? "file" : "files"} uploaded
            </Text>
          </Group>

          <Group spacing="xs">
            <Badge variant="light" color="teal" size="lg">
              {formatSize(totalBytes)} total
            </Badge>
            {!disabled && (
              <Button
                variant="subtle"
                color="red"
                size="xs"
                compact
                leftIcon={<IconTrash size={14} />}
                onClick={onClear}
              >
                Clear all
              </Button>
            )}
          </Group>
        </Group>
      )}
    </Transition>
  );
};

export const Uploader = (props: Props) => {
  const [files, setFiles] = useState<FileWithPath[]>(props.defaultImages || []);

  const onDrop = (fileDropped: FileWithPath[]) => {
    setFiles(fileDropped);
    if (props.removeActionButtons) {
      props.onSave(fileDropped);
    }
  };

  const onReject = (
    fileRejections: Parameters<
      NonNullable<React.ComponentProps<typeof Dropzone>["onReject"]>
    >[0]
  ) => {
    const tooMany = fileRejections.some((r) =>
      r.errors.some((e) => e.code === "too-many-files")
    );
    if (tooMany) {
      Notification.error({
        title: "File Upload Limit Exceeded",
        message: `Maximum of ${props.maxFiles} files allowed.`,
      });
    }
  };

  return (
    <Stack>
      <Dropzone
        disabled={props.disabled}
        maxFiles={props.maxFiles}
        accept={props.accept || IMAGE_MIME_TYPE}
        onDrop={onDrop}
        onReject={onReject}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconPlus size={50} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={50} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPlus size={50} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              {props.uploadText || "Drag & drop or click to choose files"}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      <FileSummaryBar
        files={files}
        disabled={props.disabled}
        onClear={() => onDrop([])}
      />

      <ImagePreview
        notImage={!!props.accept}
        files={files}
        disabled={props.disabled}
        onRemove={onDrop}
        renderFileIcon={props.renderFileIcon}
      />

      {!props.removeActionButtons && (
        <Group position="right">
          <Button
            disabled={files.length < 1}
            radius={10}
            leftIcon={<IconTrash />}
            onClick={() => {
              setFiles([]);
              props.onRemove?.();
            }}
            color="red"
          >
            Remove
          </Button>
          <Button
            color="teal"
            radius={10}
            onClick={() => props.onSave(files)}
            disabled={files.length < 1}
          >
            Submit
          </Button>
        </Group>
      )}
    </Stack>
  );
};