import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Task,Board, TaskModified } from '../../../_models/task';
import { environment } from 'environments/environment';
import { Priorities } from 'app/modules/admin/priorities/model/priorities';
import { Status } from 'app/modules/admin/statuses/model/status';
import { map, mergeMap, tap, Observable, take, switchMap, finalize } from 'rxjs';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-kanban-subtask-card',
  templateUrl: './kanban-subtask-card.component.html',
  styleUrls: ['./kanban-subtask-card.component.scss']
})
export class KanbanSubtaskCardComponent implements OnInit {
  @Input() card: Task;
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
      boards: ['', Validators.required],
  });
  this.myGroup = this._formBuilder.group({
    title: [this.card.title, Validators.required],
    deadline: [this.card.deadline, Validators.required],
});
  }

  isOverdue(date: string): boolean
    {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }
    selectPriority(priority: Priorities){

      if( this._taskServiceService.boardInfo.is_his !== 1){
        this._taskServiceService.openAssignPopup()
  
      }else{
        this._taskServiceService.subtaskUpdateTaskPriority(priority.id, this.card.id).subscribe(res=>{
        })
      }
    }
  
    updateField() {
      if( this._taskServiceService.boardInfo.is_his !== 1){
        this._taskServiceService.openAssignPopup()
  
      }else{
        this.myGroup.controls['deadline'].value
        this._taskServiceService.subtaskUpdateTaskDeadline(this.convertDate(this.myGroup.controls['deadline'].value), this.card.id).subscribe(res=>{
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
        this._taskServiceService.updateSubtaskTitle(this.myGroup.controls['title'].value, this.card.id).subscribe();
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
