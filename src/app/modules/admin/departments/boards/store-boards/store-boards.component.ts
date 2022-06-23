import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoardsService } from '../boards.service';

@Component({
  selector: 'app-store-boards',
  templateUrl: './store-boards.component.html',
  styleUrls: ['./store-boards.component.scss']
})
export class StoreBoardsComponent implements OnInit {
  @ViewChild('storeBoardNgForm') storeBoardNgForm: NgForm;
  storeBoard: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StoreBoardsComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _boardService: BoardsService
    ) { }

  ngOnInit(): void {
    this.storeBoard = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      department_id:[this._boardService.currentDepartment, Validators.required]
  });
  }

  addBoard(){
    console.log(this.storeBoard.value);
    this._boardService.addBoard(this.storeBoard.value).subscribe((res)=>{
    });
  }

}
