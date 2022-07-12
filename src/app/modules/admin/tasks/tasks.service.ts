/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Tag, Task, Task2, TaskLogs, TaskWithDepartment, TaskComment, TaskCheckList, Users } from './tasks.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
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

  apiUrl = environment.apiUrl;


    private _currentDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null);
    private _currentDepartmentTasks: BehaviorSubject<TaskWithDepartment | null> = new BehaviorSubject(null);
    private _currentDepartmentId: BehaviorSubject<number | null> = new BehaviorSubject(null);


    private _currentBoard: BehaviorSubject<Boards | null> = new BehaviorSubject(null);
    private _allBoards: BehaviorSubject<Boards[] | null> = new BehaviorSubject(null);
    private _currentBoardOrderTasks: BehaviorSubject<string | null> = new BehaviorSubject(null);
    private _currentBoardTasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
    private _currentBoardUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _currentDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _notAssignedDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);



    // Private
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    //checkList
    private _taskCheckList: BehaviorSubject<TaskCheckList[] | null> = new BehaviorSubject(null);
    private _udatedCheckList: BehaviorSubject<TaskCheckList | null> = new BehaviorSubject(null);
    private _newCheckList: BehaviorSubject<TaskCheckList | null> = new BehaviorSubject(null);
    private _deletedCheckList: BehaviorSubject<any | null> = new BehaviorSubject(null);

    //Comments
    private _taskComments: BehaviorSubject<TaskComment[] | null> = new BehaviorSubject(null);
    private _taskComment: BehaviorSubject<TaskComment | null> = new BehaviorSubject(null);
    private _deletedTaskComment: BehaviorSubject<number | null> = new BehaviorSubject(null);



    private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);
    private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _locations: BehaviorSubject<Location[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);

    //Tasks
    private _mytasks: BehaviorSubject<TaskWithDepartment[] | null> = new BehaviorSubject(null);
    private _mytask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _newtask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _tasksupdated: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _deletedtasks: BehaviorSubject<any> = new BehaviorSubject(null);
    private _tagsLogs: BehaviorSubject<TaskLogs[] | null> = new BehaviorSubject(null);

