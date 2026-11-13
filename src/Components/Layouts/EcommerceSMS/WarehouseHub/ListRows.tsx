import React, { memo, useState } from "react";
import { WMS } from "../../../../GraphQL";
import { Checkbox } from "../../../Elements";
import { ChangeSMSType } from "../SMS/ChangSMSType";
import { Details } from "../SMS/Details";
import { Text } from "@mantine/core";

type Props = {
  warehouses: WMS.Warehouse[];
  selectedWarehouse: WMS.Warehouse[];
  onSelectWarehouse: (isSelected: boolean, warehouse: WMS.Warehouse) => void;
  onChangeSMStype: (wh: WMS.Warehouse) => void;
};

const ListRows = (props: Props) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<
    WMS.Warehouse | undefined
  >(undefined);
  return (
    <>
      <Details
        warehouse={selectedWarehouse}
        onClose={() => setSelectedWarehouse(undefined)}
      />
      {props.warehouses.map((item) => (
        <React.Fragment key={`list-${item.id}`}>
          <tr>
            <td>
              <Checkbox
                checked={props.selectedWarehouse.some((e) => e.id === item.id)}
                onChange={(e) =>
                  props.onSelectWarehouse(e.target.checked, item)
                }
                label={""}
              />
            </td>
            <td onClick={() => setSelectedWarehouse(item)}>{item.name}</td>
            <td onClick={() => setSelectedWarehouse(item)}>{item.type}</td>
            <td onClick={() => setSelectedWarehouse(item)}>{item.area}</td>
            <td onClick={() => setSelectedWarehouse(item)}>{item.id}</td>
            <td onClick={() => setSelectedWarehouse(item)}>
              {item.ecomm_sms?.type || "Default"}
            </td>
            <td onClick={() => setSelectedWarehouse(item)}>
              <div style={{ width: 250 }}>
                <Text size={"xs"} lineClamp={2}>
                  {item.ecomm_sms?.message || "Default"}
                </Text>
              </div>
            </td>
            <td>
              <ChangeSMSType
                onChangeSMStype={props.onChangeSMStype}
                hasSelectedWarehouse={
                  props.selectedWarehouse.length > 0 ? true : false
                }
                warehouse={item}
              />
            </td>
          </tr>
        </React.Fragment>
      ))}
    </>
  );
};

export default memo(ListRows);
