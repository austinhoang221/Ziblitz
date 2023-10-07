import { message } from "antd";
import React from "react";

export default function Message(props: any) {
  const [messageApi, contextHolder] = message.useMessage();

  const openMessage = () => {
    messageApi.open({
      type: props.type,
      content: props.content,
    });
  };
  return { contextHolder };
}
