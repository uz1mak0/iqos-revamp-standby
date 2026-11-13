import { create } from "zustand";
import { WMS } from "../../../GraphQL";

type EODReportStore = {
  isReportSubmission: boolean;
  setIsReportSubmission: (value: boolean) => void;
  warehouses: WMS.Warehouse[];
  setWarehouses: (warehouses: WMS.Warehouse[]) => void;
};

export const useUploadPortalStore = create<EODReportStore>((set) => ({
  isReportSubmission: false,
  warehouses: [],
  setWarehouses: (warehouses: WMS.Warehouse[]) =>
    set(() => ({ warehouses: warehouses })),
  setIsReportSubmission: (value: boolean) =>
    set(() => ({ isReportSubmission: value })),
}));
