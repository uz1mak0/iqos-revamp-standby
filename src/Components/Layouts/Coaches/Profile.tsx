import React, { useEffect, useState } from "react";
import { Button, Grid, Group, Paper, LoadingOverlay } from "../../Elements";
import Create from "./Create";
import { Edit } from "tabler-icons-react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getCoachInfo } from "../../../GraphQL/CoachesSchema";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

const Profile = () => {
  const router = useRouter();
  const [create, setCreate] = useState<boolean>(false);
  const [profile, setProfile] = useState<WMS.Coach>();
  const { loading, error, data, refetch } = useQuery(getCoachInfo, {
    variables: { coach_id: router.query.coachId },
    context: { clientName: "warehouse" },
  });
  const [userRoles] = useAtom(rolesAtom);

  useEffect(() => {
    if (data) setProfile(data.coach);
  }, [data]);

  const onUpdateCoach = (coach: WMS.Coach) => {
    setProfile(coach);
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <Create
        visible={create}
        onClose={() => setCreate(false)}
        profileData={profile}
        onSubmit={onUpdateCoach}
      />
      <Paper>
        <Grid align="center">
          <Grid.Col span={6}>
            <h3>Coach Details</h3>
          </Grid.Col>
          <Grid.Col span={6}>
            <Group position="right">
              <Button
                disabled={
                  !userRoles.isFullAdmin && 
                  //old roles
                  !userRoles.isAdmin
                }
                icon={<Edit />}
                onClick={() => setCreate(true)}
              >
                Edit
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
        <p>Name: {profile?.name || "N/A"}</p>
        <p>Coach ID: {profile?.coach_id || "N/A"}</p>
        <p>Email: {profile?.email || "N/A"}</p>
        <p>Phone Number: {profile?.phone_number || "N/A"}</p>
        <p>Status: {profile?.user_status || "N/A"}</p>
      </Paper>
    </div>
  );
};

export default Profile;
