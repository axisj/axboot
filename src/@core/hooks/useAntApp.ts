import { App } from "antd";

export function useAntApp() {
  const { message, notification, modal } = App.useApp();
  return {
    messageApi: message,
    notificationApi: notification,
    modalApi: modal,
  };
}
