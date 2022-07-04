/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../tasks/tasks.service';
import { AsignUsersToBoardComponent } from '../tasks/asign-users-to-board/asign-users-to-board.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Users } from '../users/model/users';
import { MailboxService } from './mailbox.service';

@Component({
    selector     : 'mailbox',
    templateUrl  : './mailbox.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MailboxComponent implements OnInit, OnDestroy
{
    @ViewChild('drawer') drawer: MatDrawer;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    board_department: number;
    usersList:Users[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _currentBoardUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);


    /**
     * Constructor
     */
    constructor(private _fuseMediaWatcherService: FuseMediaWatcherService, 
        private dialog:MatDialog,
        private _tasksService: TasksService,
        private _mailboxService:MailboxService
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
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if ( matchingAliases.includes('md') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });

            //return user list


    }


  
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
