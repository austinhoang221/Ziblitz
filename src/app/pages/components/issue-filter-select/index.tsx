import { Button, Dropdown, Menu, Spin } from "antd";
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
interface IIssueFilterSelect {
  initialOption: any[];
  label: string;
  isLoading: boolean;
  isShowSearch?: boolean;
  onChangeOption: (options: any[]) => void;
}
export default function IssueFilterSelect(props: IIssueFilterSelect) {
  const {
    initialOption,
    onChangeOption,
    isLoading,
    label,
    isShowSearch = true,
  } = props;
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
                      style={{ width: "250px" }}
                      onChange={(event: any) => onSearch(event.target.value)}
                    />
                    <br></br>
                  </>
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
          <Spin size="large" />
        )
      }
      trigger={["click"]}
    >
      <Button type="default" className="ml-2">
        <span>{label}</span> <i className="fa-solid fa-chevron-down ml-2"></i>
      </Button>
    </Dropdown>
  );
}
