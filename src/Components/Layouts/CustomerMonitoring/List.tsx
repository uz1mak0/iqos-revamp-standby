import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Search } from "tabler-icons-react";
import { WMS } from "../../../GraphQL";
import { getGuidedTrials } from "../../../GraphQL/RecordSalesSchema";
import {
  Badge,
  Group,
  Input,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Table,
} from "../../Elements";
import { isTabletMobileView } from "../../../Utilities/Formatter";
import { useViewportSize } from "@mantine/hooks";
import { useStyles } from "../SalesLogs/Sales.styles";
import { Customer } from "./Customer";
import { BackButton } from "../../Modules/BackButton/BackButton";

export const List = () => {
  const { classes } = useStyles();
  const [list, setList] = useState<WMS.GuidedTrial[]>([]);
  const { height, width } = useViewportSize();
  const [guidedTrials, { loading: loading }] = useLazyQuery(getGuidedTrials, {
    context: { clientName: "warehouse" },
  });
  const router = useRouter();
  const [selectedGuidedTrial, setSelectedGuidedTrial] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    loadGuidedTrials();
  }, []);

  const loadGuidedTrials = () => {
    guidedTrials({
      fetchPolicy: "no-cache",
    }).then((res) => {
      setList(res.data.guidedTrials.items);
    });
  };

  const rows = list
    ?.sort((a, b) => Number(b?.date_created) - Number(a?.date_created))
    .map((element, index) => (
      <tr
        onClick={() => setSelectedGuidedTrial(`${element.id}`)}
        key={`user-${index}`}
      >
        <td>
          {element.type === "GT_RS" ? (
            <Badge>GUIDED TRIAL - RECORD SALE</Badge>
          ) : (
            <Badge>GUIDED TRIAL</Badge>
          )}
        </td>
        <td>
          {dayjs(Number((element?.date_created || 0) * 1000)).format(
            "MMM-DD-YYYY",
          )}
        </td>
      </tr>
    ));

  return (
    <Stack>
      <BackButton title="Home" url="/" />
      <LoadingOverlay visible={loading} />
      <Customer
        id={selectedGuidedTrial}
        onClose={() => {
          setSelectedGuidedTrial(undefined);
        }}
      />
      {/* <Group>
            <Input
                icon={<Search/>} 
                style={{width: 300}} 
                placeholder='Search by Name'
            />
            <Input
                icon={<Search/>} 
                style={{width: 300}} 
                placeholder='Search by Email'
            />
        </Group> */}
      <ScrollArea scrollbarSize={10} style={{ height: 700 }}>
        <Table
          highlightOnHover
          fontSize={width <= isTabletMobileView ? "sm" : "md"}
        >
          <thead>
            <tr>
              <th>
                <div className={classes.mobileTableTH}>Type</div>
              </th>
              <th>
                <div className={classes.mobileTableTH}>Date of Order</div>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
};
