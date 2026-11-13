import { FileWithPath } from "@mantine/dropzone";
import { create } from "zustand";

type S3ObjectType = {
  bucket: string | undefined;
  key: string;
  region: string | undefined;
};

type UploadPortalStore = {
  warehouse: string | undefined;
  setWarehouse: (value: string | undefined) => void;
  requestID: string | undefined;
  setRequestID: (value: string | undefined) => void;
  file: FileWithPath | undefined;
  setFile: (file: FileWithPath | undefined) => void;
  s3Object: S3ObjectType | undefined;
  setS3Object: (value: S3ObjectType | undefined) => void;
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
  unoTypeTransaction: string | undefined;
  setUnoTypeTransaction: (value: string | undefined) => void;
};

export const useUploadPortalStore = create<UploadPortalStore>((set) => ({
  warehouse: undefined,
  file: undefined,
  s3Object: undefined,
  validating: true,
  hasError: false,
  isUploading: false,
  errorDownloadLink: undefined,
  requestID: undefined,
  date: undefined,
  unoTypeTransaction: undefined,
  setWarehouse: (value: string | undefined) =>
    set(() => ({ warehouse: value })),
  setFile: (value: FileWithPath | undefined) => set(() => ({ file: value })),
  setS3Object: (value: S3ObjectType | undefined) =>
    set(() => ({ s3Object: value })),
  setValidating: (value: boolean) => set(() => ({ validating: value })),
  setHasError: (value: boolean) => set(() => ({ hasError: value })),
  setIsUploading: (value: boolean) => set(() => ({ isUploading: value })),
  setErrorDownloadLink: (value: string | undefined) =>
    set(() => ({ errorDownloadLink: value })),
  setRequestID: (value: string | undefined) =>
    set(() => ({ requestID: value })),
  setDate: (value: string | undefined) => set(() => ({ date: value })),
  setUnoTypeTransaction: (value: string | undefined) =>
    set(() => ({ unoTypeTransaction: value })),
}));
