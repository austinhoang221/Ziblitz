import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import Endpoint from "../../api/endpoint";

export default class PresenceService {
  private static instance: PresenceService;
  private hubConnection: HubConnection;

  constructor(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${Endpoint.hubUrl}presence`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch((error) => console.log(error));
  }

  public stopHubConnection() {
    this.hubConnection.stop().catch((error) => console.log(error));
  }

  public static getInstance(token: string): PresenceService {
    if(!PresenceService.instance) {
      PresenceService.instance = new PresenceService(token);
    }
    return PresenceService.instance;
  }
}