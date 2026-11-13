import { s3Url } from "../../../Utilities/Backend";
import { useMutation } from "@apollo/client";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ArrowRight, Edit, AlertCircle } from "tabler-icons-react";
import Notification from "../../Elements/Notification/Notification";
import { useStyles } from "../../Layouts/OrderManagement/OrderManagement.styles";
import {
  updateOrderStatus,
  updateOrderLogs,
} from "../../../GraphQL/OrderManagementSchema";
import {
  DeliveredInfo,
  DeliveryInfo,
  Maybe,
  Order,
} from "../../../GraphQL/_gql/order/graphql";
import {
  ActionIcon,
  Button,
  DatePicker,
  Group,
  Image,
  Input,
  Modal,
  Paper,
  Table,
  Tabs,
  Text,
  Badge,
  TimeInput,
} from "../../Elements";
import { ORDER } from "../../../GraphQL";
import { useAtom } from "jotai";
import { rolesAtom } from "../../../Store/StoreAtom";

type Props = {
  order?: Order | undefined;
  onUpdate: (order: ORDER.Order) => void;
};

type LogField = "order_status_logs" | "delivery_status_logs";

type SelectedLog = {
  field: LogField;
  index: number;
  status: string;
  datetime: number;
};

const LOG_DATE_FORMAT = "MMMM D, YYYY h:mm A";

