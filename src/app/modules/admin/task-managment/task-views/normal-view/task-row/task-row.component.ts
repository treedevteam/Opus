/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Priorities } from 'app/modules/admin/priorities/model/priorities';
import { Status } from 'app/modules/admin/statuses/model/status';
import { environment } from 'environments/environment';
import moment from 'moment';
import { map, mergeMap, tap, Observable, take, switchMap, finalize } from 'rxjs';
import { FilePopupComponent } from '../../../file-popup/file-popup.component';
import { Task, Board, TaskModified } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';
import { JoinTaskDialogComponent } from '../../../join-task-dialog/join-task-dialog.component';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.scss']
})
export class TaskRowComponent implements OnInit {
  @Input() task: TaskModified;
  apiUrl = environment.apiUrl;
  myGroup: FormGroup;
  board:Board;
  formShare: FormGroup;
  showTasks = false;
  subtask$= this._taskServiceService.allSubTasks$;
  departmentsWithBoard$= this._taskServiceService.departmentsWithBoard$

  constructor(private _taskServiceService:TaskServiceService,
    private _formBuilder:FormBuilder,
    private dialog: MatDialog,
    private _dialog: MatDialog

    ) { }
  statuses$ = this._taskServiceService.statuses$
  priorities$ = this._taskServiceService.priorities$
  subtasksOpened$ = this._taskServiceService.curretnSubtasksOpened$.pipe(
    tap(res=>{
      console.log(res);
      this.showTasks = this.task.id === res;
    })
  )
  
  ngOnInit(): void {


    this.formShare = this._formBuilder.group({
        boards: [''],
    });
    
    this.myGroup = this._formBuilder.group({
        title: [this.task.title, Validators.required],
        deadline: [this.task.deadline, Validators.required],
    });
  }

  isOverdue(data): boolean {
    return moment(data, moment.ISO_8601).isBefore(moment(), 'days');
  }

  selectPriority(priority: Priorities){
       if( this._taskServiceService.boardInfo.is_his !== 1){
        this._taskServiceService.openAssignPopup()
    }else{
      this._taskServiceService.updateTaskPriority(priority.id, this.task.id).subscribe(res=>{
      })
    }
  }

  selectStatus(status: Status){
    if( this._taskServiceService.boardInfo.is_his !== 1){
      this._taskServiceService.openAssignPopup()

    }else{
      this._taskServiceService.updateTaskStatus(status.id, this.task.id).subscribe((res)=>{
      });
    }
  }

  shareTask(){
    console.log(this.formShare.value,"this.formShare.valuethis.formShare.valuethis.formShare.value");
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

  updateTitle(){
    if( this._taskServiceService.boardInfo.is_his !== 1){
      this._taskServiceService.openAssignPopup()

    }else{
      this._taskServiceService.updateTaskTitle(this.myGroup.controls['title'].value, this.task.id).subscribe();
    }
  }

  sahreTaskPopover(){
  
  }



  showSubtasks(){
    if(!this.showTasks){
      this._taskServiceService.getSubtasks$(this.task.id).subscribe()
    }else{
      this._taskServiceService.closeSubtasks();

    }
  }




  onSubmit(){

  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

  openImagePopup(file)
  {

  this.dialog.open(FilePopupComponent, {
      width: '50vh',
      height:'50vh',
      data:{
          file:file
      }

  })
  }


}
