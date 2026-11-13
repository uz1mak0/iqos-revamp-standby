import React, { useState } from "react";
import { CaretDown, CaretUp } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import {
  Accordion,
  ActionIcon,
  LoadingOverlay,
  Paper,
  Table,
} from "../../Elements";
import { useStyles } from "./Activation.styles";

type Props = {
  id: string;
  inventory: WMS.InventoryItem[];
  batches: WMS.BatchItems[];
  vouchers: WMS.InventoryItem[];
  loading: boolean;
};

export const ActivationInventory = (props: Props) => {
  const [expand, setExpand] = useState<string[]>([]);
  const { classes } = useStyles();

  const rows = () => {
    const list =
      props?.inventory?.length == 0
        ? props?.batches?.filter((e) => e?.inventory_type !== "DEVICES")
        : props.batches;
    return list?.map((element, index) => (
      <React.Fragment key={`list-${index}`}>
        <tr>
          <td style={{ width: 10 }}>
            {element.inventory_type === "DEVICES" ||
            element.inventory_type === "VOUCHER" ? (
              <ActionIcon>
                {expand?.some(
                  (e) => e == `${element.gtin}_${element.batch_id}`,
                ) ? (
                  <CaretUp
                    onClick={() =>
                      setExpand(
                        expand.filter(
                          (e) => e != `${element.gtin}_${element.batch_id}`,
                        ),
                      )
                    }
                  />
                ) : (
                  <CaretDown
                    onClick={() =>
                      setExpand(
                        expand.concat(`${element.gtin}_${element.batch_id}`),
                      )
                    }
                  />
                )}
              </ActionIcon>
            ) : undefined}
          </td>
          <td>{element.gtin}</td>
          <td>{element.sku}</td>
          <td>{element.batch_id}</td>
          <td>{element?.quantity}</td>
          <td>{element?.description}</td>
          <td>{element?.inventory_type}</td>
        </tr>
        {expand?.some((e) => e == `${element.gtin}_${element.batch_id}`) ? (
          <tr key={`list-expanded=${index}`}>{expandedTable(element)}</tr>
        ) : undefined}
      </React.Fragment>
    ));
  };

  const expandedTable = (item: WMS.BatchItems) => {
    const list =
      item.inventory_type === "VOUCHER"
        ? props.vouchers.filter((e) => e.batch_id === item.batch_id)
        : props.inventory.filter(
            (e) => e.batch_id === item.batch_id && item.gtin === e.gtin,
          );
    return (
      <td colSpan={8}>
        <div>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                <th>Serial</th>
                <th>GTIN</th>
                <th>Batch ID</th>
                {item.inventory_type === "VOUCHER" ? undefined : (
                  <th>Charger Serial</th>
                )}
                {item.inventory_type === "VOUCHER" ? undefined : (
                  <th>Holder Serial</th>
                )}
              </tr>
            </thead>
            <tbody>
              {list?.map((itemList, i) => (
                <tr key={` batch-${i}`}>
                  <td></td>
                  <td>{itemList?.serial}</td>
                  <td>{itemList.gtin || "LVC"}</td>
                  <td>{itemList?.batch_id}</td>
                  {item.inventory_type === "VOUCHER" ? undefined : (
                    <td>{itemList?.charger_serial}</td>
                  )}
                  {item.inventory_type === "VOUCHER" ? undefined : (
                    <td>{itemList?.holder_serial}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </td>
    );
  };

  return (
    <div>
      {/* <LoadingOverlay visible={props.loading}/> */}
      <Paper radius={10}>
        <Accordion variant="separated" defaultValue="none">
          <Accordion.Item value="inventory">
            <Accordion.Control>Activation Inventory</Accordion.Control>
            <Accordion.Panel>
              <div className={classes.tabPanelTableContainer}>
                <Table highlightOnHover fontSize={"md"}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>GTIN</th>
                      <th>SKU</th>
                      <th>Batch ID</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th>Inventory Type</th>
                    </tr>
                  </thead>
                  <tbody>{rows()}</tbody>
                </Table>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>
    </div>
  );
};
