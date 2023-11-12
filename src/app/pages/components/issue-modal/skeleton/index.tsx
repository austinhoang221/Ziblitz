import { Card, Col, Row, Skeleton, Table } from "antd";
import React from "react";

export default function IssueModalSkeleton() {
  return (
    <Row gutter={24}>
      <Col
        span={16}
        style={{
          maxHeight: "60vh",
        }}
      >
        <Skeleton.Input active block className="mb-2" />
        <Skeleton.Input
          active
          block
          style={{ width: "100%", height: "50px" }}
        />
        <Table loading={true}></Table>
        <Skeleton active />
      </Col>
      <Col span={8}>
        <Skeleton.Input active style={{ width: "100px" }} className="mb-2" />
        <Card title="Details">
          <Skeleton.Input active block className="mb-2" />
          <Skeleton.Input active block className="mb-2" />
          <Skeleton.Input active block className="mb-2" />
          <Skeleton.Input active block className="mb-2" />
          <Skeleton.Input active block className="mb-2" />
        </Card>
      </Col>
    </Row>
  );
}
