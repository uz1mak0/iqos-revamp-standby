// UploadModal.tsx
import React, { useState } from "react";
import { Modal, Stepper, Text, Select, Input } from "../../../../Elements";
import { Group, Stack } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { Storage, Auth } from "../../../../../Utilities/Backend";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { ApolloError, useMutation } from "@apollo/client";
import { useUploadPortalStore, S3ObjectType } from "./Store";
import { NavigationBtns } from "./NavigationBtns";
import Notification from "../../../../Elements/Notification/Notification";
import { UploadPDFs } from "./UploadPDFs";
import { LoadingUpload } from "./LoadingUpload";
import { startScreening } from "../../../../../GraphQL/HRSchema";

export type ProcessCompleteData = { successCount?: number; totalCount?: number };

type Props = {
  opened: boolean;
  onClose: () => void;
  onProcessStart: () => void;
  onProcessComplete: (data?: ProcessCompleteData) => void;
  onProcessError: (message: string) => void;
};

const STEP = { FORM: 0, UPLOADING: 1, COMPLETE: 2, DONE: 3 } as const;

const POSITION_OPTIONS = [
  { value: "SALES_EXPERT", label: "Sales Expert" },
  { value: "STORE_MANAGER", label: "Store Manager" },
];

const CHANNEL_OPTIONS = [
  { value: "INDIRECT_CHANNEL", label: "Indirect Channel" },
  { value: "DIRECT_RETAIL", label: "Direct Channel" },
];

const UNKNOWN_USER = "Unknown User";

const isTimeoutError = (error: ApolloError) => {
  const message = (error?.message || "").toLowerCase();
  return message.includes("execution timed out") || message.includes("timeout") || !!error?.networkError;
};

const getLoggedInUser = async (): Promise<{ username: string; email?: string }> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const email: string | undefined = user?.attributes?.email;
    return { username: user?.username || email || UNKNOWN_USER, email };
  } catch (authError) {
    console.warn("Could not fetch authenticated user:", authError);
    return { username: UNKNOWN_USER };
  }
};

export const UploadModal = ({
  opened,
  onClose,
  onProcessStart,
  onProcessComplete,
  onProcessError,
}: Props) => {
  const [active, setActive] = useState<number>(STEP.FORM);
  const [source, setSource] = useState("");
  const [region, setRegion] = useState("");
  const [position, setPosition] = useState<string | null>(null);
  const [jobPost, setJobPost] = useState("");
  const [channel, setChannel] = useState<string | null>(null);

  const [screeningResume] = useMutation(startScreening, {
    context: { clientName: "warehouse" },
  });

  const { setS3Objects, setRequestID, setIsUploading } = useUploadPortalStore();

  const resetForm = () => {
    setSource("");
    setRegion("");
    setPosition(null);
    setJobPost("");
    setChannel(null);
  };

  const onCloseModal = () => {
    setActive(STEP.FORM);
    resetForm();
    onClose();
  };

  const onDownloadErrorReport = () => setActive(STEP.COMPLETE);
  const onConfirm = () => setActive(STEP.COMPLETE);

  const uploadFileToS3 = async (file: FileWithPath): Promise<S3ObjectType> => {
    const extension = file.name.split(".").pop() || "pdf";
    const base = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

    const key = `HR_module/resume/${position}/${base}-${uuidv4()}.${extension}`;

    try {
      await Storage.put(key, file, { level: "public", contentType: file.type });
    } catch (err) {
      console.error("Upload failed:", err);
      throw new Error(`Failed to upload ${file.name}`);
    }

    return {
      bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
      key,
      region: process.env.NEXT_PUBLIC_REGION,
    };
  };

  const uploadAllFiles = async (files: FileWithPath[]) => {
    const uploaded: S3ObjectType[] = [];
    for (const file of files) {
      uploaded.push(await uploadFileToS3(file));
    }
    return uploaded;
  };

  const onNextValidate = async (uploadFiles: FileWithPath[]) => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    if (!source || !region || !position || !jobPost || !channel) {
      return Notification.error({ message: "Please fill up the inputs" });
    }

    setIsUploading(true);
    setActive(STEP.UPLOADING);

    let s3Objects: S3ObjectType[];
    try {
      s3Objects = await uploadAllFiles(uploadFiles);
    } catch (err: any) {
      Notification.error({ message: err?.message || "An error occurred. Please try again." });
      setIsUploading(false);
      setActive(STEP.FORM); // let the user retry instead of leaving them on "Uploading"
      return;
    }

    setS3Objects(s3Objects);
    setRequestID(`REQUEST_${dayjs().unix()}`);
    setActive(STEP.DONE);

    const totalCount = uploadFiles.length;
    const { username, email } = await getLoggedInUser();

    try {
      onProcessStart();

      const response = await screeningResume({
        variables: {
          input: {
            position,
            source,
            area: region,
            channel,
            job_post: jobPost,
            created_by: username,
            // NEW: recipient for the success/failed summary emails
            hr_email: email,
            // NEW: only process the CVs from this upload, not the whole folder
            s3_keys: s3Objects.map((o) => o.key),
          },
        },
        fetchPolicy: "no-cache",
      });

      const result = response?.data?.startScreening;
      const successCount = result?.successCount ?? result?.successfulCount ?? s3Objects.length;

      onProcessComplete({ successCount, totalCount });
    } catch (screeningError) {
      console.error("Screening automated trigger context:", screeningError);
      const error = screeningError as ApolloError;

      if (isTimeoutError(error)) {
        // The backend keeps running after a gateway timeout; the summary email reports the real result.
        onProcessComplete({ successCount: s3Objects.length, totalCount });
      } else {
        onProcessError(error?.message || "Failed during extraction and screening process.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal size={1000} title="Upload CVs" centered opened={opened} onClose={onCloseModal} removeCloseButton>
      <Stack spacing={20}>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="Upload File" description="Upload PDF files" disabled>
            <Group grow>
              <Input
                label="Source"
                placeholder="Enter Source"
                value={source}
                onChange={(event) => setSource(event.currentTarget.value)}
              />
              <Select
                label="Select Position"
                placeholder="Select position"
                value={position ?? undefined}
                onChange={setPosition}
                data={POSITION_OPTIONS}
              />
            </Group>
            <br />

            <Group grow>
              <Input
                label="Region"
                placeholder="Enter Region"
                value={region}
                onChange={(event) => setRegion(event.currentTarget.value)}
              />
              <Select
                label="Channel"
                placeholder="Select Channel"
                value={channel ?? undefined}
                onChange={setChannel}
                data={CHANNEL_OPTIONS}
              />
            </Group>
            <br />

            <Input
              label="Job Post"
              placeholder="Enter Job Post"
              value={jobPost}
              onChange={(event) => setJobPost(event.currentTarget.value)}
            />
            <br />
            <UploadPDFs />
          </Stepper.Step>

          <Stepper.Step label="Uploading" description="Uploads all files to cloud" disabled>
            <LoadingUpload />
          </Stepper.Step>

          <Stepper.Step label="Complete" description="Successfully completed all steps" />

          <Stepper.Completed>
            <Text fw="bold" size="lg" align="center">
              All files uploaded!
            </Text>
          </Stepper.Completed>
        </Stepper>

        <NavigationBtns
          onConfirm={onConfirm}
          onDownloadErrorReport={onDownloadErrorReport}
          onNextValidate={onNextValidate}
          active={active}
          setActive={setActive}
          onCancel={onCloseModal}
        />
      </Stack>
    </Modal>
  );
};