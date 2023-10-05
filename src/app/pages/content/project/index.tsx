import { Button, Dropdown, MenuProps, Pagination } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import useProjectData from "../../../customHooks/fetchProject";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import UserAvatar from "../../components/user-avatar";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
import { useState } from "react";
import CreateProjectDrawer from "./partials/create";
import { IUser } from "../../../models/IUser";
export default function Project() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 3,
    sort: ["name:asc"],
  };

  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const { listProject, totalCount } = useProjectData(userId, requestParam);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Project settings",
    },
    {
      key: "2",
      label: "Move to trash",
    },
  ];

  const columns: ColumnsType<IProject> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      dataIndex: "isFavourite",
      key: "isFavourite",
      width: "40px",
      align: "center",
      render: (isFavourite: boolean) => (
        <ButtonIcon
          iconClass={isFavourite ? "fa-solid fa-star" : "fa-regular fa-star"}
        ></ButtonIcon>
      ),
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      width: "10%",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Link to={text}>{text}</Link>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <span>{text}</span>
          </>
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "leader",
      key: "leader",
      width: "30%",
      render: (leader: IUser) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[leader.id]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
    {
      title: "",
      width: "40px",
      render: () => {
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" onClick={(e) => e.preventDefault()}>
              <i className="fa-solid fa-ellipsis"></i>
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const onChangePagination = (page: number, size: number) => {
    setRequestParam({
      pageNum: page,
      pageSize: size,
      sort: requestParam.sort,
    });
  };

  return (
    <div className="c-content">
      <div className="align-child-space-between align-center">
        <h2>Project</h2>
        <Button type="primary" onClick={() => setIsDrawerOpen(true)}>
          Create project
        </Button>
      </div>
      <div className="d-flex align-center">
        <Search
          className="mr-2"
          placeholder="Search..."
          style={{ width: 200 }}
        />
      </div>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listProject}
        rowKey={(record) => record.id}
        pagination={false}
      />
      <Pagination
        className="mt-2 float-right"
        current={requestParam.pageNum}
        pageSize={requestParam.pageSize}
        total={totalCount}
        onChange={(page, size) => onChangePagination(page, size)}
      />

      <CreateProjectDrawer
        isDrawerOpen={isDrawerOpen}
        setOpen={(isOpen: boolean) => setIsDrawerOpen(isOpen)}
      />
    </div>
  );
}
