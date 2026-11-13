import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import { RETAIL } from "../../../GraphQL";
import { getEnums, getWarehouses } from "../../../GraphQL/UserSchema";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";

export const FormElements = () => {
  const [userRoles] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);

  const { data: enumsData } = useQuery(getEnums, {
    variables: { name: "Role" },
    context: { clientName: "warehouse" },
  });
  const { data: warehouseData } = useQuery<{
    warehouses: RETAIL.WarehouseConnection;
  }>(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });

  const DRRoles = [
    { name: "AdminDR" },
    { name: "Executive" },
    { name: "Coach" },
    { name: "PMFTCAdministrator" },
  ];

  return [
    {
      name: "name",
      label: "Name",
      inputType: "Input",
      placeholder: "Enter Name",
    },
    {
      name: "username",
      label: "Username",
      inputType: "Input",
      placeholder: "Enter Username",
    },
    {
      name: "office_name",
      label: "Office Name",
      inputType: "Select",
      placeholder: "Enter Office Name",
      dropdown: warehouseData?.warehouses?.items?.filter(
        (v, i, a) => a.findIndex((v2) => v2?.name === v?.name) === i
      ),
    },
    {
      name: "roles",
      label: "Roles",
      inputType: "Multiselect",
      dropdown:
        userRoles.isDirectRetailUser || userRoles.isDirectRetailAdmin
          ? DRRoles
          : enumsData?.__type.enumValues.filter(
              (e: { name: string }) => !DRRoles.some((dr) => dr.name == e.name)
            ),
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
  ];
};
