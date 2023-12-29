import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Upload,
  UploadFile,
} from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import React, { useCallback, useState } from "react";
import { UserService } from "../../../../../services/userService";
import { checkResponseStatus, sasToken } from "../../../../helpers";
import "./index.scss";
export default function UserInfo(props: any) {
  const { user } = props;
  const [infoForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] =
    useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isUploadFile, setIsUploadFile] = useState<boolean>(false);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile>({
    uid: user?.id,
    name: "image.png",
    url: user?.avatarUrl + sasToken,
  });

  const uploadProps: UploadProps = {
    multiple: false,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: false,
      showDownloadIcon: false,
    },
    beforeUpload(file: UploadFile) {
      return false;
    },
  };

  const uploadNewProps: UploadProps = {
    multiple: true,
    beforeUpload(file: UploadFile) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      if (!isPNG && !isJPG && !isJPEG) {
        message.error(`${file.name} is not a png or jpg file`);
      } else {
        setUploadFileList((prevUploadFileList) => [
          ...prevUploadFileList,
          file,
        ]);
      }
      return !isPNG || !isJPG || !isJPEG;
    },
  };

  React.useEffect(() => {
    if (uploadFileList.length > 0) {
      handleUpload();
    }
  }, [uploadFileList]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = useCallback(() => {
    const formData = new FormData();
    uploadFileList.forEach((file) => {
      formData.append("formFile", file as RcFile, file.name); // Note: The third argument is the filename
    });

    setIsUploadFile(true);
    fetch(
      `https://task-manager-service.azurewebsites.net/api/users/${user?.id}/photos`,
      {
        method: "POST",
        headers: {
          Accept: "text/plain",
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setFileList({
          uid: user?.id,
          name: "image.png",
          url: result?.data?.avatarUrl + sasToken,
        });
        setUploadFileList([]);
      })
      .catch(() => {})
      .finally(() => {
        setIsUploadFile(false);
      });
  }, [uploadFileList]);

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };

  const onSubmit = () => {
    const payload = {
      id: user?.id!,
      name: infoForm.getFieldValue("name"),
      department: infoForm.getFieldValue("department"),
      organization: infoForm.getFieldValue("organization"),
      jobTitle: infoForm.getFieldValue("jobTitle"),
      location: infoForm.getFieldValue("location"),
      email: infoForm.getFieldValue("email"),
    };
    setIsLoadingButtonSave(true);
    UserService.update(user?.id, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setIsFormDirty(false);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...res?.data!, token: user?.token })
        );
        props.onSaveSuccess();
      }
      setIsLoadingButtonSave(false);
    });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <Form form={infoForm} onFinish={onSubmit} onValuesChange={handleFormChange}>
      <div className="text-center">
        <Upload
          {...uploadProps}
          listType="picture-circle"
          fileList={[fileList]}
          onPreview={handlePreview}
          onRemove={() => false}
        ></Upload>

        <Upload
          {...uploadNewProps}
          customRequest={() => {}}
          showUploadList={undefined}
        >
          <Button
            type="text"
            className=" mr-2"
            style={{ backgroundColor: "#f1f2f4" }}
          >
            <i className="fa-solid fa-paperclip mr-2"></i>
            Change image
          </Button>
        </Upload>

        <Modal
          open={previewOpen}
          title={user?.name}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="Name"
        name="name"
        initialValue={user?.name}
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="Email"
        name="email"
        initialValue={user?.email}
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="Job title"
        name="jobTitle"
        initialValue={user?.jobTitle}
      >
        <Input placeholder="Job title" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="Organization"
        name="organization"
        initialValue={user?.organization}
      >
        <Input placeholder="Organization" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="Location"
        name="location"
        initialValue={user?.location}
      >
        <Input placeholder="Location" />
      </Form.Item>
      <div className="mt-4">
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormDirty}
          loading={isLoadingButtonSave}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
