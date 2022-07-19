/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { environment } from 'environments/environment';
import moment from 'moment';
import { Observable, takeUntil } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { Task2, TaskLogs } from '../../tasks.types';

@Component({
  selector: 'app-tasks-logs',
  templateUrl: './tasks-logs.component.html',
  styleUrls: ['./tasks-logs.component.scss']
})
export class TasksLogsComponent implements OnInit {
  taskId: number;
  taskLogsData$ = this._tasksService.tagsLogs$;
  apiUrl = environment.apiUrl;
  constructor(private _tasksService: TasksService) { }


  ngOnInit(): void {

    this._tasksService.taskById$
    .subscribe((task: Task2) => {
      console.warn('loGIIII',task);
        this.taskId = task.id;
        this._tasksService.getTasksLogs(this.taskId).subscribe();
    });
    
  }

  getRelativeFormat(date: string): string
    {
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');
        // Is today?
        if ( moment(date, moment.ISO_8601).isSame(today, 'day') )
        {
            return 'Today';
        }
        // Is yesterday?
        if ( moment(date, moment.ISO_8601).isSame(yesterday, 'day') )
        {
            return 'Yesterday';
        }
        return moment(date, moment.ISO_8601).fromNow();
    }
}
