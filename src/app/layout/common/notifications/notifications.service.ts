/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Notification, Notifications } from 'app/layout/common/notifications/notifications.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService
{
    private _notifications: ReplaySubject<Notifications[]> = new ReplaySubject<Notifications[]>(null);
    apiUrl = environment.apiUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notifications[]>
    {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    // getAll(): Observable<Notification[]>
    // {
    //     return this._httpClient.get<Notification[]>('api/common/notifications').pipe(
    //         tap((notifications) => {
    //             this._notifications.next(notifications);
    //         })
    //     );
    // }

    getAllNotifications(): Observable<Notifications[]>
    {
        return this._httpClient.get<Notifications[]>(`${this.apiUrl}api/notifications`).pipe(
            tap((notifications) => {
                this._notifications.next(notifications);
            })
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notifications): Observable<Notifications>
    {
        return this.notifications$.pipe(
            take(1),
            map((notifications)=> {
                // Update the notifications with the new notification
                this._notifications.next([notification,...notifications]);

                // Return the new notification from observable
                return notification;
            })
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(notification: Notifications): Observable<Notifications>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.get<Notifications>('api/common/notifications').pipe(
                map((updatedNotification: Notifications) => {

                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === notification.id);

                    // Update the notification
                    notifications[index] = updatedNotification;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                })
            ))
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    // delete(id: any): Observable<boolean>
    // {
    //     return this.notifications$.pipe(
    //         take(1),
    //         switchMap(notifications => this._httpClient.delete<boolean>('api/common/notifications', {params: {id}}).pipe(
    //             map((isDeleted: boolean) => {
    //                 // Find the index of the deleted notification
    //                 const index = notifications.findIndex(item => item.id === id);

    //                 // Delete the notification
    //                 notifications.splice(index, 1);

    //                 // Update the notifications
    //                 this._notifications.next(notifications);

    //                 // Return the deleted status
    //                 return isDeleted;
    //             })
    //         ))
    //     );
    // }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean>
    {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.get<boolean>('api/common/notification/1/read').pipe(
                map((isUpdated: boolean) => {

                    // Go through all notifications and set them as read
                    notifications.forEach((notification, index) => {
                        notifications[index].status = 0;
                    });

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated status
                    return isUpdated;
                })
            ))
        );
    }

    

}
