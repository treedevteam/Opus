import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
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
  private _board: BehaviorSubject<Boards | null> = new BehaviorSubject(null);
  private _newBoards: BehaviorSubject<Boards | null> = new BehaviorSubject(null);
  private _deletedBoards: BehaviorSubject<number | null> = new BehaviorSubject(null);
  private _updatedBoards: BehaviorSubject<Boards | null> = new BehaviorSubject(null);
  private _boardTasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);

  $getBoards = combineLatest([
    this.$boards,
    this.$newBoards,
    this.$updatedBoards,
    this.$deletedBoards
  ],(boards,newBoard,updatedBoard,deletedBoard) => {
    if(newBoard){
       const boardIndex = boards.findIndex(d => d.id === newBoard.id);
       if(boardIndex < 0){
         boards.push(newBoard);
       }
    }else if(updatedBoard){
      const boardIndex = boards.findIndex(d => d.id === updatedBoard.id);
      if(boardIndex > -1){
        boards.splice(boardIndex,1,updatedBoard);
      }
    }else if(deletedBoard){
      const boardIndex = boards.findIndex(d => d.id === deletedBoard);
      if(boardIndex > -1){

        boards.splice(boardIndex,1);
      }
    }
  return boards;
});




  constructor(private _httpClient: HttpClient) { }

  get $boards(): Observable<Boards[]>{
    return this._boards.asObservable();
  }

  get $board(): Observable<Boards>{
    return this._board.asObservable();
  }

  get $newBoards(): Observable<Boards>{
    return this._newBoards.asObservable();
  }
  get $deletedBoards(): Observable<number>{
    return this._deletedBoards.asObservable();
  }

  get $updatedBoards(): Observable<Boards>{
    return this._updatedBoards.asObservable();
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
          console.log([...data.public,...data.private]);

          this.currentDepartment = id;
          return data;
      }),
       shareReplay(1),
  );
  }
  addBoard(board: any): Observable<Boards>{
    return this._httpClient.post<Boards>(this.apiUrl+'api/board/store',board).pipe(
      map((res: any): Boards=>{
        this._newBoards.next(res.data);
        return res;
      })
    );
  }

  updateBoard(id: number, board: any): Observable<Boards>{
    return this._httpClient.post<Boards>(this.apiUrl+'api/board/update/'+id ,board).pipe(
      map((res: any): Boards=>{
        this._updatedBoards.next(res.data);
        return res;
      })
    );
  }

  deleteBoard(id: number): Observable<number>{
    return this._httpClient.delete<Number>(this.apiUrl+'api/board/delete/'+id).pipe(
      map((res: any): number=>{
        this._deletedBoards.next(id);
        return res;
      })
    );
  }


}
