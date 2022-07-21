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

}
