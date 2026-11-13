import React, { memo } from "react";
import { ORDER } from "../../../../GraphQL";
import { Group, Text } from "../../../Elements";
import { CreateUpdateSMS } from "./CreateUpdateSMS";
import { DeleteSMS } from "./DeleteSMS";

type Props = {
  list: ORDER.SmsTemplate[];
  onCreateUpdateCustomSMS: (template: ORDER.SmsTemplate) => void;
  onDeleteSMS: (template: ORDER.SmsTemplate) => void;
};

const ListRows = (props: Props) => {
  const actions = (item: ORDER.SmsTemplate) => (
    <div style={{ width: 170 }}>
      <Group>
        <CreateUpdateSMS
          template={item}
          onCreateUpdateCustomSMS={props.onCreateUpdateCustomSMS}
        />
        <DeleteSMS template={item} onDelete={props.onDeleteSMS} />
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

export default memo(ListRows);
