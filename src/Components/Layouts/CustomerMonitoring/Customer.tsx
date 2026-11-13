import { s3Url } from "../../../Utilities/Backend";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { WMS } from "../../../GraphQL";
import {
  getGuidedTrial,
  getGuidedTrialRecordSale,
} from "../../../GraphQL/RecordSalesSchema";
import {
  Accordion,
  Divider,
  Drawer,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Image,
} from "../../Elements";
import { CustomerGTItems } from "./CustomerGTItems";
import { CustomerRSItems } from "./CustomerRSItems";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { useViewportSize } from "@mantine/hooks";

type Props = {
  onClose: () => void;
  id?: string | undefined;
};

export const Customer = (props: Props) => {
  const { height, width } = useViewportSize();
  const [
    onLoadGuidedTrial,
    { data: guidedTrialData, loading: loadingGuidedTrial },
  ] = useLazyQuery<{ guidedTrial: WMS.GuidedTrial }>(getGuidedTrial, {
    context: { clientName: "warehouse" },
  });
  const [
    onLoadGuidedTrialRecordSale,
    { data: recordSaleData, loading: loadingRecordSale },
  ] = useLazyQuery<{ guidedTrial: WMS.GuidedTrial }>(getGuidedTrialRecordSale, {
    context: { clientName: "warehouse" },
  });
  const router = useRouter();

  useEffect(() => {
    if (props.id) {
      onLoadGuidedTrial({
        variables: {
          id: props.id,
        },
      }).then(({ data }) => {
        console.log(data);
        if (data?.guidedTrial.type === "GT_RS") {
          onLoadGuidedTrialRecordSale({
            variables: {
              id: props.id,
            },
          });
        }
      });
    }
  }, [props.id]);

  const content = () => (
    <>
      <LoadingOverlay visible={loadingGuidedTrial || loadingRecordSale} />
      {guidedTrialData?.guidedTrial ? (
        <Paper radius={5}>
          <h4>{props.id}</h4>
          <Divider />
          <h4>Record GT line items</h4>
          <p>GT device used: {guidedTrialData?.guidedTrial.device}</p>
          <p>
            GT Type:{" "}
            {guidedTrialData?.guidedTrial.sgt ? "SGT" : "First time GT"}
          </p>
          <CustomerGTItems
            line_items={guidedTrialData.guidedTrial?.items || []}
          />
        </Paper>
      ) : undefined}

      {recordSaleData?.guidedTrial ? (
        <div>
          <Paper radius={5}>
            <h4>Record Sale Information</h4>
            <p>
              Invoice ID:{" "}
              {recordSaleData?.guidedTrial.sales_transaction?.transaction_no}
            </p>
            <p>
              Remarks: {recordSaleData?.guidedTrial.sales_transaction?.remarks}
            </p>
            <p>
              Created By:{" "}
              {recordSaleData?.guidedTrial.sales_transaction?.created_by}
            </p>
            <p>
              Payment Type:{" "}
              {recordSaleData?.guidedTrial.sales_transaction?.payment_type}
            </p>
            <p>
              Lead Source:{" "}
              {recordSaleData?.guidedTrial.sales_transaction?.lead_source}
            </p>
            <p>
              Club Status:{" "}
              {recordSaleData?.guidedTrial.sales_transaction?.club_status}
            </p>
            <Accordion chevronPosition="left" variant="separated">
              <Accordion.Item value="receipt">
                <Accordion.Control
                  disabled={
                    !recordSaleData.guidedTrial?.sales_transaction?.signature
                      ?.key
                  }
                >
                  <>Open Receipt</>
                </Accordion.Control>
                <Accordion.Panel>
                  <Group position="center">
                    <Image
                      alt="Receipt"
                      src={s3Url(recordSaleData?.guidedTrial?.sales_transaction?.signature?.bucket, recordSaleData?.guidedTrial?.sales_transaction?.signature?.key)}
                    />
                    <br />
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="remittance">
                <Accordion.Control
                  disabled={
                    !recordSaleData.guidedTrial?.sales_transaction
                      ?.remittance_slip?.key
                  }
                >
                  <>Open Remittance Slip</>
                </Accordion.Control>
                <Accordion.Panel>
                  <Group position="center">
                    <Image
                      alt="remittance"
                      src={s3Url(recordSaleData?.guidedTrial?.sales_transaction?.remittance_slip?.bucket, recordSaleData?.guidedTrial?.sales_transaction?.remittance_slip?.key)}
                    />
                    <br />
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Paper>
          <Paper radius={10}>
            <h4>Record Sale line items</h4>
            <CustomerRSItems
              line_items={recordSaleData.guidedTrial.sales_transaction?.items}
              total_price={
                recordSaleData.guidedTrial.sales_transaction?.total_price
              }
            />
          </Paper>
        </div>
      ) : undefined}
    </>
  );

  if (width <= isTabletMobileView)
    return (
      <Drawer
        padding={"md"}
        title={"Customer Monitoring"}
        size={"full"}
        position="bottom"
        onClose={props.onClose}
        opened={props.id ? true : false}
      >
        <div style={{ overflow: "scroll", height: height - 100 }}>
          {content()}
        </div>
      </Drawer>
    );

  return (
    <Modal
      size={1000}
      centered
      title="Customer Monitoring"
      onClose={props.onClose}
      opened={props.id ? true : false}
    >
      {content()}
    </Modal>
  );
};
