import { Button, Card, DatePicker, Select, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../../../redux/store";
import { DashBoardService } from "../../../../../services/dashboardService";
import { checkResponseStatus } from "../../../../helpers";
import { IIssue } from "../../../../models/IIssue";
import IssuePriority from "../../../components/issue-priority";
import IssueType from "../../../components/issue-type";

export default function IssueTable() {
  const today = new Date();
  const [date, setDate] = useState<any[]>([]);
  const [type, setType] = useState<string>("All");
  const { RangePicker } = DatePicker;
  const projects = useSelector((state: RootState) => state.projects);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [projectId, setProjectId] = useState(projects?.[0]?.id);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const types = [
    {
      label: "All",
      key: "All",
    },
    {
      label: "Assignee",
      key: "Sssignee",
    },
    {
      label: "Reporter",
      key: "Reporter",
    },
  ];

  const columns: ColumnsType<IIssue> = [
    {
      title: "Type",
      width: "10%",
      render: (issue: IIssue) => {
        return (
          <Button
            type="text"
            className="p-0"
            style={{ width: "18px", height: "18px" }}
          >
            <IssueType issueTypeKey={issue.issueType?.icon} />
          </Button>
        );
      },
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (text: string) => {
        return (
          <>
            <Link to={text}>{text}</Link>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "auto",
      render: (text: string) => {
        return (
          <>
            <Tooltip title={text}>
              <span>{text}</span>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Priority",
      dataIndex: "priorityId",
      key: "priorityId",
      width: "100px",
      render: (text: string) => {
        return (
          <>
            <IssuePriority priorityId={text} />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setDate(getStartAndEndOfWeek(today));
  }, []);

  useEffect(() => {
    const payload = {
      userId: userId,
      startDate: date?.[0] ? dayjs(date?.[0]).toISOString() : null,
      endDate: date?.[1] ? dayjs(date?.[1]).toISOString() : null,
      type: type,
    };
    setIsLoading(true);
    DashBoardService.getIssueChart(projectId, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setIssues(res?.data!);
        setIsLoading(false);
      }
    });
  }, [date, type, projectId, userId]);

  const getStartAndEndOfWeek = (date: any) => {
    // Copy date to not modify the original
    const currentDate = new Date(date);

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDayOfWeek = currentDate.getDay();

    // Calculate the difference between the current day and Sunday (beginning of the week)
    const difference = currentDayOfWeek - 0;

    // Set the date to the beginning of the week (Sunday)
    currentDate.setDate(currentDate.getDate() - difference);

    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + 6);

    return [dayjs(currentDate), dayjs(endOfWeek)];
  };

  return (
    <Card>
      <div className="d-flex">
        <Select
          className="mb-2 mr-2"
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
          onChange={(e) => setProjectId(e)}
        />
        <Select
          className="mb-2"
          style={{ width: "150px" }}
          placeholder="Please select type"
          // onChange={handleChange}
          options={types}
          value={type}
          onChange={(e) => setType(e)}
        />
      </div>
      <RangePicker
        format="DD/MM/YYYY"
        onChange={(e) => setDate(e!)}
        allowClear={false}
        className="mb-2"
        value={date as [Dayjs, Dayjs]}
      />
      <Table
        columns={columns}
        dataSource={issues}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
        scroll={{ y: 400 }}
      ></Table>
    </Card>
  );
}
