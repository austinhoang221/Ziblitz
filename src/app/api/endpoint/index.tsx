export default class Endpoint {
  public static get baseUrl(): string {
    return `https://localhost:7271/api/`;
  }
  public static getAllRole: string = this.baseUrl + "roles/";
  public static editUserUrl: string = this.baseUrl + "user";
  public static getAllUser: string = this.baseUrl + "users/";
  public static getAllProject: string = this.baseUrl + "users/";
  public static getProjectByCode: string = this.baseUrl + "users/";
  public static createProject: string = this.baseUrl + "users/";
  public static updateProject: string = this.baseUrl + "users/";
  public static deleteProject: string = this.baseUrl + "users/";
  public static createSprint: string = this.baseUrl + "projects/";
  public static updateSprint: string = this.baseUrl + "projects/";
  public static deleteSprint: string = this.baseUrl + "projects/";
  public static createBacklogIssue: string = this.baseUrl + "backlogs/";
  public static createSprintIssue: string = this.baseUrl + "sprints/";
  public static editSprintIssue: string = this.baseUrl + "sprints/";
  public static editBacklogIssue: string = this.baseUrl + "backlogs/";
  public static loginUrl: string = this.baseUrl + "users/signin";
  public static signUpUrl: string = this.baseUrl + "users/signup";
}
