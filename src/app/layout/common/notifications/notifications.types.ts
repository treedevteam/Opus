/* eslint-disable @typescript-eslint/naming-convention */
export interface Notification
{
    id: string;
    icon?: string;
    image?: string;
    title?: string;
    description?: string;
    time: string;
    link?: string;
    useRouter?: boolean;
    read: boolean;
}
export interface NotificationsType
{
    id: string;
    name?: string;
    image?: string;
}

export interface Notifications
{
    id: number;
    text: string;
    type_id?: number;
    user_id?: number;
    task_id?: number;
    status?: number;
    created_at: string;
}
