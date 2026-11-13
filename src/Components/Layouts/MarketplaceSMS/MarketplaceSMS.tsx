import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
} from "../../Elements";
import { Text } from "@mantine/core";
import { useLazyQuery } from "@apollo/client";
import {
  getActiveSMSTemplates,
  getSMSTemplates,
} from "../../../GraphQL/SMSSettingsSchema";
import { ORDER } from "../../../GraphQL";
import { Switch } from "@mantine/core";
import { CreateUpdateSMS } from "./CreateUpdateSMS";
import { DeleteSMS } from "./DeleteSMS";
import { ChangeStatus } from "./ChangeStatus";
import MarketplaceSMSRow from "./MarketplaceSMSRow";

export const MarketplaceSMS = () => {
  const [fetchSMSTemplates, { loading: loadingSMSTemplates }] = useLazyQuery(
    getSMSTemplates,
    { context: { clientName: "order" } },
  );
  const [fetchActiveSMSTemplate, { loading: loadingActiveSMSTemplate }] =
    useLazyQuery(getActiveSMSTemplates, { context: { clientName: "order" } });
  const [activeTemplate, setActiveTemplate] = useState<
    ORDER.SmsTemplate | undefined
  >();
  const [templates, setTemplates] = useState<ORDER.SmsTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<
    ORDER.SmsTemplate | undefined
  >(undefined);

  useEffect(() => {
    loadActiveSMS();
  }, []);

  const loadActiveSMS = () => {
    fetchActiveSMSTemplate({ fetchPolicy: "no-cache" }).then((res) => {
      setActiveTemplate(res.data.activeSMSTemplate);
      loadSMSTemplates([], undefined);
    });
  };

  const loadSMSTemplates = (
    list: ORDER.SmsTemplate[],
    nextToken: string | undefined,
  ) => {
    fetchSMSTemplates({
      variables: {
        sms_channel: ORDER.SmsChannel.Marketplace,
        next_token: nextToken,
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      const updateList = [...list, ...res.data.smsTemplates.items];
      const token = res.data.smsTemplates.next_token;
      if (token) {
        loadSMSTemplates(updateList, token);
      } else {
        setTemplates(updateList);
      }
    });
  };

  const onCreateUpdateSMS = (
    template: ORDER.SmsTemplate,
    isActive: boolean,
  ) => {
    const updatelist = [...templates];
    if (isActive) {
      setActiveTemplate(template);
      const index = templates.findIndex((e) => e.id === template.reference_id);
      updatelist[index] = { ...template, id: template.reference_id };
    } else {
      if (templates.some((e) => e.id === template.id)) {
        const index = templates.findIndex((e) => e.id === template.id);
        updatelist[index] = { ...template };
      } else {
        updatelist.push(template);
      }
    }
    setSelectedTemplate(undefined);
    setTemplates(updatelist);
  };

  const onDeleteSMS = (template: ORDER.SmsTemplate) => {
    const updateList = templates.filter((e) => e.id !== template.id);
    setTemplates(updateList);
  };

  const onChangeStatus = (template: ORDER.SmsTemplate) => {
    setActiveTemplate(template);
    setSelectedTemplate(undefined);
  };

  const rearrangeTemplateOrder = (list: ORDER.SmsTemplate[]) => {
    const filterList = list.filter(
      (e) => e.id !== activeTemplate?.reference_id,
    );
    const item = list.find((e) => e?.id === activeTemplate?.reference_id);
    if (item) {
      filterList.unshift(item);
    }
    return filterList;
  };

  return (
    <Stack>
      <LoadingOverlay
        visible={loadingActiveSMSTemplate || loadingSMSTemplates}
      />
      <Group position="apart">
        <div>
          <Text fw={700} fz="lg">
            Marketplace SMS
          </Text>
          <Text fz="sm" c="dimmed">
            Manage your SMS preferences for order updates, account alerts, and
            promotions
          </Text>
        </div>
        <CreateUpdateSMS
          isActive={
            selectedTemplate?.id === activeTemplate?.reference_id ? true : false
          }
          onCreateUpdateSMS={onCreateUpdateSMS}
        />
      </Group>
      <ChangeStatus
        isActive={
          selectedTemplate?.id === activeTemplate?.reference_id ? true : false
        }
        selectedTemplate={selectedTemplate}
        onClose={() => setSelectedTemplate(undefined)}
        onChangeStatus={onChangeStatus}
      />
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>SMS Type</th>
            <th>SMS Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <MarketplaceSMSRow
            selectedTemplate={selectedTemplate}
            activeTemplate={activeTemplate}
            setSelectedTemplate={setSelectedTemplate}
            list={rearrangeTemplateOrder(templates)}
            onCreateUpdateSMS={onCreateUpdateSMS}
            onDeleteSMS={onDeleteSMS}
          />
        </tbody>
      </Table>
    </Stack>
  );
};
