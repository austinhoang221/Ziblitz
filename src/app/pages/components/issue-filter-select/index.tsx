import { Button, Dropdown, Menu, Spin } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import "./index.scss";
import { useParams } from "react-router-dom";
interface IIssueFilterSelect {
  initialOption: any[];
  initialChecked?: any[];
  label: string;
  isLoading: boolean;
  isShowSearch?: boolean;
  isHaveOtherOption?: boolean;
  otherOptionLabel?: string;
  otherOptionValue?: string | boolean;
  onCheckOtherOptionChange?: (option: any) => void;
  onChangeOption: (options: any[]) => void;
}
export default function IssueFilterSelect(props: IIssueFilterSelect) {
  const {
    initialOption,
    onChangeOption,
    isLoading,
    label,
    initialChecked,
    isShowSearch = true,
    isHaveOtherOption = false,
    otherOptionLabel,
    otherOptionValue,
    onCheckOtherOptionChange,
  } = props;
  const params = useParams();
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<any[]>(initialOption);
  const [searchOptions, setSearchOptions] = useState<any>([]);

  const [checked, setChecked] = useState<CheckboxValueType[]>([]);
  const checkAll = options.length === checked.length;
  const indeterminate = checked.length > 0 && checked.length < options.length;

  useEffect(() => {
    setOptions(initialOption);
    setSearchOptions(initialOption);
  }, [initialOption]);

  useEffect(() => {
    if (initialChecked && initialChecked?.length !== 0) {
      setChecked(initialChecked);
    } else {
      setChecked([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.filter, initialChecked]);

  useEffect(() => {
    if (searchValue) {
      const filtered = options.filter((epic: any) =>
        epic.label.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchOptions(filtered);
    } else {
      setSearchOptions(options);
    }
  }, [options, searchValue]);

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setChecked(
      e.target.checked ? options.map((option: any) => option.value) : []
    );
    onChangeOption(
      e.target.checked ? options.map((option: any) => option.value) : []
    );
  };

  const onCheckedChange = (list: CheckboxValueType[]) => {
    setChecked(list);
    onChangeOption(list);
  };

  return (
    <Dropdown
      className="mr-1"
      overlayStyle={{ width: "200", minHeight: "150px" }}
      overlay={
        !isLoading ? (
          <Menu>
            <Menu.Item>
              <div onClick={(e) => e.stopPropagation()}>
                {isShowSearch && (
                  <>
                    <Search
                      className="mb-2"
                      placeholder="Search filters..."
                      style={{ width: "100%" }}
                      onChange={(event: any) => onSearch(event.target.value)}
                    />
                    <br></br>
                  </>
                )}
                {isHaveOtherOption && (
                  <Checkbox
                    value={otherOptionValue}
                    onChange={onCheckOtherOptionChange}
                    className="w-100"
                  >
                    {otherOptionLabel}
                  </Checkbox>
                )}
                <Checkbox
                  value="all"
                  indeterminate={indeterminate}
                  checked={checkAll}
                  onChange={onCheckAllChange}
                  className="w-100"
                >
                  All
                </Checkbox>
                <Checkbox.Group
                  className="d-flex d-flex-direction-column"
                  options={searchOptions}
                  value={checked}
                  onChange={onCheckedChange}
                />
              </div>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu
            className="text-center"
            style={{ minHeight: "150px", lineHeight: "150px" }}
          >
            <Spin
              className="text-center"
              indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            />
          </Menu>
        )
      }
      trigger={["click"]}
    >
      <Button type="default" className="ml-2">
        {checked?.length === 0 && (
          <>
            <span>{label}</span>{" "}
            <i className="fa-solid fa-chevron-down ml-2"></i>
          </>
        )}
        {checked?.length === 1 && (
          <span style={{ color: "#1677FF" }}>
            {label}:{" "}
            {options.find((option) => option.value === checked?.[0])?.label ??
              ""}
            <i className="fa-solid fa-chevron-down ml-2"></i>
          </span>
        )}

        {checked?.length > 1 && (
          <span style={{ color: "#1677FF" }}>
            {label}:{" "}
            <span className="many-options">+ {checked?.length ?? ""}</span>
            <i className="fa-solid fa-chevron-down ml-2"></i>
          </span>
        )}
      </Button>
    </Dropdown>
  );
}
