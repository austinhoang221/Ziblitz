import {
  Button,
  Dropdown,
  Menu,
  MenuProps,
  message,
  Pagination,
  Popconfirm,
} from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import useProjectData from "../../../customHooks/fetchProject";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import UserAvatar from "../../components/user-avatar";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
import { useState } from "react";
import CreateProjectDrawer from "./partials/create";
import { IUser } from "../../../models/IUser";
import { ProjectService } from "../../../../services/projectService";
import { checkResponseStatus } from "../../../helpers";
import { useDispatch } from "react-redux";
import { deleteProject } from "../../../../redux/slices/projectSlice";
export default function Project() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 3,
    sort: ["name:asc"],
  };

  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const { listProject, totalCount, refreshData } = useProjectData(
    userId,
    requestParam
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

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
              userIds={[leader?.id]}
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
      render: (project: IProject) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <div>Project settings</div>
                </Menu.Item>
                <Menu.Item>
                  <Popconfirm
                    title="Delete the project"
                    description="Are you sure to delete this project?"
                    okText="Yes"
                    cancelText="Cancel"
                    onConfirm={() => onClickDeleteProject(project?.id)}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      Move to trash
                    </div>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="text" onClick={(e) => e.preventDefault()}>
              <i className="fa-solid fa-ellipsis"></i>
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const onClickDeleteProject = (id: string) => {
    ProjectService.delete(userId, id!).then((res) => {
      if (checkResponseStatus(res)) {
        navigate("/project");
        refreshData();
        showSuccessMessage();
        dispatch(deleteProject(id));
      }
    });
  };

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
      {totalCount > 0 && (
        <Pagination
          className="mt-2 float-right"
          current={requestParam.pageNum}
          pageSize={requestParam.pageSize}
          total={totalCount}
          onChange={(page, size) => onChangePagination(page, size)}
        />
      )}
      {contextHolder}
      <CreateProjectDrawer
        isDrawerOpen={isDrawerOpen}
        setOpen={(isOpen: boolean) => setIsDrawerOpen(isOpen)}
      />
    </div>
  );
}