export const OrderLogs = (props: Props) => {
  const { classes } = useStyles();
  const [user] = useAtom(rolesAtom);
  const [updateStatus, { loading: loadingUpdateStatus }] = useMutation(
    updateOrderStatus,
    { context: { clientName: "order" } },
  );
  const [updateLogs, { loading: loadingUpdateLogs }] = useMutation(
    updateOrderLogs,
    { context: { clientName: "order" } },
  );
  const [signatureView, setSignatureView] = useState<{
    visible: boolean;
    details: Maybe<DeliveredInfo> | undefined;
  }>({
    visible: false,
    details: undefined,
  });
  const [cancelView, setCancelView] = useState<boolean>(false);

  // edit log date
  const [editOpened, setEditOpened] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SelectedLog | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(new Date());

  const accessRole = () => {
    if (
      user.isAdministratorEC ||
      user.isPacker ||
      user.isDispatch ||
      user.isEcomAdmin ||
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

  const openEditLog = (
    field: LogField,
    index: number,
    status: string | null | undefined,
    datetime: any,
  ) => {
    const current = Number(datetime);
    setSelectedLog({
      field,
      index,
      status: status || "",
      datetime: current,
    });
    setNewDate(new Date(current));
    setEditOpened(true);
  };

  const closeEditLog = () => {
    setEditOpened(false);
    setSelectedLog(null);
    setNewDate(new Date());
  };

  const onChangeDatePart = (d: Date | null) => {
    if (!d) return;
    const base = dayjs(newDate ?? new Date());
    setNewDate(
      dayjs(d)
        .hour(base.hour())
        .minute(base.minute())
        .second(base.second())
        .toDate(),
    );
  };

  const onChangeTimePart = (t: Date | null) => {
    if (!t) return;
    setNewDate(
      dayjs(newDate ?? new Date())
        .hour(t.getHours())
        .minute(t.getMinutes())
        .toDate(),
    );
  };

  const onUpdateLogDate = async () => {
    if (!selectedLog || !newDate) return;

    try {
      const dateStr = dayjs(newDate).format("YYYY-MM-DD");
      const newDateMs = newDate.getTime();

      const res = await updateLogs({
        variables: {
          input: {
            order_id: props.order?.id,
            order_type: "ORDER",
            [selectedLog.field]: [
              {
                index: selectedLog.index,
                status: selectedLog.status,
                new_date: newDateMs,
              },
            ],
          },
        },
      });

      if (res.data?.updateOrderLogs) {
        props.onUpdate(res.data.updateOrderLogs);
        Notification.success({
          message: "Updated the log date successfully",
        });
      } else {
        Notification.error({ message: "Updating the log date failed" });
      }
    } catch (e: any) {
      Notification.error({
        message: e?.message || "Updating the log date failed",
      });
    } finally {
      closeEditLog();
    }
  };

  const renderDatetime = (
    field: LogField,
    index: number,
    status: string | null | undefined,
    datetime: any,
  ) => (
    <Group>
      {dayjs(Number(datetime)).format(LOG_DATE_FORMAT)}
      {!accessRole() && (
        <ActionIcon
          variant="default"
          onClick={() => openEditLog(field, index, status, datetime)}
        >
          <Edit size={20} />
        </ActionIcon>
      )}
    </Group>
  );

  const orderStatusRows = props?.order?.order_status_logs?.map(
    (element, index) => (
      <tr key={`order-logs-${index}`}>
        <td>{element?.status}</td>
        <td>
          {renderDatetime(
            "order_status_logs",
            index,
            element?.status,
            element?.status_datetime,
          )}
        </td>
        <td>{element?.updated_by}</td>
      </tr>
    ),
  );

  const orderSMSRows = props?.order?.sms_logs?.map((element, index) => (
    <tr key={`order-logs-${index}`}>
      <td>{element?.status}</td>
      <td>
        {dayjs(Number(element?.timestamp! * 1000)).format(LOG_DATE_FORMAT)}
      </td>
      <td>{element?.message}</td>
    </tr>
  ));

  const orderDeliveryRows = props?.order?.delivery_status_logs?.map(
    (element, index) => (
      <tr key={`order-logs-${index}`}>
        <td>{element?.status}</td>
        <td>
          {renderDatetime(
            "delivery_status_logs",
            index,
            element?.status,
            element?.status_datetime,
          )}
        </td>
        <td>
          {element?.undeliverable?.reason == "CUSTOMER_CANCELLED" &&
          props.order?.order_status != "UNDELIVERED" &&
          props.order?.order_status != "COMPLETED" ? (
            <>
              CUSTOMER CANCELLED
              <Button
                disabled={accessRole()}
                onClick={() => setCancelView(true)}
                customType="danger"
              >
                CANCEL
              </Button>
            </>
          ) : (
            element?.undeliverable?.reason || "-"
          )}
        </td>
        <td>
          {props.order?.delivery_status == "UNDELIVERABLE" ||
          (props?.order?.order_status == "UNDELIVERED" &&
            props?.order?.delivery_info?.undeliverable)
            ? props?.order?.delivery_info?.undeliverable?.remarks || "-"
            : props?.order?.delivery_info?.delivered?.remarks || "-"}
        </td>
        <td>{element?.delivered?.customers_id?.toString() || "-"}</td>
        <td>
          {element?.delivered?.authorized_recipient_id?.toString() || "-"}
        </td>
        <td>{element?.assigned_rider}</td>
        <td>
          {element?.delivered ? (
            <Button
              onClick={() =>
                setSignatureView({
                  details: element?.delivered,
                  visible: true,
                })
              }
            >
              Signature
            </Button>
          ) : (
            "-"
          )}
        </td>
      </tr>
    ),
  );

  const signatureModal = () => (
    <Modal
      centered
      size={700}
      title="Signature"
      opened={signatureView.visible}
      onClose={() =>
        setSignatureView({
          details: undefined,
          visible: false,
        })
      }
    >
      <Image
        alt=""
        src={s3Url(signatureView.details?.signature?.bucket, signatureView.details?.signature?.key)}
      />
    </Modal>
  );

  const renderUpdateModal = () => (
    <Modal
      size={700}
      centered
      opened={editOpened}
      onClose={closeEditLog}
      title="Update Log Date"
    >
      <Group>
        <AlertCircle size={20} color="red" />
        <Text>Are you sure want to edit the date of this log?</Text>
      </Group>

      <Paper radius={10}>
        <Text size="sm">
          Status: <Badge>{selectedLog?.status}</Badge>
        </Text>
        <Group align="center" position="center" spacing="md">
          <Input
            label="Current Date"
            value={
              selectedLog?.datetime
                ? dayjs(selectedLog.datetime).format(LOG_DATE_FORMAT)
                : ""
            }
            disabled
          />

          <ArrowRight size={28} />

          <DatePicker
            label="New Date"
            placeholder="Pick new date"
            value={newDate ?? undefined}
            onChange={onChangeDatePart}
            maxDate={new Date()}
          />

          <TimeInput
            label="New Time"
            format="12"
            value={newDate ?? undefined}
            onChange={onChangeTimePart}
          />
        </Group>
      </Paper>

      <Group position="right">
        <Button customType="danger" variant="default" onClick={closeEditLog}>
          Cancel
        </Button>
        <Button
          customType="primary"
          loading={loadingUpdateLogs}
          disabled={accessRole()}
          onClick={onUpdateLogDate}
        >
          Update
        </Button>
      </Group>
    </Modal>
  );

  const onCancelOrder = () => {
    updateStatus({
      variables: {
        id: props.order?.id,
        order_status: "UNDELIVERED",
        order_type: "ORDER",
      },
    })
      .then((response) => {
        props.onUpdate(response.data.orderStatusUpdate);
        Notification.success({ message: "Order Cancelled" });
        setCancelView(false);
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      });
  };

  const cancelModal = () => (
    <Modal centered onClose={() => setCancelView(false)} opened={cancelView}>
      <h3>Cancel this Order: {props.order?.id}?</h3>
      <Group position="center">
        <Button onClick={() => setCancelView(false)} customType="secondary">
          Back
        </Button>
        <Button
          disabled={accessRole()}
          onClick={() => onCancelOrder()}
          customType="danger"
        >
          Cancel Order
        </Button>
      </Group>
    </Modal>
  );

  return (
    <div>
      {signatureModal()}
      {cancelModal()}
      {renderUpdateModal()}
      <Paper radius={8}>
        <h2>Order Logs</h2>
        <Paper radius={8}>
          <Tabs defaultValue="1">
            <Tabs.List>
              <Tabs.Tab value="1">Order Status</Tabs.Tab>
              <Tabs.Tab value="2">Delivery Status</Tabs.Tab>
              <Tabs.Tab value="3">SMS Logs</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="1">
              <div className={classes.tableContainer}>
                <Table highlightOnHover fontSize={"md"}>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Datetime</th>
                      <th>Updated by</th>
                    </tr>
                  </thead>
                  <tbody>{orderStatusRows}</tbody>
                </Table>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="2">
              <div className={classes.tableContainer}>
                <Table highlightOnHover fontSize={"md"}>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Datetime</th>
                      <th>Reason</th>
                      <th>Remarks</th>
                      <th>Customers ID</th>
                      <th>Authorized Recipient ID</th>
                      <th>Updated by</th>
                      <th>Signature</th>
                    </tr>
                  </thead>
                  <tbody>{orderDeliveryRows}</tbody>
                </Table>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="3">
              <div className={classes.tableContainer}>
                <Table highlightOnHover fontSize={"md"}>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Datetime</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>{orderSMSRows}</tbody>
                </Table>
              </div>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Paper>
    </div>
  );
};
