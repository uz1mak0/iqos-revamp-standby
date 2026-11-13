/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Printer, AlertCircle } from "tabler-icons-react";
import {
  Button,
  Table,
  Input,
  Card,
  Group,
  Pagination,
  LoadingOverlay,
  ScrollArea,
  Modal,
  Text,
} from "../../Elements";

import router from "next/router";
import { useStyles } from "../OrderManagement/OrderManagement.styles";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { useMutation, useQuery } from "@apollo/client";
import {
  generatePDF,
  getOrders,
  orderUpdate,
} from "../../../GraphQL/OrderManagementSchema";
import dayjs from "dayjs";
import Notification from "../../Elements/Notification/Notification";

import { formatCustomerAddress } from "../../../Utilities/Formatter";
import { OrdersFilter } from "../../Modules/Filters/OrdersFilter";

import { ORDER } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";
import { usePagination } from "@mantine/hooks";
import { set } from "react-hook-form";

export const PackManagement = () => {
  const [user] = useAtom(rolesAtom);
  const {
    data: dataOrders,
    fetchMore,
    refetch: refetchOrders,
    loading,
    networkStatus,
  } = useQuery<{ orders: ORDER.OrderConnection }>(getOrders, {
    variables: {
      warehouse_id: "PH01",
      date_filter: {
        from: dayjs().format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
      },
    },
    context: { clientName: "order" },
    notifyOnNetworkStatusChange: true,
  });

  // const {data: dataOrders, refetch: refetchOrders, loading: loadingOrders } = useQuery(getOrders, { context: { clientName: 'order'}});
  const {
    loading: loadingWarehouse,
    error: errorWarehouse,
    data: dataWarehouse,
    refetch: refetchWarehouse,
  } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: { channel: "ECOMM" },
  });
  const [updateOrder, { loading: loadingOrder }] = useMutation(orderUpdate, {
    context: { clientName: "order" },
  });
  const [generateInvoice, { loading: loadingPDF }] = useMutation(generatePDF, {
    context: { clientName: "order" },
  });

  const { classes } = useStyles();
  // const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: "RECEIVED",
    warehouse: "PH01",
    date: {
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
  });

  const orders = dataOrders?.orders?.items;
  if (dataOrders?.orders?.next_token) {
    fetchMore({
      variables: {
        warehouse_id: "PH01",
        date_filter: filters.date,
        next_token: dataOrders?.orders?.next_token,
      },
    });
  }

  const filterOrders = () => {
    switch (filters.status) {
      case "RECEIVED":
        return orders?.filter((order) => order?.order_status === "RECEIVED");
      case "PROCESSED":
        return orders?.filter((order) => order?.order_status === "PROCESSED");
      default:
        return orders;
    }
  };

  const pagination = usePagination({
    total: filterOrders()?.length || 0,
    initialPage: 1,
  });

  // const [orders, setOrders] = useState<{
  //     RECEIVED: { [key: string]: any }[],
  //     PROCESSED: { [key: string]: any }[],
  // }>({
  //     RECEIVED: [],
  //     PROCESSED: [],
  // })

  // useEffect(() => {
  //     getAllOrders("PH01",{from:  dayjs().format("YYYY-MM-DD"),to: dayjs().format("YYYY-MM-DD")});
  // }, [])

  // const getAllOrders = (warehouse: string, date: {[key: string]: any}) => {
  //     setLoading(true)
  //     Promise.all([
  //         getOrderByStatus(warehouse, date,[], undefined, "RECEIVED"),
  //         getOrderByStatus(warehouse, date,[], undefined, "PROCESSED"),

  //     ])
  //     .then(([orderRecieved, orderProcessed]) => {
  //         setOrders({
  //             ...orders,
  //             RECEIVED: sortOrders([...orderRecieved]),
  //             PROCESSED: sortOrders([...orderProcessed]),

  //         })
  //         setFilters({...filters,  page: {from: 0, to: 99, activePage: 1}})
  //         setLoading(false)
  //     })
  //  }

  const sortOrders = (list: { [key: string]: any }[]) => {
    return list?.sort((a: any, b: any) => {
      if (a.delivery_date && b.delivery_date)
        return b.delivery_date - a.delivery_date;
      return b.date_created - a.date_created;
    });
  };

  //  const getOrderByStatus : any = (warehouse: string, date: {[key: string]: any}, list: {[key: string]: any}[], next_token: string | undefined, status: string) => {
  //    return refetchOrders({
  //          order_status: status,
  //          warehouse_id: warehouse,
  //          next_token: next_token,
  //          date_filter: date
  //      }).then(({data}) => {
  //         if(data.orders?.next_token) return getOrderByStatus(warehouse, date,  data.orders.items, data.orders?.next_token, status)
  //         return [...list, ...data.orders.items]
  //      })
  //      .catch((e) => {
  //          Notification.error({message: e.message})
  //      })
  //   }

  const onSelectOrderStatus = (status: string) => {
    if ((filterOrders()?.length || 0) > 0) {
      pagination.setPage(1);
    }
    setFilters({ ...filters, status: status });
  };

  const [openSI, setOpenSI] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ORDER.Order | null>(null);
  const [salesInvoiceType, setSalesInvoiceType] = useState<boolean>(true);
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
                // onInvoicePrint(selectedOrder, true);
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
                // onInvoicePrint(selectedOrder, false);
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

  const invoicePrint = (order: ORDER.Maybe<ORDER.Order>) => {
    var invoiceInput = order?.invoice_no || "";
    return (
      <div style={{ width: 400 }}>
        <Group>
          <Input
            defaultValue={order?.invoice_no || ""}
            disabled={loadingOrder || accessRole()}
            onChange={(e) => (invoiceInput = e.target.value)}
            placeholder="Enter invoice number"
          />
          <Button
            disabled={loadingOrder || accessRole()}
            onClick={(e) => {
              setSelectedOrder(order as ORDER.Order);
              setInvoice(invoiceInput);
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

  const onGenerateInvoice = (
    order: ORDER.Maybe<ORDER.Order>,
    invoice: string | undefined,
    salesInvoiceType: boolean
  ) => {
        
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
        id: order?.id,
        input: {
          invoice_no: invoice,
        },
        order_type: order?.doc_type != undefined ? order.doc_type : "ORDER",
      },
    }).then((res) => {
      Notification.success({ message: "Invoice saved Successfully" });
      generateInvoice({
        variables: {
          type: "INVOICE",
          order_id: order?.order_id,
          salesInvoiceType: salesInvoiceType,
        },
      }).then((resPDF) => {
        window.open(resPDF.data.generatePDF, "_blank");
      });
    });
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

  const rows = (list: ORDER.Maybe<ORDER.Order>[]) => {
    return list
      ?.slice((pagination.active - 1) * 100, pagination.active * 100)
      ?.map((e, index) => (
        <React.Fragment key={`list-${index}`}>
          <tr
            onClick={() =>
              router.push(
                `/order-management/pack/pack-details/pack?pack=${e?.id}`
              )
            }
          >
            <td>{e?.verification_status || "UNVERIFIED"}</td>
            <td>{e?.note}</td>
            <td>{e?.id}</td>
            <td>
              {
                dataWarehouse?.warehouses?.items.find(
                  (wh: any) => wh.id === e?.assigned_warehouse
                )?.name
              }
            </td>
            <td>
              <div className={classes.preWrapText}>
                {formatCustomerAddress(e?.billing_address)}
              </div>
            </td>
            <td>{e?.payment_type}</td>
            <td>{e?.order_status}</td>
            <td
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {invoicePrint(e)}
            </td>
          </tr>
        </React.Fragment>
      ));
  };

  return (
    <div>
      {SIprintModal()}
      <LoadingOverlay visible={loading || networkStatus < 7} />
      <div style={{ width: 1000 }}>
        <OrdersFilter
          defaultValues={{
            warehouse: "PH01",
            date: {
              from: dayjs().format("YYYY-MM-DD"),
              to: dayjs().format("YYYY-MM-DD"),
            },
          }}
          onFilter={({ warehouse, date }) => {
            refetchOrders({
              warehouse_id: warehouse,
              date_filter: date,
            });
          }}
        />
      </div>

      <div className={classes.statusContainer}>
        <Card
          background="#FD9710"
          title="RECEIVED"
          number={
            orders?.filter((order) => order?.order_status === "RECEIVED").length
          }
          onClick={() => onSelectOrderStatus("RECEIVED")}
          removeSelect={filters.status !== "RECEIVED"}
          isSelected={filters.status === "RECEIVED"}
        />
        <Card
          background="#61B765"
          title="PROCESSED"
          number={
            orders?.filter((order) => order?.order_status === "PROCESSED")
              .length
          }
          onClick={() => onSelectOrderStatus("PROCESSED")}
          removeSelect={filters.status !== "PROCESSED"}
          isSelected={filters.status === "PROCESSED"}
        />
      </div>
      <ScrollArea style={{ height: 700 }}>
        <div className={classes.tableContainer}>
          <Table>
            <thead>
              <tr>
                <th>Verification Status</th>
                <th>Notes</th>
                <th>Order Number</th>
                <th>Warehouse/Store</th>
                <th>Address</th>
                <th>Payment Type</th>
                <th>Order Status</th>
                <th>Invoice</th>
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
      <br />
    </div>
  );
};
