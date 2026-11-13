import React, { useEffect, useState } from "react";
import { Edit, CircleOff, Circle, Send } from "tabler-icons-react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  getAdminInfo,
  getWarehouses,
  updateAdmin,
  userDisable,
  userEnable,
} from "../../../GraphQL/UserSchema";
import {
  Badge,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { RETAIL, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom, userAtom } from "../../../Store/StoreAtom";
import Create from "../Admins/Create";
import ResetPassword from "../../Modules/Users/Reset";

export const Profile = () => {
  const router = useRouter();
  const [userRoles] = useAtom(rolesAtom);
  const [create, setCreate] = useState(false);
  const [visible, setVisible] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState<WMS.Admin>();

  const {
    loading: adminLoading,
    error,
    data,
    refetch,
  } = useQuery(getAdminInfo, {
    variables: { username: router.query.userId },
    context: { clientName: "warehouse" },
  });
  const [onDisableAdmin] = useMutation(userDisable);
  const [onEnableAdmin] = useMutation(userEnable);
  const [channel] = useAtom(channelAtom);
  const [onUpdateAdmin, { loading: loadingUpdate }] = useMutation(updateAdmin, {
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
  const [userDetails, setUserDetails] = useAtom(userAtom);

  const formValues = {
    name: adminProfile?.name || "",
    username: adminProfile?.username || "",
    office_name: adminProfile?.office_name || "",
    roles: adminProfile?.roles || "",
    phone_number: adminProfile?.phone_number?.substring(3) || "",
    email: adminProfile?.email || "",
  };

  useEffect(() => {
    if (data) {
      setAdminProfile(data.admin);
      setVisible(false);
    }
  }, [data]);

  const changeStatus = () => {
    setOpenModal(true);
    setLoading(true);
    if (adminProfile?.user_status == "ACTIVE") {
      onDisableAdmin({
        variables: { username: router.query.userId },
        onCompleted: (data) => {
          refetch();
          setLoading(false);
          setOpenModal(false);
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          setOpenModal(false);
        },
        context: { clientName: "warehouse" },
      });
    } else {
      onEnableAdmin({
        variables: { username: router.query.userId },
        onCompleted: (data) => {
          refetch();
          setLoading(false);
          setOpenModal(false);
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          setOpenModal(false);
        },
        context: { clientName: "warehouse" },
      });
    }
  };

  const onUpdate = (admin: WMS.Admin) => {
    setAdminProfile(admin);
    if (admin.username === userDetails.username) {
      setUserDetails(admin);
    }
    setCreate(false);
  };

  const getDisableCreate = () => {
    if (
      userRoles.isAdminDC ||
      //old roles
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
        onSubmit={onUpdate}
        profile={adminProfile}
        visible={create}
        onClose={() => setCreate(false)}
      />
      <Modal
        size={800}
        centered
        title={`${
          adminProfile?.user_status == "ACTIVE" ? "Disable" : "Enable"
        } User`}
        opened={openModal}
        onClose={() => setOpenModal(false)}
      >
        <p>Are you sure you want to change this user status?</p>
        <Group position="right">
          <Button onClick={() => setOpenModal(false)} customType="secondary">
            Cancel
          </Button>
          <Button
            customType="primary"
            loading={loading}
            onClick={() => changeStatus()}
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Paper radius={8} style={{ position: "relative" }}>
        <LoadingOverlay visible={visible} />
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>User Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <ResetPassword username={adminProfile?.username} />
              <Button
                disabled={getDisableCreate()}
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
              <Button
                disabled={getDisableCreate()}
                icon={
                  adminProfile?.user_status == "ACTIVE" ? (
                    <CircleOff />
                  ) : (
                    <Circle />
                  )
                }
                onClick={() => setOpenModal(true)}
              >
                {adminProfile?.user_status == "ACTIVE"
                  ? "Disable User"
                  : "Enable User"}
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={3}>
            <p>Name: {adminProfile?.name} </p>
            <p>Username: {adminProfile?.username}</p>
            <p>Phone Number: {adminProfile?.phone_number}</p>
            <p>Email: {adminProfile?.email}</p>
            <div>
              Roles:{" "}
              {adminProfile?.roles?.map((role) => (
                <Badge key={role}>{role}</Badge>
              ))}
            </div>
            <p>Status: {adminProfile?.user_status || "ACTIVE"}</p>
          </Grid.Col>
          <Grid.Col span={3}>
            {userRoles.isDirectRetailUser ? (
              <div>
                Office Name(s):
                <div>
                  {adminProfile?.office_ids?.map((office) => (
                    <Badge key={office}>{office}</Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p>{adminProfile?.office_name}</p>
            )}
          </Grid.Col>
          <Grid.Col></Grid.Col>
        </Grid>
      </Paper>
    </div>
  );
};
