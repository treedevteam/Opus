import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss']
})
export class TaskCommentsComponent implements OnInit, OnChanges{
  @Input() taskId: any;

  constructor(private _taskService: TaskServiceService) { }

  taskSelectedComments$ = this._taskService.taskSelectedComments$;

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this._taskService.taskSelectedcomments$(this.taskId).subscribe();
  }

}
