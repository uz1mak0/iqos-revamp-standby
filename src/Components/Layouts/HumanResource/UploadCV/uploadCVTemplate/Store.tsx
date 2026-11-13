// Store.ts
import { FileWithPath } from "@mantine/dropzone";
import { create } from "zustand";

export type S3ObjectType = {
  bucket: string | undefined;
  key: string;
  region: string | undefined;
};

type UploadPortalStore = {
  requestID: string | undefined;
  setRequestID: (value: string | undefined) => void;

  files: FileWithPath[];
  setFiles: (files: FileWithPath[]) => void;

  s3Objects: S3ObjectType[];
  setS3Objects: (value: S3ObjectType[]) => void;

  validating: boolean;
  setValidating: (value: boolean) => void;

  hasError: boolean;
  setHasError: (value: boolean) => void;

  isUploading: boolean;
  setIsUploading: (value: boolean) => void;

  errorDownloadLink: string | undefined;
  setErrorDownloadLink: (value: string | undefined) => void;

  date: string | undefined;
  setDate: (value: string | undefined) => void;
};

export const useUploadPortalStore = create<UploadPortalStore>((set) => ({
  files: [],
  s3Objects: [],
  validating: true,
  hasError: false,
  isUploading: false,
  errorDownloadLink: undefined,
  requestID: undefined,
  date: undefined,

  setFiles: (files) => set({ files }),
  setS3Objects: (s3Objects) => set({ s3Objects }),
  setValidating: (validating) => set({ validating }),
  setHasError: (hasError) => set({ hasError }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setErrorDownloadLink: (errorDownloadLink) => set({ errorDownloadLink }),
  setRequestID: (requestID) => set({ requestID }),
  setDate: (date) => set({ date }),
}));
