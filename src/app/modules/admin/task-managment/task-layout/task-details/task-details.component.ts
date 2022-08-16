import {  OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit,  ChangeDetectorRef,  Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { Task } from '../../_models/task';
import { TaskServiceService } from '../../_services/task-service.service';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  apiUrl = environment.apiUrl
  taskSeleced:Task|any;
  taskOrSubtask = "";

  constructor(
        private _activatedRoute: ActivatedRoute,
        private _normalView: NormalViewComponent,
        private _kanbanView: KanbanViewComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedroute :ActivatedRoute,
        private _taskService: TaskServiceService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
  ) {
   }

  taskSelected$ = this._taskService.taskSelectedDetails$


  ngOnInit(): void {

    //dont touch
    this._activatedroute.data.subscribe(res=>{
      this.taskOrSubtask = res.component

      if(res.component === "normal"){
        this._normalView.matDrawer.open();
      }else{
        this._kanbanView.matDrawer.open();
      }
    })

    this._taskService.taskSelectedDetails$.subscribe(res=>{
      this.taskSeleced = res;
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
  closeDrawer(): Promise<MatDrawerToggleResult>
    {
      return this.taskOrSubtask === "normal" ? this._normalView.matDrawer.close() : this._kanbanView.matDrawer.close()
  }

  deleteTask(): void
  {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
          title  : 'Delete task',
          message: 'Are you sure you want to delete this task? This action cannot be undone!',
          actions: {
              confirm: {
                  label: 'Delete'
              }
          }
      });
      // console.log(this.task2);

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

          // If the confirm button pressed...
          if ( result === 'confirmed' )
          {

              // Delete the task
              this._taskService.deleteTask(this.taskSeleced.id, +this.taskSeleced.departments)
                  .subscribe((res) => {
                      this.closeDrawer().then(() => true);
                      this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                  },(err)=>{
                      console.log(err);

                  });

              // Mark for check
              this._changeDetectorRef.markForCheck();
          }
      });
  }

  closeTaskDetails(){
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    this.closeDrawer();
  }
  deleteCheckList(id:number){

  }
  isAllSelected(item) {
   
  //  this.checkList.forEach((val) => {
  //    if (val.id === item.id) {
  //          if(item.value){
  //              this._tasksService.editCheckList({value: 0, text: item.text, task_id: this.taskForm.get('id').value}, item.id).subscribe((res)=>{
  //                  console.log(res);
  //              });
  //          }else{
  //              this._tasksService.editCheckList({value: 1, text: item.text, task_id: this.taskForm.get('id').value}, item.id).subscribe((res)=>{
  //                  console.log(res);
  //              });
  //          }
  //      };

  //  });
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