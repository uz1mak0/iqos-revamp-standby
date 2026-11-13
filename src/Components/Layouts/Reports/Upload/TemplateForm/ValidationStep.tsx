import React, { useEffect, useState } from "react";
import { Grid, Group, List, ScrollArea, Stack } from "../../../../Elements";
import { Progress, Text, Paper, Divider } from "@mantine/core";
import {
  AlertTriangle,
  CircleCheck,
  FileSettings,
  ListSearch,
} from "tabler-icons-react";
import { useMutation, useSubscription } from "@apollo/client";
import { salesUpload, uploadSales } from "../../../../../GraphQL/ReportsSchema";
import { WMS } from "../../../../../GraphQL";
import { useUploadPortalStore } from "./Store";
import Notification from "../../../../Elements/Notification/Notification";
import dayjs from "dayjs";
import { formatFileSize } from "../../../../../Utilities/Formatter";

export const ValidationStep = () => {
  const [onUploadSales, { loading: uploadLoading }] = useMutation(uploadSales, {
    context: { clientName: "warehouse" },
  });
  const [validationResult, setValidationResult] = useState<WMS.SalesUpload>();
  const {
    warehouse,
    s3Object,
    file,
    requestID,
    date,
    unoTypeTransaction,
    setValidating,
    setHasError,
    setErrorDownloadLink,
    setRequestID,
    setUnoTypeTransaction,
  } = useUploadPortalStore();

  //Subscription starts when requestID had value
  const { loading: subscriptionLoading } = useSubscription(salesUpload, {
    context: { clientName: "warehouse" },
    variables: {
      request_id: requestID,
    },
    shouldResubscribe: !!requestID,
    onData: ({ data }) => {
      //Save data to be able to display the validation result
      setValidationResult(data.data.onUpload);
      console.log(data);
      // number of rows need to validate
      const row = data.data?.onUpload?.rows;
      // number of rows validated
      const valid = data.data?.onUpload?.valid;
      // number of rows with error
      const errors = data.data?.onUpload?.errors;

      // Auto-download the UNO template file as soon as it's available
      const unoProjectUrl = data.data?.onUpload?.uno_project_url;
      if (unoProjectUrl) {
        const link = document.createElement("a");
        link.href = unoProjectUrl;
        link.download = ""; // let the browser infer the filename from the URL/headers
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Check if validation is completed
      if (Number(errors || 0) + Number(valid || 0) == Number(row || 0)) {
        if (errors) {
          // If error, save error url file to be downloaded
          setHasError(true);
          setErrorDownloadLink(data.data?.onUpload?.error_url);
        }
        setValidating(false);
        setRequestID(undefined);
      }
    },
    onError(error) {
      Notification.error({ message: "An error occured. Please try again" });
      console.log(error);
    },
  });

  useEffect(() => {
    //Check if warehouse, S3Object and request ID exist before request validation
    if (warehouse && s3Object && requestID) {
      setTimeout(() => {
        onRequestValidation();
      }, 3000);
    }
  }, [warehouse, s3Object, requestID]);

  const onRequestValidation = () => {
    // Set new request ID to be able to have a request first on subscription before upload the sales on database.
    setValidating(true);
    onUploadSales({
      variables: {
        request_id: requestID,
        warehouse_id: warehouse,
        file: s3Object,
        date: date,
        uno_template_type: warehouse == "PH1012" ? unoTypeTransaction : null,
      },
    });
  };

  // Display current progress percentage of validation
  const progressPercentage = () => {
    return (
      ((Number(validationResult?.errors || 0) +
        Number(validationResult?.valid || 0)) /
        Number(validationResult?.rows || 0) || 0) * 100
    );
  };

  // Formats error messages from validation
  const formatText = (text: string) => {
    const rowNumber = text.match(/row (\d+)\./);
    return (
      <Text fz="xs">
        <Text span inherit c={"red"}>
          {dayjs().format("MM-DD-YYYY hh:mm A")}
        </Text>
        {`  |  `}
        <Text span c={"red"} inherit>
          {`Row ${rowNumber ? rowNumber[1] : ""}: `}
        </Text>
        {` Error Message: ${text}`}
      </Text>
    );
  };

  return (
    <div>
      <Stack spacing={"xl"}>
        <div>
          <Text fw={700}>File Details</Text>
          <Paper radius={5}>
            <Group position="apart">
              <Text fz="xs">File name: {file?.name || ""}</Text>
              <Text fz="xs">Warehouse Name: {warehouse}</Text>
            </Group>
            <Text fz="xs">File size: {formatFileSize(Number(file?.size))}</Text>
          </Paper>
        </div>
        <div>
          <Text fz="lg" color="teal" fw={700}>
            {progressPercentage()}% Completed
          </Text>
          <Progress color="teal" value={progressPercentage()} />
          <Text fz={"xs"} c="dimmed">
            Please do not leave this page while the validation process is
            ongoing
          </Text>
        </div>
        <div>
          <Text fw={700}>Current Status of Validation</Text>
          <Grid>
            <Grid.Col span={4}>
              <Paper
                style={{ padding: 15, background: "#E2F6F0" }}
                withBorder
                radius={15}
              >
                <Group>
                  <CircleCheck color="#12B886" size={30} />
                  <Stack spacing={1}>
                    <Text fz="lg" color="teal" fw={700}>
                      {validationResult?.valid || 0}
                    </Text>
                    <Text color="black" fz="xs">
                      Total Validated Rows Successfully{" "}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Paper
                style={{ padding: 15, background: "#FEF5E1" }}
                withBorder
                radius={15}
              >
                <Group>
                  <ListSearch color="#FAB005" size={30} />
                  <Stack spacing={1}>
                    <Text fz="lg" color="yellow" fw={700}>
                      {Number(validationResult?.rows || 0) -
                        (Number(validationResult?.valid || 0) +
                          Number(validationResult?.errors || 0))}
                    </Text>
                    <Text color="black" fz="xs">
                      Remaining Validating Rows
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={4}>
              <Paper
                style={{ padding: 15, background: "#FEEAEA" }}
                withBorder
                radius={15}
              >
                <Group>
                  <AlertTriangle color="#E44747" size={30} />
                  <Stack spacing={1}>
                    <Text fz="lg" color="red" fw={700}>
                      {validationResult?.errors || 0}
                    </Text>
                    <Text color="black" fz="xs">
                      Total Affected Rows Errors
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </div>
        <>
          <Group>
            <FileSettings color="teal" />
            <Text fz="sm">Generates a detailed report of errors</Text>
          </Group>
          <div>
            <Paper
              radius={5}
              withBorder
              style={{ borderColor: "red", padding: 10 }}
            >
              <Divider
                my="xs"
                size={"xs"}
                label={
                  <Group>
                    <AlertTriangle width={20} color="#E44747" size={30} />
                    <Text>Please correct these errors and try again:</Text>
                  </Group>
                }
              />
              <ScrollArea
                style={{
                  height: validationResult?.error_logs?.length ? 300 : 50,
                }}
              >
                <List size={"sm"}>
                  {validationResult?.error_logs?.map((error, i) => (
                    <List.Item key={`error-${i}`}>
                      {formatText(`${error}`)}
                    </List.Item>
                  ))}
                </List>
              </ScrollArea>
            </Paper>
          </div>
        </>
      </Stack>
    </div>
  );
};
