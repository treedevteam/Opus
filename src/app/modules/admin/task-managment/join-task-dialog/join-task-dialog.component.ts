/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TasksService } from '../tasks.service';
import { Board } from '../_models/task';
import { TaskServiceService } from '../_services/task-service.service';
@Component({
  selector: 'app-join-task-dialog',
  templateUrl: './join-task-dialog.component.html',
  styleUrls: ['./join-task-dialog.component.scss']
})
export class JoinTaskDialogComponent implements OnInit {
  currentBoard: Board;

  constructor(private _tasksService: TaskServiceService,
    private dialogRef: MatDialogRef<JoinTaskDialogComponent>
  ) { 
  }

  ngOnInit(): void {
    this._tasksService.currentBoard$.subscribe((res)=>{
      this.currentBoard = res;
    });
  }
  assignUserToBoard(){
    this._tasksService.assignMeToBoard(this.currentBoard.id).subscribe((res)=>{
      this.closeDialog()
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
