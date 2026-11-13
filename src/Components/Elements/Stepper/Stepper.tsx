import React from "react";

import { useState } from "react";
import { Stepper as MantineStepper, Button, Group } from "@mantine/core";

type StepperProps = {
  children?: React.ReactNode;
  active: number;
  onStepClick?: (stepIndex: number) => void;
  iconPosition?: "left" | "right";
  breakpoint?: number | "xs" | "sm" | "md" | "lg" | "xl";
  allowNextStepsSelect?: boolean;
};

export const Stepper = (props: StepperProps) => {
  return (
    <>
      <MantineStepper {...props} allowNextStepsSelect={false}>
        {props.children}
      </MantineStepper>
    </>
  );
};
const { Step, Completed } = MantineStepper;
Stepper.Step = Step;
Stepper.Completed = Completed;
