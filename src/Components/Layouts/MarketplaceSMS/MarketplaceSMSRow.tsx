import React, { memo } from "react";
import { ORDER } from "../../../GraphQL";
import { Group, Text } from "../../Elements";
import { CreateUpdateSMS } from "./CreateUpdateSMS";
import { DeleteSMS } from "./DeleteSMS";
import { Switch } from "@mantine/core";

type Props = {
  list: ORDER.SmsTemplate[];
  activeTemplate: ORDER.SmsTemplate | undefined;
  selectedTemplate: ORDER.SmsTemplate | undefined;
  setSelectedTemplate: React.Dispatch<
    React.SetStateAction<ORDER.SmsTemplate | undefined>
  >;
  onDeleteSMS: (template: ORDER.SmsTemplate) => void;
  onCreateUpdateSMS: (template: ORDER.SmsTemplate, isActive: boolean) => void;
};

const MarketplaceSMSRow = (props: Props) => {
  const actions = (item: ORDER.SmsTemplate) => (
    <div style={{ width: 170 }}>
      <Group>
        <Switch
          checked={
            item.id === props.activeTemplate?.reference_id ? true : false
          }
          onLabel="Active"
          offLabel="Inactive"
          size="lg"
          disabled={props.selectedTemplate ? true : false}
          onChange={() => props.setSelectedTemplate(item)}
          styles={{
            trackLabel: { width: 50 },
            track:
              item.id !== props.activeTemplate?.reference_id
                ? {
                    border: "#F03E3E solid",
                    backgroundColor: "#F03E3E",
                    color: "white",
                  }
                : {
                    border: "green solid",
                    backgroundColor: "green",
                    color: "white",
                  },
          }}
          color="green"
        />
        {item.type !== "DEFAULT" ? (
          <CreateUpdateSMS
            isUpdate={true}
            isActive={props.activeTemplate?.reference_id === item.id}
            template={item}
            onCreateUpdateSMS={props.onCreateUpdateSMS}
          />
        ) : undefined}
        {item.type !== "DEFAULT" ? (
          <DeleteSMS
            template={item}
            isActive={props.activeTemplate?.reference_id === item.id}
            onDelete={props.onDeleteSMS}
          />
        ) : undefined}
      </Group>
    </div>
  );

  return (
    <>
      {props.list.map((item) => (
        <React.Fragment key={`list-${item.id}`}>
          <tr>
            <td>{item.type}</td>
            <td>
              <div style={{ whiteSpace: "pre-wrap" }}>
                <Text size={12}>{item.message}</Text>
              </div>
            </td>

            <td>{actions(item)}</td>
          </tr>
        </React.Fragment>
      ))}
    </>
  );
};

export default memo(MarketplaceSMSRow);
