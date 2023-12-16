export interface IFilter {
  name: string;
  stared: boolean;
  project: {
    projectIds: [string];
    sprintIds: [string];
    backlogIds: [string];
  };
  type: {
    issueTypeIds: [string];
  };
  status: {
    statusIds: [string];
  };
  assginee: {
    currentUserId: string;
    unassigned: boolean;
    userIds: [string];
  };
  created: {
    moreThan: {
      quantity: number;
      unit: string;
    };
    between: {
      startDate: string;
      endDate: string;
    };
  };
  dueDate: {
    moreThan: {
      quantity: number;
      unit: string;
    };
    between: {
      startDate: string;
      endDate: string;
    };
  };
  fixVersions: {
    noVersion: boolean;
    versionIds: [string];
  };
  labels: {
    labelIds: [string];
  };
  priority: {
    priorityIds: [string];
  };
  reporter: {
    currentUserId: string;
    unassigned: boolean;
    userIds: [string];
  };
  resolution: {
    unresolved: boolean;
    done: boolean;
  };
  resolved: {
    moreThan: {
      quantity: number;
      unit: string;
    };
    between: {
      startDate: string;
      endDate: string;
    };
  };
  sprints: {
    noSprint: boolean;
    sprintIds: [string];
  };
  statusCategory: {
    statusCategoryIds: [string];
  };
  updated: {
    moreThan: {
      quantity: number;
      unit: string;
    };
    between: {
      startDate: string;
      endDate: string;
    };
  };
}
