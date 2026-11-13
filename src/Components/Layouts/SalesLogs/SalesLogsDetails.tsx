import { s3Url } from "../../../Utilities/Backend";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Check, QuestionMark, X } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { rolesAtom, channelAtom } from "../../../Store/StoreAtom";
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Modal,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Table,
  Drawer,
} from "../../Elements";
import RefundSales from "../RefundSales/RefundSales";
import { DeleteSalesRecord } from "./DeleteSalesRecord";
import { canUpdateSalesLogs } from "../../../Utilities/AccessRoles";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { useStyles } from "./Sales.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  details?: WMS.SaleTransaction | undefined;
  onRemoveRecord: (id: string) => void;
  isSales?: boolean;
  user?: string;
  onRefund: (id: string) => void;
};

export const SalesLogsDetails = (props: Props) => {
  const [channel] = useAtom(channelAtom);
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const [userRoles] = useAtom(rolesAtom);
  const [isRefund, setIsRefund] = useState(false);

  const onClose = () => {
    props.onClose();
    setIsRefund(false);
  };

  const onRefund = (id: string) => {
    props.onRefund(id);
    setIsRefund(false);
  };

  const itemDiscountBreakdown = (item: WMS.LineItem | null) => (
    <Group>
      <a> {item?.discount}</a>
      <Popover position="left">
        <Popover.Dropdown>
          <div style={{ textAlign: "left" }}>
            <p>
              Original Price:{" "}
              {Number((item?.sku?.price || 0) * (item?.quantity || 0))}
            </p>
            <p>Price per qauntity: {Number(item?.sku?.price)}</p>
            <p>Promo Discount: {item?.promo_discount || 0}</p>
            <p>
              Promo Goods Discount: {item?.sku?.promo?.discount || 0}{" "}
              <Badge>{item?.sku?.promo?.discount_type}</Badge>
            </p>
          </div>
        </Popover.Dropdown>
        <Popover.Target>
          <div>
            <ActionIcon size={"sm"} color="blue" variant="filled">
              <QuestionMark />
            </ActionIcon>
          </div>
        </Popover.Target>
      </Popover>
    </Group>
  );

  const rows = props.details?.items?.map((element, index) => (
    <tr key={`user-${index}`}>
      <td>{element?.sku?.gtin}</td>
      <td>{element?.sku?.description}</td>
      <td>{element?.sku?.sku}</td>
      <td>{element?.menthol_variant}</td>
      <td>{element?.quantity}</td>
      <td>{element?.promo_type}</td>
      <td>{element?.is_promo_good ? <Check /> : <X />}</td>
      <td>{element?.sku?.promo?.name || "-"}</td>
      <th>{itemDiscountBreakdown(element)}</th>
      <td>{element?.price}</td>
      <td>{element?.inputs || "-"}</td>
    </tr>
  ));

  const logsActionButtons = () => (
    <Group>
      {props.isSales && !props.details?.is_refunded ? (
        <Button
          fullWidth={width <= isTabletMobileView}
          disabled={!canUpdateSalesLogs(userRoles)}
          onClick={() => setIsRefund(true)}
        >
          Refund
        </Button>
      ) : undefined}

      {props.isSales && userRoles.isDirectRetailAdmin ? (
        <DeleteSalesRecord
          disabled={!canUpdateSalesLogs(userRoles)}
          details={props.details}
          onRemoveRecord={props.onRemoveRecord}
        />
      ) : undefined}
    </Group>
  );

  const salesLog = () => (
    <Stack>
      <Paper radius={8}>
        <Group position="apart">
          <h4>{props.details?.id}</h4>
          {width <= isTabletMobileView ? undefined : logsActionButtons()}
        </Group>
        <Divider />
        <Grid>
          <Grid.Col md={4} lg={3}>
            <p>Invoice ID: {props.details?.transaction_no}</p>
            <p>Sales Expert: {props.details?.sales_expert}</p>
            <p>Notes: {props.details?.return_notes}</p>
          </Grid.Col>
          <Grid.Col md={4} lg={3}>
            <p>
              Underwent Guided Trial:{" "}
              {props.details?.underwent_guided_trial ? "Yes" : "No"}
            </p>
            <p>Payment Type: {props.details?.payment_type}</p>
            {channel == WMS.ChannelType.DirectRetail ? (
              <p>Lead Source: {props.details?.lead_source}</p>
            ) : undefined}
          </Grid.Col>
          <Grid.Col md={4} lg={3}>
            <p>Remarks: {props.details?.remarks}</p>
            <p>Type: {props.details?.type}</p>
            {width <= isTabletMobileView ? logsActionButtons() : undefined}

            {channel == WMS.ChannelType.DirectRetail ? (
              <p>Club Status: {props.details?.club_status}</p>
            ) : undefined}
          </Grid.Col>
        </Grid>
      </Paper>
      <Accordion chevronPosition="left" variant="separated">
        <Accordion.Item value="receipt">
          <Accordion.Control disabled={!props.details?.signature?.key}>
            <>Open Receipt</>
          </Accordion.Control>
          <Accordion.Panel>
            <Group position="center">
              <Image
                alt="Receipt"
                src={s3Url(props.details?.signature?.bucket, props?.details?.signature?.key)}
              />
              <br />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="remittance">
          <Accordion.Control disabled={!props.details?.remittance_slip?.key}>
            <>Open Remittance Slip</>
          </Accordion.Control>
          <Accordion.Panel>
            <Group position="center">
              <Image
                alt="Receipt"
                src={s3Url(props.details?.remittance_slip?.bucket, props?.details?.remittance_slip?.key)}
              />
              <br />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <ScrollArea scrollbarSize={10}>
        <Table
          captionSide="bottom"
          highlightOnHover
          fontSize={width <= isTabletMobileView ? "sm" : "md"}
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
                <div className={classes.mobileTableTH}>SKU</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Menthol Variant</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Quantity</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Promo Type</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Promo Goods</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Promo</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Total Discount</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Price</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Serial</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <caption>
            <Group position="right">
              {props.isSales ? (
                <h3> TOTAL: {props.details?.total_price}</h3>
              ) : undefined}
            </Group>
          </caption>
        </Table>
      </ScrollArea>
    </Stack>
  );

  if (width <= isTabletMobileView)
    return (
      <Drawer
        padding={"md"}
        title={"Logs"}
        size={"full"}
        position="bottom"
        onClose={() => onClose()}
        opened={props.visible}
      >
        <div style={{ overflow: "scroll", height: height - 100 }}>
          {isRefund ? (
            <RefundSales
              user={props.user}
              onCancel={() => setIsRefund(false)}
              onRefund={onRefund}
              sales={props.details}
            />
          ) : (
            salesLog()
          )}
        </div>
      </Drawer>
    );

  return (
    <Modal
      size={1000}
      centered
      title="Logs"
      onClose={onClose}
      opened={props.visible}
    >
      {isRefund ? (
        <RefundSales
          user={props.user}
          onCancel={() => setIsRefund(false)}
          onRefund={onRefund}
          sales={props.details}
        />
      ) : (
        salesLog()
      )}
    </Modal>
  );
};
