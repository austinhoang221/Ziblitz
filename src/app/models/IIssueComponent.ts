export interface IIssueComponentProps {
  type: string;
  periodId: string;
  issueId: string;
  selectedId: string;
  className?: string;
  onSaveIssue: () => void;
  onBlur?: () => void;
}
