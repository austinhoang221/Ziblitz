import { Button } from "antd";
import React from "react";
import "./index.scss";
export default function ButtonIcon(props: any) {
  return (
    <>
      <Button shape="circle" type="text" className="c-Button-icon ml-2">
        <i className={props.iconClass}></i>
      </Button>
    </>
  );
}
