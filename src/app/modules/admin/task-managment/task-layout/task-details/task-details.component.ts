/* eslint-disable  */
import { environment } from 'environments/environment';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { Task, Users } from '../../_models/task';
import { TaskServiceService } from '../../_services/task-service.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { combineLatest, debounceTime, filter, map, Observable, of, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import saveAs from 'file-saver';
import Pusher from 'pusher-js';
import { RealtimeServiceService } from '../../real_time_services/task_realtime.services';
import { TaskOrSub } from 'app/modules/admin/tasks/kanban-view/kanban-board/board/add-card/add-card.component';
import { SubtaskDetailsComponent } from '../subtask-details/subtask-details.component';
import { User } from 'app/core/user/user.types';
import {Priorities} from "../../../priorities/model/priorities";




@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
  @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;

  private _tagsPanelOverlayRef: OverlayRef;
  @Input() card: Task;
  apiUrl = environment.apiUrl
  taskSeleced:Task|any;
  taskOrSubtask = "";
  taskForm: FormGroup;
  myGroup: FormGroup;
    filteredTags: Task[];
  tagsEditMode: boolean = false;
  tags: Task[];
  boardUsers$= this._taskService.boardUsers$;
  filteredUsers$ = this._taskService.filteredUsers$;
  task;
  uploaded: boolean;
  file: any = null;
  url ;
  taskFile$ = this._taskService.taskSelected$
  showTasks = false;
  showBox = true;
  subtask$ = this._taskServiceService.allSubTasksDetails$;
  subtasksOpened$ = this._taskServiceService._currentSubtasksDetailsOpened$.pipe(
    tap(res => {
      this.showTasks = this.task.id === res;
    })
  )

  pusher: any;
  channel: any;
  public text: String;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
        this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
        this.closeDrawer();
    }
  }




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
        private _snackBar: MatSnackBar,
        private realTimeService:RealtimeServiceService,
        private _taskServiceService: TaskServiceService,
        private eRef: ElementRef
        ) {
        }

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  priorities$ = this._taskServiceService.priorities$
  taskSelected$ = this._taskService.taskSelectedDetails$
  rawData: Array<Users> = [];
  selectData: Array<Users> = [];
  ngOnInit(): void {
    console.log('granit baba', this.card)
    this.realTimeService.channel$.subscribe(channel2=>{
      channel2.bind('task-data', data => {
        debugger;
          this._taskService.handleSingTaskRealtimeFunction(data);
        });
    })
  this.filteredUsers$ = this._taskService.boardUsers$.pipe(
       users => {
        return users
       }

    );

    this.taskForm = this._formBuilder.group({
      checklist:'',
      file:[''],
      users_assigned    : [[]],

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
      this.task = res
      console.log(this.task, 'taskkkk')
    })



  }
    updateField() {

        if( this._taskServiceService.boardInfo.is_his !== 1){
            this._taskServiceService.openAssignPopup()

        }else{
            this.myGroup.controls['deadline'].value
            this._taskServiceService.updateTaskDeadline(this.convertDate(this.myGroup.controls['deadline'].value), this.task.id).subscribe(res=>{
                console.log(res);
            });
        }
    }

    convertDate(time: any): string
    {
        const convert = time._i.year + '-' + (time._i.month + 1) + '-' + time._i.date + '  00:00';
        return convert;
    }
    selectPriority(priority: Priorities){
        if( this._taskServiceService.boardInfo.is_his !== 1){
            this._taskServiceService.openAssignPopup()
        }else{
            this._taskServiceService.updateTaskPriority(priority.id, this.task.id).subscribe(res=>{
            })
        }
    }
  ngAfterViewInit(): void
  {
    // this._normal.matDrawer.open();
  }

  ngOnDestroy(): void
  {
    this.closeDrawer();
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
  uploadTaskImage() {
    const formData = new FormData();
    const result = Object.assign({}, this.taskForm.value);
    formData.append('file', this.taskForm.get('file').value);
    this._taskService.addFileToTask(formData, this.task.id).subscribe((res) => {
      console.log(res, '');
    });
  }


  onFileChange(pFileList: File): void {

    if( this._taskService.boardInfo.is_his !== 1){
      this._taskService.openAssignPopup()


    }else{

      this.uploaded = true;
      this.file = pFileList[0];

    if (pFileList[0]) {
        if (
            pFileList[0].type === 'image/jpeg' ||
            pFileList[0].type === 'image/png' ||
            pFileList[0].type === 'image/jpg'
        ) {
            if (pFileList[0].size < 200 * 200) {
                /* Checking height * width*/
            }
            if (pFileList[0].size < 512000) {
                this._snackBar.open('Successfully upload!', 'Close', {
                    duration: 2000,
                });

                const reader = new FileReader();
                reader.readAsDataURL(pFileList[0]);
                reader.onload = (event): any => {
                    this.url = event.target.result;
                };
                this.taskForm.get('file').patchValue(this.file);

                this.uploadTaskImage();
                console.warn(this.url, 'url');
                console.warn(this.file, 'url');
            }else{
                this._snackBar.open('File is too large!', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.taskForm.get('file').patchValue(null);
                this.url = null;
            }
        }else{
            this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                duration: 2000,
            });
            this.uploaded = false;
            this.file = null;
            this.taskForm.get('file').patchValue(null);
            this.url = null;
        }
    }
    }

}

