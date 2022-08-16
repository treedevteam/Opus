import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-task-logs',
  templateUrl: './task-logs.component.html',
  styleUrls: ['./task-logs.component.scss']
})
export class TaskLogsComponent implements OnInit, OnChanges {
  @Input() taskId: any;
  constructor(private _taskService: TaskServiceService) { }
  
  taskSelectedLogs$ = this._taskService.taskSelectedLogs$;
  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this._taskService.getSelectedTaskLogs$(this.taskId).subscribe();
  }

}
