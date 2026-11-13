import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import { RETAIL } from "../../../GraphQL";
import { getEnums, getWarehouses } from "../../../GraphQL/UserSchema";

export const FormElements = () => {
  const { data: enumsData } = useQuery(getEnums, {
    variables: { name: "Role" },
    context: { clientName: "warehouse" },
  });
  const { data: warehouseData } = useQuery<{
    warehouses: RETAIL.WarehouseConnection;
  }>(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: "DIRECT_RETAIL",
    },
  });

  return [
    {
      name: "name",
      label: "Name",
      inputType: "Input",
      placeholder: "Enter Name",
    },
    {
      name: "sales_expert_id",
      label: "Sales Expert ID",
      inputType: "Input",
      placeholder: "Enter Sales Expert ID",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      inputType: "Input",
      placeholder: "Enter Email",
    },
    {
      name: "phone_number",
      type: "number",
      label: "Contact Number",
      inputType: "Input",
      placeholder: "Enter Contact Number",
    },
    {
      name: "office_ids",
      label: "Office Name",
      inputType: "Multiselect",
      placeholder: "Enter Office Name",
      dropdown:
        warehouseData?.warehouses?.items?.map((e) => {
          return {
            name: e?.name,
            id: e?.id,
          };
        }) || [],
    },
  ];
};
