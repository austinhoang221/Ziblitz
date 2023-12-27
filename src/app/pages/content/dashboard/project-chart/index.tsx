import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectChart() {
  const projects = useSelector((state: RootState) => state.projects);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);

  const options = {
    aspectRatio: 1,
  };
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
    <Card>
      <Select
        className="mb-2"
        style={{ width: "150px" }}
        placeholder="Please select project"
        // onChange={handleChange}
        options={projects.map((project) => {
          return {
            label: <span>{project.name}</span>,
            value: project.id,
          };
        })}
        value={projectId}
      />
      <Pie data={data} options={options} />;
    </Card>
  );
}
