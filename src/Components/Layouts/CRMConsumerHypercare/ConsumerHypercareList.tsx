import React from "react";
import { Trial } from "../../../GraphQL/_gql/crm/graphql";
import { Accordion, Paper } from "../../Elements";
import { getFeedbackSurveysMockData } from "../../Modules/CRM/Config";
import { IFormInput } from "../CRMTrials/Create/Create";
import { ConsumerWeeklyHypercare } from "./ConsumerWeeklyHypercare";
import { useRouter } from "next/router";

type Props = {
  list: IFormInput[];
  onUpdate: () => void;
  trial: Trial | undefined;
};

export const ConsumerHypercareList = (props: Props) => {
  const weeks = props.list.map((item) => Number(item.week.replace("WEEK", "")));
  const router = useRouter();
  return (
    <Paper radius={10}>
      <h2>Hypercare</h2>
      {props.list.length > 0 ? (
        <Accordion
          radius={8}
          chevronPosition="right"
          variant="contained"
          multiple
          defaultValue={
            props.list
              ? router.query.week
                ? `${router.query.week}`
                : `WEEK ${Math.max(...weeks)}`
              : undefined
          }
        >
          {props.list.map((item) => (
            <Accordion.Item
              key={`${item.week.replace("WEEK", "")}`}
              value={`${item.week}`}
            >
              <Accordion.Control data-testid={`accordion-${item.week}`}>
                {item.week}
              </Accordion.Control>
              <Accordion.Panel>
                <ConsumerWeeklyHypercare
                  trial={props.trial}
                  onUpdateHypercare={props.onUpdate}
                  hypercare={item}
                  isLatestWeek={item.week == `WEEK ${Math.max(...weeks)}`}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : undefined}
    </Paper>
  );
};
