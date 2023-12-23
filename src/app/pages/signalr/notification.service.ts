import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import Endpoint from "../../api/endpoint";
import { BehaviorSubject, take } from "rxjs";
import { IUserNotification } from "../../models/IUserNotification";

export default class NotificationService {
  private static instance: NotificationService;

  private hubConnection: HubConnection;
  private notificationNum: number = 0;
  // contain notification of current user
  public notificationsSource = new BehaviorSubject<IUserNotification[]>([]);
  public notifications = this.notificationsSource.asObservable();
  // contain number of unread notifications
  public unreadNotificationNum = new BehaviorSubject<number>(0);
  public unreadNotifyNum = this.unreadNotificationNum.asObservable();

  constructor(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${Endpoint.hubUrl}notifications`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('NotificationList', (notifications) => {
      this.notificationsSource.next(notifications);
    });

    this.hubConnection.on('UnreadNotificationNum', (count) => {
      this.unreadNotifyNum.pipe(take(1)).subscribe(() => {
        this.unreadNotificationNum.next(count)
        this.notificationNum = count
      }
      );
    });

    this.hubConnection.on(
      'NewNotification',
      (newNotification: IUserNotification) => {
        this.notifications.pipe(take(1)).subscribe((notifications) => {
          this.notificationsSource.next([...notifications, newNotification]);
          this.notificationNum = this.notificationNum + 1;
          this.unreadNotificationNum.next(this.notificationNum);
          console.log(newNotification)
        });
      }
    );

    this.hubConnection.on('ReadNotification', (readNotify: IUserNotification) => {
      this.notifications.pipe(take(1)).subscribe((notifications) => {
        const index = notifications.findIndex((n) => n.id === readNotify.id);
        this.notificationsSource.next([
          ...notifications.slice(0, index),
          readNotify,
          ...notifications.slice(index + 1),
        ]);
      });
    });
  }

  public stopHubConnection() {
    this.hubConnection.stop().catch((error) => console.log(error));
  }

  public static getInstance(token: string): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(token);
    }
    return NotificationService.instance
  } 
}