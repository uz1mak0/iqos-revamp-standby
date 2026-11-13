import React, { useState } from "react";
import { ActionIcon } from "../../Elements/ActionIcon";
import { Table } from "../../Elements/Table";
import { CaretUp, CaretDown, Trash } from "tabler-icons-react";
import { Input } from "../../Elements/Input";
import { useStyles } from "./Transaction.syles";
import { DatePicker } from "../../Elements/DatePicker/DatePicker";
import { formatCodentify } from "../CodentifyScanner/Config";
import Notification from "../../Elements/Notification/Notification";
import { WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type TransactionBatchItems = WMS.BatchPulloutItems &
  WMS.BatchTransmittalItems &
  WMS.BatchTransferItems &
  WMS.BatchReturnItems;
type DisplayBatchItem = TransactionBatchItems & {
  isMapped?: boolean;
  mappingReference?: string;
  id?: string;
};

type SerialItem = {
  gtin: string | undefined;
  batch_id: string | undefined;
  quantity: string | undefined;
};

type Props = {
  isLending?: boolean;
  list: DisplayBatchItem[];
  skus: WMS.Sku[];
  onUpdateQuantity: (value: number, item: TransactionBatchItems) => void;
  onUpdateExpDate?: (value: Date, item: TransactionBatchItems) => void;
  onRemoveSerial?: (
    item: WMS.InventoryItem | null,
    serialItem: SerialItem
  ) => void;
  onRemoveItem?: (item: TransactionBatchItems) => void;
  onReceivedQuantity?: (value: number, item: TransactionBatchItems) => void;
  transaction?: WMS.Pullout | WMS.Transmittal | WMS.Return | WMS.Transfer;
  loaders?: { [key: string]: any };
  onRemoveMappedItem?: (id: string) => void;
};

export const TransactionTable = (props: Props) => {
  const accessRole = () => {
    if (
      user.isAdminDC ||
      user.isDirectRetailAdmin ||
      user.isEcommUser ||
      user.isAdministratorEC ||
      user.isAdminIC ||
      user.isFullAdmin ||
      user.isSE ||
      user.isStoreManager ||
      user.isFOM ||
      // old roles
      user.isAdmin ||
      user.isCRMAdmin ||
      user.isWarehousePersonnel ||
      user.isExecutive
    ) {
      return false;
    } else {
      return true;
    }
  };

  const [expand, setExpand] = useState<string[]>([]);
  const { classes } = useStyles();
  const [user] = useAtom(rolesAtom);
  const disable =
    props.transaction?.status === "COMPLETED" ||
    props?.transaction?.status === "CANCELLED" ||
    accessRole()
      ? true
      : false;
  const [editable, setEditable] = useState<number | undefined>(undefined);
  const [isFocus, setIsFocus] = useState<string | undefined>(undefined);

  const onClickItem = (item: TransactionBatchItems) => {
    const type = props?.skus?.find((e: WMS.Sku) => item?.gtin == e?.gtin)?.type;
    if (type !== "DEVICES" && type !== "VOUCHER") return;
    if (expand?.some((e: string) => e == `${item?.gtin}-${item?.batch_id}`)) {
      setExpand(
        expand.filter((e: string) => e != `${item?.gtin}-${item?.batch_id}`)
      );
    } else {
      setExpand(expand.concat(`${item?.gtin}-${item?.batch_id}`));
    }
  };

  const onCheckReceivedQty = (value: number, item: TransactionBatchItems) => {
    if (value < 0) {
      Notification.error({ message: "Invalid receive quantiy" });
    } else if (value > (item?.quantity || 0)) {
      Notification.error({
        message: "Entered receive quantity is greater than expected",
      });
    } else {
      props?.onReceivedQuantity
        ? props?.onReceivedQuantity(value, item)
        : undefined;
    }
    setEditable(undefined);
  };

  const rows = () => {
    if (!props.list) return;
    const list = [...(props.list || [])];

    return list?.map((element: DisplayBatchItem, index: number) => {
      const isMapped = !!element?.isMapped;
      const rowKey =
        element?.id ||
        `${element?.gtin ?? "item"}-${element?.batch_id ?? "batch"}-${index}`;
      return (
        <React.Fragment key={rowKey}>
          <tr onClick={() => (isMapped ? undefined : onClickItem(element))}>
            <td style={{ width: 10 }}>
            {!isMapped &&
            (props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
              ?.type === "DEVICES" ||
              props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                ?.type === "VOUCHER") ? (
              <div data-testid={`expand-${element.gtin}-${element.batch_id}`}>
                <ActionIcon>
                  {expand?.some(
                    (e: string) => e == `${element?.gtin}-${element?.batch_id}`
                  ) ? (
                    <CaretUp />
                  ) : (
                    <CaretDown />
                  )}
                </ActionIcon>
              </div>
            ) : undefined}
          </td>
          <td>{element?.gtin?.replace("_PMI", "")}</td>
          <td>{element?.sku}</td>
          <td>{element?.description}</td>
          <td>{element?.batch_id}</td>
          <td
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {disable ||
            isMapped ||
            editable !== index ||
            props?.transaction?.status === "FLOATING" ? (
              <div
                className={
                  props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                    ?.type == "DEVICES" ||
                  props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                    ?.type === "VOUCHER" ||
                  element?.batch_id === "FEFO" ||
                  props?.transaction?.status === "FLOATING"
                    ? undefined
                    : classes.editableContentDate
                }
                onClick={() => {
                  if (isMapped) return;
                  if (
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type == "DEVICES" ||
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type === "VOUCHER" ||
                    props?.transaction?.status === "FLOATING"
                  ) {
                    return undefined;
                  } else {
                    setEditable(index);
                    setIsFocus("QTY");
                  }
                }}
              >
                <span
                  data-testid={`display-${element.gtin}-${element.batch_id}`}
                >
                  {element?.quantity}
                </span>
              </div>
            ) : (
              <div data-testid={`qty-${element.gtin}-${element.batch_id}`}>
                <Input
                  autoFocus={isFocus === "QTY"}
                  defaultValue={element?.quantity || undefined}
                  onBlur={(e: any) => {
                    props.onUpdateQuantity(e.target.value, element);
                    setEditable(undefined);
                    setIsFocus(undefined);
                  }}
                  placeholder="Enter Qty"
                  disabled={props.transaction?.status === "COMPLETED"}
                  className={classes.inputQty}
                  type="number"
                />
              </div>
            )}
          </td>
          {props?.transaction?.id?.includes("TRANSFER") &&
          props?.transaction?.status === "FLOATING" ? (
            <td
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {disable || editable !== index || isMapped ? (
                <div
                  className={
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type == "DEVICES" ||
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type === "VOUCHER" ||
                    element?.batch_id === "FEFO"
                      ? undefined
                      : classes.editableContentDate
                  }
                  onClick={() => {
                    if (isMapped) return;
                    if (
                      props?.skus?.find(
                        (e: WMS.Sku) => element?.gtin == e?.gtin
                      )?.type == "DEVICES" ||
                      props?.skus?.find(
                        (e: WMS.Sku) => element?.gtin == e?.gtin
                      )?.type === "VOUCHER"
                    ) {
                      return undefined;
                    } else {
                      setEditable(index);
                      setIsFocus("QTY");
                    }
                  }}
                >
                  <span
                    data-testid={`receieved-${element.gtin}-${element.batch_id}`}
                  >
                    {element.received || 0}
                  </span>
                </div>
              ) : (
                <div data-testid={`qty-${element.gtin}-${element.batch_id}`}>
                  <Input
                    autoFocus={isFocus === "QTY"}
                    defaultValue={element.received || 0}
                    onBlur={(e: any) => {
                      onCheckReceivedQty(e.target.value, element);
                      setEditable(undefined);
                      setIsFocus(undefined);
                    }}
                    placeholder="Enter Qty"
                    className={classes.inputQty}
                    type="number"
                  />
                </div>
              )}
            </td>
          ) : undefined}
          {props?.transaction?.id?.includes("TRANSMITTAL") ? (
            <td
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {disable || editable !== index ? (
                <div
                  className={
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type == "DEVICES" ||
                    props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                      ?.type === "VOUCHER" ||
                    props?.transaction?.status === "FLOATING"
                      ? undefined
                      : classes.editableContentDate
                  }
                  onClick={() => {
                    if (
                      props?.skus?.find(
                        (e: WMS.Sku) => element?.gtin == e?.gtin
                      )?.type == "DEVICES" ||
                      props?.skus?.find(
                        (e: WMS.Sku) => element?.gtin == e?.gtin
                      )?.type === "VOUCHER" ||
                      props?.transaction?.status === "FLOATING"
                    ) {
                      return undefined;
                    } else {
                      setEditable(index);
                      setIsFocus("DATE");
                    }
                  }}
                >
                  <span>{element?.expiration_date}</span>
                </div>
              ) : (
                <DatePicker
                  autoFocus={isFocus === "DATE"}
                  clearable={false}
                  dropdownType="modal"
                  onDropdownClose={() => {
                    setIsFocus(undefined);
                    setEditable(undefined);
                  }}
                  initiallyOpened={isFocus === "DATE"}
                  defaultValue={new Date(`${element?.expiration_date}`)}
                  onChange={(e) =>
                    props.onUpdateExpDate
                      ? props.onUpdateExpDate(e, element)
                      : undefined
                  }
                  className={classes.datePicker}
                />
              )}
            </td>
          ) : undefined}
          <td>
            { props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)?.type}
          </td>
          <td> {element?.updated_by}</td>
          <td
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {isMapped ? (
              <div data-testid={`remove-${element.gtin}-${element.batch_id}`}>
                <ActionIcon
                  disabled={props?.loaders?.batch || props?.loaders?.device}
                  color="red"
                >
                  <Trash
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      props.onRemoveMappedItem
                        ? props.onRemoveMappedItem(
                            element.id ||
                              `${element?.batch_id}-${element?.gtin}`,
                          )
                        : undefined;
                    }}
                  />
                </ActionIcon>
              </div>
            ) : disable ||
              props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                ?.type === "DEVICES" ||
              props?.skus?.find((e: WMS.Sku) => element?.gtin == e?.gtin)
                ?.type === "VOUCHER" ||
              element?.batch_id === "FEFO" ||
              props?.transaction?.status === "FLOATING" ? undefined : (
              <div data-testid={`remove-${element.gtin}-${element.batch_id}`}>
                <ActionIcon
                  disabled={props?.loaders?.batch || props?.loaders?.device}
                  color="red"
                >
                  <Trash
                    onClick={(e) => {
                      props.onRemoveItem
                        ? props.onRemoveItem(element)
                        : undefined;
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </ActionIcon>
              </div>
            )}
          </td>
        </tr>

        {expand?.some(
          (e: string) => e == `${element?.gtin}-${element?.batch_id}`
        ) ? (
          <tr key={`list-expanded=${index}`}>{expandedTable(element)}</tr>
        ) : undefined}
      </React.Fragment>
    );
  });
  };

  const expandedTable = (device: DisplayBatchItem) => {
    return (
      <>
        <td colSpan={9}>
          <div>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Serial {`(${device?.inventory?.items?.length})`}</th>
                  {props?.skus?.find((e: WMS.Sku) => device?.gtin == e?.gtin)
                    ?.type === "DEVICES" && props.isLending ? (
                    <th>Holder</th>
                  ) : undefined}
                  {props?.skus?.find((e: WMS.Sku) => device?.gtin == e?.gtin)
                    ?.type === "DEVICES" && props.isLending ? (
                    <th>Charger</th>
                  ) : undefined}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {device?.inventory?.items?.map(
                  (
                    item: WMS.Maybe<WMS.Maybe<WMS.InventoryItem>>,
                    i: number
                  ) => (
                    <tr key={` batch-${i}`}>
                      <td></td>
                      <td>{item?.serial}</td>
                      {props?.skus?.find(
                        (e: WMS.Sku) => device?.gtin == e?.gtin
                      )?.type === "DEVICES" && props.isLending ? (
                        <td>{item?.holder_serial}</td>
                      ) : undefined}
                      {props?.skus?.find(
                        (e: WMS.Sku) => device?.gtin == e?.gtin
                      )?.type === "DEVICES" && props.isLending ? (
                        <td>{item?.charger_serial}</td>
                      ) : undefined}
                      <td>
                        {disable ||
                        (props?.transaction?.id?.includes("TRANSFER") &&
                          props?.transaction?.status === "FLOATING" &&
                          item?.warehouse_id ===
                            props.transaction.warehouse_id) ? undefined : (
                          <div
                            data-testid={`remove-${device.gtin}-${item?.serial}`}
                          >
                            <ActionIcon
                              disabled={
                                props?.loaders?.batch || props?.loaders?.device
                              }
                              color="red"
                            >
                              <Trash
                                onClick={() =>
                                  props.onRemoveSerial
                                    ? props.onRemoveSerial(item, {
                                        gtin: `${device?.gtin}`,
                                        batch_id: `${device?.batch_id}`,
                                        quantity: `${device?.quantity}`,
                                      })
                                    : undefined
                                }
                              />
                            </ActionIcon>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className={classes.tabPanelTableContainer}>
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th></th>
            <th>GTIN</th>
            <th>SKU</th>
            <th>Description</th>
            <th>Batch ID</th>
            <th style={{ width: 220 }}>Quantity</th>
            {props?.transaction?.id?.includes("TRANSMITTAL") ? (
              <th style={{ width: 220 }}>Expiration Date</th>
            ) : undefined}
            {props?.transaction?.id?.includes("TRANSFER") &&
            props?.transaction.status === "FLOATING" ? (
              <th style={{ width: 220 }}>Received</th>
            ) : undefined}
            <th>Type</th>
            <th>Updated By</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows()}</tbody>
      </Table>
    </div>
  );
};
