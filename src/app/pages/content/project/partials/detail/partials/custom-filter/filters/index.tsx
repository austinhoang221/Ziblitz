import { red } from "@ant-design/colors";
import { Button, message, Popconfirm, Table } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FilterService } from "../../../../../../../../../services/filterService";
import { checkResponseStatus } from "../../../../../../../../helpers";
import { IFilter } from "../../../../../../../../models/IFilter";
import ButtonIcon from "../../../../../../../components/button-icon";

export default function CustomFilter() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listFilter, setListFilter] = useState<IFilter[]>([]);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const columns: ColumnsType<IFilter> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      key: "isFavourite",
      width: "100px",
      align: "center",
      render: () => <ButtonIcon iconClass={"fa-solid fa-star"}></ButtonIcon>,
    },
    {
      title: "Name",
      key: "name",
      width: "auto",
      render: (filter: IFilter) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Link to={"/issues/" + filter.id}>{filter.name}</Link>
          </>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      title: "",
      key: "action",
      width: "50px",
      render: (filter: any) => {
        return (
          <Popconfirm
            title="Delete the filter"
            description="Are you sure to delete this filter?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteFilter(filter.id)}
            disabled={filter.type === "DEFAULT FILTERS"}
          >
            <Button
              type="text"
              shape="circle"
              disabled={filter.type === "DEFAULT FILTERS"}
            >
              <i
                style={{ color: red.primary }}
                className="fa-solid fa-trash-can"
              ></i>
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      FilterService.getALl(userId).then((res) => {
        if (checkResponseStatus(res)) {
          setListFilter(res?.data!);
        }
        setIsLoading(false);
      });
    };
    fetchData();
  }, []);

  const onDeleteFilter = (id: string) => {
    FilterService.delete(id).then((res) => {
      if (checkResponseStatus(res)) {
        showSuccessMessage();
      }
    });
  };

  return (
    <>
      <div className="c-content">
        <div className="align-child-space-between align-center">
          <h2>Filter</h2>
          <Button type="primary" onClick={() => navigate("/issues/new")}>
            Create filter
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
          dataSource={listFilter}
          rowKey={(record) => record.id}
          pagination={false}
          loading={isLoading}
          scroll={{ y: 400 }}
        />
      </div>
      {contextHolder}
    </>
  );
}
