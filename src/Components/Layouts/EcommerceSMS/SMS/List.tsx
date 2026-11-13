import React, { useEffect, useState } from "react";
import { Group, Stack, Table } from "../../../Elements";
import { getSMSTemplates } from "../../../../GraphQL/SMSSettingsSchema";
import { useLazyQuery } from "@apollo/client";
import { ORDER } from "../../../../GraphQL";
import { CreateUpdateSMS } from "./CreateUpdateSMS";
import ListRows from "./ListRows";
import { LoadingOverlay, Text } from "@mantine/core";

export const List = () => {
  const [fetchSMSTemplates, { loading: loadingSMSTemplates }] = useLazyQuery(
    getSMSTemplates,
    { context: { clientName: "order" } },
  );
  const [smsTemplates, setSmsTemplates] = useState<ORDER.SmsTemplate[]>([]);

  useEffect(() => {
    loadSMSTemplates([], undefined);
  }, []);

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
  const onCreateUpdateCustomSMS = (template: ORDER.SmsTemplate) => {
    const updatelist = [...smsTemplates];
    if (updatelist.some((e) => e.id === template.id)) {
      const index = updatelist.findIndex((e) => e.id === template.id);
      updatelist[index] = { ...template };
    } else {
      updatelist.push(template);
    }
    setSmsTemplates(updatelist);
  };

  const onDeleteSMS = (template: ORDER.SmsTemplate) => {
    const updateList = smsTemplates.filter((e) => e.id !== template.id);
    setSmsTemplates(updateList);
  };

  return (
    <div>
      <LoadingOverlay visible={loadingSMSTemplates} />
      <Stack>
        <Group position="apart">
          <div>
            <Text fw={700} fz="lg">
              List of Custom SMS
            </Text>
            <Text fz="sm" c="dimmed">
              Templates tailored for specific notifications
            </Text>
          </div>
          <CreateUpdateSMS onCreateUpdateCustomSMS={onCreateUpdateCustomSMS} />
        </Group>
        <Table highlightOnHover fontSize={"md"}>
          <thead>
            <tr>
              <th>SMS Type</th>
              <th>SMS Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <ListRows
              list={smsTemplates}
              onCreateUpdateCustomSMS={onCreateUpdateCustomSMS}
              onDeleteSMS={onDeleteSMS}
            />
          </tbody>
        </Table>
      </Stack>
    </div>
  );
};
