export default class Endpoint {
  public static get baseUrl(): string {
    return `${(window as any).context.api as string}/api`;
  }
  private static login: string = "/login";
}
