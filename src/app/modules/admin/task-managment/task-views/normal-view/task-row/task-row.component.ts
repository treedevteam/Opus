import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import moment from 'moment';
import { Task } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styleUrls: ['./task-row.component.scss']
})
export class TaskRowComponent implements OnInit {
  @Input() task: Task;
  apiUrl = environment.apiUrl;
  myGroup: FormGroup;

  
  constructor(private _taskServiceService:TaskServiceService,
    private _formBuilder:FormBuilder) { }
  statuses$ = this._taskServiceService.statuses$
  priorities$ = this._taskServiceService.priorities$
  
  ngOnInit(): void {
   
      this.myGroup = this._formBuilder.group({
        title: [this.task.title, Validators.required],
        deadline: [this.task.deadline, Validators.required],
    });
  }

  isOverdue(data): boolean {
    return moment(data, moment.ISO_8601).isBefore(moment(), 'days');
  }
  

  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }

}
