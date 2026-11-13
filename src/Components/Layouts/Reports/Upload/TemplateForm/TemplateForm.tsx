import React, { useState } from "react";
import { Modal, Stepper } from "../../../../Elements";
import { UploadFileStep } from "./UploadFileStep";
import { ValidationStep } from "./ValidationStep";
import { CompleteStep } from "./CompleteStep";
import { NavigationStep } from "./NavigationStep";
import { ReportStatusStep } from "./ReportStatusStep";
import { Stack } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import Amplify, { Storage } from "../../../../../Utilities/Backend";
import dayjs from "dayjs";
import { useUploadPortalStore } from "./Store";
import Notification from "../../../../Elements/Notification/Notification";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export const TemplateForm = (props: Props) => {
  const [active, setActive] = useState(0);
  const [isDownloadReport, setIsDownloadReport] = useState(false);
  const { setS3Object, setIsUploading, setRequestID } = useUploadPortalStore();

  //Close modal using modal close button
  const onCloseModal = () => {
    setActive(0);
    props.onClose();
  };

  // Go to next page for downloading error report
  const onDownloadErrorReport = () => {
    setActive(2);
    setIsDownloadReport(true);
  };

  // Before validation, upload first the file on the S3 the proceed to the validation page on success upload
  const onNextValidate = async (
    file: FileWithPath | undefined,
    warehouse: string | undefined,
  ) => {
    const s3Object = await uploadCSVFile(warehouse, file);
    // If CSV file upload success, update the states needed for validation
    if (s3Object) {
      setRequestID(`REQUEST_${dayjs().unix()}`);
      setS3Object(s3Object);
      setIsUploading(false);
      setActive(1);
    } else {
      // Prompt error when CSV file upload failed
      Notification.error({ message: "An error occured. please try again" });
      setIsUploading(false);
    }
  };

  // Upload CSV file on S3
  const uploadCSVFile = async (
    warehouse: string | undefined,
    file: FileWithPath | undefined,
  ) => {
    setIsUploading(true);
    if (file) {
      var key = `${warehouse}/RecordSalesUpload/${`RSU-${dayjs().unix()}`}.${file?.path
        ?.split(".")
        .pop()}`; //sig.key;
      return Storage.put(`retail/${key}`, file, {
        level: "public",
        contentType: file.type,
      })
        .then(() => {
          return {
            bucket: process.env.NEXT_PUBLIC_DATA_BUCKET,
            key: `public/retail/${key}`,
            region: process.env.NEXT_PUBLIC_REGION,
          };
        })
        .catch((e) => {
          return undefined;
        });
    } else {
      return undefined;
    }
  };

  // If no error on validation proceed on the final step
  const onConfirm = () => {
    setActive(2);
    setIsDownloadReport(false);
  };
  return (
    <Modal
      size={1000}
      title="Upload Template"
      centered
      opened={props.opened}
      onClose={onCloseModal}
      removeCloseButton
    >
      <Stack spacing={20}>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step
            label="Upload File"
            description="Upload csv, xls, xlsx file"
          >
            <UploadFileStep />
          </Stepper.Step>
          <Stepper.Step
            label="File Validation & Results"
            description="Identifies errors and displays upload results"
          >
            <ValidationStep />
          </Stepper.Step>
          <Stepper.Step
            label="Complete"
            description="Successfully completes all steps"
          >
            <ReportStatusStep isDownloadReport={isDownloadReport} />
          </Stepper.Step>
          <Stepper.Completed>
            <CompleteStep />
          </Stepper.Completed>
        </Stepper>
        <NavigationStep
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
