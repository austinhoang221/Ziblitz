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
import { DashBoardService } from "../../../../../services/dashboardService";
import { checkResponseStatus, getRandomColor } from "../../../../helpers";

export default function SprintChart() {
  const projects = useSelector((state: RootState) => state.projects);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);
  const [listData, setListData] = useState<any>();

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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "All sprint of project",
      },
    },
    aspectRatio: 1,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (projectId) {
      DashBoardService.getSprintChart(projectId).then((res) => {
        if (checkResponseStatus(res)) {
          const labels = res?.data.map((item) => item.name);
          const datasets = [
            {
              label: "Issues",
              data: res?.data.map((item) => item.issueCount),
              backgroundColor: res?.data.map((item) => getRandomColor()),
              borderWidth: 1,
              maxBarThickness: 50,
            },
          ];
          const list = {
            labels: labels,
            datasets: datasets,
          };
          setListData(list);
        }
      });
    }
  }, [projectId]);

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
      <div style={{ height: "350px" }}>
        {listData && <Bar options={options} data={listData} />}
      </div>
    </Card>
  );
}
