import { useQuery } from "@apollo/client";
import { FileWithPath } from "@mantine/dropzone";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { ArrowLeft, Tex } from "tabler-icons-react";
import { RETAIL, WMS } from "../../../GraphQL";
import { getWarehouses } from "../../../GraphQL/InventorySchema";
import { getSalesExperts } from "../../../GraphQL/UserSchema";
import { rolesAtom, userAtom, channelAtom } from "../../../Store/StoreAtom";
import {
  DatePicker,
  Grid,
  Input,
  Paper,
  Select,
  TextArea,
} from "../../Elements";
import { RecordSalesItemsProps } from "./RecordSaleItems";
import {
  getClubStatuses,
  getLeadSource,
  getPaymentType,
  getRecordSalesType,
  RecordSalesFormInputs,
  getICRecordSalesType,
  getICPaymentType,
  getKCRecordSalesType,
} from "./RecordSalesConfig";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { Box, Checkbox, Divider, Group, Text } from "@mantine/core";

type Props = {
  isGT?: boolean;
  onReturnForm?: () => void;
  form: UseFormReturnType<
    RecordSalesFormInputs,
    (values: RecordSalesFormInputs) => RecordSalesFormInputs
  >;
};

export const RecordInformation = (props: Props) => {
  const [channel] = useAtom(channelAtom);
  const { height, width } = useViewportSize();
  const [userRoles] = useAtom(rolesAtom);
  const [user] = useAtom(userAtom);
  const { loading, data } = useQuery(getWarehouses, {
    context: { clientName: "warehouse" },
    variables: {
      channel: channel,
    },
  });
  const { data: dataSalesExpert } = useQuery(getSalesExperts, {
    context: { clientName: "warehouse" },
  });

  // useEffect(() => {
  //     if (data && user) {
  //         props.form.setFieldValue('warehouse_id', data.warehouses.items[0]?.id)
  //     }
  // }, [data, user])

  const onChangeType = (type: string) => {
    props.form.setFieldValue("type", type);
    console.log(type);
    if (type === "Replacement") {
      const updateList = props.form.values.scanned_items.map((item) => {
        return {
          ...item,
          price: 0,
          promo_discount: 0,
          discount: 0,
          promo_type: undefined,
          promo: undefined,
        };
      });
      props.form.setFieldValue("scanned_items", []);
      setTimeout(() => {
        props.form.setFieldValue("scanned_items", updateList);
      }, 0);
    }
  };

  const lgSize = channel === "INDIRECT_CHANNEL" ? 4 : 3;

  const paymentTypes =
    channel === "INDIRECT_CHANNEL"
      ? getICPaymentType // whatever list you want for indirect
      : getPaymentType;


  return (
    <div>
      <Paper radius={5}>
        <Group position="apart" align="center">
          <h4>Record Information</h4>
          {channel === "INDIRECT_CHANNEL" &&
            props.form.values.ir_error_tags?.length > 0 && (
              <Text size={13} color="red">
                IR ID: {props.form.values.incident_report_id}
              </Text>
            )}
        </Group>
        <Grid>
          <Grid.Col md={6} lg={lgSize}>
            <Select
              searchable
              {...props.form.getInputProps("warehouse_id")}
              required
              disabled={props.isGT && (userRoles.isEcommUser || userRoles.isEcomAdmin)}
              description="Warehouse"
              placeholder="Select Warehouse"
              onChange={(e) => {
                props.form.setFieldValue("sales_expert", "");
                props.form.setFieldValue("warehouse_id", e);
              }}
              isPullUpSelect={width <= isTabletMobileView}
              onSelectFromPullUp={(value) => {
                props.form.setFieldValue("warehouse_id", value);
                props.form.setFieldValue("sales_expert", "");
              }}
              data={
                data?.warehouses?.items
                  ?.filter((e: WMS.Warehouse) =>
                    channel === "INDIRECT_CHANNEL" ||
                      userRoles.isAdminIC ||
                      userRoles.isFullAdmin ||
                      userRoles.isDirectRetailAdmin
                      ? e
                      : user?.office_ids?.some((o) => o == e.id),
                  )
                  .map((wh: WMS.Warehouse) => ({
                    value: wh.id,
                    label: wh.name,
                  })) || []
              }

            />
          </Grid.Col>

          <Grid.Col md={6} lg={lgSize}>
            <DatePicker
              {...props.form.getInputProps("date_created")}
              description="Date"
              dropdownType="modal"
              maxDate={new Date()}
            />
          </Grid.Col>

          <Grid.Col md={6} lg={lgSize}>
            <Input
              {...props.form.getInputProps("transaction_number")}
              placeholder="Enter Invoice ID"
              description="Invoice ID"
            />
          </Grid.Col>

          {channel !== "INDIRECT_CHANNEL" && (
            <Grid.Col md={6} lg={lgSize}>
              <Input
                {...props.form.getInputProps("cegid_no")}
                placeholder="Enter CEGID No"
                description="CEGID No."
              />
            </Grid.Col>
          )}
        </Grid>

        <Grid>
          <Grid.Col md={6} lg={3}>
            <Select
              {...props.form.getInputProps("type")}
              onChange={(e) => onChangeType(e)}
              required
              description="Type"
              placeholder="Select Type"
              data={
                channel != "INDIRECT_CHANNEL"
                  ? getRecordSalesType
                  : props.form.values.warehouse_id === "PH1204"
                  ? getKCRecordSalesType.filter((salesType) =>
                      user.name?.includes("cashier")
                        ? salesType.value === "Sampling"
                        : salesType.value === "Sales",
                    )
                    : getICRecordSalesType
              }
              isPullUpSelect={width <= isTabletMobileView}
              onSelectFromPullUp={(value) =>
                props.form.setFieldValue("type", value)
              }
            />
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            <Input
              withAsterisk={true}
              {...props.form.getInputProps("remarks")}
              description="Remarks"
              placeholder="Enter Remarks"
            />
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            <Input
              {...props.form.getInputProps("created_by")}
              description="Created By"
              disabled
            />
          </Grid.Col>
          <Grid.Col md={6} lg={3}>
            <Select
              {...props.form.getInputProps("sales_expert")}
              required
              disabled={!props.form.values.warehouse_id}
              description="Sales Expert"
              placeholder="Select Sales Expert"
              data={
                dataSalesExpert?.salesExperts?.items
                  ?.filter((e: RETAIL.SalesExpert) =>
                    e.office_ids?.some(
                      (office) => office === props.form.values.warehouse_id,
                    ),
                  )
                  ?.map((se: RETAIL.SalesExpert) => {
                    return {
                      value: se.sales_expert_id,
                      label: se.name,
                    };
                  }) || []
              }
              isPullUpSelect={width <= isTabletMobileView}
              onSelectFromPullUp={(value) =>
                props.form.setFieldValue("sales_expert", value)
              }
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col md={6} lg={3}>
            <Select
              required
              searchable
              {...props.form.getInputProps("payment_type")}
              description="Payment Type"
              placeholder="Select Payment Type"
              data={(props.form.values.warehouse_id === "PH1204"
                ? paymentTypes.filter((payment) => payment === "QRPH")
                : paymentTypes
              ).map((payment) => ({
                value: payment,
                label: payment,
              }))}
              isPullUpSelect={width <= isTabletMobileView}
              onSelectFromPullUp={(value) =>
                props.form.setFieldValue("payment_type", value)
              }
            />
          </Grid.Col>

          {channel === "INDIRECT_CHANNEL" && (
            <>
              <Grid.Col md={6} lg={3}>
                <Text color="dimmed" size={12}>
                  Link Tagging
                </Text>
                <Group>
                  <Checkbox.Group {...props.form.getInputProps("link_tags")}>
                    <Group spacing="lg">
                      <Checkbox value="LINKED_EGM" label="Linked EGM" />
                      <Checkbox value="LINKED_SSR" label="Linked SSR" />
                      <Checkbox
                        value="SAMPLING_REGISTERED"
                        label="Sampling Registered"
                      />
                    </Group>
                  </Checkbox.Group>
                </Group>
              </Grid.Col>

              <Grid.Col md={6} lg={5}>
                <Text color="dimmed" size={12}>
                  Error Tagging
                </Text>
                <Group>
                  <Checkbox.Group
                    {...props.form.getInputProps("ir_error_tags")}
                  >
                    <Group spacing="lg">
                      <Checkbox value="EGM_ERROR" label="EGM Error" />
                      <Checkbox value="SSR_ERROR" label="SSR Error" />
                      <Checkbox
                        value="SAMPLING_REG_ERROR"
                        label="Sampling Reg Error"
                      />
                      <Checkbox value="HOME_REGISTRATION" label="Home Registration" />
                      <Checkbox value="LINK_VIA_CEAPP" label="Link via Ceapp" />

                    </Group>
                  </Checkbox.Group>
                </Group>
              </Grid.Col>
            </>
          )}

          {channel != "INDIRECT_CHANNEL" ? (
            <>
              <Grid.Col md={6} lg={3}>
                <Select
                  required
                  {...props.form.getInputProps("lead_source")}
                  isPullUpSelect={width <= isTabletMobileView}
                  searchable
                  onSelectFromPullUp={(value) =>
                    props.form.setFieldValue("lead_source", value)
                  }
                  description="Lead Source"
                  placeholder="Select Lead Source"
                  data={getLeadSource}
                />
              </Grid.Col>

              <Grid.Col md={6} lg={3}>
                <Select
                  required
                  searchable
                  {...props.form.getInputProps("club_status")}
                  description="Club Status"
                  placeholder="Select Club Status"
                  data={getClubStatuses}
                  isPullUpSelect={width <= isTabletMobileView}
                  onSelectFromPullUp={(value) =>
                    props.form.setFieldValue("club_status", value)
                  }
                />
              </Grid.Col>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Paper>
      {channel != "INDIRECT_CHANNEL" ? (
        <Paper radius={5}>
          <Grid>
            <Grid.Col md={6} lg={3}>
              <TextArea
                required
                {...props.form.getInputProps("return_notes")}
                description="Notes"
                placeholder="Add notes"
              />
            </Grid.Col>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
    </div>
  );
};
