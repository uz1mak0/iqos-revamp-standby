import { useState, useEffect } from "react";
import { Stepper } from "@mantine/core";
import { HR } from "../../../../GraphQL";
import { ApplicationStatus } from "../TalentsManagements/TalentsManagementConfig";

type Props = {
  candidate?: HR.Maybe<HR.Talent>;
};

export const StatusCard = (props: Props) => {
  const [active, setActive] = useState(0);
  const [steps, setSteps] = useState<typeof ApplicationStatus>([]);

  useEffect(() => {
    if (!props.candidate?.status) return;

    let stepFlow: typeof ApplicationStatus = [];

    if (props.candidate.status === "CANCELLED") {
      stepFlow = ApplicationStatus.filter((s) =>
        ["PASSED_SCREENING", "FOR_INTERVIEW", "CANCELLED"].includes(s.id),
      );
    } else if (props.candidate.status === "FAILED_SCREENING") {
      stepFlow = ApplicationStatus.filter((s) =>
        [
          "FAILED_SCREENING",
          "INITIAL_INTERVIEW",
          "PASSED_INTERVIEW",
          "FINAL_INTERVIEW",
          "FOR_JO",
          "COMPLETED",
        ].includes(s.id),
      );
    } else {
      stepFlow = ApplicationStatus.filter((s) =>
        [
          "PASSED_SCREENING",
          "INITIAL_INTERVIEW",
          "PASSED_INTERVIEW",
          "FINAL_INTERVIEW",
          "FOR_JO",
          "COMPLETED",
        ].includes(s.id),
      );

      if (props.candidate.status === "COMPLETED") {
        stepFlow[stepFlow.length - 1] = ApplicationStatus.find(
          (s) => s.id === "COMPLETED",
        )!;
      }
    }

    setSteps(stepFlow);

    let stepIndex = stepFlow.findIndex((s) => s.id === props.candidate?.status);

    if (stepIndex === -1) {
      stepIndex = stepFlow.findIndex((s) => s.id === "PASSED_INTERVIEW");
    }

    setActive(stepIndex >= 0 ? stepIndex : 0);
  }, [props.candidate?.status]);

  return (
    <Stepper
      active={
        props.candidate?.status == HR.Status.COMPLETED ? active + 1 : active
      }
      iconSize={62}
      radius="sm"
      allowNextStepsSelect={false}
    >
      {steps.map((step) => (
        <Stepper.Step
          key={step.id}
          label={step.title}
          description={step.title}
          color={step.color}
        />
      ))}
    </Stepper>
  );
};
