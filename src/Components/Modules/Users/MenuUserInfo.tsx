import { useAtom } from "jotai";
import React from "react";
import { rolesAtom, userAtom } from "../../../Store/StoreAtom";
import { Badge, Grid, Modal, Paper } from "../../Elements";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const MenuUserInfo = (props: Props) => {
  const [user] = useAtom(userAtom);
  const [userRoles] = useAtom(rolesAtom);
  return (
    <Modal
      opened={props.visible}
      size={700}
      onClose={() => props.onClose()}
      centered
      title={"User Info"}
    >
      <Paper radius={8} style={{ position: "relative" }}>
        <p>Name: {user?.name} </p>
        <p>Username: {user?.username}</p>
        <p>Phone Number: {user?.phone_number}</p>
        <p>Email: {user?.email}</p>
        <div>
          Roles: {user?.roles?.map((role) => <Badge key={role}>{role}</Badge>)}
        </div>
        <p>Status: {user?.user_status || "ACTIVE"}</p>
        {userRoles.isDirectRetailUser ? (
          <div>
            Office Name(s):
            <div>
              {user?.office_ids?.map((office) => (
                <Badge key={office}>{office}</Badge>
              ))}
            </div>
          </div>
        ) : (
          <p>{user?.office_name}</p>
        )}
      </Paper>
    </Modal>
  );
};
