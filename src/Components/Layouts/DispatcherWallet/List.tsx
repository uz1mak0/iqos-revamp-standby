import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import React, { useState } from "react";
import { walletDeposit, walletWithdraw } from "../../../GraphQL/FinanceSchema";
import { Badge } from "../../Elements/Badge";
import { Button } from "../../Elements/Button";
import { Divider } from "../../Elements/Divider";
import { Group } from "../../Elements/Group";
import { Input } from "../../Elements/Input";
import { Modal } from "../../Elements/Modal";
import Notification from "../../Elements/Notification/Notification";
import { Table } from "../../Elements/Table";

type Props = {
  users: any;
  refetch: (
    variables?: Partial<OperationVariables> | undefined,
  ) => Promise<ApolloQueryResult<any>>;
};

export const List = (props: Props) => {
  const [modal, setModal] = useState(false);
  const [details, setDetails] = useState<any>({});
  const [type, setType] = useState("");
  const [amount, setAmount] = useState<number>();

  const [onWalletWithdraw, { loading: widthdrawLoading }] = useMutation(
    walletWithdraw,
    { context: { clientName: "order" } },
  );
  const [onWalletDeposit, { loading: depositingLoading }] = useMutation(
    walletDeposit,
    { context: { clientName: "order" } },
  );

  const openModal = (type: string, details: any, e?: any) => {
    e?.stopPropagation();
    setModal(true);
    setType(type);
    setDetails(details);
  };

  const onSubmit = () => {
    if (amount == 0 || undefined) return;

    if (type == "Deposit") {
      return onWalletDeposit({
        variables: {
          to_username: details?.username,
          amount: amount,
        },
        onCompleted: (data) => {
          setModal(false);
          props.refetch();
          Notification.success({
            title: "Deposit",
            message: "Transaction Successful",
          });
        },
        onError: console.error,
      });
    }
    return onWalletWithdraw({
      variables: {
        from_username: details?.username,
        amount: 0,
      },
      onCompleted: (data) => {
        setModal(false);
        props.refetch();
        Notification.success({
          title: "Widthdraw",
          message: "Transaction Successful",
        });
      },
      onError: console.error,
    });
  };

  const rows = props.users?.map(
    (element: { [key: string]: any }, index: number) => (
      <tr key={`list-${index}`}>
        <td>{element.username}</td>
        <td>{element.name}</td>
        <td>{element.phone_number}</td>
        <td>{element.wallet?.balance || 0}</td>
        <td>
          <Button
            onClick={(e) => openModal("Deposit", element, e)}
            customType="orange"
          >
            Deposit
          </Button>
        </td>
        <td>
          <Button onClick={(e) => openModal("Collect", element, e)}>
            Withdraw
          </Button>
        </td>
      </tr>
    ),
  );

  return (
    <>
      <Modal
        size={800}
        centered
        title={`${
          type == "Collect" ? "Collect from" : "Deposit to"
        } ${details?.name}`}
        opened={modal}
        onClose={() => setModal(false)}
      >
        <Divider />
        <p>Current Balance: {details?.wallet?.balance || 0} </p>
        <Input
          placeholder="Enter Amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <Divider my="10px" />
        <Group position="center">
          <Button
            onClick={() => {
              setAmount(0);
              setType("");
              setModal(false);
            }}
            styles={{ width: 250 }}
            customType="secondary"
          >
            Cancel
          </Button>
          <Button
            customType="primary"
            loading={type == "Collect" ? widthdrawLoading : depositingLoading}
            styles={{ width: 250 }}
            onClick={() => onSubmit()}
          >{`${type} Amount`}</Button>
        </Group>
      </Modal>
      <Table highlightOnHover fontSize={"md"}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Wallet Balance</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
