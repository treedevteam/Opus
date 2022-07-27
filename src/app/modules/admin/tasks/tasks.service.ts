/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Tag, Task, Task2, TaskLogs, TaskWithDepartment, TaskComment, TaskCheckList, Users } from './tasks.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, take, tap, throwError, withLatestFrom } from 'rxjs';
import { parseInt } from 'lodash';
import { Priorities } from '../priorities/model/priorities';
import { Location } from '../locations/model/location';
import { Status } from '../statuses/model/status';
import { Departments, Boards } from '../departments/departments.types';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root'
})
export class TasksService
{
    [x: string]: any;
    apiUrl = environment.apiUrl;
    //Logs
    private _tagsLogs: BehaviorSubject<TaskLogs[] | null> = new BehaviorSubject(null);
    //checkList
    private _taskCheckList: BehaviorSubject<TaskCheckList[] | null> = new BehaviorSubject(null);
    //Comments
    private _taskComments: BehaviorSubject<TaskComment[] | null> = new BehaviorSubject(null);
    //Tasks
    private _currentBoardTasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
    //Subtask
    private _subtasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
    private _mysubtask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _currentDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null);
    private _currentDepartmentTasks: BehaviorSubject<TaskWithDepartment | null> = new BehaviorSubject(null);
    private _currentDepartmentId: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private _boardData : BehaviorSubject <any> = new BehaviorSubject(null);
    private _currentBoard: BehaviorSubject<any| null> = new BehaviorSubject(null);
    private _allBoards: BehaviorSubject<Boards[] | null> = new BehaviorSubject(null);
    private _currentBoardOrderTasks: BehaviorSubject<string | null> = new BehaviorSubject(null);
    private _currentBoardUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _currentDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _notAssignedDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);
    private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _locations: BehaviorSubject<Location[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);


    ///////////////////////
    //duhet mi fshi ne te ardhmen
    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    //se di a na vyjn
    private _mytasks: BehaviorSubject<TaskWithDepartment[] | null> = new BehaviorSubject(null);
    private _mytask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    /////////////////////


    //CheckList
    taskCheckListservice$ = this.taskCheckList$;
    //Subtask
    subtasksList$ = this.subtasks$;
    //TaskData
    getTasksData$ = this._httpClient.get<TaskWithDepartment[]>(this.apiUrl+'api/tasks/departments').pipe(
        map((data: any): TaskWithDepartment[] => {
            this._mytasks.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );

    usersAssigned$ = combineLatest([
        this.currentBoardUsers$,
        this.currentDepartmentUsers$
      ]).pipe(
        map(([currentBoardUsers,currentDepUsers]) =>(
            {
              assigned:[...currentBoardUsers],
              users: currentDepUsers.filter(object1 =>
                  currentBoardUsers.findIndex(x=>x.id === object1.id) === -1
              )
        })),
        shareReplay(1),
        tap((res)=>{
            debugger;
            this._notAssignedDepartmentUsers.next(res.users);
        })
        );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getDepartmentsData$ = this._httpClient.get<Departments[]>(this.apiUrl+'api/departments').pipe(
        map((data: any): Departments[] => {
            this._departments.next(data);
            return data;
        }),
         shareReplay(1),
    );

    getBoardsData$ = this._httpClient.get<Boards[]>(this.apiUrl+'api/all/boards').pipe(
        map((data: any): Boards[] => {
            this._allBoards.next(data);
            return data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getUsersData$ = this._httpClient.get<Users[]>(this.apiUrl+'api/users').pipe(
        map((data: any): Users[] => {
            this._users.next(data);
            console.log(data);

            return data;
        }),
         shareReplay(1),
    );
    
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getPriorities$ = this._httpClient.get<Priorities[]>(this.apiUrl+'api/priorities').pipe(
        map((data: any): Priorities[] => {
            this._priorities.next(data);
            return data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getStatus$ = this._httpClient.get<Status[]>(this.apiUrl+'api/statuses').pipe(
        map((data: any): Status[] => {
            this._status.next(data);
            return data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getLocation$ = this._httpClient.get<Location[]>(this.apiUrl+'api/locations').pipe(
        map((data: any): Location[] => {
            this._locations.next(data);
            return data;
        }),
         shareReplay(1),
    );



    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    /**
     * Getter for tags
     */
    get currentDepartment$(): Observable<Departments>{
        return this._currentDepartment.asObservable();
    }
    get currentDepartmentTasks$(): Observable<TaskWithDepartment>{
        return this._currentDepartmentTasks.asObservable();
    }
    get currentDepartmentId$(): Observable<number>{
        return this._currentDepartmentId.asObservable();
    }

    get currentBoard$(): Observable<Boards>{
        return this._currentBoard.asObservable();
    }
    get joinedBoard$(): Observable<Boards>{
        return this._boardData.asObservable();
    }
    get allBoards$(): Observable<Boards[]>{
        return this._allBoards.asObservable();
    }

    get currentBoardOrderTasks$(): Observable<string>{
        return this._currentBoardOrderTasks.asObservable();
    }
    

    get currentBoardUsers$(): Observable<Users[]>{
        return this._currentBoardUsers.asObservable();
    }

    get currentDepartmentUsers$(): Observable<Users[]>{
        return this._currentDepartmentUsers.asObservable();
    }

    get notAssignedDepartmentUsers$(): Observable<Users[]>{
        return this._notAssignedDepartmentUsers.asObservable();
    }


    //CheckList Getter
    get taskCheckList$(): Observable<TaskCheckList[]>{
        return this._taskCheckList.asObservable();
    }
    //Logs
    get tagsLogs$(): Observable<TaskLogs[]>
    {
        return this._tagsLogs.asObservable();
    }
    //Comments getter
    get taskComments$(): Observable<TaskComment[]>
    {
        return this._taskComments.asObservable();
    }
    //Taskat e bordit
    get currentBoardTasks$(): Observable<Task2[]>{
        return this._currentBoardTasks.asObservable();
    }
    get task$(): Observable<Task>
    {
        return this._task.asObservable();
    }

    /**
     * Getter for tasks
     */
    get tasks$(): Observable<Task[]>
    {
        return this._tasks.asObservable();
    }

    get taskById$(): Observable<Task2>
    {
        return this._mytask.asObservable();
    }

    //Subtask
    get subtasks$(): Observable<Task2[]>
    {
        return this._subtasks.asObservable();
    }
    get mysubtask$(): Observable<Task2>
    {
        return this._mysubtask.asObservable();
    }


   
    get departments$(): Observable<Departments[]>
    {
        return this._departments.asObservable();
    }
    get priorities$(): Observable<Priorities[]>
    {
        return this._priorities.asObservable();
    }

    get status$(): Observable<Status[]>
    {
        return this._status.asObservable();
    }
    get locations$(): Observable<Location[]>
    {
        return this._locations.asObservable();
    }
    get users$(): Observable<Users[]>
    {
        return this._users.asObservable();
    }
    // get taskData$(): Observable<Any>
    // {
    //     return this._boardData.asObservable();
    // }


    //nuk na duhet 
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }
    /**
     * Get tags
     */
    //  getBoard(id: number): Observable<Boards>{
    //     return this._httpClient.get<Boards>(this.apiUrl+'api/board/'+ id).pipe(
    //         map((data: any): Boards => {
    //             this._currentBoard.next({...data.board, is_his: data.is_his});
    //             return data;
    //         }),
    //          shareReplay(1),
    //         );
    // }
    
    getTags(): Observable<Tag[]>
    {
        return this._httpClient.get<Tag[]>('api/apps/tasks/tags').pipe(
            tap((response: any) => {
                this._tags.next(response);
            })
        );
    }

    getUsersDepartment(depId: number): Observable<Users[]>
    {
        debugger;
        return this._httpClient.get<Users[]>(this.apiUrl+'api/users/department/'+depId).pipe(
            map((data: any): Users[] => {
                this._currentDepartmentUsers.next(data.data);
                return data.data;
            }),
        );
    }

    getUsersBoard(boardId: number): Observable<Users[]>
    {
        debugger
        return this._httpClient.get<Users[]>(this.apiUrl+'api/board/'+ boardId +'/users').pipe(
            map((data: any): Users[] => {
                console.log(data,'USSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                this._currentBoardUsers.next(data.data);
                return data.data;
            }),
        );
    }

    // assingUserToBoard$ = (boardId: number, userId: number) => combineLatest([this.assignUserToBoard(boardId,userId), this.getBoard(boardId)]).pipe(
    //     map(([response, board]: [any, Boards]) => {
    //         this._currentBoard.next({...response.board, is_his: board.is_his});
    //         return response.data;
    //     })
    // )

    assignUserToBoard(boardId: number, userId: number): Observable<Users[]>
    {
      
        return this._httpClient.post<Users[]>(this.apiUrl+'api/board/'+ boardId +'/'+userId,null).pipe(
            map((data: any): Users[] => {
                this._currentBoardUsers.next(data.data);
                this.getBoard(boardId).subscribe((board: Boards) => {
                })
                return data.data;
            }),
        );
    }

    getTasksLogs(id): Observable<TaskLogs[]> {
        return this._httpClient.get<TaskLogs[]>(this.apiUrl+'api/logs/'+ id).pipe(
            map((data: any): TaskLogs[] => {
                this._tagsLogs.next(data.data);
                return data.data;
            }),
             shareReplay(1),
        );
      }

    //////////////////////////Mujna mi fshi ne te ardhmen ////////////////////////////////
    //nuk jem tu e perdor
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/tasks/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    //nuk jem tu e perdor
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/tasks/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }
   
    //nuk bon kurgjo
    updateTasksOrders(tasks: Task[]): Observable<Task[]>
    {
        return this._httpClient.patch<Task[]>('api/apps/tasks/order', {tasks});
    }
    //nuk jem tu e perdor
    searchTasks(query: string): Observable<Task[] | null>
    {
        return this._httpClient.get<Task[] | null>('api/apps/tasks/search', {params: {query}});
    }
   
    //nuk e perdorum
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/tasks/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.tasks$.pipe(
                    take(1),
                    map((tasks) => {

                        // Iterate through the tasks
                        tasks.forEach((task) => {

                            const tagIndex = task.tags.findIndex(tag => tag === id);

                            // If the task has a tag, remove it
                            if ( tagIndex > -1 )
                            {
                                task.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }
    //Se di a na vyn
    createTask(type: string): Observable<Task>
    {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task>('api/apps/tasks/task', {type}).pipe(
                map((newTask) => {

                    // Update the tasks with the new task
                    this._tasks.next([newTask, ...tasks]);

                    // Return the new task
                    return newTask;
                })
            ))
        );
    }
    //Se di a na vyn
    updateTask(id: string, task: Task): Observable<Task>
    {
        return this.tasks$
                   .pipe(
                       take(1),
                       switchMap(tasks => this._httpClient.patch<Task>('api/apps/tasks/task', {
                           id,
                           task
                       }).pipe(
                           map((updatedTask) => {

                               // Find the index of the updated task
                               const index = tasks.findIndex(item => item.id === id);

                               // Update the task
                               tasks[index] = updatedTask;

                               // Update the tasks
                               this._tasks.next(tasks);

                               // Return the updated task
                               return updatedTask;
                           }),
                           switchMap(updatedTask => this.task$.pipe(
                               take(1),
                               filter(item => item && item.id === id),
                               tap(() => {
                                   // Update the task if it's selected
                                   this._task.next(updatedTask);

                                   // Return the updated task
                                   return updatedTask;
                               })
                           ))
                       ))
                   );
    }
    //se di a na vyn
    getDepartment(id: number): Observable<Departments>{
        return this._httpClient.get<Departments>(this.apiUrl+'api/department/'+ id).pipe(
            map((data: any): Departments => {
                this._currentDepartment.next(data);
                console.log('DEPARTMENT BY ID');
                return data;
            }),
             shareReplay(1),
            );
    }
    //se di a na vyn
    getDepartmentTasks(id: number): Observable<TaskWithDepartment>{
        return this._httpClient.get<TaskWithDepartment>(this.apiUrl+'api/department/'+id+'/tasks').pipe(
            map((data: any): TaskWithDepartment => {
                this._currentDepartmentTasks.next(data.data);
                this._currentDepartmentId.next(data.data.id);
                console.log(data,'DEPARTMENT tasks');
                return data.data;
            }),
             shareReplay(1),
            );
    }
    //////////////////////////Mujna mi fshi ne te ardhmen ////////////////////////////////
    
///////////////////////////CKECK LIST REQUESTS//////////////////////////////////////////////////
getTaskCheckList(id: number): Observable<TaskCheckList[]>{
    return this._httpClient.get<TaskCheckList[]>(this.apiUrl+'api/checklists/'+ id).pipe(
        map((data: any): TaskCheckList[] => {
            this._taskCheckList.next(data.data);
            return data.data;
        }),
        shareReplay(1),
        );
}

editCheckList(form, id: number): Observable<TaskCheckList>{
    return this.currentBoardTasks$.pipe(
        take(1),
        switchMap(taskwithchecklist => this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/update/'+id, form).pipe(
            map((updatedcheckList: any) => {
                updatedcheckList = updatedcheckList.data
                debugger;
                const taskId = taskwithchecklist.findIndex(x=>x.id === form.task_id);
                const checkListId = taskwithchecklist[taskId].checklists.findIndex(y=>y.id === updatedcheckList.id);
                if(checkListId > -1){
                    taskwithchecklist[taskId].checklists.splice(checkListId,1,updatedcheckList);
                }
                this._currentBoardTasks.next(taskwithchecklist)
                this._taskCheckList.next([...taskwithchecklist[taskId].checklists]);
                return updatedcheckList;
            })
        ))
      );
}

addNewCheckListItem(form: any): Observable<TaskCheckList>{
    return this.currentBoardTasks$.pipe(
        take(1),
        switchMap(taskWithChecklist => this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/store', form).pipe(
            map((newcheckList: any) => {
                const taskId = taskWithChecklist.findIndex(x=>x.id === form.task_id);
                taskWithChecklist[taskId].checklists = [...taskWithChecklist[taskId].checklists, newcheckList.data] 
                this._currentBoardTasks.next(taskWithChecklist)
                this._taskCheckList.next([...taskWithChecklist[taskId].checklists]);
                return newcheckList.data;
            })
        ))
      );
}

deletedCheckListItem(id: number, task_id): Observable<number>{
    return this.currentBoardTasks$.pipe(
    take(1),
    switchMap(taskwithchecklist => this._httpClient.delete<number>(this.apiUrl+'api/checklist/delete/'+id).pipe(
        map((deletedcheckList: any) => {
            const taskId = taskwithchecklist.findIndex(x=>x.id === task_id);
            const checkListId = taskwithchecklist[taskId].checklists.findIndex(y=>y.id === id);
            if(checkListId > -1){
                taskwithchecklist[taskId].checklists.splice(checkListId,1);
            }
            this._currentBoardTasks.next(taskwithchecklist)
            this._taskCheckList.next([...taskwithchecklist[taskId].checklists]);
            return deletedcheckList;
        })
    ))
    );
}
///////////////////////////CKECK LIST REQUESTS//////////////////////////////////////////////////
///////////////////////////Comments of task ////////////////////////////////////////////////////
getTaskComments(id: number): Observable<TaskComment[]>{
    return this._httpClient.get<Users[]>(this.apiUrl+'api/comments/'+ id).pipe(
    map((data: any): TaskComment[] => {
        this._taskComments.next(data.data);
        return data.data;
    }),
     shareReplay(1),
    );
}

//add comment
storeComment(comment: any): Observable<TaskComment[]>{
    return this.taskComments$.pipe(
        take(1),
        switchMap(taskComments => this._httpClient.post<TaskComment[]>(this.apiUrl+'api/comment/store', comment).pipe(
            map((newComment: any) => {
                this._taskComments.next([newComment.data,...taskComments])
                return newComment;
            })
        ))
        );
}

//delete comment
deleteComment(id: number): Observable<any>
{   
    return this.taskComments$.pipe(
        take(1),
        switchMap(taskComments => this._httpClient.delete(this.apiUrl+'api/comment/delete/'+id).pipe(
            map((deleted: any) => {
                const index = taskComments.findIndex(x=>x.id === id);
                taskComments.splice(index,1);
                this._taskComments.next(taskComments)
                return deleted;
            })
        ))
        );
}
///////////////////////////Comments of task ////////////////////////////////////////////////////

///////////////////////////TASKS////////////////////////////////////////////////////
    getBoardTasks(id: number): Observable<Task2[]>{
        debugger
        return this._httpClient.get<Task2[]>(this.apiUrl+'api/board/'+id+'/tasks').pipe(
        map((data: any): Task2[] => {
            this._currentBoardTasks.next(data.tasks);
            console.warn(data.tasks,'TASKS');
            this._currentBoardOrderTasks.next(data.order);
            return data.data;
        }),
        shareReplay(1),
        );
    }

    storeTask(form: any): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
        take(1),
        switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task/store/board', form).pipe(
            map((newTask: any) => {
                this._currentBoardTasks.next([...tasks, newTask.task])
                this._currentBoardOrderTasks.next(newTask.board_order);
                return newTask;
            })
        ))
        );
    }

    deleteTask(id: number, departments: number): Observable<any>
    {
        return this.currentBoardTasks$.pipe(
        take(1),
        switchMap(tasks => this._httpClient.delete(this.apiUrl+'api/task/delete/'+id).pipe(
            map((deletedTask: any) => {
                const index = tasks.findIndex(x=>x.id === id)
                tasks.splice(index,1);
                this._currentBoardTasks.next(tasks)
                return deletedTask;
            })
        ))
        );
    }



    updateTaskStatus(statusId: any, order: any,board_id: number, taskId: number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task_status/' + taskId , {status: statusId,order: order,board_id:board_id}).pipe(
                map((updatedTask: any) => {
                    updatedTask = updatedTask.task;
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    this._currentBoardOrderTasks.next(updatedTask.order);
                    return updatedTask; 
                })
            ))
        );
    }
    dowloadFile(url:any){
        console.warn(url)
        return this._httpClient.get(url);
    }
    updateTaskStatusOrder(statusId: any, order: string, board_id: number, taskId: number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task_status/' + taskId ,  {board_id:board_id,status: statusId,order}).pipe(
                map((updatedTask: any) => {
                    debugger;
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.data.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask.data);
                    }
                    this._currentBoardTasks.next(tasks)
                    this._currentBoardOrderTasks.next(updatedTask.order);
                    return updatedTask;
                })
            ))
        );
    }

    updateTaskPriority(priorityId: any, taskId:number, board_id:number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task_priority/' + taskId ,  {priority: priorityId,board_id}).pipe(
                map((updatedTask: any) => {
                    updatedTask = updatedTask.data;
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    return updatedTask;
                })
            ))
        );
    }

    updateTaskTitle(title: any, taskId:number, board_id:number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task_title/' + taskId ,  {title: title, board_id:board_id}).pipe(
                map((updatedTask: any) => {
                    updatedTask = updatedTask.data
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    return updatedTask;
                })
            ))
        );
    }

    updateTaskDeadline(deadline: any, taskId:number, board_id:number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task_deadline/' + taskId ,  {deadline: deadline,board_id}).pipe(
                map((updatedTask: any) => {
                    updatedTask= updatedTask.data
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    return updatedTask;
                })
            ))
        );
    }
    
    assignUserTask(taskId: number, userId: number): Observable<TaskWithDepartment>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task/'+ taskId+'/'+ userId, null).pipe(
                map((updatedTask: any) => {
                    updatedTask= updatedTask.data
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    return updatedTask;
                })
            ))
        );
    }

    updateTaskservice(form: any, id: number): Observable<Task2>{
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post<Task2>(this.apiUrl+'api/task/' + id + '/update/admin', form).pipe(
                map((updatedTask: any) => {
                    updatedTask= updatedTask.data
                    const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                    if(checklistIndex > -1){
                        tasks.splice(checklistIndex,1,updatedTask);
                    }
                    this._currentBoardTasks.next(tasks)
                    return updatedTask;
                })
            ))
        );
    }
    getTaskById2(id: string): Observable<Task2>
    {
        // this.getTaskComments(+id);
        return this._httpClient.get<Task2>(this.apiUrl+'api/task/'+ id).pipe(
            map((data: any): Task2 => {
                this._mytask.next(data.data);
                // this.getTaskComments(+id)
                // console.log(data);
                return data;
            }),switchMap((task) => {

                if ( !task )
                {
                    return throwError('Could not found task with id of ' + id + '!');
                }
                return of(task);
            })
        );
    }
    addfileToTask(file,id): any{
        return this.taskById$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post(this.apiUrl+`api/task_file/${id}`, file).pipe(
                map((updatedTask: any) => {
                    console.warn(updatedTask)
                    // this.tasks.file = file
                    // console.log(tasks)
                    this._mytask.next(updatedTask)
                })
            ))
        );
        
        return this._httpClient.post(this.apiUrl+`api/task_file/${id}`, file);
    }
    deleteFileFromTask(id): any{
        console.log('tes')
        debugger;
        return this.currentBoardTasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post(this.apiUrl+`api/delete_file/${id}`,'delete').pipe(
                map((deletedTask: any) => {
                    debugger
                    const index  = tasks.findIndex(x=> x.id === id)
                    console.warn( tasks[index].file)
                    tasks[index].file = null;
                    this._currentBoardTasks.next(tasks)
                    return deletedTask;
                }) 
                ))
                );
            }
