import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { TaskServiceService } from '../_services/task-service.service';

@Component({
  selector: 'app-task-views',
  templateUrl: './task-views.component.html',
  styleUrls: ['./task-views.component.scss']
})
export class TaskViewsComponent implements OnInit {

  constructor(private _taskService: TaskServiceService,
    private route: ActivatedRoute,

    ) { }

  ngOnInit(): void {
    this._taskService.boardUsersData().subscribe()
  }

}
