import { DatePicker, Select, Table } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

export default function IssueTable() {
  const [date, setDate] = useState<any[]>([]);
  const [type, setType] = useState<string>("all");
  const { RangePicker } = DatePicker;
  const projects = useSelector((state: RootState) => state.projects);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);
  const types = [
    {
      label: "All",
      key: "all",
    },
    {
      label: "Assignee",
      key: "assignee",
    },
    {
      label: "all",
      key: "all",
    },
  ];

  return (
    <>
      <div className="df-elx">
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
        <RangePicker
          format="DD/MM/YYYY"
          className="w-100"
          onChange={(e) => setDate(e!)}
          allowClear={false}
        />
        <Select
          className="mb-2"
          style={{ width: "150px" }}
          placeholder="Please select type"
          // onChange={handleChange}
          options={types}
          value={type}
        />
      </div>
      <Table></Table>
    </>
  );
}
