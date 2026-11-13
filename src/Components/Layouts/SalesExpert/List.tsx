import React, { useState } from "react";
import router from "next/router";
import { Badge, Button, Group, Modal, Table } from "../../Elements";
import { RETAIL, WMS } from "../../../GraphQL";
import { useMutation, useQuery } from "@apollo/client";
import {
  deleteSalesExpert,
  getSalesExperts,
} from "../../../GraphQL/UserSchema";
import Notification from "../../Elements/Notification/Notification";
import { UserRoles } from "../../../Store/StoreAtom";

type Props = {
  users?: RETAIL.Maybe<RETAIL.Maybe<RETAIL.SalesExpert>[]> | undefined;
  roles?: UserRoles;
};

export const List = (props: Props) => {
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    RETAIL.Maybe<string> | undefined
  >();
  const { refetch } = useQuery<{ salesExperts: RETAIL.SalesExpertConnection }>(
    getSalesExperts,
    { context: { clientName: "warehouse" } },
  );
  const [onDeleteUser, { loading }] = useMutation(deleteSalesExpert, {
    context: { clientName: "warehouse" },
  });

  const rows = props.users?.map((element, index) => (
    <tr
      onClick={() =>
        router.push(
          `/users/sales-expert/profile?userId=${element?.sales_expert_id}`,
        )
      }
      key={`user-${index}`}
    >
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
        <Button
          disabled={!props.roles?.isDirectRetailAdmin}
          customType="danger"
          onClick={(e) => {
            e.stopPropagation();
            setModal(true);
            setSelectedUser(element?.sales_expert_id);
          }}
        >
          Remove
        </Button>
      </td>
    </tr>
  ));

  const onRemoveSalesExpert = () => {
    onDeleteUser({
      variables: {
        sales_expert_id: selectedUser,
      },
      onCompleted: () => {
        refetch();
        Notification.success({ message: "Deleted Successfully" });
        setModal(false);
      },
      onError: console.error,
    });
  };

  return (
    <>
      <Modal
        title="Remove"
        onClose={() => {
          setSelectedUser("");
          setModal(false);
        }}
        opened={modal}
      >
        <p>Are you sure you want to remove Sales Expert?</p>
        <Group position="right">
          <Button
            onClick={() => {
              setSelectedUser("");
              setModal(false);
            }}
            customType="secondary"
          >
            Cancel
          </Button>
          <Button
            customType="danger"
            onClick={onRemoveSalesExpert}
            loading={loading}
          >
            Remove
          </Button>
        </Group>
      </Modal>
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
    </>
  );
};
