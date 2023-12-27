import { Col, Row, Table } from "antd";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import "./index.scss";
import SprintChart from "./sprint-chart";
import ProjectChart from "./project-chart";
export default function Dashboard() {
  Chart.register(ArcElement);
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Row gutter={48} className="mt-4">
        <Col span={10}>
          <ProjectChart></ProjectChart>
        </Col>
        <Col span={14}>
          <Table></Table>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col span={24}>
          <SprintChart></SprintChart>
        </Col>
      </Row>
    </>
  );
}
