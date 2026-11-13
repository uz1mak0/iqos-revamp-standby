/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  CaretDown,
  CaretUp,
  Checklist,
  CircleCheck,
  Edit,
  Plus,
  Qrcode,
  QuestionMark,
  Scan,
  Trash,
  X,
  Printer,
} from "tabler-icons-react";
import Notification from "../../Elements/Notification/Notification";
import { formatCodentify } from "../../Layouts/CodentifyScanner/Config";
import { getInventoryItem } from "../../../GraphQL/CodentifyScannerSchema";
import {
  getItemStocks,
  pickAndPackSave,
  pickAndPackVoid,
  orderUpdate,
  generatePDF,
} from "../../../GraphQL/OrderManagementSchema";
import { ItemEditor } from "./ItemEditor";
import {
  ActionIcon,
  Button,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Paper,
  Table,
  Popover,
  Stack,
} from "../../Elements";
import { ORDER, WMS } from "../../../GraphQL";
import { InventoryItem, Maybe } from "../../../GraphQL/_gql/order/graphql";
import { useForm } from "@mantine/form";
import { Flex, Loader, Text, Title, TextInput } from "@mantine/core";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { updateGTIN } from "./Config";
import { openConfirmModal } from "@mantine/modals";
import { IconTextScan2 } from "@tabler/icons-react";

type Props = {
  isPack?: boolean;
  order?: ORDER.Order;
  skus?: WMS.Sku[];
  onUpdate: (order: ORDER.Order) => void;
};

interface ScannedItems extends ORDER.OrderItem {
  gtin: ORDER.Maybe<string> | undefined;
  type: WMS.Maybe<WMS.SkuType> | undefined;
  scanned_quantity: ORDER.Maybe<number> | undefined;
}

