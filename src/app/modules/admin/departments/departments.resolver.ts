import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DepartmentsService } from './departments.service';
import { Departments, Boards } from './departments.types';
import { BoardsService } from './boards/boards.service';
import { Task2 } from '../tasks/tasks.types';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<any> {

  constructor(private _departmentsService: DepartmentsService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Departments[]> {
    return this._departmentsService.getDepartments();
  }
}



@Injectable({
  providedIn: 'root'
})
export class BoardsResolver implements Resolve<any> {

  constructor(private _boardService: BoardsService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Boards[]> {
    return this._boardService.getBoards(+route.paramMap.get('depId'));
  }
}



@Injectable({
  providedIn: 'root'
})
export class BoardTaskResolve implements Resolve<any> {

  constructor(private _boardService: BoardsService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task2[]> {
    return this._boardService.getBoardTasks(+route.paramMap.get('boardId'));
  }
}
