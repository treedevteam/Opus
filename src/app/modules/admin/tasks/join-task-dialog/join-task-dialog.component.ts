/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TasksService } from '../tasks.service';
@Component({
  selector: 'app-join-task-dialog',
  templateUrl: './join-task-dialog.component.html',
  styleUrls: ['./join-task-dialog.component.scss']
})
export class JoinTaskDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any, private _tasksService: TasksService) { 
  }

  ngOnInit(): void {
  }
    assignUserToBoard(){
      this._tasksService.assignUserToBoard(this.data.boardId , this.data.userid).subscribe((res)=>{
        console.log(res);
        window.location.reload();
      });
    }

}
