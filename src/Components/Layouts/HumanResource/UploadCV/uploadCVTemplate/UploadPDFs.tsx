import React from "react";
import { Stack, Uploader } from "../../../../Elements";
import { useUploadPortalStore } from "./Store";
import { FileWithPath } from "@mantine/dropzone";
import { IconFileTypePdf, IconFileTypeDocx, IconFileText } from "@tabler/icons-react";

export const UploadPDFs = () => {
  const { setFiles, isUploading } = useUploadPortalStore();

  const renderCustomFileIcon = (file: FileWithPath) => {
    const fileName = file.name ? file.name.toLowerCase() : "";
    const mimeType = file.type ? file.type.toLowerCase() : "";

    if (
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx") ||
      mimeType.includes("word") ||
      mimeType.includes("officedocument")
    ) {
      return <IconFileTypeDocx size={36} color="#2B579A" />;
    }

    if (fileName.endsWith(".pdf") || mimeType.includes("pdf")) {
      return <IconFileTypePdf size={36} color="#E53935" />;
    }

    return <IconFileText size={36} color="#757575" />;
  };

  return (
    <div>
      <Stack>
        <Uploader
          disabled={isUploading}
          accept={[
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            ".pdf",
            ".docx",
            ".doc",
          ]}
          maxFiles={100}
          onSave={(selectedFiles) => setFiles(selectedFiles)}
          removeActionButtons={true}
          uploadText="Drag & drop PDF or Word document(s) or click to upload"
          renderFileIcon={renderCustomFileIcon}
        />
      </Stack>
    </div>
  );
};