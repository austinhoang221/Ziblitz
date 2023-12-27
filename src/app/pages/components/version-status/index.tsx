import { Tag } from "antd";
import React from "react";

export default function VersionStatus(props: any) {
  const onRenderStatus = () => {
    switch (props.name) {
      case "UNRELEASED":
        return <Tag>{props.name}</Tag>;
      case "RELEASED":
        return <Tag color="#108ee9">{props.name}</Tag>;
      case "ARCHIVED":
        return <Tag color="purple">{props.name}</Tag>;
    }
  };
  return <>{onRenderStatus()}</>;
}
