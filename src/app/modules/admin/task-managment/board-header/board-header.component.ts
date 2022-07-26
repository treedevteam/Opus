import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from '../_services/task-service.service';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit {

  constructor(private _taskServiceService:TaskServiceService) { }

  currentBoard$ = this._taskServiceService.currentBoard$;

  ngOnInit(): void {
  }
  filterStatus(){
    this._taskServiceService.statusFilter$.next([1])
  }

  filterPriority(){
    this._taskServiceService.priorityFilter$.next([3])
  }
  filterUserasign(){
    this._taskServiceService.usersAssignedFilter$.next([1,2])
  }

  filterTasksCreatedByMe(){
    this._taskServiceService.createdByMe$.next(1)
  }

}
