import * as signalR from '@microsoft/signalr';
import { getAuthToken } from '../api/apiClient';

export interface DataChangeEvent {
  entityType: string;
  action: string;
  data: any;
  timestamp: string;
  sourceUserId?: string;
}

export interface UserNotificationEvent {
  id: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  createdAt: string;
}

type DataChangeHandler = (event: DataChangeEvent) => void;
type NotificationHandler = (event: UserNotificationEvent) => void;

class SyncHubService {
  private connection: signalR.HubConnection | null = null;
  private dataChangeListeners: Set<DataChangeHandler> = new Set();
  private notificationListeners: Set<NotificationHandler> = new Set();

  public async start(): Promise<void> {
    const token = getAuthToken();
    if (!token) return;

    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const baseHost = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')
      : 'http://localhost:5000';
    const hubUrl = `${baseHost}/hubs/sync`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getAuthToken() || '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.on('OnDataChanged', (payload: { entity: string; action: string; entityId: string; timestamp: string }) => {
      const event: DataChangeEvent = { ...payload, entityType: payload.entity, data: { id: payload.entityId } };
      this.dataChangeListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error('[SyncHub] Error in OnDataChanged listener', e);
        }
      });
    });

    this.connection.on('OnNotificationReceived', (payload: UserNotificationEvent & { content?: string }) => {
      const event = { ...payload, message: payload.content || payload.message };
      this.notificationListeners.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error('[SyncHub] Error in OnNotificationReceived listener', e);
        }
      });
    });

    try {
      await this.connection.start();
    } catch (err) {
      console.warn('[SyncHub] Could not establish connection:', err);
    }
  }

  public async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  public onDataChanged(handler: DataChangeHandler): () => void {
    this.dataChangeListeners.add(handler);
    return () => this.dataChangeListeners.delete(handler);
  }

  public onNotificationReceived(handler: NotificationHandler): () => void {
    this.notificationListeners.add(handler);
    return () => this.notificationListeners.delete(handler);
  }
}

export const syncHubClient = new SyncHubService();

