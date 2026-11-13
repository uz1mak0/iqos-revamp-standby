import React, { useEffect, useState } from "react";
import { Paper, Stack, Tabs } from "../../Elements";
import { RefundList } from "./RefundList";
import { SalesList } from "./SalesList";
import { ReplacementList } from "./ReplacementList";
import { BackButton } from "../../Modules/BackButton/BackButton";
import { useAtom } from "jotai";
import { channelAtom } from "../../../Store/StoreAtom";
export const SalesLogs = () => {
  const [channel] = useAtom(channelAtom);
  return (
    <Stack>
      <BackButton title="Home" url="/" />
      <Paper radius={5}>
        <Tabs keepMounted={true} defaultValue="sales">
          {channel != "INDIRECT_CHANNEL" ? (
            <Tabs.List>
              <Tabs.Tab value="sales">Sales</Tabs.Tab>
              <Tabs.Tab value="replacements">Replacements</Tabs.Tab>
              <Tabs.Tab value="refund">Return / Refund</Tabs.Tab>
            </Tabs.List>
          ) : null}
          <Tabs.Panel pt="lg" value="sales">
            <SalesList />
          </Tabs.Panel>
          <Tabs.Panel pt="lg" value="replacements">
            <ReplacementList />
          </Tabs.Panel>
          <Tabs.Panel pt="lg" value="refund">
            <RefundList />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Stack>
  );
};
