import { Button } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
interface IIssuePriority {
  priorityId: string;
}
export default function IssuePriority(props: IIssuePriority) {
  const { priorities } = useSelector((state: RootState) => state.projectDetail);
  const onRenderPriority = () => {
    const priority = priorities?.find((item) => item.id === props.priorityId);
    return (
      <Button type="text" shape="circle" style={{ color: priority?.color }}>
        {priority?.icon}
      </Button>
    );
  };
  return onRenderPriority();
}
