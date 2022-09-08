import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Priorities } from 'app/modules/admin/priorities/model/priorities';
import { Status } from 'app/modules/admin/statuses/model/status';
import { environment } from 'environments/environment';
import moment from 'moment';
import { map, mergeMap, tap, Observable, take, switchMap, finalize } from 'rxjs';
import { Task, Board, TaskModified } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-subtask-row',
  templateUrl: './subtask-row.component.html',
  styleUrls: ['./subtask-row.component.scss']
})
export class SubtaskRowComponent implements OnInit {
  @Input() task: TaskModified;
  apiUrl = environment.apiUrl;
  myGroup: FormGroup;
  board:Board;
  formShare: FormGroup;
  showTasks = false;
  subtask$ = this._taskServiceService.allSubTasks$;
  
  constructor(private _taskServiceService:TaskServiceService,
    private _formBuilder:FormBuilder) { }

    
  statuses$ = this._taskServiceService.statuses$
  priorities$ = this._taskServiceService.priorities$
  


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
      this._taskServiceService.subtaskUpdateTaskPriority(priority.id, this.task.id).subscribe(res=>{
      })
    }
  }

  selectStatus(status: Status){
      if( this._taskServiceService.boardInfo.is_his !== 1){
        this._taskServiceService.openAssignPopup()

      }else{
        this._taskServiceService.subtaskUpdateTaskStatus(status.id, this.task.id).subscribe((res)=>{
        });
      }
  }

  updateField() {
    if( this._taskServiceService.boardInfo.is_his !== 1){
      this._taskServiceService.openAssignPopup()

    }else{
      this.myGroup.controls['deadline'].value
      this._taskServiceService.subtaskUpdateTaskDeadline(this.convertDate(this.myGroup.controls['deadline'].value), this.task.id).subscribe(res=>{
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
      this._taskServiceService.updateSubtaskTitle(this.myGroup.controls['title'].value, this.task.id).subscribe();
    }
  }

  sahreTaskPopover(){
  
  }







  onSubmit(){

  }

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
