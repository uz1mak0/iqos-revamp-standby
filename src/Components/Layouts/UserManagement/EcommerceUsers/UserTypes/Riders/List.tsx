import React, { useState } from "react";
import { ORDER } from "../../../../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../../../../Store/StoreAtom";
import { useStyles } from "./Riders.styles";
import { ResetUserPassword } from "../../../Actions/ResetUserPassword";
import { RiderForm } from "../../Create/RiderForm";
import { RiderActions } from "../../../Actions/RiderAction";
import { Badge, Text } from "@mantine/core";
import { useUsersStore } from "../../../Store";
import { DisableRider } from "../../../Actions/DisableRider";
import { Table } from "../../../../../Elements";

type Props = {
  users: ORDER.Rider[] | undefined;
};

export const List = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const { classes } = useStyles();

  const [selectedAction, setSelectedAction] = useState<{
    user: ORDER.Rider | undefined;
    type: string | undefined;
  }>({
    user: undefined,
    type: undefined,
  });
  const { riders, setRiders } = useUsersStore();

  const rows = props.users?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.username}</td>
      <td>{element.name}</td>
      <td>
        <div style={{ whiteSpace: "pre-wrap", width: 250 }}>
          <Text fz={12}>{element.address}</Text>
        </div>
      </td>

      <td>{element.license_number}</td>
      <td>{element.license_expiration_date}</td>
      <td>{element.phone_number}</td>
      <td>
        {
          <Badge
            color={
              element.user_status === ORDER.UserStatus.Inactive ? "red" : "teal"
            }
            variant="dot"
          >
            {element.user_status || ORDER.UserStatus.Active}
          </Badge>
        }
      </td>
      <td>{element.hybridlead_enabled ? "ENABLED" : "DISABLED"}</td>

      <td>
        <RiderActions
          user={element}
          onSelectAction={(user, type) => setSelectedAction({ user, type })}
        />
      </td>
    </tr>
  ));

  const onCloseAction = () => {
    setSelectedAction({ user: undefined, type: undefined });
  };

  return (
    <>
      <div>
        <RiderForm
          visible={selectedAction.type === "EDIT"}
          onClose={onCloseAction}
          profile={selectedAction.user}
        />
        <ResetUserPassword
          visible={selectedAction.type === "RESET"}
          onClose={onCloseAction}
          profile={selectedAction.user}
        />
        <DisableRider
          users={riders}
          setUsers={setRiders}
          profile={selectedAction.user}
          visible={selectedAction.type === "DISABLE"}
          onClose={onCloseAction}
        />
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Address</th>
              <th>License Number</th>
              <th>License Expiration Date</th>
              <th>Contact No.</th>
              <th>Status</th>
              <th>Hybrid Lead</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </>
  );
};
