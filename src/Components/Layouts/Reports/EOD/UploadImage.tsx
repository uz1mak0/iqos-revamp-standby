import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import React, { useRef } from "react";
import { Button, Group } from "../../../Elements";
import Notification from "../../../Elements/Notification/Notification";

type Props = {
  form: any;
  type: string;
  name: string;
};

export const UploadImage = ({ form, type, name }: Props) => {
  const openRef = useRef<() => void>(null);

  return (
    <div>
      <Dropzone
        accept={
          type === "Additional Upload"
            ? [...PDF_MIME_TYPE, ...IMAGE_MIME_TYPE]
            : IMAGE_MIME_TYPE
        }
        openRef={openRef}
        onDrop={(file) => {
          if (file.length > 1)
            return Notification.error({ message: "Only 1 file is allowed" });
          form.setFieldValue(name, file);
        }}
        activateOnClick={false}
        styles={{ inner: { pointerEvents: "all" } }}
        style={{ border: 0, background: "transparent", padding: 0 }}
      >
        <Group position="center">
          <Button
            customType="secondary"
            onClick={() => (openRef ? openRef?.current?.() : undefined)}
          >
            {`${type}`}
          </Button>
        </Group>
      </Dropzone>
    </div>
  );
};
