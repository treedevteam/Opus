/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-trailing-spaces */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/quotes */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import Pusher from 'pusher-js';
import { WebSocketServiceService } from '../../../modules/web-socket-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notifications } from './notifications.types';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    notifications: Notifications[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userId: any;
    pusher: Pusher;
    channel: any;
    notifications$ = this._notificationsService.notifications$;
    notificationsOneByone:Notifications[];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private pusherService: WebSocketServiceService,
        private _snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // new Notification("Notifications", {
        //     body: "hi"
        // });

        // this.getEachNotifications();
        //          // Enable pusher logging - don't include this in production

        // this.pusherService.channel.bind('my-event', (data: any) => {
        //     console.log(data, "notifications ooo");

        //     if (Notification.permission === "granted") {
        //         new Notification("Notifications", {
        //             body: "hi"
        //         });
        //     }
        //     else if (Notification.permission !== "denied") {
        //         Notification.requestPermission().then(premission => {
        //             if (premission === "granted") {
        //                 new Notification("Notifications", {
        //                     body: "hi"
        //                 });
        //             }
        //         });
        //     }
        //      this._notificationsService.create(data).subscribe((res)=>{
        //          console.log(res,'res from not service'); 


        //      });
            
        // });

    

        // Subscribe to notification changes
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: Notifications[]) => {
                console.log(notifications,'notificationsnotifications');

                // Load the notifications
                this.notifications = notifications;

                // Calculate the unread count
                this._calculateUnreadCount();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

   
        
        // function  showNotification(){
        //     const notification = new Notification("test",{
        //         body: "you have new notification"      
        //     });
        // };


    }

    getEachNotifications(){
        this.notifications$.forEach(el=>{
            this.notificationsOneByone = el
            console.log(this.notificationsOneByone,"One by one");
        });
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void
    {
        // Return if the notifications panel or its origin is not defined
        if ( !this._notificationsPanel || !this._notificationsOrigin )
        {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the notifications panel
     */
    closePanel(): void
    {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    // markAllAsRead(): void
    // {
    //     // Mark all as read
    //     this._notificationsService.markAllAsRead().subscribe((res)=>
    //     console.log(res)
    //     );
    // }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: Notifications): void
    {
        // Update the notification
        this._notificationsService.update(notification).subscribe();
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void
    {
        let count = 0;

        if ( this.notifications && this.notifications.length )
        {
            //per ma von
            count = this.notifications.filter(notification => notification.status === 0).length;
            // count = this.notifications.length;
        }

        this.unreadCount = count;
    }

    markAsread(id:any){
        this._notificationsService.markAsRead(id).subscribe((res)=>{
            console.warn(res,'res from  service');
        })
    }

    ///Delete
    delete(id: any) {
        this._notificationsService.delete(id).subscribe((res) => {
          this.notifications$ = this._notificationsService.getAllNotifications(); // Update the observable with the new list
          this.cdr.detectChanges(); // Manually trigger change detection
        });
      }
}
