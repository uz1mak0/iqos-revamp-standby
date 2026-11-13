import { create } from "zustand";
import { ORDER, STORE, WMS } from "../../../GraphQL";

type UsersStore = {
  directIndirectAdmins: WMS.Admin[];
  setDirectIndirectAdmins: (value: WMS.Admin[]) => void;
  ecommerceAdmins: WMS.Admin[];
  setEcommerceAdmins: (value: WMS.Admin[]) => void;
  salesExpert: WMS.SalesExpert[];
  setSalesExpert: (value: WMS.SalesExpert[]) => void;
  riders: ORDER.Rider[];
  setRiders: (value: ORDER.Rider[]) => void;
  storeUsers: STORE.StoreUser[];
  setStoreUsers: (value: STORE.StoreUser[]) => void;
  fullAdmins: WMS.Admin[];
  setFullAdmins: (value: WMS.Admin[]) => void;
};

export const useUsersStore = create<UsersStore>((set) => ({
  directIndirectAdmins: [],
  setDirectIndirectAdmins: (value: WMS.Admin[]) =>
    set(() => ({ directIndirectAdmins: value })),
  ecommerceAdmins: [],
  setEcommerceAdmins: (value: WMS.Admin[]) =>
    set(() => ({ ecommerceAdmins: value })),
  salesExpert: [],
  setSalesExpert: (value: WMS.SalesExpert[]) =>
    set(() => ({ salesExpert: value })),
  riders: [],
  setRiders: (value: ORDER.Rider[]) => set(() => ({ riders: value })),
  storeUsers: [],
  setStoreUsers: (value: STORE.StoreUser[]) =>
    set(() => ({ storeUsers: value })),
  fullAdmins: [],
  setFullAdmins: (value: WMS.Admin[]) => set(() => ({ fullAdmins: value })),
}));
