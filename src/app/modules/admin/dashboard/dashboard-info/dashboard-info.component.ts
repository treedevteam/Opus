import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BoardsService } from '../../departments/boards/boards.service';
import { Data } from '../../tasks/tasks.types';

@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardInfoComponent implements OnInit {
userCount$= this.boardService.$data;
loading$ = this.boardService.loading$;

    constructor(
    private boardService:BoardsService
  ) { }


  ngOnInit(): void {
    this.boardService.getData().subscribe();
    console.warn(this.userCount$)

  }

}
