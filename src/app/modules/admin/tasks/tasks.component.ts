import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketServiceService } from 'app/modules/web-socket-service.service';

@Component({
    selector       : 'tasks',
    templateUrl    : './tasks.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }

}
