import { DropdownProps } from "antd";

export interface IIssueComponentProps {
  type: string;
  periodId: string;
  issueId: string;
  selectedId: string;
  className?: string;
  style?: DropdownProps["overlayStyle"];
  onSaveIssue: () => void;
  onBlur?: () => void;
}
