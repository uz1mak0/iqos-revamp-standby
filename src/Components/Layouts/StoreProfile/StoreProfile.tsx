import React, { useEffect, useState } from "react";
import { Edit, Send } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getStoreUsers, storeUserUpdate } from "../../../GraphQL/UserSchema";
import Notification from "../../Elements/Notification/Notification";
import Create from "../../Modules/Users/Create";
import { formElements } from "../Store/Config";
import ResetModal from "../../Modules/Users/Reset";
import { STORE } from "../../../GraphQL";
import { Button, Grid, Group, Paper } from "../../Elements";
import ResetPassword from "../../Modules/Users/Reset";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

export const Profile = () => {
  const router = useRouter();
  const [create, setCreate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userRoles] = useAtom(rolesAtom);
  const [storeProfile, setStoreProfile] = useState<STORE.StoreUser>();

  const { loading, data, refetch } = useQuery(getStoreUsers, {
    context: { clientName: "store" },
  });
  const [onUpdateStoreUser, { loading: loadingUpdate }] = useMutation(
    storeUserUpdate,
    { context: { clientName: "store" } }
  );

  useEffect(() => {
    if (data)
      setStoreProfile(
        data.storeUsers.items.filter(
          (store: STORE.StoreUser) => store.username == router.query.userId
        )[0]
      );
  }, [data]);

  const formValues = {
    name: storeProfile?.name || "",
    username: storeProfile?.username || "",
    roles: storeProfile?.roles || [],
    phone_number: storeProfile?.phone_number?.substring(3) || "",
    email: storeProfile?.email || "",
  };

  const onSubmit = (values: STORE.StoreUser) => {
    const configValues = {
      ...values,
      phone_number: "+63" + values.phone_number,
    };

    onUpdateStoreUser({
      variables: { input: configValues },
      onCompleted: (data) => {
        refetch();
        Notification.success({ message: "Updated Successfully" });
        setCreate(false);
      },
      onError: (error) => {
        console.log(error);
        Notification.error({ message: error.message });
        setCreate(false);
      },
    });
  };

  const accessRoles = () => {
    if (
      userRoles.isDirectRetailAdmin ||
      userRoles.isAdminDC ||
      // old roles
      userRoles.isAdmin ||
      userRoles.isCRMAdmin ||
      userRoles.isDirectRetailAdmin
    )
      return false;
    return true;
  };

  return (
    <div>
      <Create
        type="Store User"
        isUpdate
        onSubmit={(values) => onSubmit(values)}
        visible={create}
        formElements={formElements}
        formValues={formValues}
        loading={loadingUpdate}
        onClose={() => setCreate(false)}
        profileData={storeProfile}
      />
      <Paper radius={8}>
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>Store User Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <ResetPassword username={storeProfile?.username} />
              <Button
                disabled={accessRoles()}
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <p>Name: {storeProfile?.name}</p>
        <p>Username: {storeProfile?.username}</p>
        <p>Phone Number: {storeProfile?.phone_number}</p>
        <p>Email: {storeProfile?.email}</p>
      </Paper>
    </div>
  );
};
