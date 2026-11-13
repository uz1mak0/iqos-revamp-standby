import { Alert, Group, Switch, Textarea, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { ORDER, WMS } from "../../../../GraphQL";
import {
  Badge,
  Button,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Table,
  Text,
} from "../../../Elements";
import { ArrowRight, InfoCircle } from "tabler-icons-react";
import { useMutation } from "@apollo/client";
import { unAssignSMSToWarehouses } from "../../../../GraphQL/SMSSettingsSchema";
import { Controller } from "react-hook-form";
import { AssignSMS } from "./AssignSMS";
import { UnAssignSMS } from "./UnAssignSMS";
import { AssignEcommerceSMSFormInput } from "../config";

type Props = {
  warehouse: WMS.Warehouse;
  hasSelectedWarehouse: boolean;
  onChangeSMStype: (wh: WMS.Warehouse) => void;
};

export const ChangeSMSType = (props: Props) => {
  const [opened, setOpened] = useState(false);

  const onAssignSMSToWarehouses = (sms: ORDER.SmsTemplate) => {
    const updateWarehouse = {
      ...props.warehouse,
      ecomm_sms: sms,
    };
    props.onChangeSMStype(updateWarehouse);
  };

  const onUnAssignSMSToWarehouses = () => {
    const updateWarehouse = {
      ...props.warehouse,
      ecomm_sms: undefined,
    };
    props.onChangeSMStype(updateWarehouse);
  };

  return (
    <div>
      <AssignSMS
        opened={opened && (props.warehouse.ecomm_sms ? false : true)}
        warehouses={[props.warehouse]}
        onClose={() => setOpened(false)}
        isSingleUpdate={true}
        onAssignSMSToWarehouses={onAssignSMSToWarehouses}
      />
      <UnAssignSMS
        opened={opened && (props.warehouse.ecomm_sms ? true : false)}
        warehouses={[props.warehouse]}
        onClose={() => setOpened(false)}
        onUnAssignSMSToWarehouses={onUnAssignSMSToWarehouses}
      />
      <Switch
        checked={props.warehouse.ecomm_sms ? true : false}
        onLabel="CUSTOM"
        offLabel="DEFAULT"
        size="lg"
        title="Change "
        disabled={props.hasSelectedWarehouse ? true : false}
        onClick={() => setOpened(true)}
        styles={{
          trackLabel: { width: 50 },
          track: true
            ? {
                border: "#495057 solid",
                backgroundColor: "#495057",
                color: "white",
              }
            : {
                border: "#228BE6 solid",
                backgroundColor: "#228BE6",
                color: "white",
              },
        }}
        color="#228BE6"
      />
    </div>
  );
};
