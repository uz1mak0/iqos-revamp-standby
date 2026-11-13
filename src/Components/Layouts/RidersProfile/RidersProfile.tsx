import React, { useEffect, useState } from "react";
import { Edit, Send } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Button, Grid, Group, LoadingOverlay, Paper } from "../../Elements";
import Create from "../../Modules/Users/Create";
import { formElements } from "../Riders/Config";
import dayjs from "dayjs";
import Notification from "../../Elements/Notification/Notification";
import { getRiderInfo, riderUpdate } from "../../../GraphQL/RiderSchema";
import { ORDER } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import ResetPassword from "../../Modules/Users/Reset";

export const Profile = () => {
  const router = useRouter();
  const [create, setCreate] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [riderProfile, setRiderProfile] = useState<ORDER.Rider>();

  const { loading, data, refetch } = useQuery(getRiderInfo, {
    variables: { username: router.query.userId },
    context: { clientName: "order" },
  });
  const [onRiderUpdate, { loading: loadingUpdate }] = useMutation(riderUpdate, {
    context: { clientName: "order" },
  });
  const [userRoles] = useAtom(rolesAtom);
  useEffect(() => {
    if (data) {
      setRiderProfile(data.rider);
      setVisible(false);
    }
  }, [data]);

  const formValues = {
    name: riderProfile?.name || "",
    username: riderProfile?.username || "",
    license_number: riderProfile?.license_number || "",
    phone_number: riderProfile?.phone_number?.substring(3) || "",
    address: riderProfile?.address || "",
    license_expiration_date:
      new Date(riderProfile?.license_expiration_date!) || "",
    hybridlead_enabled: riderProfile?.hybridlead_enabled || "false",
  };

  const onSubmit = (values: ORDER.Rider) => {
    const configValues = {
      ...values,
      phone_number: "+63" + values.phone_number,
      license_expiration_date: dayjs(values.license_expiration_date).format(
        "MMMM DD YYYY",
      ),
    };

    onRiderUpdate({
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

  return (
    <div>
      <Create
        type="Rider"
        isUpdate
        loading={loadingUpdate}
        visible={create}
        onClose={() => setCreate(false)}
        formElements={formElements}
        formValues={formValues}
        profileData={riderProfile}
        onSubmit={(values) => onSubmit(values)}
      />

      <Paper radius={8} style={{ position: "relative" }}>
        <LoadingOverlay visible={visible} />
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>Rider Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <ResetPassword username={riderProfile?.username} />
              <Button
                disabled={!userRoles.isFullAdmin}
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <p>Name: {riderProfile?.name}</p>
        <p>Username: {riderProfile?.username}</p>
        <p>Phone Number: {riderProfile?.phone_number}</p>
        <p>Licensed Number: {riderProfile?.license_number}</p>
        <p>Licensed Expiration Date: {riderProfile?.license_expiration_date}</p>
        <p>Address: {riderProfile?.address}</p>
        <p>Hybrid Lead: {riderProfile?.hybridlead_enabled}</p>
      </Paper>
    </div>
  );
};
