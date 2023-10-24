export interface IIssueComponentProps {
  type: string;
  periodId: string;
  currentId: string;
  selectedId: string;
  onSaveIssue: () => void;
}
