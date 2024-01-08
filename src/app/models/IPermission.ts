export interface IPermissions {
  viewPermission: boolean;
  editPermission: boolean;
}

export interface IProjectPermissions {
  timeline: IPermissions;
  backlog: IPermissions;
  board: IPermissions;
  project: IPermissions;
}

export interface IPermissionGroup {
  id: string;
  name: string;
  permissions: IProjectPermissions;
  isMain: boolean;
}
