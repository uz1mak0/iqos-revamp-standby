import { useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";
import { Trash } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { userAtom } from "../../../Store/StoreAtom";
import {
  ActionIcon,
  Input,
  Paper,
  Table,
  NumberInput,
  Badge,
  Select,
  RadioGroup,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { UseFormReturnType } from "@mantine/form";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "../SalesLogs/Sales.styles";

type Props = {
  form: UseFormReturnType<
    {
      first_name: string;
      last_name: string;
      phone_number: string;
      scanned_items: WMS.LineItemInput[];
      warehouse_id: string;
      device: string;
      gt_type: string;
    },
    (values: {
      first_name: string;
      last_name: string;
      phone_number: string;
      scanned_items: WMS.LineItemInput[];
      warehouse_id: string;
      device: string;
      gt_type: string;
    }) => {
      first_name: string;
      last_name: string;
      phone_number: string;
      scanned_items: WMS.LineItemInput[];
      warehouse_id: string;
      device: string;
      gt_type: string;
    }
  >;
  isRecordSale?: boolean;
};

export const GuidedTrialItems = (props: Props) => {
  const { height, width } = useViewportSize();
  const { classes } = useStyles();
  const [user] = useAtom(userAtom);
  const { data: dataSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: "DIRECT_RETAIL" },
  });
  const inputNonDeviceRef = useRef<HTMLInputElement>(null);
  const GTDevices = [
    "BONDS",
    "IQOS ORIGINALS",
    "IQOS 3.0",
    "IQOS 2.4",
    "IQOS ILUMA",
  ];
  const [device, setDevice] = useState<string | undefined>(undefined);

  const onChangeQuantity = (
    item: WMS.LineItemInput,
    quantity: number | undefined,
    isQuantity: boolean,
  ) => {
    const updateList = [...props.form.values.scanned_items];
    const index = updateList.findIndex((e) => e.gtin === item.gtin);
    if (isQuantity) {
      updateList[index] = { ...updateList[index], quantity: Number(quantity) };
    }
    props.form.setFieldValue("scanned_items", updateList);
  };

  const onScanNonDevice = (gtin: string) => {
    const updatedGTIN = gtin.includes("GT_") ? gtin : `GT_${gtin}`;
    const skus: WMS.Sku[] = dataSKU?.skus?.items;
    const updateList = [...props.form.values.scanned_items];
    if (inputNonDeviceRef.current?.value) {
      inputNonDeviceRef.current.value = "";
    }
    if (!skus.some((e) => e.gtin === updatedGTIN)) {
      return Notification.error({
        title: "Error",
        message: "SKU/GTIN not found",
      });
    } else {
      const item = skus.find((e) => e.gtin === updatedGTIN);
      if (item?.type === "DEVICES")
        return Notification.error({
          message: "Cannot scan device using GTIN!",
        });
      if (props.form.values.scanned_items.some((e) => e.gtin === item?.gtin)) {
        const index = updateList?.findIndex((e) => e.gtin === item?.gtin);
        updateList[index] = {
          ...updateList[index],
          quantity: (updateList[index]?.quantity || 0) + 1,
        };
        props.form.setFieldValue("scanned_items", []);
        setTimeout(() => {
          props.form.setFieldValue("scanned_items", updateList);
        }, 0);
      } else {
        const updateItem = {
          quantity: 1,
          gtin: item?.gtin ? item?.gtin : "",
          serials: undefined,
          inputs: undefined,
          sku: {
            gtin: item?.gtin ? item?.gtin : "",
            name: item?.description,
            sku: item?.sku ? item?.sku : "",
            type: item?.type,
            unit_of_measure: item?.unit_of_measure,
            description: item?.description,
            channel: WMS.ChannelType.DirectRetail,
          },
        };
        updateList.push(updateItem);
        props.form.setFieldValue("scanned_items", updateList);
      }
    }
  };

  const onRemoveItem = (item: WMS.LineItemInput) => {
    props.form.setFieldValue(
      "scanned_items",
      props.form.values.scanned_items.filter((e) => e.gtin !== item.gtin),
    );
  };

  const rows = props.form.values.scanned_items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element.gtin}</td>
      <td>{element.sku?.description}</td>
      <td>{element.sku?.unit_of_measure}</td>
      <td>
        {element.sku?.type === "DEVICES" || props.isRecordSale ? (
          element.quantity
        ) : (
          <NumberInput
            min={0}
            precision={0}
            disabled={props.isRecordSale}
            onChange={(e) => onChangeQuantity(element, e || 0, true)}
            style={{ width: 100 }}
            defaultValue={element?.quantity || 0}
          />
        )}
      </td>
      <td>
        {props.isRecordSale ? undefined : (
          <ActionIcon onClick={() => onRemoveItem(element)}>
            <Trash color="red" />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <Paper radius={12}>
      <h4>Record GT</h4>
      <RadioGroup
        description="GT Type"
        defaultValue="FGT"
        {...props.form.getInputProps("gt_type")}
        data={[
          {
            label: "First time GT",
            value: "FTGT",
          },
          {
            label: "SGT",
            value: "SGT",
          },
        ]}
      />
      <br />

      <Select
        {...props.form.getInputProps("device")}
        placeholder="Select GT device"
        description="GT Device used"
        data={GTDevices.map((e) => {
          return {
            value: e,
            label: e,
          };
        })}
        onChange={(e) => props.form.setFieldValue("device", e)}
        isPullUpSelect={width <= isTabletMobileView}
        onSelectFromPullUp={(value) =>
          props.form.setFieldValue("device", value)
        }
      />
      <br />
      <div>
        <Input
          innerref={inputNonDeviceRef}
          onKeyPress={(e) =>
            e.key === "Enter" ? onScanNonDevice(e.target.value) : undefined
          }
          disabled={!props.form.values.device || props.isRecordSale}
          description="HEETS and Others"
          placeholder="SCAN GTIN"
          style={{ width: "100%" }}
        />
      </div>

      <br />
      <Table
        highlightOnHover
        fontSize={width <= isTabletMobileView ? "xs" : "md"}
      >
        <thead>
          <tr>
            <th>
              <div className={classes.mobileTableTH}>GTIN</div>
            </th>
            <th>
              <div className={classes.mobileTableTH}>Name</div>
            </th>
            <th>
              <div className={classes.mobileTableTH}>UOM</div>
            </th>
            <th>
              <div className={classes.mobileTableTH}>Quantity</div>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
};
