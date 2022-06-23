import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../boards.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor(private _boardSerive: BoardsService) { }

  ngOnInit(): void {

    console.log(this._boardSerive.$boardTask);

  }

}
