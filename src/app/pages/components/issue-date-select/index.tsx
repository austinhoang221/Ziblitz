import {
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  InputNumber,
  Menu,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import React from "react";
import { useState } from "react";
interface IIssueDateSelect {
  label: string;
  onSaveOption: (options: any) => void;
}
export default function IssueDateSelect(props: IIssueDateSelect) {
  const { onSaveOption, label } = props;
  const [value, setValue] = useState<string>("moreThan");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("Minutes");
  const [date, setDate] = useState<any[]>([]);
  const { RangePicker } = DatePicker;

  const units = [
    {
      label: "Minutes",
      value: "Minutes",
    },
    {
      label: "Hours",
      value: "Hours",
    },
    {
      label: "Days",
      value: "Days",
    },
    {
      label: "Weeks",
      value: "Weeks",
    },
  ];

  const onSave = () => {
    if (value === "moreThan") {
      props.onSaveOption({
        quantity: quantity,
        unit: unit,
      });
    } else {
      props.onSaveOption({
        startDate: date?.[0] ? dayjs(date?.[0]).toISOString() : null,
        endDate: date?.[1] ? dayjs(date?.[1]).toISOString() : null,
      });
    }
  };
  return (
    <Dropdown
      className="mr-1"
      overlayStyle={{ width: "300px" }}
      overlay={
        <Menu>
          <Menu.Item>
            <div onClick={(e) => e.stopPropagation()}>
              <Radio.Group
                onChange={(e: RadioChangeEvent) => setValue(e.target.value)}
                value={value}
              >
                <Space direction="vertical">
                  <Radio value="moreThan" className="mb-2">
                    More than
                  </Radio>
                  {value === "moreThan" && (
                    <Row gutter={16}>
                      <Col span={12}>
                        <InputNumber
                          className="mr-2 w-100"
                          min={1}
                          value={quantity}
                          onChange={(e) => setQuantity(e!)}
                        ></InputNumber>
                      </Col>
                      <Col span={12}>
                        <Select
                          defaultValue="Minutes"
                          className="mb-2 w-100"
                          onChange={(e) => setUnit(e)}
                          options={units}
                        ></Select>
                      </Col>
                    </Row>
                  )}
                  <Radio value="between">Between</Radio>
                  {value === "between" && (
                    <RangePicker
                      format="DD/MM/YYYY"
                      picker="week"
                      className="w-100"
                      onChange={(e) => setDate(e!)}
                      allowClear={false}
                    />
                  )}
                </Space>
              </Radio.Group>
            </div>
          </Menu.Item>
          <Divider className="mb-0 mt-0"></Divider>
          <Menu.Item>
            <Button type="primary" onClick={onSave}>
              <span>Update</span>
            </Button>
          </Menu.Item>
        </Menu>
      }
      trigger={["click"]}
    >
      <Button type="default" className="ml-2">
        <span>{label}</span> <i className="fa-solid fa-chevron-down ml-2"></i>
      </Button>
    </Dropdown>
  );
}