downloadImg(url){
  this._taskService.dowloadFile(url).subscribe((data: Blob | MediaSource)=>{
      const downloadUrl = window.URL.createObjectURL(data);
      saveAs(downloadUrl);
  });
}

deleteFile(id){

  if( this._taskService.boardInfo.is_his !== 1){
    this._taskService.openAssignPopup()

  }else{
    this._taskService.deleteFileFromTask(id).subscribe((res)=>{
      this._snackBar.open('Successfully deleted!', 'Close', {});
      this.ngOnInit();
  });
  }

}




  addNewCheckList(){
    if( this._taskService.boardInfo.is_his !== 1){

      this._taskService.openAssignPopup()


    }else{
      this._taskService.addNewCheckListItem(
        {text: this.taskForm.get('checklist').value, task_id: this.taskSeleced.id}
        ).subscribe(()=> this.taskForm.get('checklist').setValue('')
        );
    }
  }


  deleteTask(): void
  {

    if( this._taskService.boardInfo.is_his !== 1){
      this._taskService.openAssignPopup()
    }else{
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
  }

  closeTaskDetails(){
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    this.closeDrawer();
  }

  deleteCheckList(id:number){
    if( this._taskService.boardInfo.is_his !== 1){
      this._taskService.openAssignPopup()

    }else{
      this._taskService.deletedCheckListItem(id,this.taskSeleced.id).subscribe();
    }
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





// add to cart function per subtask

addCard(list: any, event: TaskOrSub){

  if( this._taskServiceService.boardInfo.is_his !== 1){
  }else{
    const newTask = {
      task_id: list.id,
      title: event.title,
      status:list.status.id
    };
    this._taskServiceService.storeSubtask(newTask).subscribe()
  }
}



showSubtasks$() {
if(!this.showTasks) {
  this._taskServiceService.getSubtasksDetails(this.task.id).subscribe(res => {
    console.log('testt' , res);

  })
}
else {
  this._taskServiceService.closeSubtasks();
}


}


  addUsersToTask(userId: number): void{
    if( this._taskService.boardInfo.is_his !== 1){
      this._taskService.openAssignPopup()
    }else{
      this._taskService.assignUserTask(this.task.id, userId).subscribe((res)=>{
        const usersAssigned = this.taskForm.get('users_assigned').value;
        const index = usersAssigned.findIndex(object => +object === +userId);
        if (index < 0) {
            usersAssigned.push(userId);
        }else{
            usersAssigned.splice(index,1);
        }
        this.taskForm.get('users_assigned').patchValue(usersAssigned);
        console.log(this.taskForm.get('users_assigned').value);
    });
    }

  }

  toggleTaskUser(user: number): void
  {
      this.addUsersToTask(user);
  }

  userCheck(user: any): boolean{
    const index = this.task.users_assigned.map(x=>x.id).findIndex(x=>x === user)
    if(index >= 0){
        return true;
    }else{
        return false;
    }
}

  onClickPanel(event) : void
  {
    console.log(event);
    event.stopPropagation();
  }

  openTagsPanel(event : MouseEvent): void
  {

    if( this._taskService.boardInfo.is_his !== 1){
      this._taskService.openAssignPopup()

    }

    else{

      // Create the overlay
      this._tagsPanelOverlayRef = this._overlay.create({
        backdropClass   : '',
        hasBackdrop     : true,
        scrollStrategy  : this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
                              .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                              .withFlexibleDimensions(true)
                              .withViewportMargin(64)
                              .withLockedPosition(true)
                              .withPositions([
                                  {
                                      originX : 'start',
                                      originY : 'bottom',
                                      overlayX: 'start',
                                      overlayY: 'top'
                                  }
                              ])
      });

      // Subscribe to the attachments observable
      this._tagsPanelOverlayRef.attachments().subscribe(() => {

        // Focus to the search input once the overlay has been attached
        this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
      });

      // Create a portal from the template
      const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

      // Attach the portal to the overlay
      this._tagsPanelOverlayRef.attach(templatePortal);

      // Subscribe to the backdrop click
      this._tagsPanelOverlayRef.backdropClick().subscribe(() => {

        // If overlay exists and attached...
        if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
        {
            // Detach it
            this._tagsPanelOverlayRef.detach();

            // Reset the tag filter
            this.filteredTags = this.tags;

            // Toggle the edit mode off
            this.tagsEditMode = false;
        }

        // If template portal exists and attached...
        if ( templatePortal && templatePortal.isAttached )
        {
            // Detach it
            templatePortal.detach();
        }
      });
    }

  }
    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
     filterDepartments(event): void
     {
         // Get the value
         const value = event.target.value.toLowerCase();
         console.log(value);

         // Filter the tags
        //  this.filteredUsers$ = this.usersList.filter(tag => tag.name.toLowerCase().includes(value));

           this.filteredUsers$ = this.boardUsers$.pipe(
            map(users => {
              const filteredUsers = users.filter(tag => tag.name.toLowerCase().includes(value))
              console.log(filteredUsers);
              return filteredUsers;
            }
            ));

     }

     /**
      * Filter tags input key down event
      *
      * @param event
      */
     filterTagsInputKeyDown(event): void
     {

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

function onDatePickerClick(event: any, clickout: (event: any) => void) {
  throw new Error('Function not implemented.');
}
