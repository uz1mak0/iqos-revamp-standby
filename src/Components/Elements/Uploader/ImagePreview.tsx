import React from "react";
import {
  Group,
  Text,
  ActionIcon,
  Paper,
  Stack,
  createStyles,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { IconTrash, IconFileText } from "@tabler/icons-react";

const useStyles = createStyles((theme) => {
  const dark = theme.colorScheme === "dark";

  return {
    item: {
      backgroundColor: dark ? theme.colors.dark[6] : theme.colors.gray[0],
      borderColor: dark ? theme.colors.dark[4] : theme.colors.gray[3],
      transition: "background-color 150ms ease",

      "&:hover": {
        backgroundColor: dark ? theme.colors.dark[5] : theme.colors.gray[1],
      },
    },
    name: {
      color: dark ? theme.colors.dark[0] : theme.colors.gray[9],
    },
    size: {
      color: dark ? theme.colors.dark[2] : theme.colors.gray[6],
    },
    remove: {
      color: dark ? theme.colors.red[4] : theme.colors.red[6],

      "&:hover": {
        backgroundColor: dark
          ? theme.fn.rgba(theme.colors.red[9], 0.35)
          : theme.colors.red[0],
      },
    },
  };
});

type Props = {
  view?: boolean;
  files: FileWithPath[];
  notImage?: boolean;
  disabled?: boolean;
  onRemove: (files: FileWithPath[]) => void;
  renderFileIcon?: (file: FileWithPath) => React.ReactNode;
};

export const ImagePreview = (props: Props) => {
  const { classes } = useStyles();

  if (!props.files || props.files.length === 0) {
    return null;
  }

  const handleRemove = (indexToRemove: number) => {
    const updatedFiles = props.files.filter((_, index) => index !== indexToRemove);
    props.onRemove(updatedFiles);
  };

  return (
    <Stack spacing="xs">
      {props.files.map((file, index) => {
        const isImage = file.type.startsWith("image/") && !props.notImage;
        const imageUrl = isImage ? URL.createObjectURL(file) : null;

        return (
          <Paper
            key={`${file.name}-${index}`}
            withBorder
            p="xs"
            radius="md"
            className={classes.item}
          >
            <Group position="apart">
              <Group spacing="sm">
                {props.renderFileIcon ? (
                  props.renderFileIcon(file)
                ) : isImage && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={file.name}
                    style={{
                      width: 36,
                      height: 36,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                  />
                ) : (
                  <IconFileText size={36} color="#757575" />
                )}

                <div>
                  <Text size="sm" weight={500} lineClamp={1} className={classes.name}>
                    {file.name}
                  </Text>
                  <Text size="xs" className={classes.size}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </div>
              </Group>

              {!props.disabled && (
                <ActionIcon
                  variant="subtle"
                  className={classes.remove}
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              )}
            </Group>
          </Paper>
        );
      })}
    </Stack>
  );
};