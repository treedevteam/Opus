import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DepartmentsService } from '../departments.service';
import { StoreDepartmentsComponent } from '../store-departments/store-departments.component';
import { BoardsService } from './boards.service';
import { StoreBoardsComponent } from './store-boards/store-boards.component';
import { Boards } from '../departments.types';
import { UpdateBoardsComponent } from './update-boards/update-boards.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {

  $boards = this._boardService.$getBoards;

  constructor(private _boardService: BoardsService,
    public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }

  ngOnInit(): void {
  }


  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(StoreBoardsComponent, {
      width: '100%',
      maxWidth:'700px'
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }


  editBoard(boards: Boards){
    const dialogRef = this.dialog.open(UpdateBoardsComponent, {
      width: '100%',
      maxWidth:'700px',
      data: {dataKey:
      {
        id:boards.id,
        description:boards.description,
        department_id:boards.department_id,
        name:boards.name,
        type:boards.type,
      }}
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  deleteBoard(id: number): void{
    const confirmation = this._fuseConfirmationService.open({
        title  : 'Delete Board',
        message: 'Are you sure you want to delete this board? This action cannot be undone!',
        actions: {
            confirm: {
                label: 'Delete'
            }
        }
    });
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if ( result === 'confirmed' )
      {
          // Delete the task
          this._boardService.deleteBoard(id).subscribe(
            (res)=>{
          });
        }
      });
  }

}