///////////////////////////TASKS////////////////////////////////////////////////////

///////////////////////////SUBTASK////////////////////////////////////////////////////
getSubtasks(id: number): Observable<Task2[]>{
    return this._httpClient.get<Task2[]>(this.apiUrl+'api/task/subtasks/'+ id).pipe(
    map((data: any): Task2[] => {
        this._subtasks.next(data.data);
        return data.data;
    }),
     shareReplay(1),
    );
}

storeSubtask(data): Observable<Task2>{
    return this.subtasks$.pipe(
    take(1),
    switchMap(subTasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask/store', data).pipe(
        map((newSubTask: any) => {
            debugger;
            this._subtasks.next([...subTasks, newSubTask.data])
            return newSubTask;
        })
    ))
    );
}

subtaskUpdateTaskStatus(statusId: any, subtaskId: number): Observable<Task2>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask_status/' + subtaskId ,  {status: statusId}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._currentBoardTasks.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}

subtaskUpdateTaskPriority(priorityId: any, subtaskId: number): Observable<Task2>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask_priority/' + subtaskId ,  {priority: priorityId}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._currentBoardTasks.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}

    getBoard(id: number): Observable<Boards>{
        return this._httpClient.get<Boards>(this.apiUrl+'api/board/'+ id).pipe(
            map((data: any): Boards => {
                this._currentBoard.next({...data.board, is_his: data.is_his});
                return data;
            }),
             shareReplay(1),
            );
    }



