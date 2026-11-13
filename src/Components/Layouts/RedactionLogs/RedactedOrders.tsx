import React, { useState } from "react";
import {
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  ScrollArea,
  Stack,
  Table,
} from "../../Elements";
import { useQuery } from "@apollo/client";
import { getRedactionOrders } from "../../../GraphQL/RedactionSchema";
import { ORDER } from "../../../GraphQL";
import { usePagination } from "@mantine/hooks";

type Props = {
  details: ORDER.RedactLog | undefined;
  onClose: () => void;
};

export const RedactedOrders = (props: Props) => {
  const pagination = usePagination({ total: 200, initialPage: 1 });
  const [list, setList] = useState<ORDER.Order[]>([]);

  const { loading, data, fetchMore } = useQuery(getRedactionOrders, {
    variables: {
      date_filter: {
        from: props.details?.date_affected,
        to: props.details?.date_affected,
      },
      next_token: null, // Initially set next_token to null
    },
    context: { clientName: "order" },
    onCompleted: (data) => {
      if (data.orders.next_token) {
        // Fetch more data
        fetchMore({
          variables: {
            next_token: data.orders.next_token,
          },
        });
      } else {
        // No more next_token, set the final list
        setList(data.orders.items);
      }
    },
  });

  const rows = () => {
    return (
      list
        // makes 100 items per page base on active page
        ?.slice((pagination.active - 1) * 100, pagination.active * 100)
        .map((item, index) => (
          <React.Fragment key={`list-${index}`}>
            <tr>
              <td>{item.order_id}</td>
              <td>{`${item.shipping_address?.first_name} ${item.shipping_address?.last_name}`}</td>
              <td>{item.shipping_address?.telephone_number}</td>
              <td>{item.shipping_address?.email}</td>
              <td>{item.shipping_address?.city}</td>
              <td>{item.shipping_address?.zip}</td>
            </tr>
          </React.Fragment>
        ))
    );
  };

  return (
    <div>
      <Modal
        opened={props.details ? true : false}
        onClose={() => props.onClose()}
        centered
        fullScreen
        title="Redaction Details"
      >
        <LoadingOverlay visible={loading} />
        <Stack>
          <h4>{`${
            props.details?.status === "SUCCESS" ? "Success" : "Failed"
          } Redacted Coverage`}</h4>
          <ScrollArea style={{ height: 750 }}>
            <div>
              <Table highlightOnHover fontSize={"md"}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>ZIP Code</th>
                  </tr>
                </thead>
                <tbody>{rows()}</tbody>
              </Table>
            </div>
          </ScrollArea>
          <Group position="right">
            <Pagination
              position="center"
              total={Math.ceil((list?.length || 0) / 100)}
              page={pagination.active}
              onChange={pagination.setPage}
            />
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};
