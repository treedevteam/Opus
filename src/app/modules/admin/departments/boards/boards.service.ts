/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { Boards } from '../departments.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Task2 } from '../../tasks/tasks.types';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  apiUrl = environment.apiUrl;
  public currentDepartment: number;

  private _boards: BehaviorSubject<Boards[] | null> = new BehaviorSubject(null);
  private _boardTasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }
  get $boards(): Observable<Boards[]>{
    return this._boards.asObservable();
  }
  get $boardTask(): Observable<Task2[]>{
    return this._boardTasks.asObservable();
  }

  getBoardTasks(id: number): Observable<Task2[]>{
    return this._httpClient.get<Task2[]>(this.apiUrl+'api/board/'+id+'/tasks').pipe(
      map((data: any): Task2[] => {
          this._boardTasks.next(data);
          console.log(data,'boardTasks');
          return data;
      }),
       shareReplay(1),
  );
  }

  getBoards(id: number): Observable<Boards[]>{
    return this._httpClient.get<Boards[]>(this.apiUrl+'api/department/'+id+'/boards').pipe(
      map((data: any): Boards[] => {
          this._boards.next([...data.public,...data.private]);
          this.currentDepartment = id;
          return data;
      }),
      shareReplay(1),
    );
  }
  
  addBoard(board: any): Observable<Boards>{
    return this.$boards.pipe(
      take(1),
      switchMap(boards => this._httpClient.post<Boards>(this.apiUrl+'api/board/store',board).pipe(
          map((newBoard: any) => {
              this._boards.next([...boards,newBoard.data]);
              return newBoard;
          })
      ))
    );
  }

  updateBoard(id: number, board: any): Observable<Boards>{
    return this.$boards.pipe(
      take(1),
      switchMap(boards => this._httpClient.post<Boards>(this.apiUrl+'api/board/update/'+id ,board).pipe(
          map((updatedBoard: any) => {
            const Index = boards.findIndex(d => d.id === updatedBoard.data.id);
            if(Index > -1){
              boards.splice(Index,1,updatedBoard.data);
            }
            this._boards.next(boards);
            return updatedBoard.data;
          })
      ))
    );
  }

  deleteBoard(id: number): Observable<number>{
    return this.$boards.pipe(
      take(1),
      switchMap(boards => this._httpClient.delete<Boards>(this.apiUrl+'api/board/delete/'+id).pipe(
          map((deletedBoard: any) => {
            const index = boards.findIndex(x=>x.id == id);
            boards.splice(index,1);
            this._boards.next(boards)
            return deletedBoard;
          })
      ))
    );
  }

}
