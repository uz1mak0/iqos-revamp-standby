import React, { useEffect, useState } from "react";
import { Badge } from "../../Elements";
import { useLazyQuery } from "@apollo/client";
import { getActiveSMSTemplates } from "../../../GraphQL/SMSSettingsSchema";
import { ORDER } from "../../../GraphQL";
import { IconInfoCircle } from "@tabler/icons-react";

export const ActiveSMS = () => {
  const [activeTemplate, setActiveTemplate] = useState<
    ORDER.SmsTemplate | undefined
  >();
  const [fetchActiveSMSTemplate, { loading: loadingActiveSMSTemplate }] =
    useLazyQuery(getActiveSMSTemplates, { context: { clientName: "order" } });

  useEffect(() => {
    fetchActiveSMSTemplate({ fetchPolicy: "no-cache" }).then((res) => {
      setActiveTemplate(res.data?.activeSMSTemplate);
    });
  }, []);

  return (
    <div>
      <p
        style={{
          fontSize: 12,
          lineHeight: 2,
          color: "#909296",
          margin: 0,
        }}
      >
        Marketplace SMS
      </p>
      <div style={{ margin: 8 }}>
        <Badge
          color="yellow"
          leftSection={<IconInfoCircle style={{ marginTop: 8 }} size={20} />}
          size="lg"
        >
          {activeTemplate?.type}
        </Badge>
      </div>
    </div>
  );
};
