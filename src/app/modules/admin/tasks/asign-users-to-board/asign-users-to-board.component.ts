import { Component, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Users } from '../tasks.types';
import { Boards } from '../../departments/departments.types';
import { environment } from 'environments/environment';
import { combineLatest, map, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-asign-users-to-board',
  templateUrl: './asign-users-to-board.component.html',
  styleUrls: ['./asign-users-to-board.component.scss']
})
export class AsignUsersToBoardComponent implements OnInit {
  cardValue: any = {
    options: []
  };

  selectOptions: Array<Users>;
  
  apiUrl = environment.apiUrl;

  usersAssigned = this._taskService.currentBoardUsers$;
  departmentUsers = this._taskService.currentDepartmentUsers$;
  usersAssigned$ = this._taskService.usersAssigned$
 




  currentBoard: Boards;
  constructor(private _taskService: TasksService) { }

  ngOnInit(): void {
    this._taskService.notAssignedDepartmentUsers$.subscribe(res=>{
      this.selectOptions = res;
    })

   this._taskService.currentBoard$.subscribe(res=>{
     this.currentBoard = res;
   
   })
    
  }




  getDepartmentUsers(id:number){
    this._taskService.getUsersDepartment(id).subscribe(res=>{
      this.selectOptions = res; 
    })
  }

  selectChange = (event: any) => {
    const key: string = event.key;
    this.cardValue[key] = [ ...event.data ];

    console.log(this.cardValue);
  };


  assignUserToBoard(userId:number){
    this._taskService.assignUserToBoard(this.currentBoard.id , userId).subscribe(res=>{
      console.log(res);
    })
  }

}
