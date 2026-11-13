import React from "react";
import { Group } from "../../Elements";

export const PowerBI = () => {
  return (
    <div>
      <Group position="center">
        <iframe
          width="1140"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=127f3614-b9fd-46ba-85a8-1b60912c1201&autoAuth=true&ctid=21eadd7d-988e-480e-be58-b25d292db752"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </Group>
    </div>
  );
};
