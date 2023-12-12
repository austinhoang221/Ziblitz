import { DropdownProps } from "antd";
import { IIssue } from "./IIssue";

export interface IIssueComponentProps {
  type: string;
  periodId: string;
  issueId: string;
  selectedId: string | string[];
  className?: string;
  style?: DropdownProps["overlayStyle"];
  onSaveIssue: (issue?: IIssue) => void;
  onBlur?: () => void;
}
