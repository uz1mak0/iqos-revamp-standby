import React, { useState } from "react";
import { NavigationMain } from "../src/Components/Layouts/NavigationMain";
import { useAtom } from "jotai";
import { channelAtom } from "../src/Store/StoreAtom";
import ChannelSelection from "../src/Components/Layouts/NavigationMain/ChannelSelection";
type Props = {};

const index = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedChannel, setSelectedChannel] = useAtom(channelAtom);

  return (
    <div>{!selectedChannel ? <ChannelSelection /> : <NavigationMain />}</div>
  );
};

export default index;