export const OrderPickAndPack = (props: Props) => {
  const [userRoles] = useAtom(rolesAtom);
  const [expand, setExpand] = useState<number[]>([]);
  const [updateHistory, setUpdateHistory] = useState(false);
  const [itemEditor, setItemEditor] = useState(false);
  const [scannedItems, setScannedItems] = useState<ScannedItems[]>([]);
  const [stocks, setStocks] = useState<WMS.ItemStocks[]>([]);

  const [openSI, setOpenSI] = useState(false);
  const [invoice, setInvoice] = useState<string>("");

  const [refetchStocks, { loading: loadingStocks }] = useLazyQuery(
    getItemStocks,
    { context: { clientName: "warehouse" } },
  );
  const [refetchSerial, { data: dataSerial, loading: loadingSerial }] =
    useLazyQuery(getInventoryItem, { context: { clientName: "warehouse" } });
  const [pickAndPack, { loading: loadingPickAndPack }] = useMutation(
    pickAndPackSave,
    { context: { clientName: "order" } },
  );
  const [voidPickAndPack, { loading: loadingVoid }] = useMutation(
    pickAndPackVoid,
    { context: { clientName: "order" } },
  );

  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });
  const [generateInvoice, { loading: loadingPDF }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });

  const [scanning, setScanning] = useState(false);

  const form = useForm({
    initialValues: {
      scan: "",
    },
  });

  useEffect(() => {
    if (props.order?.items && props.skus) {
      const updateItems = props?.order?.items.map((item) => {
        const baseGtin =
          item?.sku === "PISK001"
            ? "0001"
            : updateGTIN(item, props?.skus || []);

        const isRed = RED_GTIN.includes(baseGtin?.replace("_PMI", "") || "");

        return {
          ...item,
          gtin: isRed ? `${baseGtin?.replace("_PMI", "")}_RED` : baseGtin,
          type: props.skus?.find((e) => e.sku === item?.sku)?.type,
          scanned_quantity: item?.scanned_quantity || 0,
        };
      });
      setScannedItems(updateItems);
    }

    if (props.order?.invoice_no) {
      setInvoice(props.order.invoice_no);
    }
  }, [props?.order, props.skus]);

  const getStockPerItem = async (gtin: string) => {
    return refetchStocks({
      variables: {
        warehouse_id: props.order?.assigned_warehouse,
        gtin: gtin,
        type: props.skus?.find((e) => e.gtin === gtin)?.type,
      },
      fetchPolicy: "no-cache",
    }).then((res) => {
      return res.data.itemStocks;
    });
  };

  const serialChecker = async (serial: string) => {
    if (serial.length == 12) {
      return refetchSerial({
        variables: { serial: serial },
        fetchPolicy: "no-cache",
      }).then((res) => {
        setScanning(false);
        return res.data.inventoryItem
          ? {
              gtin: res.data.inventoryItem.gtin,
              serial: res.data.inventoryItem.serial,
              sku: res.data.inventoryItem.sku,
              item_status: res.data.inventoryItem.item_status,
              description: res.data.inventoryItem.description,
              batch_id: res.data.inventoryItem.batch_id,
              unit_of_measure: res.data.inventoryItem.unit_of_measure,
              warehouse_id: res.data.inventoryItem.warehouse_id,
            }
          : undefined;
      });
    } else {
      setScanning(false);
      return undefined;
    }
  };
  const RED_GTIN = ["7311250169915", "7311250169908","7311250069901","7311250069918"];
  const onScan = async (value: string) => {
    const updateScannedItems = [...scannedItems];
    const isSerial = await serialChecker(value);
    const codentify = isSerial ? isSerial : formatCodentify(value);
    if (RED_GTIN.includes(value.trim())) {
      value = `${value.trim()}_RED`;
    }
    console.log(
      "scanned:",
      value,
      "rows:",
      scannedItems.map((e) => e.gtin),
    );

    if (!updateScannedItems.some((e) => e.gtin === value) && !codentify) {
      console.log("first check");
      value = value + "_PMI";
      if (!updateScannedItems.some((e) => e.gtin === value) && !codentify) {
        return Notification.error({ message: "Invalid GTIN/Codentify" });
      }
    }

    if (updateScannedItems?.find((e) => e.gtin === value)?.type === "DEVICES") {
      console.log("device first check");
      value = value + "_PMI";
      if (
        updateScannedItems?.find((e) => e.gtin === value)?.type === "DEVICES"
      ) {
        return Notification.info({ message: "Cannot scan device using GTIN" });
      }
    }

    if (codentify) {
      const index = updateScannedItems.findIndex(
        (e) => e.gtin === codentify.gtin,
      );
      if (index < 0)
        return Notification.error({ message: "Wrong scanned item" });
      if (
        updateScannedItems[index]?.quantity ===
        updateScannedItems[index]?.scanned_quantity
      )
        return Notification.info({
          message: "Scanned quantity already exceeded",
        });
      const data = await serialChecker(codentify.serial);
      if (data?.item_status !== "AVAILABLE")
        return Notification.error({ message: "Serial already scanned" });
      if (data?.warehouse_id !== props.order?.assigned_warehouse)
        return Notification.error({
          message: "Serial is not from this warehouse",
        });

      updateScannedItems[index] = {
        ...updateScannedItems[index],
        scanned_quantity: updateScannedItems[index]?.scanned_quantity! + 1,
        inventory_items: [
          ...(updateScannedItems[index]?.inventory_items || []),
          {
            serial: data?.serial,
            sku: data?.sku,
            description: data?.description,
            batch_id: data?.batch_id,
            unit_of_measure: data?.unit_of_measure,
            gtin: codentify.gtin,
          },
        ],
      };
      setScannedItems(updateScannedItems);
      setExpand(expand.concat(index));
      Notification.success({ message: "Item scan success" });
      form.reset();
    } else {
      const skuGtin = value.endsWith("_RED")
        ? value.replace("_RED", "_PMI")
        : value;
      if (!props.skus?.some((e) => e.gtin === skuGtin))
        return Notification.error({ message: `SKU/GTIN not found` });
      if (!props.skus?.some((e) => e.gtin === value))
        return Notification.error({ message: `SKU/GTIN not found` });
      const index = updateScannedItems.findIndex((e) => e.gtin === value);
      if (index < 0)
        return Notification.error({ message: "Wrong scanned item" });
      if (
        updateScannedItems[index]?.quantity ===
        updateScannedItems[index]?.scanned_quantity
      )
        return Notification.info({
          message: "Scanned quantity already exceeded",
        });
      const stock = await getStockPerItem(skuGtin);
      if (stock.quantity <= 0 && props?.order?.assigned_warehouse === "RS50")
        return Notification.error({ message: `Out of Stock: ${value}` });
      const hasMultipleLineItems = updateScannedItems.filter(
        (e) => e.gtin === value,
      );
      if (hasMultipleLineItems.length > 1) {
        const indexes = updateScannedItems.reduce((acc: number[], item, i) => {
          if (item.gtin === value) {
            acc.push(i);
          }
          return acc;
        }, []);
        indexes.forEach((index) => {
          updateScannedItems[index] = {
            ...updateScannedItems[index],
            scanned_quantity: updateScannedItems[index]?.quantity,
          };
        });
      } else {
        updateScannedItems[index] = {
          ...updateScannedItems[index],
          scanned_quantity:
            (updateScannedItems[index]?.scanned_quantity || 0) + 1,
        };
      }
      setScannedItems(updateScannedItems);
      Notification.success({ message: "Item scan success" });
      form.reset();
    }
  };

  const onScanAllQuantityPerItem = (element: ScannedItems) => {
    const updateScannedItems = [...scannedItems];
    const index = updateScannedItems.findIndex((e) => e.gtin === element.gtin);
    updateScannedItems[index] = {
      ...updateScannedItems[index],
      scanned_quantity: element.quantity,
    };
    setScannedItems(updateScannedItems);
    Notification.success({ message: "Item scan successfully!" });
  };

  const openScanAllModal = (element: ScannedItems) =>
    openConfirmModal({
      centered: true,
      withCloseButton: false,
      transition: "slide-down",
      children: (
        <Flex gap={"md"} justify={"center"} align={"flex-start"}>
          <ActionIcon size={"xl"} radius={"md"} color="#E4F1FC" variant="light">
            <IconTextScan2 color="#228BE6" size={30} />
          </ActionIcon>
          <Stack>
            <Title order={4}>Scan All Quantities</Title>
            <Text size="sm">
              This will scan all available quantities as scanned. Do you want to
              continue?
            </Text>
          </Stack>
        </Flex>
      ),
      cancelProps: {
        style: { backgroundColor: "#F0F1F2", borderRadius: 20, color: "black" },
      },
      confirmProps: {
        style: { backgroundColor: "#23C2D7", borderRadius: 20, color: "white" },
      },
      labels: { confirm: "Yes, Scan All", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => onScanAllQuantityPerItem(element),
    });

  const getSubtotalPrice = (record: ScannedItems) => {
    var total_discount =
      record.item_discounts?.reduce(
        (total, item_discount) =>
          total + parseFloat(`${item_discount?.discount_gross}`),
        0,
      ) || 0;
    var total =
      parseFloat(`${record.quantity}`) *
      parseFloat(
        `${record?.price_per_unit_original || record?.price_per_unit}`,
      );
    return total - total_discount;
  };

  const getPricePerUnit = (record: ScannedItems) => {
    var total_discount =
      record.item_discounts?.reduce(
        (total, item_discount) =>
          total + parseFloat(`${item_discount?.discount_gross}`),
        0,
      ) || 0;
    if (record.price_per_unit_original == undefined) {
      var header_discount =
        props?.order?.price?.discounts?.reduce(
          (total, discount) =>
            total + parseFloat(`${discount?.discount_gross}`),
          0,
        ) || 0;
      var per_item_discount =
        header_discount / (props?.order?.items?.length || 0);
      return (
        (record?.price_per_unit || 0) +
        total_discount +
        per_item_discount
      ).toFixed(2);
    }
    return record.price_per_unit_original.toFixed(2);
  };

  const onGenerateInvoice = (salesInvoiceType: boolean) => {
    const cleanInvoice = invoice?.trim() || "";
    const alphanumericRegex = /^[a-zA-Z0-9]{4,}$/;

    if (!cleanInvoice) {
      return Notification.error({ message: "Please add invoice number!" });
    }

    if (!alphanumericRegex.test(cleanInvoice)) {
      return Notification.error({
        message: "Invoice number must be at least 4 alphanumeric characters!",
      });
    }

    updateOrder({
      variables: {
        id: props.order?.id,
        input: {
          invoice_no: cleanInvoice,
        },
        order_type:
          props.order?.doc_type !== undefined ? props.order.doc_type : "ORDER",
      },
    }).then((res) => {
      Notification.success({ message: "Invoice saved Successfully" });
      generateInvoice({
        variables: {
          type: "INVOICE",
          order_id: props.order?.order_id,
          salesInvoiceType: salesInvoiceType,
        },
      }).then((resPDF) => {
        window.open(resPDF.data.generatePDF, "_blank");
      });
    });
  };

  const freeItemsTable = (
    freeItems: Maybe<Maybe<ORDER.FreeItem>[]> | undefined,
  ) => {
    return (
      <td colSpan={8}>
        <div>
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Description</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {freeItems?.map((item, i) => (
                <tr key={`free-item-${i}`}>
                  <td></td>
                  <td>{item?.gtin}</td>
                  <td>{item?.sku}</td>
                  <td>{item?.description}</td>
                  <td>{item?.qty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </td>
    );
  };

  const rows = () => {
    return scannedItems?.map((element, index) => {
      const hasDevices = element.type === "DEVICES" && element.scanned_quantity;
      const hasFreeItems = (element.free_items?.length || 0) > 0;
      const isExpandable = hasDevices || hasFreeItems;

      return (
        <React.Fragment key={`list-${index}`}>
          <tr>
            <td style={{ width: 10 }}>
              {isExpandable ? (
                <ActionIcon>
                  {expand?.some((e) => e == index) ? (
                    <CaretUp
                      onClick={() =>
                        setExpand(expand.filter((e) => e != index))
                      }
                    />
                  ) : (
                    <CaretDown
                      onClick={() => setExpand(expand.concat(index))}
                    />
                  )}
                </ActionIcon>
              ) : undefined}
            </td>
            <td>{element.gtin?.replace("_PMI", "")}</td>
            <td>{element.sku}</td>
            <td>{element.description}</td>
            <td>{getPricePerUnit(element)}</td>
            <td>
              <Group spacing={"xs"}>
                <span>
                  {scannedItems?.find((item) => item.gtin === element.gtin)
                    ?.scanned_quantity || 0}
                  /{element.quantity}
                </span>
                {quantityIcon(element)}
                {(element?.quantity || 0) > 1 && (
                  <Button
                    disabled={
                      element.scanned_quantity === element.quantity ||
                      !element.scanned_quantity
                    }
                    onClick={() => openScanAllModal(element)}
                    icon={<Scan size={15} />}
                    styles={{ backgroundColor: "#12B886" }}
                    customType="custom"
                    radius={12}
                    size="xs"
                  >
                    Scan All
                  </Button>
                )}
              </Group>
            </td>
            <td>{itemDiscount(element)}</td>
            <td>{getSubtotalPrice(element)}</td>
          </tr>
          {expand?.some((e) => e == index) && isExpandable ? (
            <tr key={`list-expanded=${index}`}>
              {hasDevices
                ? expandedTable(element?.inventory_items)
                : freeItemsTable(element?.free_items)}
            </tr>
          ) : undefined}
        </React.Fragment>
      );
    });
  };

  const itemDiscount = (element: ScannedItems) => {
    var discounts = JSON.parse(JSON.stringify(element.item_discounts || []));
    if (discounts.length == 0) return "-";
    var total_discount = discounts
      .reduce(
        (total: number, item_discount: any) =>
          total + parseFloat(item_discount.discount_gross || 0),
        0,
      )
      .toFixed(2);
    return (
      <Group>
        <a> {total_discount} </a>
        <Popover position="top">
          <Popover.Target>
            <div>
              <ActionIcon size={"sm"} color="blue" variant="filled">
                <QuestionMark />
              </ActionIcon>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <div>
              <p>Discount Breakdown</p>
              {discounts.map((discount: ORDER.Discount, index: number) => (
                <div key={`${index}`}>
                  {discount.discount_code + ": " + discount.discount_gross}
                </div>
              ))}
            </div>
          </Popover.Dropdown>
        </Popover>
      </Group>
    );
  };

  const onRemoveSerial = (gtin: Maybe<string> | undefined) => {
    const updateScannedItems = [...(scannedItems as ScannedItems[])];
    const index = updateScannedItems.findIndex((e) => e.gtin === gtin);
    updateScannedItems[index] = {
      ...updateScannedItems[index],
      scanned_quantity: updateScannedItems[index]?.scanned_quantity! - 1,
      inventory_items: [],
    };
    setScannedItems(updateScannedItems);
    setExpand(expand.filter((e: number) => index !== e));
    Notification.success({ message: "Item removed" });
  };

  const onPickAndPackItems = () => {
    pickAndPack({
      variables: {
        order_id: props.order?.id,
        input: scannedItems?.map((e) => {
          return {
            gtin: e.gtin,
            scanned_quantity: e.scanned_quantity,
            serials: e.inventory_items
              ? e.inventory_items.map((e) => e?.serial)
              : [],
          };
        }),
        order_type: "ORDER",
      },
    })
      .then((res) => {
        props?.onUpdate(res.data.pickAndPackSave);
        Notification.success({ message: `Pick & Pack saved` });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onVoidItems = () => {
    voidPickAndPack({
      variables: {
        order_id: props.order?.id,
        type: "ORDER",
      },
    })
      .then((res) => {
        setExpand([]);
        props.onUpdate(res.data?.pickAndPackVoid);
        Notification.success({ message: "Item void success" });
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const quantityIcon = (item: ScannedItems) => {
    if (item.quantity === item.scanned_quantity) {
      return <CircleCheck size={15} strokeWidth={2} color={"#40bf89"} />;
    } else {
      return <AlertCircle size={15} strokeWidth={2} color={"#bf4240"} />;
    }
  };

  const expandedTable = (items: Maybe<Maybe<InventoryItem>[]> | undefined) => {
    return (
      <>
        <td colSpan={8}>
          <div>
            <Group position="right">
              <Button
                disabled={
                  props.order?.items?.some((e) => e?.scanned_quantity) ||
                  accessRole()
                }
                onClick={() => setUpdateHistory(true)}
                icon={<Plus />}
              >
                Update Usage History
              </Button>
            </Group>
            <Table highlightOnHover fontSize={"md"}>
              <thead>
                <tr>
                  <th></th>
                  <th>Serial</th>
                  <th>SKU</th>
                  <th>Bacth ID</th>
                  <th>UOM</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, i) => (
                  <tr key={` batch-${i}`}>
                    <td></td>
                    <td>{item?.serial}</td>
                    <td>{item?.sku}</td>
                    <td>{item?.batch_id}</td>
                    <td>{item?.unit_of_measure}</td>
                    <td>{item?.description}</td>
                    <td>
                      {props.order?.items?.some(
                        (e) => e?.scanned_quantity,
                      ) ? undefined : (
                        <Trash
                          onClick={(e) => {
                            onRemoveSerial(item?.gtin);
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </td>
      </>
    );
  };

  const onBeforeScan = (value: string) => {
    setScanning(true);
    setTimeout(() => {
      onScan(value);
    }, 500);
  };

  const accessRole = () => {
    if (
      userRoles.isAdministratorEC ||
      userRoles.isPacker ||
      userRoles.isDispatch ||
      userRoles.isEcomAdmin ||
      userRoles.isFullAdmin ||
      userRoles.isAdmin ||
      userRoles.isPacker ||
      userRoles.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <LoadingOverlay
        visible={
          loadingPickAndPack || loadingVoid || loadingOrder || loadingPDF
        }
      />
      <Modal
        title="Update usage history"
        centered
        opened={updateHistory}
        onClose={() => setUpdateHistory(false)}
      >
        <Input type="number" label="Version" placeholder="Enter version" />
        <Input
          type="number"
          label="Charger Usage"
          placeholder="Enter charger usage"
        />
        <Input
          type="number"
          label="Holder Usage"
          placeholder="Enter holder usage"
        />
        <br />
        <Group position="center">
          <Button
            onClick={() => setUpdateHistory(false)}
            customType="secondary"
          >
            Back
          </Button>
          <Button customType="primary">Okay</Button>
        </Group>
      </Modal>
      <ItemEditor
        onUpdate={(order) => props.onUpdate(order)}
        opened={itemEditor}
        onClose={() => setItemEditor(false)}
        list={scannedItems}
        skus={props.skus || []}
        order={props.order}
      />
      <Paper radius={8}>
        <h2>Pick & Pack</h2>
        <Paper radius={8}>
          <Group position="apart" align="flex-end">
            <Input
              {...form.getInputProps("scan")}
              disabled={
                props.order?.items?.some((e) => e?.scanned_quantity) ||
                scanning ||
                accessRole()
              }
              onKeyPress={(e) =>
                e.key === "Enter" ? onBeforeScan(e.target.value) : undefined
              }
              placeholder="Scan CODENTIFY or GTIN"
              description={"CODENTIFY/GTIN"}
              style={{ width: 300 }}
              rightSection={scanning ? <Loader size={20} /> : undefined}
              data-testid={`TEST-PICKANDPACK-SCAN`}
            />

            <Group spacing="md" align="flex-end">
              <TextInput
                placeholder="Enter Invoice Number"
                value={invoice}
                onChange={(e) => setInvoice(e.currentTarget.value)}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    onGenerateInvoice(false);
                  }
                }}
                radius="md"
                style={{ width: 200 }}
                data-testid="invoice-input"
              />

              <Button
                disabled={loadingOrder || accessRole()}
                onClick={() => onGenerateInvoice(false)}
                icon={<Printer />}
              >
                INVOICE PRINT
              </Button>

              {!props.isPack &&
              (props.order?.order_status == "RECEIVED" ||
                (props.order?.order_status == "PROCESSED" &&
                  !props.order?.items?.some((e) => e?.scanned_quantity))) ? (
                <Button
                  disabled={
                    props.order?.items?.some((e) => e?.scanned_quantity) ||
                    accessRole()
                  }
                  onClick={() => setItemEditor(true)}
                  icon={<Edit />}
                >
                  Edit Items
                </Button>
              ) : undefined}
            </Group>
          </Group>
          <br />
          <Table highlightOnHover fontSize={"md"}>
            <thead>
              <tr>
                <th></th>
                <th>GTIN</th>
                <th>SKU</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Item Discounts</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>{rows()}</tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  <div>
                    {props?.order?.price?.discounts?.map((discount, index) => {
                      if (!discount?.discount_code) return;
                      return (
                        <sub key={`${index}-discount`}>
                          {discount?.discount_code +
                            " -" +
                            parseFloat(`${discount?.discount_gross || 0}`)}{" "}
                        </sub>
                      );
                    })}
                  </div>
                  {`Total: ${props.order?.items?.reduce(
                    (acc, curr) => acc + (curr?.total || 0),
                    0,
                  )}`}
                </th>
              </tr>
            </tfoot>
          </Table>
          <br />
          {props.order?.order_status === "PROCESSED" ||
          props.order?.order_status === "RECEIVED" ? (
            <Group direction="column" position="center">
              {props.order?.items?.some((e) => e?.scanned_quantity) ? (
                <div data-testid={"TEST-PICKANDPACK-VOID"}>
                  <Button
                    disabled={accessRole()}
                    customType="danger"
                    icon={<X />}
                    onClick={() => onVoidItems()}
                  >
                    Void
                  </Button>
                </div>
              ) : (
                <div data-testid={"TEST-PICKANDPACK-SAVE"}>
                  <Button
                    disabled={scannedItems?.some(
                      (e) => e?.scanned_quantity !== e?.quantity,
                    )}
                    icon={<Checklist />}
                    onClick={() => onPickAndPackItems()}
                  >
                    Save
                  </Button>
                </div>
              )}
            </Group>
          ) : undefined}
        </Paper>
      </Paper>
    </div>
  );
};