//subtask
    private _subtasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
    private _newSubtasks: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _updateSubtasks: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _mysubtask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _deletedSubtasks: BehaviorSubject<any> = new BehaviorSubject(null);




    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);


    taskCheckListservice$ = combineLatest([
        this.taskCheckList$,
        this.udatedCheckList$,
        this.newCheckList$,
        this.deletedCheckList$
      ],(checklist,updatedcheck, addCheckList,deletedCheckList) => {
        if(addCheckList){
            const checklistIndex = checklist.findIndex(d => d.id === addCheckList.id);
            if(checklistIndex < 0){
                checklist.push(addCheckList);
            }
        }else if(updatedcheck){
          const checklistIndex = checklist.findIndex(d => d.id === updatedcheck.id);
          if(checklistIndex > -1){
            checklist.splice(checklistIndex,1,updatedcheck);
          }
        }else if(deletedCheckList){
            const checklistIndex = checklist.findIndex(d => d.id === deletedCheckList.id);
          if(checklistIndex > -1){
            checklist.splice(checklistIndex,1);
          }
        }

        return checklist;
    });
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

    subtasksList$ = combineLatest([
        this.subtasks$,
        this.newSubtask$,
        this.updatedSubtask$
      ],(subtasks,newSubtask,updatedSubtask) => {
        if(newSubtask){
            subtasks.push(newSubtask);
        }
        else if(updatedSubtask){
          const checklistIndex = subtasks.findIndex(d => d.id === updatedSubtask.id);
          if(checklistIndex > -1){
            subtasks.splice(checklistIndex,1,updatedSubtask);
          }
        }
        return subtasks;
    });


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
    getTasksLogsData$ = this._httpClient.get<TaskLogs[]>(this.apiUrl+'api/logs/').pipe(
        map((data: any): TaskLogs[] => {
            this._tagsLogs.next(data);
            return data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getTasksData$ = this._httpClient.get<TaskWithDepartment[]>(this.apiUrl+'api/tasks/departments').pipe(
        map((data: any): TaskWithDepartment[] => {
            this._mytasks.next(data.data);
            return data.data;
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



    setNullBehaviourSubject(): void{
        this._newtask.next(null);
        this._tasksupdated.next(null);
        this._deletedtasks.next(null);
    }


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    // eslint-disable-next-line @typescript-eslint/member-ordering

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
    get allBoards$(): Observable<Boards[]>{
        return this._allBoards.asObservable();
    }

    get currentBoardOrderTasks$(): Observable<string>{
        return this._currentBoardOrderTasks.asObservable();
    }
    get currentBoardTasks$(): Observable<Task2[]>{
        return this._currentBoardTasks.asObservable();
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











    get taskCheckList$(): Observable<TaskCheckList[]>{
        return this._taskCheckList.asObservable();
    }

    get udatedCheckList$(): Observable<TaskCheckList>{
        return this._udatedCheckList.asObservable();
    }



    get newCheckList$(): Observable<TaskCheckList>{
        return this._newCheckList.asObservable();
    }
    get deletedCheckList$(): Observable<any>{
        return this._deletedCheckList.asObservable();
    }















    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }
    get departments$(): Observable<Departments[]>
    {
        return this._departments.asObservable();
    }
    get priorities$(): Observable<Priorities[]>
    {
        return this._priorities.asObservable();
    }

    get newTask$(): Observable<Task2>{
        return this._newtask.asObservable();
    }
    get deletedTask$(): Observable<any>{
        return this._deletedtasks.asObservable();
    }
    get taskUpdated$(): Observable<Task2>{
        return this._tasksupdated.asObservable();
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
    get tagsLogs$(): Observable<TaskLogs[]>
    {
        return this._tagsLogs.asObservable();
    }

    get subtasks$(): Observable<Task2[]>
    {
        return this._subtasks.asObservable();
    }
    get mysubtask$(): Observable<Task2>
    {
        return this._mysubtask.asObservable();
    }

    get newSubtask$(): Observable<Task2>
    {
        return this._newSubtasks.asObservable();
    }

    get updatedSubtask$(): Observable<Task2>
    {
        return this._updateSubtasks.asObservable();
    }



    /**
     * Getter for task
     */
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

    get taskComments$(): Observable<TaskComment[]>
    {
        return this._taskComments.asObservable();
    }

    get taskComment$(): Observable<TaskComment>
    {
        return this._taskComment.asObservable();
    }
    get deletedComment$(): Observable<number>
    {
        return this._deletedTaskComment.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get tags
     */
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
        return this._httpClient.get<Users[]>(this.apiUrl+'api/board/'+ boardId +'/users').pipe(
            map((data: any): Users[] => {
                console.log(data,'USSSSSSSSSSSSSSSSSSSSSSSSSSSSSS');
                this._currentBoardUsers.next(data.data);
                return data.data;
            }),
        );
    }

    assignUserToBoard(boardId: number, userId: number): Observable<Users[]>
    {
        return this._httpClient.post<Users[]>(this.apiUrl+'api/board/'+ boardId +'/'+userId,null).pipe(
            map((data: any): Users[] => {
                this._currentBoardUsers.next(data.data);
                return data.data;
            }),
        );
    }

    /**
     * Crate tag
     *
     * @param tag
     */

     storeTask(form: any): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task/store/board', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: any) => {
                this._newtask.next(data.task);
                this._currentBoardOrderTasks.next(data.board_order);
                this.setNullBehaviourSubject();
                return data.task;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    assignUserTask(taskId: number, userId: number): Observable<TaskWithDepartment>{
        return this._httpClient.post<any>(this.apiUrl+'api/task/'+ taskId+'/'+ userId, null).pipe(
            map((data: any): TaskWithDepartment => {
                this._tasksupdated.next(data.data);
                // this.setNullBehaviourSubject();
                return data.data;
            }),
        );
    }
    updateTaskservice(form: any, id: number): Observable<Task2>{
        debugger;
        return this._httpClient.post<Task2>(this.apiUrl+'api/task/' + id + '/update/admin', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: any) => {
                console.warn(data);
                this._tasksupdated.next(data.data);
                this._newtask.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    updateSubtaskById(form: any, id: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask/' + id + '/update/admin', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: any) => {
                this._updateSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
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

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
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

    /**
     * Delete the tag
     *
     * @param id
     */
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

    /**
     * Get tasks
     */
    getTasks(): Observable<Task[]>
    {
        return this._httpClient.get<Task[]>('api/apps/tasks/all').pipe(
            tap((response) => {
                this._tasks.next(response);
            })
        );
    }

    /**
     * Update tasks orders
     *
     * @param tasks
     */
    updateTasksOrders(tasks: Task[]): Observable<Task[]>
    {
        return this._httpClient.patch<Task[]>('api/apps/tasks/order', {tasks});
    }

    /**
     * Search tasks with given query
     *
     * @param query
     */
    searchTasks(query: string): Observable<Task[] | null>
    {
        return this._httpClient.get<Task[] | null>('api/apps/tasks/search', {params: {query}});
    }

    /**
     * Get task by id
     */
    getTaskById(id: string): Observable<Task>
    {
        return this._tasks.pipe(
            take(1),
            map((tasks) => {

                // Find the task
                const task = tasks.find(item => item.id === id) || null;

                // Update the task
                this._task.next(task);

                // Return the task
                return task;
            }),
            switchMap((task) => {

                if ( !task )
                {
                    return throwError('Could not found task with id of ' + id + '!');
                }

                return of(task);
            })
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

    getTaskCheckList(id: number): Observable<TaskCheckList[]>{
        return this._httpClient.get<TaskCheckList[]>(this.apiUrl+'api/checklists/'+ id).pipe(
            map((data: any): TaskCheckList[] => {
                this._taskCheckList.next(data.data);

                return data.data;
            }),
             shareReplay(1),
            );
    }

    /**
     * Create task
     *
     * @param type
     */
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

    /**
     * Update task
     *
     * @param id
     * @param task
     */
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

    /**
     * Delete the task
     *
     * @param id
     */
    deleteTask(id: number, departments: number): Observable<any>
    {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.delete(this.apiUrl+'api/task/delete/'+id,).pipe(
                map((isDeleted: boolean) => {
                    const test = {id:id, departments: departments};
                    this._deletedtasks.next(test);
                    this.setNullBehaviourSubject();
                    return test;
                })
            ))
        );
    }



    //COMMENT
    //get comments
    getTaskComments(id: number): Observable<TaskComment[]>{
        return this._httpClient.get<Users[]>(this.apiUrl+'api/comments/'+ id).pipe(
        map((data: any): TaskComment[] => {
            this._taskComments.next(data.data);
            console.log(data);
            return data.data;
        }),
         shareReplay(1),
        );
    }

    //add comment
    storeComment(comment: any): Observable<TaskComment[]>{
        return this._httpClient.post<TaskComment[]>(this.apiUrl+'api/comment/store', comment).pipe(
            map((data: any) => {
                this._taskComment.next(data.data);
                this._taskComment.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    //delete comment
    deleteComment(id: number): Observable<any>
    {
        return this.taskComments$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.delete(this.apiUrl+'api/comment/delete/'+id,).pipe(
                map((isDeleted: boolean) => {
                    this._deletedTaskComment.next(id);
                    this._deletedTaskComment.next(null);
                    return id;
                })
            ))
        );
    }


    setNullBehaviourSubjectComments(): void{
        this._deletedTaskComment.next(null);
        this._taskComment.next(null);
    }

    //COMMENT




    //Subtasks

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
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask/store', data).pipe(
            map((data: any): Task2 => {
                this._newSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
        );
    }





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


    getBoardTasks(id: number): Observable<Task2[]>{
        return this._httpClient.get<Task2[]>(this.apiUrl+'api/board/'+id+'/tasks').pipe(
            map((data: any): Task2[] => {
                this._currentBoardTasks.next(data.tasks);
                this._currentBoardOrderTasks.next(data.order);
                console.log(data,'data.taskdata.taskdata.taskdata.task');
                return data.data;
            }),
             shareReplay(1),
            );
    }

    editCheckList(form, id: number): Observable<TaskCheckList>{
        return this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/update/'+id, form).pipe(
            map((data: any): TaskCheckList => {
                this._udatedCheckList.next({...data.data,task_id: form.task_id});
                this._udatedCheckList.next(null);
                return data.data;
            }),
            );
    }

    addNewCheckListItem(form: any): Observable<TaskCheckList>{
        return this._httpClient.post<TaskCheckList>(this.apiUrl+'api/checklist/store', form).pipe(
            map((data: any): TaskCheckList => {
                console.log(form,'DSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                this._newCheckList.next({...data.data,task_id: form.task_id});
                this._newCheckList.next(null);
                return data.data;
            }),
            );
    }

    deletedCheckListItem(id: number, task_id): Observable<number>{
        return this._httpClient.delete<number>(this.apiUrl+'api/checklist/delete/'+id).pipe(
            map((data: any): number => {
                this._deletedCheckList.next({id:id,task_id: task_id});
                this._deletedCheckList.next(null);
                return data;
            }),
            );
    }


    updateTaskStatus(statusId: any, order: any,board_id: number, taskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task_status/' + taskId , {status: statusId,order: order,board_id:board_id}).pipe(
            map((data: any) => {
                this._tasksupdated.next(data.task);
                this._currentBoardOrderTasks.next(data.order);
                this._newtask.next(null);
                return data.task;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }
    updateTaskStatusOrder(statusId: any, order: string, board_id: number, taskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task_status/' + taskId ,  {board_id:board_id,status: statusId,order}).pipe(
            map((data: any) => {
                this._tasksupdated.next(data.task);
                this._currentBoardOrderTasks.next(data.order);
                this._newtask.next(null);
                return data.task;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }
    updateTaskPriority(priorityId: any, taskId:number, board_id:number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task_priority/' + taskId ,  {priority: priorityId,board_id}).pipe(
            map((data: any) => {
                this._tasksupdated.next(data.data);
                this._newtask.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    updateTaskTitle(title: any, taskId:number, board_id:number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task_title/' + taskId ,  {title: title, board_id:board_id}).pipe(
            map((data: any) => {
                this._tasksupdated.next(data.data);
                this._newtask.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }


    updateTaskDeadline(deadline: any, taskId:number, board_id:number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/task_deadline/' + taskId ,  {deadline: deadline,board_id}).pipe(
            map((data: any) => {
                this._tasksupdated.next(data.data);
                this._newtask.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }



    subtaskUpdateTaskStatus(statusId: any, subtaskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask_status/' + subtaskId ,  {status: statusId}).pipe(
            map((data: any) => {
                this._updateSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    subtaskUpdateTaskPriority(priorityId: any, subtaskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask_priority/' + subtaskId ,  {priority: priorityId}).pipe(
            map((data: any) => {
                this._updateSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }


    subtaskUpdateTaskDeadline(deadline: any, subtaskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask_deadline/' + subtaskId ,  {deadline: deadline}).pipe(
            map((data: any) => {
                this._updateSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }


    updateSubtaskTitle(title: any, subtaskId: number): Observable<Task2>{
        return this._httpClient.post<Task2>(this.apiUrl+'api/subtask_title/' + subtaskId ,  {title: title}).pipe(
            map((data: any) => {
                this._updateSubtasks.next(data.data);
                this._newSubtasks.next(null);
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
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
    addfileToTask(file,id): any{
        return this._httpClient.post(`api/task_file/${id}`, {file});
    }
}
