import { Button, Dropdown, MenuProps } from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import useProjectData from "../../../customHooks/fetchProject";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import UserAvatar from "../../components/user-avatar";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
export default function Project() {
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const requestParam: IPagination = {
    pageNum: 1,
    pageSize: 20,
  };
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
  const { listOfData } = useProjectData(userId, requestParam);

  const columns: ColumnsType<IProject> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      dataIndex: "star",
      key: "star",
      width: "40px",
      align: "center",
      render: () => <ButtonIcon iconClass="fa-regular fa-star"></ButtonIcon>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Link to="">{text}</Link>
          </>
        );
      },
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
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
      dataIndex: "leaderId",
      key: "leaderId",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[text]}
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
  return (
    <>
      <div className="align-child-space-between align-center">
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
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listOfData}
        rowKey={(record) => record.id}
      />
    </>
  );
}
