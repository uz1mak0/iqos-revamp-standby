import React from "react";
import { showNotification } from "@mantine/notifications";
import { Check, X, InfoCircle } from "tabler-icons-react";

type NotificationProps = {
  title?: string;
  message?: string | React.ReactNode;
  render?: React.ReactNode;
};

class Notification {
  success(props: NotificationProps) {
    showNotification({
      autoClose: 5000,
      title: props.title,
      message: <p data-testid={`NOTIF-${props.message}`}>{props.message}</p>,
      color: "teal",
      icon: <Check />,
      closeButtonProps: {
        "data-testid": `NOTIF-SUCCESS-CLOSE-${props.message}`,
      },
    });
  }

  error(props: NotificationProps) {
    showNotification({
      autoClose: 5000,
      title: props.title,
      message: <p data-testid={`NOTIF-${props.message}`}>{props.message}</p>,
      color: "red",
      icon: <X />,
      closeButtonProps: {
        "data-testid": `NOTIF-ERROR-CLOSE-${props.message}`,
      },
    });
  }

  info(props: NotificationProps) {
    showNotification({
      autoClose: 5000,
      title: props.title,
      message: <p data-testid={`NOTIF-${props.message}`}>{props.message}</p>,
      color: "blue",
      icon: <InfoCircle />,
      closeButtonProps: {
        "data-testid": `NOTIF-INFO-CLOSE-${props.message}`,
      },
    });
  }
}

export default new Notification();
