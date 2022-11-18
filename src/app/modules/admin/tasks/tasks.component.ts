import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
