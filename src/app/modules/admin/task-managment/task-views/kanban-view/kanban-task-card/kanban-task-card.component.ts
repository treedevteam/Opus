import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import moment from 'moment';
import { tap } from 'rxjs';
import { Task } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';
import { TaskOrSub } from '../add-card/add-card.component';

@Component({
  selector: 'app-kanban-task-card',
  templateUrl: './kanban-task-card.component.html',
  styleUrls: ['./kanban-task-card.component.scss']
})
export class KanbanTaskCardComponent implements OnInit {
  @Input() card: Task;
  formShare: FormGroup;
  expandedSubtasks = null
  showTasks = false;
  subtask$= this._taskServiceService.allSubTasks$;
  apiUrl = environment.apiUrl
  subtasksOpened$ = this._taskServiceService.curretnSubtasksOpened$.pipe(
    tap(res=>{
      this.showTasks = this.card.id === res;
    })
  )
  constructor(
    private _formBuilder: FormBuilder,
    private _taskServiceService: TaskServiceService
  ) { }

  ngOnInit(): void {
    console.log(this.card);
    
    this.formShare = this._formBuilder.group({
      boards: ['', Validators.required],
  });
  }

    showSubtasks(){
        if(!this.showTasks){
        this._taskServiceService.getSubtasks$(this.card.id).subscribe(res=>{
        console.log(res);
        })
    }else{
      this._taskServiceService.closeSubtasks();

    }
  }


  isOverdue(date: string): boolean
  {
      return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
  }

  sahreTaskPopover(){

  }

  onSubmit(id:number){

  }
  toggleTableRows(id:number){

  }
  

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

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
}
