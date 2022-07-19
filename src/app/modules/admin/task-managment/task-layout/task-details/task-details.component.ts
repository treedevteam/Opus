import {  OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit,  Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';


import { KanbanViewComponent } from '../../kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../normal-view/normal-view.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  normal:any;
  kanban:any;
  constructor(
        private _kanbanviewComponent: KanbanViewComponent,
        private _normal: NormalViewComponent,
        private _activatedroute :ActivatedRoute
  ) {
   }

  ngOnInit(): void {
      this._activatedroute.data.subscribe(data => {
        if(data.component === "kanban"){
          this._kanbanviewComponent.matDrawer.open();
    
        }
      })
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