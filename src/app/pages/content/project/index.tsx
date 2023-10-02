import { Button } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { ColumnTitleProps } from "antd/es/table/interface";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ProjectService } from "../../../../services/projectService";
import useProjectData from "../../../customHooks/fetchProject";
import { checkResponseStatus } from "../../../helpers";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
export default function Project() {
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const requestParam: IPagination = {
    pageNum: 1,
    pageSize: 20,
  };
  const { listOfData } = useProjectData(userId, requestParam);

  const columns: ColumnsType<IProject> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      dataIndex: "star",
      key: "star",
      width: "40px",
      align: "center",
      render: (text: string) => (
        <ButtonIcon iconClass="fa-solid fa-star"></ButtonIcon>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (record: IProject) => {
        return (
          <>
            <img src={record.avatarUrl} alt="" />{" "}
            <Link to="">{record.name}</Link>,
          </>
        );
      },
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Lead",
      dataIndex: "lead",
      key: "lead",
    },
    {
      title: "",
      key: "action",
    },
  ];
  return (
    <>
      <div className="align-child-space-between  align-center">
        <h2>Project</h2>
        <Button type="primary">Create project</Button>
      </div>
      <div className="d-flex align-center">
        <Search
          className="mr-2"
          placeholder="Search..."
          style={{ width: 200 }}
        />
      </div>
      <Table className="mt-3" columns={columns} dataSource={listOfData} />
    </>
  );
}
