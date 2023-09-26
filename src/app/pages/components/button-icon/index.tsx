import React from "react";
import "./index.scss";
export default function ButtonIcon(props: any) {
  return (
    <>
      <button className="c-button-icon mr-2">
        <i className={props.iconClass}></i>
      </button>
    </>
  );
}
