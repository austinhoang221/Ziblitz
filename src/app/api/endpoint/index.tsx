export default class Endpoint {
  public static get baseUrl(): string {
    return `https://localhost:7271/`;
  }
  public static loginUrl: string = this.baseUrl + "users/signin";
  public static signUpUrl: string = this.baseUrl + "users/signup";
}
