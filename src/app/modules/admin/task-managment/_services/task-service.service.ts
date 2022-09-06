import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, scan, shareReplay, Subject, switchMap, take, tap } from 'rxjs';
import { Board, Comments, DueData, Logs, Task, TaskCheckList, Users } from '../_models/task';
import { environment } from 'environments/environment';
import { Priorities } from '../../priorities/model/priorities';
import { Status } from '../../statuses/model/status';
import moment from 'moment';
import { MatRadioChange } from '@angular/material/radio';


@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  apiUrl = environment.apiUrl;
  private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
  private _taskOrder: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _currentBoard: BehaviorSubject<Board | null> = new BehaviorSubject(null);

  private _taskSelected: BehaviorSubject<Task | null> = new BehaviorSubject(null);
  private _subtaskSelected: BehaviorSubject<Task | null> = new BehaviorSubject(null);

  private _taskSelectedLogs: BehaviorSubject<Logs[] | null> = new BehaviorSubject(null);
  private _taskSelectedcomments: BehaviorSubject<Comments[] | null> = new BehaviorSubject(null);



  

  private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
  private _statuses: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
  private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
  private _boardUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
  private _departmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);


  private _subtask: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
  private _curretnSubtasksOpened: BehaviorSubject<number | null> = new BehaviorSubject(null);


  private productCrudActionSubject = new Subject<CrudAction<Task>>();
  private postAddCompleteSubject = new Subject<Task>();
  postAddComplete$ = this.postAddCompleteSubject.asObservable();
  private postDeleteCompleteSubject = new Subject<Task>();
  postDeleteComplete$ = this.postDeleteCompleteSubject.asObservable();
  private postUpdateCompleteSubject = new Subject<Task>();
  postUpdateComplete$ = this.postUpdateCompleteSubject.asObservable();




  //Filters for tasks
    public statusFilter$ = new BehaviorSubject<number[] | null>(null);
    public priorityFilter$ = new BehaviorSubject<number[] | null>(null);
    public titleTaskFilter$ = new BehaviorSubject<string | null>(null);
    public usersAssignedFilter$ = new BehaviorSubject<number[] | null>(null);
    public createdByMe$ = new BehaviorSubject<number | null>(null);
    public dueData$ = new BehaviorSubject<MatRadioChange | null>(null);
    // public channelIdFilter$ = new BehaviorSubject<string | null>(null);
    // public teamIdFilter$ = new BehaviorSubject<string | null>(null);
    // public idFilter$ = new BehaviorSubject<string[] | null>(null);





  constructor(private _httpClient: HttpClient) { }

  get tasks$(): Observable<Task[]>
  {
      return this._tasks.asObservable();
  }
  get tasksOrder$(): Observable<string>
  {
      return this._taskOrder.asObservable();
  }
  get currentBoard$(): Observable<Board>
  {
      return this._currentBoard.asObservable();
  }

  get subtasks$(): Observable<Task[]>
  {
      return this._subtask.asObservable();
  }
  get curretnSubtasksOpened$(): Observable<number| null>
  {
      return this._curretnSubtasksOpened.asObservable();
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
  get boardUsers$(): Observable<Users[]>
  {
      return this._boardUsers.asObservable();
  }

  get departmentUsers$(): Observable<Users[]>
  {
      return this._departmentUsers.asObservable();
  }
  get taskSelected$(): Observable<Task>
  {
      return this._taskSelected.asObservable();
  }
  get subtaskSelected$(): Observable<Task>
  {
      return this._subtaskSelected.asObservable();
  }

  get taskSelectedLogs$(): Observable<Logs[]>
  {
      return this._taskSelectedLogs.asObservable();
  }

  get taskSelectedComments$(): Observable<Comments[]>
  {
      return this._taskSelectedcomments.asObservable();
  }
  
  orderModified$ = this.tasksOrder$.pipe(
        map(e=>e.split(',').filter(t=>t !== '').map(e=>+e))
    );




  
  //BoardTasks
  getBoardTasks(id: number): Observable<Task[]>{
    return this._httpClient.get<Task[]>(this.apiUrl+'api/board/'+id+'/tasks').pipe(
    map((data: any): Task[] => {
        this._tasks.next(data.tasks)
        console.log(data.order,"ODERRIIIIIIIK");
        console.log(data);
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

  getBoardUsersData$ = (boardId:number) => this._httpClient.get<Users[]>(this.apiUrl+`api/board/${boardId}/users`).pipe(
    map((data: any): Users[] => {
        this._boardUsers.next(data.data);
        return data;
    }),
    shareReplay(1),
  );


  boardUsersData(): Observable<Users[]>{
    return this.currentBoard$.pipe(
        switchMap(board=> this._httpClient.get<Users[]>(this.apiUrl+`api/board/${board.id}/users`).pipe(
            map((data: any): Users[] => {
                this._boardUsers.next(data.data);
                return data.data;
            }),
            shareReplay(1),
          ))
    )
}




  getUsersDepartment(depId: number): Observable<Users[]>
    {
        return this._httpClient.get<Users[]>(this.apiUrl+'api/users/department/'+depId).pipe(
            map((data: any): Users[] => {
                this._departmentUsers.next(data.data);
                return data.data;
            }),
        );
    }

  usersAssigned$ = combineLatest([
    this.boardUsers$,
    this.departmentUsers$
  ]).pipe(
    map(([currentBoardUsers,currentDepUsers]) =>(
        {
          assigned:[...currentBoardUsers],
          users: currentDepUsers.filter(object1 =>
              currentBoardUsers.findIndex(x=>x.id === object1.id) === -1
          )
    })),
    shareReplay(1),
    );
    taskSelectedDetails$ = combineLatest([
    this.taskSelected$,
    this.getUsersData$
  ]).pipe(
        map(([tasksBoard, users ]) =>(
            {
                ...tasksBoard,
                users_assigned: tasksBoard.users_assigned?.map(u => (
                    users.find(user => u === user.id)
                )),
                checkListcompleted: tasksBoard.checklists.filter(x=>x.value === 1).length
            }
            )),
    shareReplay(1),
    tap(res=>{
        console.log(res);
    })
    );


  filterasks$ = combineLatest([
    this.tasks$,
    this.statusFilter$,
    this.priorityFilter$,
    this.usersAssignedFilter$,
    this.createdByMe$,
    this.titleTaskFilter$,
    this.dueData$
  ]).pipe(map(
    ([tasks, status, priority,userAssignedFilter,createdByMe, titleFilter,dueData]) =>
    tasks.filter(file => 
        (status ? status.some(e=>e === file.status) : true) &&
        (priority ? priority.some(e=>e === file.priority) : true) &&
        (createdByMe ? createdByMe === file.user.id : true) &&
        (userAssignedFilter ? file.users_assigned.some(r=> userAssignedFilter.indexOf(r) >= 0): true) &&
        (titleFilter ? file.title.includes(titleFilter) : true)&&
        (dueData ? this.dataFilter(file.deadline ,dueData) : true)
      )
  ),
  tap(res=>console.log(res)
  ));
  
  //Ko duhet te ndrrohet
  dataFilter(data, type:MatRadioChange):boolean{
        switch(type.value) {
            case 0:
                return moment(data, moment.ISO_8601).isSame(moment(), 'day')
            case 1:
                return moment(data, moment.ISO_8601).isSame(moment().add(1), 'day')
            case 7:
            return moment(data, moment.ISO_8601).isBetween
                    (moment(), moment().add(7, 'days')); // true
            case 30:
                return moment(data, moment.ISO_8601).isBetween
                    (moment(), moment().add(30, 'days')); // true
            case -1:
                return moment(data, moment.ISO_8601).isBefore(moment(), 'day')
            case null:
                return true
            default:
            // code block
        }
  }
  

  allTasks$ = combineLatest([
    this.filterasks$,
    this.getStatus$,
    this.getPriorities$,
    this.getUsersData$,
    this.orderModified$
  ]).pipe(
    map(([tasksBoard, statuses, priority, users,orderTasks]) =>(
       [ 
        ...tasksBoard.map(res=>({
            ...res,
            status: statuses.find(s => +res.status === +s.id),
            priority: priority.find(p => +res.priority === +p.id),
            users_assigned: res.users_assigned?.map(u => (
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


    allSubTasks$ = combineLatest([
        this.subtasks$,
        this.getStatus$,
        this.getPriorities$,
        this.getUsersData$,
      ]).pipe(
        map(([tasksBoard, statuses, priority, users]) =>(
           [ 
            ...tasksBoard.map(res=>({
                ...res,
                status: statuses.find(s => +res.status === +s.id),
                priority: priority.find(p => +res.priority === +p.id),
                users_assigned: res.users_assigned?.map(u => (
                    users.find(user => u === +user.id)
                )),
            })),
        ])),
        shareReplay(1),
        tap(res=>{
            console.log(res);
        })
        );

    updateTaskPriority(priorityId: any, taskId:number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(res=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task_priority/' + taskId ,  {priority: priorityId,board_id:res.id}).pipe(
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data;
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if(checklistIndex > -1){
                            tasks.splice(checklistIndex,1,updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    updateTaskStatus(statusId: any, taskId: number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task_status/' + taskId , {status: statusId,order: board.board_order,board_id:board.id}).pipe(
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.task;
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if(checklistIndex > -1){
                            tasks.splice(checklistIndex,1,updatedTask);
                        }
                        this._tasks.next(tasks)
                        console.log(updatedTask);
                        this._taskOrder.next(updatedTask.order)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    updateTaskDeadline(deadline: any, taskId:number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task_deadline/' + taskId ,  {deadline: deadline,board_id: board.id}).pipe(
                    map((updatedTask: any) => {
                        updatedTask= updatedTask.data
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if(checklistIndex > -1){
                            tasks.splice(checklistIndex,1,updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    addNewCheckListItem(form: any): Observable<TaskCheckList>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/store', form).pipe(
                    map((newChecklist: any) => {
                        const taskId = tasks.findIndex(x=>x.id === form.task_id);
                        tasks[taskId].checklists = [...tasks[taskId].checklists,newChecklist.data]
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId])
                        return newChecklist.data;
                    })
                ))
            ))
        )
    }

    deletedCheckListItem(id: number,task_id): Observable<TaskCheckList>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.delete<number>(this.apiUrl+'api/checklist/delete/'+id).pipe(
                    map((deletedTask: any) => {
                        const taskId = tasks.findIndex(x=>x.id === task_id);
                        const checkListId = tasks[taskId].checklists.findIndex(y=>y.id === id);
                        if(checkListId > -1){
                            tasks[taskId].checklists.splice(checkListId,1);
                        }
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId])
                        return deletedTask.data;
                    })
                ))
            ))
        )
    }


    editCheckList(id: number,form): Observable<TaskCheckList>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/update/'+id, form).pipe(
                    map((updatedChecklist: any) => {
                        updatedChecklist = updatedChecklist.data
                        const taskId = tasks.findIndex(x=>x.id === form.task_id);
                        const checkListId = tasks[taskId].checklists.findIndex(y=>y.id === updatedChecklist.id);
                        if(checkListId > -1){
                            tasks[taskId].checklists.splice(checkListId,1,updatedChecklist);
                        }
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId]);
                        return updatedChecklist;
                    })
                ))
            ))
        )
    }


    updateTaskTitle(title: any, taskId:number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task_title/' + taskId ,  {title: title, board_id:board.id}).pipe(
                    map((updatedTask: any) => {
                        updatedTask= updatedTask.data
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if(checklistIndex > -1){
                            tasks.splice(checklistIndex,1,updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    storeTask(form: any): Observable<Task>{

        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task/store/board' , {...form,board_id:board.id}).pipe(
                    map((newTask: any) => {
                        this._tasks.next([newTask.task,...tasks])
                        console.log(newTask);
                        this._taskOrder.next(newTask.board_order)
                        return newTask;
                    })
                ))
            ))
        )
    }

    deleteTask(id: number, departments: number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.delete<Task>(this.apiUrl+'api/task/delete/'+id).pipe(
                    map((deletedTask: any) => {
                        const taskindex = tasks.findIndex(x=>x.id === id);
                        tasks.splice(taskindex,1);
                        this._tasks.next([...tasks])
                        return deletedTask;
                    })
                ))
            ))
        )
    }

    assignUserTask(taskId: number, userId: number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task/'+ taskId+'/'+ userId, null).pipe(
                    map((updatedTask: any) => {
                        updatedTask= updatedTask.data
                        const taskindex = tasks.findIndex(x=>x.id === updatedTask.id);
                        if(taskindex > -1){
                            tasks.splice(taskindex,1,updatedTask);
                        }
                        this._tasks.next([...tasks])
                        this._taskSelected.next(updatedTask)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    updateTaskStatusOrder(statusId: any, order: string, taskId: number): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl+'api/task_status/' + taskId ,  {board_id:board.id,status: statusId,order}).pipe(
                    map((updatedTask: any) => {
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.task.id);
                        if(checklistIndex > -1){
                            tasks.splice(checklistIndex,1,updatedTask.task);
                        }
                        this._tasks.next(tasks)
                        console.log(updatedTask);
                        this._taskOrder.next(updatedTask.order);
                        return updatedTask;
                    })
                ))
            ))
        )
    }



    getTask(id: number): Observable<Task>
    {
        return this._httpClient.get<Task>(this.apiUrl+'api/task/'+ id).pipe(
            map((data: any): Task => {
                this._taskSelected.next(data.data);
                return data.tasks;
            }),
            shareReplay(1),
            );
    }

    getSubtask(id: number): Observable<Task>
    {
        return this._httpClient.get<Task>(this.apiUrl+'api/task/'+ id).pipe(
            map((data: any): Task => {
                this._subtaskSelected.next(data.data);
                return data.tasks;
            }),
            shareReplay(1),
            );
    }


    assignUserToBoard(boardId: number, userId: number): Observable<Users[]>
    {
        return this._httpClient.post<Users[]>(this.apiUrl+'api/board/'+ boardId +'/'+userId,null).pipe(
            map((data: any): Users[] => {
                debugger;
                this.getBoard(boardId).subscribe((board: Board) => {
                })
                this._boardUsers.next(data.data);
                return data.data;
            }),
        );
    }

    getSubtasks$= (id: number) => this._httpClient.get<Task[]>(this.apiUrl+'api/task/subtasks/'+ id).pipe(
        map((data: any): Task[] => {
            this._subtask.next(data.data)
            this._curretnSubtasksOpened.next(id);
            return data.data;
        }),
        shareReplay(1),
      );
    closeSubtasks(){
        this._curretnSubtasksOpened.next(null)
    }



    getSelectedTaskLogs$= (id: number) => this._httpClient.get<Logs[]>(this.apiUrl+'api/logs/'+ id).pipe(
        map((data: any): Logs[] => {
            this._taskSelectedLogs.next(data.data)
            return data.data;
        }),
        shareReplay(1),
      );


    taskSelectedcomments$= (id: number) => this._httpClient.get<Comments[]>(this.apiUrl+'api/comments/'+ id).pipe(
    map((data: any): Comments[] => {
        this._taskSelectedcomments.next(data.data)
        return data.data;
    }),
    shareReplay(1),
    );



    
