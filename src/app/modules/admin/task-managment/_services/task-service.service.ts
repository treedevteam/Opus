import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { Board, Task, Users } from '../_models/task'
import { environment } from 'environments/environment';
import { Priorities } from '../../priorities/model/priorities';
import { Status } from '../../statuses/model/status';


@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  apiUrl = environment.apiUrl;
  private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
  private _taskOrder: BehaviorSubject<number[] | null> = new BehaviorSubject(null);
  private _currentBoard: BehaviorSubject<Board | null> = new BehaviorSubject(null);


  private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
  private _statuses: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }

  get tasks$(): Observable<Task[]>
  {
      return this._tasks.asObservable();
  }
  get tasksOrder$(): Observable<number[]>
  {
      return this._taskOrder.asObservable();
  }
  get currentBoard$(): Observable<Board>
  {
      return this._currentBoard.asObservable();
  }


  get priorities$(): Observable<Priorities[]>
  {
      return this._priorities.asObservable();
  }
  get statuses$(): Observable<Status[]>
  {
      return this._statuses.asObservable();
  }
  get users$(): Observable<Users[]>
  {
      return this._users.asObservable();
  }
  
  


  
  //BoardTasks
  getBoardTasks(id: number): Observable<Task[]>{
    return this._httpClient.get<Task[]>(this.apiUrl+'api/board/'+id+'/tasks').pipe(
    map((data: any): Task[] => {
        this._tasks.next(data.tasks)
        this._taskOrder.next(data.order)
        return data.tasks;
    }),
    shareReplay(1),
    );
  }
  
  //GetBoardTask
  getBoard(id: number): Observable<Board>{
    return this._httpClient.get<Board>(this.apiUrl+'api/board/'+ id).pipe(
      map((data: any): Board => {
          this._currentBoard.next({...data.board, is_his: data.is_his});
          return data;
      }),
        shareReplay(1),
      );
  }

  getPriorities$ = this._httpClient.get<Priorities[]>(this.apiUrl+'api/priorities').pipe(
    map((data: any): Priorities[] => {
        this._priorities.next(data);
        return data;
    }),
     shareReplay(1),
  );

  getStatus$ = this._httpClient.get<Status[]>(this.apiUrl+'api/statuses').pipe(
      map((data: any): Status[] => {
          this._statuses.next(data);
          return data;
      }),
      shareReplay(1),
  );
  getUsersData$ = this._httpClient.get<Users[]>(this.apiUrl+'api/users').pipe(
    map((data: any): Users[] => {
        this._users.next(data);
        return data;
    }),
    shareReplay(1),
  );

  
  allTasks$ = combineLatest([
    this.tasks$,
    this.getStatus$,
    this.getPriorities$,
    this.getUsersData$
  ]).pipe(
    map(([tasksBoard, statuses, priority, users]) =>(
       [ 
        ...tasksBoard.map(res=>({
            ...res,
            status: statuses.find(s => +res.status === +s.id),
            priority: priority.find(p => +res.priority === +p.id),
            users_assigned: res.users_assigned.map(u => (
                users.find(user => u === +user.id)
            )),
            checkListInfo : {
                completed: res.checklists.filter(x => x.value === 1).length,
                total: res.checklists.length
            }
        })),
    ])),
    shareReplay(1),
    );
}
