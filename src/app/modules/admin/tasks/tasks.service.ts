import { Tag, Task, Task2, TaskLogs, TaskWithDepartment, TaskComment, TaskCheckList } from './tasks.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { parseInt } from 'lodash';
import { Priorities } from '../priorities/model/priorities';
import { Location } from '../locations/model/location';
import { Status } from '../statuses/model/status';
import { Users } from '../users/model/users';
import { Departments } from '../departments/departments.types';



@Injectable({
    providedIn: 'root'
})
export class TasksService
{


    private _currentDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null); 
    private _currentDepartmentTasks: BehaviorSubject<TaskWithDepartment | null> = new BehaviorSubject(null); 













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

    //subtask
    private _subtasks: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);

    private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);
    private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _locations: BehaviorSubject<Location[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);

    //Tasks
    private _mytasks: BehaviorSubject<TaskWithDepartment[] | null> = new BehaviorSubject(null);
    private _mytask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _newtask: BehaviorSubject<Task2[] | null> = new BehaviorSubject(null);
    private _tasksupdated: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);
    private _deletedtasks: BehaviorSubject<any> = new BehaviorSubject(null);
    private _tagsLogs: BehaviorSubject<TaskLogs[] | null> = new BehaviorSubject(null);




    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);


    taskCheckListservice$ = combineLatest([
        this.taskCheckList$,
        this.udatedCheckList$,
        this.newCheckList$,
        this.deletedCheckList$
      ],(checklist,updatedcheck, addCheckList,deletedCheckList) => {
        if(addCheckList){
            checklist.push(addCheckList);
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

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getDepartmentsData$ = this._httpClient.get<Departments[]>('http://127.0.0.1:8000/api/departments').pipe(
        map((data: any): Departments[] => {
            this._departments.next(data);
            return data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getUsersData$ = this._httpClient.get<Users[]>('http://127.0.0.1:8000/api/users').pipe(
        map((data: any): Users[] => {
            this._users.next(data);
            console.log(data);
            
            return data;
        }),
         shareReplay(1),
    );




    // eslint-disable-next-line @typescript-eslint/member-ordering
    // getTasksLogsData$ = this._httpClient.get<TaskLogs[]>('http://127.0.0.1:8000/api/logs/').pipe(
    //     map((data: any): TaskLogs[] => {
    //         this._tagsLogs.next(data);
    //         return data;
    //     }),
    //      shareReplay(1),
    // );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getTasksData$ = this._httpClient.get<TaskWithDepartment[]>('http://127.0.0.1:8000/api/tasks/departments').pipe(
        map((data: any): TaskWithDepartment[] => {
            this._mytasks.next(data.data);
            console.log(data.data);
            return data.data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getPriorities$ = this._httpClient.get<Priorities[]>('http://127.0.0.1:8000/api/priorities').pipe(
        map((data: any): Priorities[] => {
            this._priorities.next(data);
            return data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getStatus$ = this._httpClient.get<Status[]>('http://127.0.0.1:8000/api/statuses').pipe(
        map((data: any): Status[] => {
            this._status.next(data);
            return data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getLocation$ = this._httpClient.get<Location[]>('http://127.0.0.1:8000/api/locations').pipe(
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

    get newTask$(): Observable<Task2[]>{
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
        return this._httpClient.get<Users[]>('http://127.0.0.1:8000/api/users/department/' + depId).pipe(
            map((data: any): Users[] => {
                return data.data;
            }),
        );
    }

    /**
     * Crate tag
     *
     * @param tag
     */
  
     storeTask(form: any): Observable<Task2[]>{
        return this._httpClient.post<Task2[]>('http://127.0.0.1:8000/api/task/store', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: any) => {
                this._newtask.next(data.data);
                console.log(data,"new taskkkkkkk");
                this.setNullBehaviourSubject();
                return data.data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    assignUserTask(taskId: number, userId: number): Observable<void>{
        return this._httpClient.post<any>('http://127.0.0.1:8000/api/task/'+ taskId+'/'+ userId, null).pipe(
            map((data: any): any => {
                this._tasksupdated.next(data.data);
                this.setNullBehaviourSubject();
                return data.data;
            }),
        );
    }
    updateTaskservice(form: any, id: number): Observable<Task2>{
        return this._httpClient.post<Task2>('http://127.0.0.1:8000/api/task/' + id + '/update/admin', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: any) => {
                this._newtask.next(null);
                this._tasksupdated.next(data.data);
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
        return this._httpClient.get<TaskLogs[]>('http://127.0.0.1:8000/api/logs/'+ id).pipe(
            map((data: any): TaskLogs[] => {
                this._tagsLogs.next(data.data)
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
        return this._httpClient.get<Task2>('http://127.0.0.1:8000/api/task/'+ id).pipe(
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

    getTaskCheckList(id: number): Observable<TaskCheckList[]>{
        return this._httpClient.get<TaskCheckList[]>('http://127.0.0.1:8000/api/checklists/'+ id).pipe(
            map((data: any): TaskCheckList[] => {
                this._taskCheckList.next(data.data);
                console.log(data);
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
            switchMap(tasks => this._httpClient.delete('http://127.0.0.1:8000/api/task/delete/'+id,).pipe(
                map((isDeleted: boolean) => {
                    const test = {id:id, departments: departments}
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
        return this._httpClient.get<Users[]>('http://127.0.0.1:8000/api/comments/'+ id).pipe(
        map((data: any): TaskComment[] => {
            this._taskComments.next(data.data);
            console.log(data);
            return data.data;
        }),
         shareReplay(1),
        );
    }

    //add comment
    storeComment(comment: any): Observable<Task2[]>{
        return this._httpClient.post<Task2[]>('http://127.0.0.1:8000/api/comment/store', comment).pipe(
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
            switchMap(tasks => this._httpClient.delete('http://127.0.0.1:8000/api/comment/delete/'+id,).pipe(
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
        return this._httpClient.get<Task2[]>('http://127.0.0.1:8000/api/task/subtasks/'+ id).pipe(
        map((data: any): Task2[] => {
            this._subtasks.next(data.data);
            return data.data;
        }),
         shareReplay(1),
        );
    }




    getDepartment(id: number): Observable<Departments>{
        return this._httpClient.get<Departments>('http://127.0.0.1:8000/api/department/'+ id).pipe(
            map((data: any): Departments => {
                this._currentDepartment.next(data);
                console.log('DEPARTMENT BY ID');
                return data;
            }),
             shareReplay(1),
            );
    }


    getDepartmentTasks(id: number): Observable<TaskWithDepartment>{
        return this._httpClient.get<TaskWithDepartment>('http://127.0.0.1:8000/api/department/'+id+'/tasks').pipe(
            map((data: any): TaskWithDepartment => {
                this._currentDepartmentTasks.next(data.data);
                console.log(data,'DEPARTMENT tasks');
                return data.data;
            }),
             shareReplay(1),
            );
    }


    editCheckList(form, id:number): Observable<TaskCheckList>{
        return this._httpClient.post<TaskCheckList>('http://127.0.0.1:8000/api/checklist/update/'+id, form).pipe(
            map((data: any): TaskCheckList => {
                this._udatedCheckList.next({...data.data,task_id: form.task_id});
                this._udatedCheckList.next(null);
                return data.data;
            }),
            );
    }

    addNewCheckListItem(form: any): Observable<TaskCheckList>{
        return this._httpClient.post<TaskCheckList>('http://127.0.0.1:8000/api/checklist/store', form).pipe(
            map((data: any): TaskCheckList => {
                console.log(form,"DSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                this._newCheckList.next({...data.data,task_id: form.task_id});
                this._newCheckList.next(null);
                return data.data;
            }),
            );
    }

    deletedCheckListItem(id: number, task_id): Observable<number>{
        return this._httpClient.delete<number>('http://127.0.0.1:8000/api/checklist/delete/'+id).pipe(
            map((data: any): number => {
                this._deletedCheckList.next({id:id,task_id: task_id});
                this._deletedCheckList.next(null);
                return data;
            }),
            );
    }


}
