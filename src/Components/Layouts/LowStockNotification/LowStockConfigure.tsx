import React, { useState, useEffect } from "react";
import { Button, Group, LoadingOverlay, Modal, Stepper } from "../../Elements";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom } from "../../../Store/StoreAtom";
import { SKUThresholds } from "./SKUThresholds";
import { Recipients } from "./Recipients";
import { useForm } from "@mantine/form";
import { Summary } from "./Summary";
import { Flex, Text } from "@mantine/core";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useMutation } from "@apollo/client";
import {
  createThresholdConfig,
  updateThresholdConfig,
} from "../../../GraphQL/SKUsSchema";
import { useLowStockNotificationStore } from "./Store";
import Notification from "../../Elements/Notification/Notification";

type Props = {
  warehouse: WMS.Warehouse | undefined;
  onClose: () => void;
  config: WMS.ThresholdConfig | undefined;
};

export const LowStockConfigure = ({ warehouse, onClose, config }: Props) => {
  const [channel] = useAtom(channelAtom);
  const [active, setActive] = useState(0);
  const { thresholds, setThresholds } = useLowStockNotificationStore();
  const [onCreateThresholdConfig, { loading: createLoading }] = useMutation(
    createThresholdConfig,
    {
      context: { clientName: "warehouse" },
    }
  );
  const [onUpdateThresholdConfig, { loading: updateLoading }] = useMutation(
    updateThresholdConfig,
    {
      context: { clientName: "warehouse" },
    }
  );
  const form = useForm<{
    thresholds: WMS.Maybe<WMS.Maybe<WMS.Threshold>[]> | undefined;
    recipients: WMS.Maybe<WMS.Maybe<string>[]> | undefined;
  }>({
    initialValues: {
      thresholds: [],
      recipients: [],
    },
  });
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const onCloseModal = () => {
    onClose();
    form.reset();
    setActive(0);
  };

  useEffect(() => {
    if (config) {
      form.setValues({
        thresholds: config.thresholds,
        recipients: config?.recipients || [],
      });
    }
  }, [config]);

  const onSubmit = () => {
    if (config) {
      onUpdateThresholdConfig({
        variables: {
          input: {
            warehouse_id: warehouse?.id,
            recipients: form?.values?.recipients?.map((e) => e),
            thresholds: form.values.thresholds
              ?.filter((e) => e?.value !== null)
              ?.map((e) => {
                return {
                  gtin: e?.gtin,
                  sku: e?.sku,
                  value: e?.value,
                };
              }),
          },
        },
      })
        .then((res) => {
          const currentThresholds = [...thresholds];
          const newThreshold = res.data.thresholdConfigUpdate;
          const index = currentThresholds.findIndex(
            (e) => e.id === newThreshold.id
          );
          currentThresholds[index] = newThreshold;
          setThresholds(currentThresholds);
          nextStep();
        })
        .catch((error) => {
          Notification.error({ message: error.message });
        });
    } else {
      onCreateThresholdConfig({
        variables: {
          input: {
            warehouse_id: warehouse?.id,
            recipients: form?.values?.recipients?.map((e) => e),
            thresholds: form.values.thresholds
              ?.filter((e) => e?.value !== null || e.value !== undefined)
              .map((e) => {
                return {
                  gtin: e?.gtin,
                  sku: e?.sku,
                  value: e?.value,
                };
              }),
          },
        },
      })
        .then((res) => {
          const newThreshold = res.data.thresholdConfigCreate;
          const updateThresholds = [...thresholds, { ...newThreshold }];
          setThresholds(updateThresholds);
          nextStep();
        })
        .catch((error) => {
          Notification.error({ message: error.message });
        });
    }
  };

  const onNextStep = () => {
    switch (active) {
      case 0:
      case 1:
        return nextStep();
      case 2:
        return onSubmit();
      case 3:
        return onCloseModal();

      default:
        break;
    }
  };

  const onDisableNextStep = () => {
    switch (active) {
      case 0:
        if (form.values.thresholds?.some((e) => typeof e?.value === "number"))
          return false;
        return true;
      case 1:
        if (form.values.recipients?.length) return false;
        return true;
      default:
        break;
    }
  };

  return (
    <Modal
      size={1400}
      title={`Configure: ${warehouse?.id}`}
      centered
      opened={!!warehouse}
      onClose={onCloseModal}
    >
      <LoadingOverlay visible={createLoading || updateLoading} />
      <>
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step
            label="Inventory Thresholds"
            description="Select SKU for thresholds"
          >
            <SKUThresholds channel={channel} form={form} />
          </Stepper.Step>
          <Stepper.Step
            label="Recipients"
            description="Add or remove recipients"
          >
            <Recipients form={form} />
          </Stepper.Step>
          <Stepper.Step
            label="Summary"
            description="list of SKUs and recipients"
          >
            <Summary form={form} />
          </Stepper.Step>
          <Stepper.Completed>
            <Flex
              gap="md"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <IconDiscountCheck stroke={2} color="#12B886" size={180} />
              <Text size={"xl"} fw={700}>
                Low stock notification for {warehouse?.name} completed.
              </Text>
            </Flex>
          </Stepper.Completed>
        </Stepper>

        <Group position="right">
          {active !== 3 && (
            <Button
              customType="secondary"
              variant="default"
              onClick={active == 0 ? onCloseModal : prevStep}
            >
              Back
            </Button>
          )}

          <Button disabled={onDisableNextStep()} onClick={onNextStep}>
            {active === 3 ? "Complete" : "Procceed to Next Step"}
          </Button>
        </Group>
      </>
    </Modal>
  );
};
