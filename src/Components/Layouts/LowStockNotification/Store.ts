import { create } from "zustand";
import { WMS } from "../../../GraphQL";

type LowStockNotificationStore = {
  thresholds: WMS.ThresholdConfig[];
  setThresholds: (value: WMS.ThresholdConfig[]) => void;
};

export const useLowStockNotificationStore = create<LowStockNotificationStore>(
  (set) => ({
    thresholds: [],
    setThresholds: (value: WMS.ThresholdConfig[]) =>
      set(() => ({ thresholds: value })),
  })
);
