import { create } from "zustand";
import { WMS } from "../../../GraphQL";

type DCLendingStoreProps = {
  returnDCList: WMS.SaleTransaction[];
  setReturnDCList: (list: WMS.SaleTransaction[]) => void;
  lendingDCList: WMS.SaleTransaction[];
  setLendingDCList: (list: WMS.SaleTransaction[]) => void;
};

export const useDCLendingStore = create<DCLendingStoreProps>((set) => ({
  lendingDCList: [],
  returnDCList: [],
  setLendingDCList: (list: WMS.SaleTransaction[]) =>
    set(() => ({ lendingDCList: list })),
  setReturnDCList: (list: WMS.SaleTransaction[]) =>
    set(() => ({ returnDCList: list })),
}));