subtaskUpdateTaskDeadline(deadline: any, subtaskId: number): Observable<Task2>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask_deadline/' + subtaskId ,  {deadline: deadline}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._currentBoardTasks.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}

updateSubtaskTitle(title: any, subtaskId: number): Observable<Task2>{
    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask_title/' + subtaskId ,  {title: title}).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._currentBoardTasks.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}


updateSubtaskById(form: any, id: number): Observable<Task2>{

    return this.subtasks$.pipe(
        take(1),
        switchMap(subtasks => this._httpClient.post<Task2>(this.apiUrl+'api/subtask/' + id + '/update/admin', form).pipe(
            map((updatedSubTask: any) => {
                updatedSubTask= updatedSubTask.data
                const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                if(index > -1){
                    subtasks.splice(index,1,updatedSubTask);
                }
                this._currentBoardTasks.next(subtasks)
                return updatedSubTask;
            })
        ))
    );
}

getSubtaskById(id: string): Observable<Task2>
{
    // this.getTaskComments(+id);
    return this._httpClient.get<Task2>(this.apiUrl+'api/subtask/'+ id).pipe(
        map((data: any): Task2 => {
            this._mysubtask.next(data.data);
            // this.getTaskComments(+id)
            // console.log(data);
            return data;
        }),switchMap((task) => {

            if ( !task )
            {
                return throwError('Could not found task with id of ' + id + '!');
            }
            return of(task);
        })
    );
}

///////////////////////////SUBTASK////////////////////////////////////////////////////
}
