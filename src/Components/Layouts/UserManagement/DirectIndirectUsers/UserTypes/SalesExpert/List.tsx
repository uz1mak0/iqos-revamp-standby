import React, { useState } from "react";
import router from "next/router";
import { Badge, Button, Group, Modal, Table } from "../../../../../Elements";
import { RETAIL, WMS } from "../../../../../../GraphQL";
import { useMutation, useQuery } from "@apollo/client";
import {
  deleteSalesExpert,
  getSalesExperts,
  getWarehouses,
} from "../../../../../../GraphQL/UserSchema";
import Notification from "../../../../../Elements/Notification/Notification";
import { UserRoles } from "../../../../../../Store/StoreAtom";
import { SalesExpertActions } from "../../../Actions/SalesExpertActions";
import { SalesExpertForm } from "../../Create/SalesExpertForm";
import { useUsersStore } from "../../../Store";
import { RemoveSalesExpert } from "../../../Actions/RemoveSalesExpert";
import { useRouter } from "next/router";
type Props = {
  users?: RETAIL.SalesExpert[];
  roles?: UserRoles;
};

export const List = (props: Props) => {
  const router = useRouter();
  const { salesExpert, setSalesExpert } = useUsersStore();
  const [selectedAction, setSelectedAction] = useState<{
    user: WMS.SalesExpert | undefined;
    type: string | undefined;
  }>({
    user: undefined,
    type: undefined,
  });

  const { data: warehouseData } = useQuery<{
    warehouses: RETAIL.WarehouseConnection;
  }>(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: router.route.includes("/users/direct")
        ? "DIRECT_RETAIL"
        : "INDIRECT_CHANNEL",
    },
  });

  const warehouseOfficeIdSet = new Set(
    warehouseData?.warehouses?.items?.map((w) => w?.id) ?? []
  );

  const filteredUsers = props.users?.filter((user) =>
    user?.office_ids?.some((officeId) => warehouseOfficeIdSet.has(officeId))
  );

  const rows = filteredUsers?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element?.name}</td>
      <td>{element?.sales_expert_id}</td>
      <td>{element?.phone_number}</td>
      <td>{element?.email}</td>
      <td>
        {element?.office_ids?.map((office) => (
          <Badge key={office}>{office}</Badge>
        ))}
      </td>
      <td>
        <SalesExpertActions
          user={element}
          onSelectAction={(user, type) => setSelectedAction({ user, type })}
        />
      </td>
    </tr>
  ));

  const onCloseAction = () => {
    setSelectedAction({ user: undefined, type: undefined });
  };

  const onRemoveSalesExpert = (sales_expert: WMS.SalesExpert | undefined) => {
    setSalesExpert(
      salesExpert.filter(
        (e) => e.sales_expert_id !== sales_expert?.sales_expert_id
      )
    );
  };

  return (
    <div>
      <SalesExpertForm
        visible={selectedAction.type === "EDIT"}
        onClose={onCloseAction}
        profile={selectedAction.user}
      />
      <RemoveSalesExpert
        visible={selectedAction.type === "REMOVE"}
        onClose={onCloseAction}
        onRemove={onRemoveSalesExpert}
        user={selectedAction.user}
      />
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sales Expert ID</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Warehouse</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};