//add comment
storeComment(comment: any): Observable<Comments[]>{
    return this.taskSelectedComments$.pipe(
        take(1),
        switchMap(taskComments => this._httpClient.post<Comments[]>(this.apiUrl+'api/comment/store', comment).pipe(
            map((newComment: any) => {
                this._taskSelectedcomments.next([newComment.data,...taskComments])
                return newComment;
            })
        ))
        );
}

//delete comment
deleteComment(id: number): Observable<any>
{   
    return this.taskSelectedComments$.pipe(
        take(1),
        switchMap(taskComments => this._httpClient.delete(this.apiUrl+'api/comment/delete/'+id).pipe(
            map((deleted: any) => {
                const index = taskComments.findIndex(x=>x.id === id);
                taskComments.splice(index,1);
                this._taskSelectedcomments.next(taskComments)
                return deleted;
            })
        ))
        );
}



      
    subtaskUpdateTaskStatus(statusId: any, subtaskId: number): Observable<Task>{
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl+'api/subtask_status/' + subtaskId ,  {status: statusId}).pipe(
                map((updatedSubTask: any) => {

                    updatedSubTask= updatedSubTask.data
                    const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    if(index > -1){
                        subtasks.splice(index,1,updatedSubTask);
                    }
                    this._subtask.next(subtasks)
                    return updatedSubTask;
                })
            ))
        );
    }

    subtaskUpdateTaskPriority(priorityId: any, subtaskId: number): Observable<Task>{
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl+'api/subtask_priority/' + subtaskId ,  {priority: priorityId}).pipe(
                map((updatedSubTask: any) => {
                    updatedSubTask= updatedSubTask.data
                    const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    if(index > -1){
                        subtasks.splice(index,1,updatedSubTask);
                    }
                    this._subtask.next(subtasks)
                    return updatedSubTask;
                })
            ))
        );
    }

    
updateSubtaskTitle(title: any, subtaskId: number): Observable<Task>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl+'api/subtask_title/' + subtaskId ,  {title: title}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._subtask.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}

subtaskUpdateTaskDeadline(deadline: any, subtaskId: number): Observable<Task>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl+'api/subtask_deadline/' + subtaskId ,  {deadline: deadline}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._subtask.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}
        
    
    storeSubtask(data): Observable<Task>{
        return this.currentBoard$.pipe(
            switchMap(board=> this.subtasks$.pipe(
                take(1),
                switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl+'api/subtask/store', {...data,board_id:board.id}).pipe(
                    map((newSubTask: any) => {
                        this._subtask.next([...subtasks, newSubTask.data])
                        return newSubTask;
                    })
                ))
            ))
        )
    }

    


}


export interface CrudAction<T extends IEntity> {
    operation: CrudOperation;
    entity: T;
  }
  export enum CrudOperation {
    None = 0,
    Add = 1,
    Update = 2,
    Delete = -1
  }
  export interface IEntity {
    id?: number;
  }
