/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Boards } from '../../departments.types';
import { BoardsService } from '../boards.service';
import { StoreBoardsComponent } from '../store-boards/store-boards.component';

@Component({
  selector: 'app-update-boards',
  templateUrl: './update-boards.component.html',
  styleUrls: ['./update-boards.component.scss']
})
export class UpdateBoardsComponent implements OnInit {
  @ViewChild('updateBoardNgForm') updateBoardNgForm: NgForm;
  updateBoards: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _formBuilder: FormBuilder,private _boardService: BoardsService,
  public dialogRef: MatDialogRef<StoreBoardsComponent>,
  ) { }

  ngOnInit() {
    this.updateBoards = this._formBuilder.group({
      id:['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      department_id:[this._boardService.currentDepartment, Validators.required],
  });
    this.updateBoards.setValue(this.data.dataKey);
    console.log(this.data);
  this.updateBoards.value({
    id:this.updateBoards.value.id,
    name:this.updateBoards.value.name,
    description:this.updateBoards.value.description,
    type:this.updateBoards.value.type,
    department_id: this.updateBoards.value.department_id
  });
  }

  updateBoard(): void{
    this._boardService.updateBoard(this.data.dataKey.id ,this.updateBoards.value).subscribe();
    this.closeDialog();
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
