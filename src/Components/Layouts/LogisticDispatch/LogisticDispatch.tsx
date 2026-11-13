/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Printer, AlertCircle } from "tabler-icons-react";
import { EcomVerificationDetails } from "../OrderManagement";
import {
  Button,
  Card,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Pagination,
  ScrollArea,
  Table,
  Text,
} from "../../Elements";
import Notification from "../../Elements/Notification/Notification";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { getSKUs } from "../../../GraphQL/SKUsSchema";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import {
  generatePDF,
  getLogisticsOrders,
  orderUpdate,
  printAWB,
} from "../../../GraphQL/OrderManagementSchema";
import { TurnOverPrint } from "./TurnOverPrint";
import { formatCustomerAddress } from "../../../Utilities/Formatter";
import { ORDER, WMS } from "../../../GraphQL";
import { useAtom } from "jotai";
import { channelAtom, rolesAtom } from "../../../Store/StoreAtom";
import { usePagination } from "@mantine/hooks";

export const LogisticDispatch = () => {
  const { classes } = useStyles();
  const [user] = useAtom(rolesAtom);
  const [channel] = useAtom(channelAtom);
  const {
    loading: loadingWarehouse,
    error: errorWarehouse,
    data: dataWarehouse,
    refetch: refetchWarehouse,
  } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });
  const { data: dataSKU, refetch: refetchSKU } = useQuery(getSKUs, {
    context: { clientName: "warehouse" },
    variables: { channel: channel },
  });
  const { loading, data, refetch } = useQuery(getLogisticsOrders, {
    context: { clientName: "order" },
    variables: { assigned_logistics: "TWO_GO", order_status: "SHIPPED" },
  });
  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });
  const [generateInvoice, { loading: loadingPDF }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });
  const [generateAWB, { loading: loadingAWB }] = useMutation(printAWB, {
    context: { clientName: "external" },
  });

  const [filters, setFilters] = useState({
    status: "PROCESSED",
  });

  const [showModal, setShowModal] = useState<{
    visible: boolean;
    order: ORDER.Order;
  }>({
    visible: false,
    order: {},
  });
  const [orders, setOrders] = useState<ORDER.Order[]>([]);

  useEffect(() => {
    getAllLogisticOrders();
  }, []);

  const filterOrders = () => {
    switch (filters.status) {
      case "SHIPPED":
        return orders.filter((e) => e.order_status === "SHIPPED");
      case "PROCESSED":
        return orders.filter((e) => e.order_status === "PROCESSED");
      default:
        return [];
    }
  };

  const pagination = usePagination({
    total: filterOrders().length || 0,
    initialPage: 1,
  });

  const getAllLogisticOrders = () => {
    Promise.all([
      getLogisticDispatchPerStatus("SHIPPED", undefined, []),
      getLogisticDispatchPerStatus("PROCESSED", undefined, []),
    ])
      .then(([orderShipped, orderProcessed]) => {
        console.log(orderShipped, orderProcessed);
        const updateList = [...orderShipped, ...orderProcessed];
        setOrders(updateList);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const getLogisticDispatchPerStatus: any = (
    status: string,
    next_token: string | undefined,
    list: ORDER.Order[] | undefined
  ) => {
    return refetch({
      assigned_logistics: "TWO_GO",
      order_status: status,
    })
      .then(({ data }) => {
        if (data.logisticsOrders?.next_token)
          return getLogisticDispatchPerStatus(
            status,
            data.logisticsOrders?.next_token,
            data.inventoryItems.items
          );
        return [...(list || []), ...(data.logisticsOrders.items || [])];
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const onGenerateInvoice = (
    order: ORDER.Order,
    invoice: string | undefined,
    salesInvoiceType: boolean
  ) => {
    if (!invoice || invoice === "") {
      onInvoicePrint(order, salesInvoiceType);
    } else {
      updateOrder({
        variables: {
          id: order.id,
          input: {
            invoice_no: invoice,
          },
          order_type: order.doc_type != undefined ? order.doc_type : "ORDER",
        },
      }).then((res) => {
        onInvoicePrint(order, salesInvoiceType);
        Notification.success({ message: "Invoice saved Successfully" });
      });
    }
  };

  const [openSI, setOpenSI] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ORDER.Order | null>(null);
  const [invoice, setInvoice] = useState<string>("");

  function SIprintModal() {
    return (
      <Modal
        opened={openSI}
        centered
        onClose={() => setOpenSI(false)}
        title="Sales Invoice Print"
      >
        <Group>
          <AlertCircle size={20} />
          <Text>Please Select Sales invoice type to print </Text>
        </Group>

        <Group position="right">
          <Button
            customType="orange"
            onClick={() => {
              if (selectedOrder) {
                onGenerateInvoice(selectedOrder, invoice, true);
              }
              setOpenSI(false);
            }}
          >
            Old
          </Button>
          <Button
            customType="primary"
            onClick={() => {
              if (selectedOrder) {
                onGenerateInvoice(selectedOrder, invoice, false);
              }
              setOpenSI(false);
            }}
          >
            New
          </Button>
        </Group>
      </Modal>
    );
  }

  const onInvoicePrint = (order: ORDER.Order, salesInvoiceType: boolean) => {
    generateInvoice({
      variables: {
        type: "INVOICE",
        order_id: order.order_id,
        salesInvoiceType: salesInvoiceType,
      },
    }).then((resPDF) => {
      window?.open(resPDF?.data?.generatePDF, "_blank");
    });
  };

  const onAWBPrint = (order: ORDER.Order) => {
    generateAWB({
      variables: {
        order_id: order.id,
      },
    })
      .then((res) => {
        Notification.success({ message: "Generate AWB success" });
        window.open(res?.data?.printAWB, "_blank");
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const invoicePrint = (order: ORDER.Order) => {
    var invoiceInput: string | undefined = `${order.invoice_no || ""}`;
    return (
      <div>
        <Group>
          <Input
            defaultValue={`${order?.invoice_no || ""}`}
            disabled={loadingOrder || accessRole()}
            onChange={(e) => (invoiceInput = e.target.value)}
            placeholder="Enter invoice number"
          />
          <Button
            disabled={loadingOrder || accessRole()}
            onClick={() => {
              setInvoice(invoiceInput || "");
              setSelectedOrder(order);
              setOpenSI(true);
            }}
            icon={<Printer />}
          >
            INVOICE PRINT
          </Button>
        </Group>
      </div>
    );
  };

  const onSelectOrderStatus = (status: string) => {
    if (filterOrders().length > 0) {
      pagination.setPage(1);
    }
    setFilters({ ...filters, status: status });
  };

  const accessRole = () => {
    if (
      user.isPacker ||
      user.isDispatch ||
      user.isEcomAdmin ||
      user.isAdministratorEC ||
      user.isFullAdmin ||
      // old roles
      user.isAdmin ||
      user.isPacker ||
      user.isDispatcher
    ) {
      return false;
    } else {
      return true;
    }
  };

  const rows = (list: ORDER.Order[]) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((e: ORDER.Order, index: number) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() =>
              setShowModal({
                visible: true,
                order: e,
              })
            }
          >
            <td>{e.id}</td>
            <td>{e.awb}</td>
            <td>
              {
                dataWarehouse?.warehouses?.items.find(
                  (wh: WMS.Warehouse) => wh.id === e.assigned_warehouse
                )?.name
              }
            </td>
            <td>
              <div className={classes.preWrapText}>
                {formatCustomerAddress(e.billing_address)}
              </div>
            </td>
            <td>{e.payment_type}</td>
            <td>{e.order_status}</td>
            <td
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {invoicePrint(e)}
            </td>
            <td
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Button disabled={accessRole()} onClick={() => onAWBPrint(e)}>
                AWB Print
              </Button>
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      <LoadingOverlay visible={loading} />
      {SIprintModal()}
      <Modal
        size={1100}
        opened={showModal.visible}
        onClose={() =>
          setShowModal({
            visible: false,
            order: {},
          })
        }
        centered
      >
        <EcomVerificationDetails
          order={showModal.order}
          skus={dataSKU?.skus?.items}
        />
      </Modal>
      <div className={classes.statusContainer}>
        <Card
          background="#61B765"
          title="PROCESSED"
          number={orders.filter((e) => e.order_status === "PROCESSED").length}
          onClick={() => onSelectOrderStatus("PROCESSED")}
          removeSelect={filters.status !== "PROCESSED"}
          isSelected={filters.status === "PROCESSED"}
        />
        <Card
          background="#A23DB6"
          title="SHIPPED"
          number={orders.filter((e) => e.order_status === "SHIPPED").length}
          onClick={() => onSelectOrderStatus("SHIPPED")}
          removeSelect={filters.status !== "SHIPPED"}
          isSelected={filters.status === "SHIPPED"}
        />
      </div>
      <Group position="right">
        <TurnOverPrint
          disable={accessRole()}
          orders={orders.filter((e) => e.order_status === "PROCESSED")}
        />
      </Group>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>AWB Number</th>
                <th>Warehouse/Store</th>
                <th>Address</th>
                <th>Payment Type</th>
                <th>Order Status</th>
                <th>Invoice</th>
                <th>AWB</th>
              </tr>
            </thead>
            <tbody>{rows(filterOrders() || [])}</tbody>
          </Table>
        </div>
      </ScrollArea>
      <br />
      <Group position="right">
        <Pagination
          position="center"
          total={Math.ceil((filterOrders()?.length || 0) / 100)}
          page={pagination.active}
          onChange={pagination.setPage}
        />
      </Group>
    </div>
  );
};
