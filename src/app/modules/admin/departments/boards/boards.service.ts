/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, finalize, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { Boards } from '../departments.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Data, Task2 } from '../../tasks/tasks.types';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  apiUrl = environment.apiUrl;
  public currentDepartment: number;
  private _boards: BehaviorSubject<Boards[] | null> = new BehaviorSubject(null);
  private _boardTasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
  private _data: BehaviorSubject<any | null > = new BehaviorSubject(null);
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();


  constructor(private _httpClient: HttpClient) { }

  show(){
    this._loading.next(true);
  }
  hide(){
    this._loading.next(false);
  }

  get $boards(): Observable<Boards[]>{
    return this._boards.asObservable();
  }
  get $boardTask(): Observable<Task2[]>{
    return this._boardTasks.asObservable();
  }

  get $data(): Observable<any> {
    return this._data.asObservable();
  }
  
  getData(): Observable<any>{
    debugger
    this.show();
    return this._httpClient.get <any>(this.apiUrl + 'api/data').pipe(
      finalize(() => this.hide()),
      map((userdata: any): any=>{
        this._data.next(userdata)
        return userdata
      }),
      shareReplay(1),
 );
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
      shareReplay(1),
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
            console.log(`newBoard: ${JSON.stringify(newBoard)}`);
            console.log(`poseted Data: ${JSON.stringify(board)}`);
            console.log(`currentBoards: ${JSON.stringify(boards)}`);
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
