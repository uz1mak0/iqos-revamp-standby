import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  getCustomerTrial,
  getHypercarePerCustomer,
  getWeeklyCount,
} from "../../../GraphQL/CRMSchema";
import { Trial, WeekCount } from "../../../GraphQL/_gql/crm/graphql";
import { IFormInput } from "../CRMTrials/Create/Create";
import { ConsumerHypercareList } from "./ConsumerHypercareList";
import { ConsumerTrialDetails } from "./ConsumerTrialDetails";
import { Group } from "../../Elements";
import { IconArrowLeft } from "@tabler/icons-react";

export const CRMConsumerHypercare = () => {
  const router = useRouter();
  const [queryCustomerHypercare, { loading }] = useLazyQuery(
    getHypercarePerCustomer,
    { context: { clientName: "crm" } },
  );
  const [queryCustomerTrial] = useLazyQuery(getCustomerTrial, {
    context: { clientName: "crm" },
  });
  const [hypercares, setHypercares] = useState<IFormInput[]>([]);
  const [trial, setTrial] = useState<Trial>();
  useEffect(() => {
    if (router.query.orderID) {
      loadHypercares();
      loadTrial();
    }
  }, [router.query.orderID]);

  const loadHypercares = () => {
    setTimeout(() => {
      queryCustomerHypercare({
        variables: {
          customer_id: router.query.orderID,
        },
        fetchPolicy: "no-cache",
      }).then(({ data }) => {
        setHypercares([]);
        const updateList = data?.hyperCarePerCustomer?.items;
        setTimeout(() => {
          setHypercares([...updateList].reverse());
        }, 10);
      });
    }, 2000);
  };

  const loadTrial = () => {
    queryCustomerTrial({
      variables: {
        id: router.query.orderID,
      },
    }).then(({ data }) => {
      setTrial(data.trial);
    });
  };

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={() => history.back()}>
        <Group align="center">
          <IconArrowLeft size={30} stroke={4} />
          <h2> Consumer Trial Details</h2>
        </Group>
      </div>
      <ConsumerTrialDetails
        trial={trial}
        variants={hypercares[0]?.orders || []}
      />
      <ConsumerHypercareList
        trial={trial}
        onUpdate={loadHypercares}
        list={hypercares}
      />
    </div>
  );
};
