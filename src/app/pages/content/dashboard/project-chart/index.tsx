import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { DashBoardService } from "../../../../../services/dashboardService";
import { checkResponseStatus, getRandomColor } from "../../../../helpers";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectChart() {
  const projects = useSelector((state: RootState) => state.projects);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);
  const [listData, setListData] = useState<any>();

  const options = {
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "All member of project",
      },
    },
    maintainAspectRatio: false,
    aspectRatio: 1,
  };

  useEffect(() => {
    if (projectId) {
      DashBoardService.getProjectChart(projectId).then((res) => {
        if (checkResponseStatus(res)) {
          const labels = res?.data.map((item) => item.name);
          const datasets = [
            {
              data: res?.data.map((item) => item.issueCount),
              backgroundColor: res?.data.map((item) => getRandomColor()),
              borderWidth: 1,
            },
          ];
          const list = {
            labels: labels,
            datasets: datasets,
          };
          console.log(list);
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
        // onChange={handleChange}
        options={projects.map((project) => {
          return {
            label: <span>{project.name}</span>,
            value: project.id,
          };
        })}
        onChange={(e) => setProjectId(e)}
        value={projectId}
      />
      <div style={{ height: "350px", width: "100%" }}>
        {listData && <Doughnut data={listData} options={options} />}
      </div>
    </Card>
  );
}
