import {  Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit,  ChangeDetectorRef,  Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';
import { combineLatest, Subject, Observable, map, filter } from 'rxjs';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { Task, Users } from '../../_models/task';
import { TaskServiceService } from '../../_services/task-service.service';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  apiUrl = environment.apiUrl
  taskSeleced:Task|any;
  taskOrSubtask = "";
  taskForm: FormGroup;


  constructor(
        private _activatedRoute: ActivatedRoute,
        private _normalView: NormalViewComponent,
        private _kanbanView: KanbanViewComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedroute :ActivatedRoute,
        private _taskService: TaskServiceService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,

  ) {
   }

  taskSelected$ = this._taskService.taskSelectedDetails$


  ngOnInit(): void {
    this.taskForm = this._formBuilder.group({
      checklist:'',
      file:['']
  });
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
      
  }
  closeDrawer(): Promise<MatDrawerToggleResult>
    {
      return this.taskOrSubtask === "normal" ? this._normalView.matDrawer.close() : this._kanbanView.matDrawer.close()
  }


  addNewCheckList(){
    this._taskService.addNewCheckListItem(
      {text: this.taskForm.get('checklist').value, task_id: this.taskSeleced.id}
      ).subscribe(()=> this.taskForm.get('checklist').setValue('')
      );
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
    this._taskService.deletedCheckListItem(id,this.taskSeleced.id).subscribe();
  }

  isAllSelected(item) {
    this.taskSeleced.checklists.forEach((val) => {
      if (val.id === item.id) {
        if(item.value){
          this._taskService.editCheckList(item.id, {value: 0, text: item.text, task_id: this.taskSeleced.id}).subscribe();
        }else{
            this._taskService.editCheckList(item.id, {value: 1, text: item.text, task_id: this.taskSeleced.id}).subscribe();
        }
      };
    });
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