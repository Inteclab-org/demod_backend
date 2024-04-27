export type NotificationAction =
  'new_model_download' |
  'new_model_upload' |
  'new_interior_upload' |
  'new__tag' |
  'new_comment' |
  'new_like' |
  'new_message' |
  'banned';

export interface INotification {
  id: string;
  action_id: NotificationAction;
  model_id: string;
  interior_id: string;
  notifier_id: string;
  recipient_id: string;
  seen: boolean;
  message?: string;
  created_at: Date | string;
}

export interface ICreateNotification {
  action_id: NotificationAction;
  model_id?: string;
  interior_id?: string;
  notifier_id: string;
  recipient_id: string;
  seen?: boolean;
  message?: string;
}

export interface IUpdateNotification {
  action_id?: NotificationAction;
  model_id?: string;
  interior_id?: string;
  notifier_id?: string;
  recipient_id?: string;
  seen?: boolean;
  message?: string;
}

export interface IFilterNotifications {
  action_id?: NotificationAction;
  model_id?: string;
  interior_id?: string;
  notifier_id?: string;
  recipient_id?: string;
  seen?: boolean;
}