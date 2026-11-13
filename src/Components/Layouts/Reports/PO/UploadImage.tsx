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
        accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]} 
        openRef={openRef}
        onDrop={(files) => {
          if (!files || files.length === 0) return;

          const existingFiles = form.values[name] || [];
          const allFiles = [...existingFiles, ...files];

          form.setFieldValue(name, allFiles);
        }}
        activateOnClick={false}
        styles={{ inner: { pointerEvents: "all" } }}
        style={{ border: 0, background: "transparent", padding: 0 }}
      >
        <Group position="center">
          <Button customType="secondary" onClick={() => openRef.current?.()}>
            {type}
          </Button>
        </Group>
      </Dropzone>
    </div>
  );
};
