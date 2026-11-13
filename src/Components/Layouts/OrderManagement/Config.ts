import dayjs from "dayjs";

export const checkUsageHistory = (item: any, returnOrder: any) => {
  return (
    item.inventory_items &&
    (returnOrder?.usage_history?.pre?.charger_cycle ||
      returnOrder?.usage_history?.pre?.holder_cycle ||
      returnOrder?.usage_history?.pre?.device_cycle ||
      returnOrder?.usage_history?.pre?.version)
  );
};
