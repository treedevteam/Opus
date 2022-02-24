import { Tag, Task, Task2, TaskWithDepartment } from './tasks.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { Departments } from '../pages/departaments/model/departments.model';
import { parseInt } from 'lodash';
import { Priorities } from '../priorities/model/priorities';
import { Location } from '../locations/model/location';
import { Status } from '../statuses/model/status';
import { Users } from '../users/model/users';

@Injectable({
    providedIn: 'root'
})
export class TasksService
{


    // Private
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);


    private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);
    private _priorities: BehaviorSubject<Priorities[] | null> = new BehaviorSubject(null);
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _locations: BehaviorSubject<Location[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);


    private _mytasks: BehaviorSubject<TaskWithDepartment[] | null> = new BehaviorSubject(null);
    private _mytask: BehaviorSubject<Task2 | null> = new BehaviorSubject(null);




    private _task: BehaviorSubject<Task | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);


    // eslint-disable-next-line @typescript-eslint/member-ordering
    getDepartmentsData$ = this._httpClient.get<Departments[]>('https://opus.devtaktika.com/api/departments/all').pipe(
        map((data: any): Departments[] => {
            this._departments.next(data);
            return data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getUsersData$ = this._httpClient.get<Users[]>('https://opus.devtaktika.com/api/users').pipe(
        map((data: any): Users[] => {
            this._users.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getTasksData$ = this._httpClient.get<TaskWithDepartment[]>('https://opus.devtaktika.com/api/tasks/departments').pipe(
        map((data: any): TaskWithDepartment[] => {
            this._mytasks.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getPriorities$ = this._httpClient.get<Priorities[]>('https://opus.devtaktika.com/api/priorities').pipe(
        map((data: any): Priorities[] => {

            this._priorities.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getStatus$ = this._httpClient.get<Status[]>('https://opus.devtaktika.com/api/statuses').pipe(
        map((data: any): Status[] => {
            this._status.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );

    // eslint-disable-next-line @typescript-eslint/member-ordering
    getLocation$ = this._httpClient.get<Location[]>('https://opus.devtaktika.com/api/locations').pipe(
        map((data: any): Location[] => {
            this._locations.next(data.data);
            return data.data;
        }),
         shareReplay(1),
    );






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

    // getDepartments(): Observable<Departments[]>
    // {
    //     return this._httpClient.get<Departments[]>('https://opus.devtaktika.com/api/departments').pipe(
    //         // eslint-disable-next-line arrow-body-style
    //         map((data: Departments[]) => {
    //         debugger;

    //             this._departments.next(data);
    //             console.log(data);
    //             return data;
    //         }),
    //         catchError((err) => {
    //             console.error(err);
    //             throw err;
    //         }
    //     )
    //     );
    // }

    /**
     * Crate tag
     *
     * @param tag
     */

     storeTask(form: any): Observable<Task2>{
        return this._httpClient.post<Task2>('https://opus.devtaktika.com/api/task/store', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: Task2) => {
                // this.task$.next(data);
                return data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }

    updateTaskservice(form: any, id: number): Observable<Task2>{
        return this._httpClient.post<Task2>('https://opus.devtaktika.com/api/task/' + id + '/update/admin', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: Task2) => {
                // this.task$.next(data);
                return data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
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
        return this._httpClient.get<Task2>('https://opus.devtaktika.com/api/task/'+ id).pipe(
            map((data: any): Task2 => {
                this._mytask.next(data.data);
                console.log(data);
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
    deleteTask(id: string): Observable<boolean>
    {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.delete('api/apps/tasks/task', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted task
                    const index = tasks.findIndex(item => item.id === id);

                    // Delete the task
                    tasks.splice(index, 1);

                    // Update the tasks
                    this._tasks.next(tasks);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
