import { Col, Row } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";
import CustomFilterIssueNav from "./filter-nav";
import CustomFilterList from "./list";

export default function CustomFilterIssues() {
  return (
    <>
      <Row gutter={32}>
        <Col span={4}>
          <CustomFilterIssueNav />
        </Col>
        <Col span={20}>
          <CustomFilterList></CustomFilterList>
        </Col>
      </Row>
    </>
  );
}
