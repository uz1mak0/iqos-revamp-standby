import React, { useState } from "react";
import { Input } from "../../Elements/Input";
import { Modal } from "../../Elements/Modal";
import Notification from "../../Elements/Notification/Notification";
import { Stepper } from "../../Elements/Stepper";
import { Auth } from "../../../Utilities/Backend";
import { Button, Group, NumberInput } from "../../Elements";
import { PasswordInput } from "@mantine/core";

type Props = {
  visible: boolean;
  onClose: () => void;
};
export const ForgotPassword = (props: Props) => {
  const [active, setActive] = useState<number>(0);
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    if (active === 0) props.onClose();
  };

  const [values, setValues] = useState<{
    username: string | undefined;
    new_password: string | undefined;
    code: number | undefined;
  }>({
    username: undefined,
    new_password: undefined,
    code: undefined,
  });

  const onSendCode = () => {
    Auth.forgotPassword(`${values.username}`)
      .then((data) => {
        setActive((current) => (current < 3 ? current + 1 : current));
        Notification.success({ message: "Verification code sent" });
      })
      .catch((err) => {
        if (err.name === "LimitExceededException") {
          Notification.error({ message: err.message });
        } else {
          Notification.error({ message: "Username does not exist" });
        }
      });
  };

  const onSubmit = () => {
    Auth.forgotPasswordSubmit(
      `${values?.username}`,
      `${values.code}`,
      `${values.new_password}`,
    )
      .then((data) => {
        setActive((current) => (current < 3 ? current + 1 : current));
        Notification.success({ message: "Forgot Password Success" });
        onClose();
      })
      .catch((err) => {
        if (err.name === "LimitExceededException") {
          Notification.error({ message: err.message });
        } else {
          Notification.error({ message: "Forgot Password Failed" });
        }
      });
  };

  const onStepClick = (step: number) => {
    console.log(step);
    switch (step) {
      case 0:
        if (!values.username)
          return Notification.error({ message: "Please add username!" });
        return onSendCode();
      case 1:
        if (!values.code)
          return Notification.error({ message: "Please add code!" });
        return setActive((current) => (current < 3 ? current + 1 : current));
      case 2:
        if (!values.new_password)
          return Notification.error({ message: "Please add new password!" });
        return onSubmit();
      default:
        break;
    }
  };

  const onClose = () => {
    props.onClose();
    setValues({
      new_password: undefined,
      code: undefined,
      username: undefined,
    });
    setActive(0);
  };

  return (
    <Modal
      title="Forgot Password"
      centered
      size={800}
      onClose={() => onClose()}
      opened={props.visible}
    >
      <Stepper
        active={active}
        onStepClick={(e) => onStepClick(e)}
        breakpoint="sm"
      >
        <Stepper.Step label="First step" description="Enter Username">
          <Input
            value={values.username}
            onChange={(e) => setValues({ ...values, username: e.target.value })}
            description="Username"
          />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify Code">
          <Input
            type="number"
            value={values.code}
            description="Code"
            onChange={(e) => setValues({ ...values, code: e.target.value })}
          />
        </Stepper.Step>

        <Stepper.Step label="Final step" description="Update new password">
          <PasswordInput
            value={values.new_password}
            description="New Password"
            onChange={(e) =>
              setValues({ ...values, new_password: e.target.value })
            }
          />
        </Stepper.Step>
        <Stepper.Completed>Completed</Stepper.Completed>
      </Stepper>
      <br />
      <Group position="center">
        <Button customType="secondary" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={() => onStepClick(active)}>Next</Button>
      </Group>
    </Modal>
  );
};
