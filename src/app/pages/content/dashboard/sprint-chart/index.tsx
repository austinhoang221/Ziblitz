import { Card, Select } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

export default function SprintChart() {
  const projects = useSelector((state: RootState) => state.projects);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
    aspectRatio: 1,
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.random()),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.random()),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Card>
      <Select
        className="mb-2"
        style={{ width: "150px" }}
        placeholder="Please select project"
        options={projects.map((project) => {
          return {
            label: <span>{project.name}</span>,
            value: project.id,
          };
        })}
        onChange={(e) => setProjectId(e)}
        value={projectId}
      />
      <Bar options={options} data={data} />
    </Card>
  );
}
