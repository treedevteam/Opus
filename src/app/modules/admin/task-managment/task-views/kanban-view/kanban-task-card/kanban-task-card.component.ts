import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import moment from 'moment';
import { tap } from 'rxjs';
import { Task, TaskModified } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';
import { TaskOrSub } from '../add-card/add-card.component';
import { Board } from '../scrumboard.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-kanban-task-card',
  templateUrl: './kanban-task-card.component.html',
  styleUrls: ['./kanban-task-card.component.scss']
})
export class KanbanTaskCardComponent implements OnInit {
  @Input() card: Task;
  @Input() task: TaskModified;
  apiUrl = environment.apiUrl;
  myGroup: FormGroup;
  board:Board;
  formShare: FormGroup;
  showTasks = false;
  subtask$= this._taskServiceService.allSubTasks$.pipe(
    tap(res => { 
      this.card.subtasks_count = res.length; 
    })
  )
  departmentsWithBoard$= this._taskServiceService.departmentsWithBoard$
  expandedSubtasks = null
  subtasksOpened$ = this._taskServiceService.curretnSubtasksOpened$.pipe(
    tap(res => {
      this.showTasks = this.card.id === res;
    })
  )
  constructor(
    private _formBuilder: FormBuilder,
    private _taskServiceService: TaskServiceService,
    private dialog: MatDialog,
    private _dialog: MatDialog
  ) { }
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

  showSubtasks() {
    if (!this.showTasks) {
      this._taskServiceService.getSubtasks$(this.card.id).subscribe(res => {
        console.log(res);
      })
    } else {
      this._taskServiceService.closeSubtasks();

    }
  }


  isOverdue(date: string): boolean {
    return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }
  updateField() {

    if( this._taskServiceService.boardInfo.is_his !== 1){
      this._taskServiceService.openAssignPopup()

    }else{
      this.myGroup.controls['deadline'].value
      this._taskServiceService.updateTaskDeadline(this.convertDate(this.myGroup.controls['deadline'].value), this.card.id).subscribe(res=>{
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
      this._taskServiceService.updateTaskTitle(this.myGroup.controls['title'].value, this.card.id).subscribe();
    }
  }

  sahreTaskPopover() {

  }

  onSubmit(id: number) {

  }
  toggleTableRows(id: number) {

  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  addCard(list: any, event: TaskOrSub) {

    if (this._taskServiceService.boardInfo.is_his !== 1) {
    } else {
      const newTask = {
        task_id: list.id,
        title: event.title,
        status: list.status.id
      };
      this._taskServiceService.storeSubtask(newTask).subscribe()
    }
  }

}