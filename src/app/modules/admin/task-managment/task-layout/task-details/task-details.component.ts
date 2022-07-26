import {  OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit,  Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { TaskServiceService } from '../../_services/task-service.service';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
        private _normalView: NormalViewComponent,
        private _kanbanView: KanbanViewComponent,
        private _activatedroute :ActivatedRoute,
        private _taskService: TaskServiceService
  ) {
   }

  taskSelected$ = this._taskService.taskSelected$


  ngOnInit(): void {

    //dont touch
    this._activatedroute.data.subscribe(res=>{
      if(res.component === "normal"){
        this._normalView.matDrawer.open();
      }else{
        this._kanbanView.matDrawer.open();
      }
    })
  }

  ngAfterViewInit(): void
  {
    // this._normal.matDrawer.open();
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