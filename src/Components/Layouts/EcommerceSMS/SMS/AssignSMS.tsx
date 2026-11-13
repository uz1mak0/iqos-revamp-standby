import React, { useEffect, useState } from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import {
  Badge,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Table,
  Paper,
  Input,
  Stepper,
} from "../../../Elements";
import { Controller, useForm } from "react-hook-form";
import { Alert, MultiSelect, Select, Textarea, Text } from "@mantine/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  assignSMSToWarehouses,
  getSMSTemplates,
} from "../../../../GraphQL/SMSSettingsSchema";
import Notification from "../../../Elements/Notification/Notification";
import { AssignEcommerceSMSFormInput } from "../config";
import { ArrowRight, ChevronLeft, InfoCircle } from "tabler-icons-react";

type Props = {
  opened: boolean;
  warehouses: WMS.Warehouse[];
  onClose: () => void;
  onAssignSMSToWarehouses: (
    sms: ORDER.SmsTemplate,
    warehouse_ids: string[],
  ) => void;
  isSingleUpdate?: boolean;
};

export const AssignSMS = (props: Props) => {
  const [fetchSMSTemplates, { loading: loadingSMSTemplates }] = useLazyQuery(
    getSMSTemplates,
    { context: { clientName: "order" } },
  );
  const [smsTemplates, setSmsTemplates] = useState<ORDER.SmsTemplate[]>([]);
  const [assignSMS, { loading: loading }] = useMutation(assignSMSToWarehouses, {
    context: { clientName: "order" },
  });
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AssignEcommerceSMSFormInput>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (props.opened) {
      loadSMSTemplates([], undefined);
      reset({ message: undefined, sms_type_id: undefined });
      setValue("warehouse_ids", props?.warehouses?.map((e) => `${e?.id}`));
    }
  }, [props.opened]);

  const loadSMSTemplates = (
    list: ORDER.SmsTemplate[],
    nextToken: string | undefined,
  ) => {
    fetchSMSTemplates({
      variables: {
        sms_channel: ORDER.SmsChannel.Ecomm,
        next_token: nextToken,
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      const updateList = [...list, ...res.data.smsTemplates.items];
      const token = res.data.smsTemplates.next_token;
      if (token) {
        loadSMSTemplates(updateList, token);
      } else {
        setSmsTemplates(updateList);
      }
    });
  };

  const onSubmit = (input: AssignEcommerceSMSFormInput) => {
    assignSMS({
      variables: {
        id: input.sms_type_id,
        warehouse_ids: input.warehouse_ids,
      },
    })
      .then(() => {
        Notification.success({
          message: "SMS assigned to selected warehouses",
        });
        props.onAssignSMSToWarehouses(
          {
            id: input.sms_type_id,
            type: smsTemplates.find((e) => e.id === input.sms_type_id)?.type,
            message: input.message,
          },
          input.warehouse_ids,
        );
        onModalClose();
      })
      .catch((err) => Notification.error({ message: err.message }));
  };

  const onModalClose = () => {
    reset({ message: undefined, sms_type_id: undefined });
    setActive(0);
    props.onClose();
  };

  const formView = () => (
    <Stack>
      <Controller
        name="warehouse_ids"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <MultiSelect
            {...field}
            error={errors.warehouse_ids ? "Required" : undefined}
            label="Warehouse/Hub"
            disabled
            placeholder="Select warehouse/hub"
            data={props.warehouses.map((e) => {
              return {
                value: `${e.id}`,
                label: `${e.name}`,
              };
            })}
          />
        )}
      />
      <Controller
        name="sms_type_id"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            error={errors.sms_type_id ? "Required" : undefined}
            label="SMS Type"
            placeholder="Select SMS type"
            onChange={(sms_id) => {
              setValue(
                "message",
                smsTemplates.find((e) => e.id === sms_id)?.message || "",
              );
              setValue("sms_type_id", sms_id);
            }}
            data={smsTemplates.map((e) => {
              return {
                value: `${e.id}`,
                label: `${e.type}`,
              };
            })}
          />
        )}
      />
      <Controller
        name="message"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Textarea
            {...field}
            disabled
            withAsterisk
            autosize
            minRows={5}
            error={errors.message ? "Required" : undefined}
            label="SMS Message"
            maxLength={160}
          />
        )}
      />
      <Group position="right">
        <Button customType="secondary" onClick={() => onModalClose()}>
          Cancel
        </Button>
        {props.isSingleUpdate ? (
          <Button
            onClick={() => onSubmit(getValues())}
            customType="custom"
            styles={{ backgroundColor: `#0BCE66` }}
          >
            {"Submit"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setActive(1)}
            disabled={watch("sms_type_id") ? false : true}
            customType="custom"
            styles={{ backgroundColor: `#0BCE66` }}
          >
            {"Review Changes"}
          </Button>
        )}
      </Group>
    </Stack>
  );

  const rows = () => {
    return props.warehouses.map((item) => (
      <React.Fragment key={`list-${item.id}`}>
        <tr>
          <td>{item.name}</td>
          <td>
            <div style={{ width: 500 }}>
              <Text lineClamp={5} size={"xs"}>
                {item.ecomm_sms?.message || "Default"}
              </Text>
            </div>
          </td>
          <td>
            <Group>
              {item.ecomm_sms?.id ? (
                <Badge>Custom</Badge>
              ) : (
                <Badge color="dark">Default</Badge>
              )}
              <ArrowRight />
              <Badge>Custom</Badge>
            </Group>
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  const reviewChangesView = () => (
    <Stack>
      <Alert color="blue" title="Change Status" icon={<InfoCircle />}>
        Are you sure you want to change Custom SMS?
      </Alert>
      <Table highlightOnHover fontSize={"sm"}>
        <thead>
          <tr>
            <th>SMS Type</th>
            <th>SMS Message</th>
            <th>Message Type</th>
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
      </Table>
      <Paper withBorder radius={5}>
        <Stack>
          <h4>Summary Result</h4>
          <Input
            disabled
            label="SMS Type"
            defaultValue={
              smsTemplates.find((sms) => sms.id === getValues("sms_type_id"))
                ?.type || ""
            }
          />
          <Textarea
            disabled
            autosize
            minRows={5}
            defaultValue={getValues("message")}
            label="SMS Message"
          />
        </Stack>
      </Paper>
      <Group position="right">
        <Button
          icon={<ChevronLeft />}
          customType="secondary"
          onClick={() => setActive(0)}
        >
          Back to Assigning
        </Button>
        <Button
          onClick={() => onSubmit(getValues())}
          customType="custom"
          styles={{ backgroundColor: `#0BCE66` }}
        >
          {"Submit"}
        </Button>
      </Group>
    </Stack>
  );

  return (
    <Modal
      title="Assign Custom SMS"
      centered
      size={1300}
      opened={props.opened}
      onClose={() => onModalClose()}
    >
      <LoadingOverlay visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {props.isSingleUpdate ? (
          <div>{formView()}</div>
        ) : (
          <Stepper active={active}>
            <Stepper.Step label="Step 1" description="Assign SMS Type">
              {formView()}
            </Stepper.Step>
            <Stepper.Step
              label="Step 2"
              description="Review Summary and Submit"
            >
              {reviewChangesView()}
            </Stepper.Step>
          </Stepper>
        )}
      </form>
    </Modal>
  );
};
