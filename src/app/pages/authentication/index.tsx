import { Checkbox, Input, Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import "./index.scss";
import Login from "./login";
import SignUp from "./signup";
export default function Authentication() {
  const onSubmit = () => {};
  const [defaultTabIndex, setDefaultTabIndex] = useState<string>("1");
  const goToSignUp = () => {
    setDefaultTabIndex("2");
  };
  const goToLogin = () => {
    setDefaultTabIndex("1");
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tab 1",
      children: <Login onSubmit={onSubmit} goToSignUp={goToSignUp} />,
    },
    {
      key: "2",
      label: "Tab 2",
      children: <SignUp onSubmit={onSubmit} goToLogin={goToLogin} />,
    },
  ];
  return (
    <>
      <section className="vh-100 c-login">
        <header className="c-login-header">
          <img
            src={require("../../assets/images/logo.png")}
            className="mr-2"
            alt="Logo"
            width="50px"
            height="50px"
          ></img>
          <h1>HeadUp</h1>
        </header>
        <div className="c-login-section">
          <h2 className="mb-4 text-center">Welcome back</h2>
          <Tabs
            activeKey={defaultTabIndex}
            items={items}
            onChange={setDefaultTabIndex}
          />
        </div>
      </section>
    </>
  );
}
