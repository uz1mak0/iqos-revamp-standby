import { useLazyQuery } from "@apollo/client";
import { Flex } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import {
  getHypercarePerWeek,
  getWeeklyCount,
} from "../../../GraphQL/CRMSchema";
import { Hypercare, WeekCount } from "../../../GraphQL/_gql/crm/graphql";
import { Card, Grid, LoadingOverlay, ScrollArea } from "../../Elements";
import { getRandomColors } from "./Config";
import { useStyles } from "./crmhypercare.styles";
import { useDraggable } from "react-use-draggable-scroll";
import List from "./List";

export const CRMHypercare = () => {
  const { classes } = useStyles();
  const hypercareWeeks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const [queryHypercarePerWeek, { loading }] = useLazyQuery(
    getHypercarePerWeek,
    { context: { clientName: "crm" } },
  );
  const [queryWeeklyCount] = useLazyQuery(getWeeklyCount, {
    context: { clientName: "crm" },
  });
  const [list, setList] = useState<Hypercare[]>([]);
  const [weeklyCount, setWeeklyCount] = useState<WeekCount[]>([]);
  const [selected, setSelected] = useState(2);
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  useEffect(() => {
    loadHypercarePerWeek(2);
  }, []);

  /**
   *
   * @param week current week
   */
  const loadHypercarePerWeek = (week: number) => {
    queryHypercarePerWeek({
      variables: {
        week: `WEEK ${week}`,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      setSelected(week);
      setList(data?.hyperCarePerWeek?.items || []);
    });
    loadWeeklyCount();
  };

  const loadWeeklyCount = () => {
    queryWeeklyCount({ variables: {}, fetchPolicy: "no-cache" }).then(
      ({ data }) => {
        setWeeklyCount(data.weekCounts || []);
      },
    );
  };
  return (
    <div className={classes.statusContainer}>
      <LoadingOverlay visible={loading} />
      <div className={classes.statusContainer} {...events} ref={ref}>
        <div style={{ width: 300 }}>
          <Flex gap={"lg"} justify={"start"}>
            {hypercareWeeks.map((week, i) => (
              <div key={`${week}`}>
                <Card
                  key={`${week}`}
                  background={getRandomColors[i]}
                  title={`Week ${week}`}
                  number={
                    weeklyCount.find(
                      (e: WeekCount) => e.week === `WEEK ${week}`,
                    )?.total || 0
                  }
                  onClick={() => loadHypercarePerWeek(week)}
                  isSelected={selected === week}
                />
              </div>
            ))}
          </Flex>
        </div>
      </div>
      <div>
        <List items={list} />
      </div>
    </div>
  );
};
