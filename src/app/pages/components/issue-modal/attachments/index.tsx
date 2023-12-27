import { red } from "@ant-design/colors";
import { Button, Popconfirm, Tooltip, UploadFile } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { FileService } from "../../../../../services/fileService";
import {
  byteToMb,
  checkResponseStatus,
  getFileIcon,
  sasToken,
} from "../../../../helpers";
import { IFile } from "../../../../models/IFile";

import React from "react";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import { useParams } from "react-router-dom";
import { IIssue } from "../../../../models/IIssue";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";

interface IAttachments {
  issue: IIssue;
  onSaveSuccess: () => void;
}

export default function Attachments(props: IAttachments) {
  const params = useParams();
  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<IFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const uploadProps: UploadProps = {
    multiple: true,
    beforeUpload(file: UploadFile) {
      setUploadFileList((prevUploadFileList) => [...prevUploadFileList, file]);
      return false;
    },
  };

  React.useEffect(() => {
    if (uploadFileList.length > 0) {
      handleUpload();
    }
  }, [uploadFileList]);

  const handleUpload = useCallback(() => {
    const formData = new FormData();
    uploadFileList.forEach((file) => {
      formData.append("files", file as RcFile, file.name); // Note: The third argument is the filename
    });

    setIsUploadFile(true);
    const user = localStorage.getItem("user");
    fetch(
      `https://task-manager-service.azurewebsites.net/api/issues/${props.issue?.id}/attachments`,
      {
        method: "POST",
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${JSON.parse(user!).token}`,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setFileList((prevFileList) => [...prevFileList, ...result?.data]);
        setUploadFileList([]);
      })
      .catch(() => {})
      .finally(() => {
        setIsUploadFile(false);
      });
  }, [uploadFileList]);

  React.useEffect(() => {
    FileService.getByIssueId(params?.issueId!).then((res) => {
      if (checkResponseStatus(res)) {
        setFileList(res?.data!);
        setIsLoading(false);
      }
    });
  }, []);

  const onClickDeleteFile = async (id: string) => {
    await FileService.delete(props.issue?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        const newFileList = fileList.filter((file) => file.id !== res?.data);
        setFileList(newFileList);
        props.onSaveSuccess();
      }
    });
  };

  const onClickDownload = (data: IFile) => {
    var file = document.createElement("a");
    file.download = data.name;
    file.href = data.link + sasToken;
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  };

  const columns: ColumnsType<IFile> = [
    {
      title: "Name",
      key: "title",
      width: "auto",
      ellipsis: true,
      render: (file: IFile) => (
        <div className="d-flex align-center">
          <span className="font-sz16 mr-2">{getFileIcon(file.type)}</span>
          <Tooltip title={file.name}>
            <span className="text-truncate">{file.name}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Date added",
      dataIndex: "modificationTime",
      key: "modificationTime",
      width: "20%",
      render: (text: string) => {
        return <span>{dayjs(text).format("MMM D, YYYY")}</span>;
      },
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "15%",
      render: (size: number) => {
        return <span>{byteToMb(size)} MB</span>;
      },
    },
    {
      title: "",
      key: "action",
      width: "15%",
      render: (file: IFile) => {
        return (
          <div className="d-flex">
            <Button
              type="text"
              shape="circle"
              className="mr-1"
              onClick={() => onClickDownload(file)}
            >
              <i className="fa-solid fa-download"></i>
            </Button>
            <Popconfirm
              title="Delete the file"
              description="Are you sure to delete this file?"
              okText="Yes"
              cancelText="Cancel"
              onConfirm={() => onClickDeleteFile(file?.id)}
              disabled={!editPermission}
            >
              <Button type="text" shape="circle" disabled={!editPermission}>
                <i
                  style={{ color: red.primary }}
                  className="fa-solid fa-trash-can"
                ></i>
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="mt-2 mb-4">
        <Upload {...uploadProps}>
          <Button
            type="text"
            className=" mr-2"
            style={{ backgroundColor: "#f1f2f4" }}
          >
            <i className="fa-solid fa-paperclip mr-2"></i>
            Attach
          </Button>
        </Upload>
      </div>
      {fileList?.length > 0 && (
        <>
          <span className="font-weight-bold ml-2 mt-4 mb-2">Attachments</span>
          <Table
            columns={columns}
            dataSource={fileList}
            rowKey={(record) => record.id}
            pagination={false}
            loading={isUploadFile}
          />
        </>
      )}
    </>
  );
}
