import { IFilterConfiguration } from "./IFilterConfiguration";

export interface IFilter {
  id: string;
  type: string;
  name: string;
  stared: boolean;
  configuration: IFilterConfiguration | null;
}
