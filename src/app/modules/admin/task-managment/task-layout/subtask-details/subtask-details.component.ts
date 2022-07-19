import {  OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit,  Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NormalViewComponent } from '../../normal-view/normal-view.component';
import { KanbanViewComponent } from '../../kanban-view/kanban-view.component';

@Component({
  selector: 'app-subtask-details',
  templateUrl: './subtask-details.component.html',
  styleUrls: ['./subtask-details.component.scss']
})
export class SubtaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _normalviewComponent: NormalViewComponent,
        private _kanbanViewComponent: KanbanViewComponent,
    ) { }

    ngOnInit(): void {
        // Open the drawer
        this._normalviewComponent.matDrawer.open();
    }

    ngAfterViewInit(): void
    {
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
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
}
