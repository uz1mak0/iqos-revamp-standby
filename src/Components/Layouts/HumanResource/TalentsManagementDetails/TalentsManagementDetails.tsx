import { HR } from "../../../../GraphQL";
import { useState } from "react";
import { useRouter } from "next/router";
import { Stack, LoadingOverlay } from "../../../Elements";
import { CandidateDetails } from "./CandidateDetails";
import { Application } from "./Application";
import { StatusCard } from "./StatusCard";
import { getTalentDetails } from "../../../../GraphQL/HRSchema";
import { useQuery } from "@apollo/client";

export const TalentsManagementDetails = () => {
  const router = useRouter();
  const { loading, data } = useQuery(getTalentDetails, {
    context: { clientName: "warehouse" },
    variables: { id: router.query.transactionID },
  });

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Stack>
        <CandidateDetails candidate={data?.talent} isVertical={true} />
        <Application candidate={data?.talent} />
        <StatusCard candidate={data?.talent} />
      </Stack>
    </>
  );
};
