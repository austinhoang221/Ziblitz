export interface IPermissions {
  viewPermission: boolean;
  editPermission: boolean;
}

export interface IProjectPermissions {
  timeline: Permissions;
  backlog: Permissions;
  board: Permissions;
  project: Permissions;
}

export interface IPermissionGroup {
  id: string;
  name: string;
  permissions: IProjectPermissions;
}
