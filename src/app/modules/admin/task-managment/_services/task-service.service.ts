/* eslint-disable  */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, scan, shareReplay, Subject, switchMap, take, tap, mergeMap, first, concatMap } from 'rxjs';
import { Board, Comments, DueData, Logs, Task, TaskCheckList, Users } from '../_models/task';
import { environment } from 'environments/environment';
import { Priorities } from '../../priorities/model/priorities';
import { Status } from '../../statuses/model/status';
import moment from 'moment';
import { MatRadioChange } from '@angular/material/radio';
import { UserService } from '../../../../core/user/user.service';
import { JoinTaskDialogComponent } from '../join-task-dialog/join-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Boards, Departments } from '../../departments/departments.types';


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
    private _filteredUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null); 

    private _subtask: BehaviorSubject<Task[] | null> = new BehaviorSubject(null);
    private _curretnSubtasksOpened: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private _currentSubtasksDetailsOpened: BehaviorSubject<number | null> = new BehaviorSubject(null);


    private productCrudActionSubject = new Subject<CrudAction<Task>>();
    private postAddCompleteSubject = new Subject<Task>();
    postAddComplete$ = this.postAddCompleteSubject.asObservable();
    private postDeleteCompleteSubject = new Subject<Task>();
    postDeleteComplete$ = this.postDeleteCompleteSubject.asObservable();
    private postUpdateCompleteSubject = new Subject<Task>();
    postUpdateComplete$ = this.postUpdateCompleteSubject.asObservable();

    private _boardInfo: Board;


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
    



    constructor(private _httpClient: HttpClient,
        private _userService: UserService,
        private _dialog: MatDialog) { }

    get tasks$(): Observable<Task[]> {
        return this._tasks.asObservable();
    }
    get tasksOrder$(): Observable<string> {
        return this._taskOrder.asObservable();
    }
    get currentBoard$(): Observable<Board> {
        return this._currentBoard.asObservable();
    }
    get filteredUsers$(): Observable<Users[]>{
        return this._filteredUsers.asObservable();

    }

    get subtasks$(): Observable<Task[]> {
        return this._subtask.asObservable();
    }
    get curretnSubtasksOpened$(): Observable<number | null> {
        return this._curretnSubtasksOpened.asObservable();
    }
    get _currentSubtasksDetailsOpened$(): Observable<number | null> {
        return this._currentSubtasksDetailsOpened.asObservable();
    }
    get priorities$(): Observable<Priorities[]> {
        return this._priorities.asObservable();
    }
    get statuses$(): Observable<Status[]> {
        return this._statuses.asObservable();
    }
    get users$(): Observable<Users[]> {
        return this._users.asObservable();
    }
    get boardUsers$(): Observable<Users[]> {
        return this._boardUsers.asObservable();
    }

    get departmentUsers$(): Observable<Users[]> {
        return this._departmentUsers.asObservable();
    }
    get taskSelected$(): Observable<Task> {
        return this._taskSelected.asObservable();
    }
    get subtaskSelected$(): Observable<Task> {
        return this._subtaskSelected.asObservable();
    }

    get taskSelectedLogs$(): Observable<Logs[]> {
        return this._taskSelectedLogs.asObservable();
    }

    get taskSelectedComments$(): Observable<Comments[]> {
        return this._taskSelectedcomments.asObservable();
    }

    get boardInfo(): Board {
        return this._boardInfo;
    }

    orderModified$ = this.tasksOrder$.pipe(
        tap(res => console.log(res)),
        map(e => e.split(',').filter(t => t !== '').map(e => +e))
    );


    getDepartmentsData$ = this._httpClient.get<Departments[]>(this.apiUrl + 'api/departments').pipe(
        map((data: any): Departments[] => {
            return data;
        }),
        shareReplay(1),
    );

    getBoardsData$ = this._httpClient.get<Boards[]>(this.apiUrl + 'api/all/boards').pipe(
        map((data: any): Boards[] => {
            return data;
        }),
        shareReplay(1),
    );


    //BoardTasks
    getBoardTasks(id: number): Observable<Task[]> {
        return this._httpClient.get<Task[]>(this.apiUrl + 'api/board/' + id + '/tasks').pipe(
            map((data: any): Task[] => {
                this._tasks.next(data.tasks)
                console.log(data.order, "ODERRIIIIIIIK");
                console.log(data);
                this._taskOrder.next(data.order ? data.order : "")
                return data.tasks;
            }),
            shareReplay(1),
        );
    }

    //GetBoardTask
    getBoard(id: number): Observable<Board> {
        return this._httpClient.get<Board>(this.apiUrl + 'api/board/' + id).pipe(
            map((data: any): Board => {

                this._currentBoard.next({ ...data.board, is_his: data.is_his });
                this._boardInfo = { ...data.board, is_his: data.is_his };
                return data;
            }),
            shareReplay(1),
        );
    }

    getPriorities$ = this._httpClient.get<Priorities[]>(this.apiUrl + 'api/priorities').pipe(
        map((data: any): Priorities[] => {
            this._priorities.next(data);
            return data;
        }),
        shareReplay(1),
    );

    getStatus$ = this._httpClient.get<Status[]>(this.apiUrl + 'api/statuses').pipe(
        map((data: any): Status[] => {
            this._statuses.next(data);
            return data;
        }),
        shareReplay(1),
    );
    getUsersData$ = this._httpClient.get<Users[]>(this.apiUrl + 'api/users').pipe(
        map((data: any): Users[] => {   
            this._users.next(data);
            return data;
        }),
        shareReplay(1),
    );

    getBoardUsersData$ = (boardId: number) => this._httpClient.get<Users[]>(this.apiUrl + `api/board/${boardId}/users`).pipe(
        map((data: any): Users[] => {
            this._boardUsers.next(data.data);
            return data;
        }),
        shareReplay(1),
    );

    getFilteredUsers(boardId : number){
        console.log(boardId, 'altin' )
     this._httpClient.get<Users[]>(this.apiUrl + `api/board/${boardId}/users`).pipe(
        map((data: any): Users[] => {
            this._filteredUsers.next(data.data);
            return data;
            
        }),
        
        shareReplay(1),
        
    );
    }
    
    filteredUsersData(value) { 
        this.filteredUsers$.pipe(
            map(users => users.filter(tag => tag.name.toLowerCase().includes(value)))).subscribe(filteredUsers => {
              this._filteredUsers.next(filteredUsers);
            });
           
    }

    boardUsersData(): Observable<Users[]> {
        return this.currentBoard$.pipe(
            switchMap(board => this._httpClient.get<Users[]>(this.apiUrl + `api/board/${board.id}/users`).pipe(
                map((data: any): Users[] => {
                    this._boardUsers.next(data.data);
                    return data.data;
                }),
                shareReplay(1),
            ))
        )
    }

    departmentsWithBoard$ = combineLatest([
        this.getDepartmentsData$,
        this.getBoardsData$,
        this.currentBoard$
    ]).pipe(
        map(([departments, board, currentBoard]) =>
            departments.map(departmet => ({
                ...departmet,
                boards: board.filter(x => +x.department_id === departmet.id).filter(x => x.id !== currentBoard.id)
            }))),
        shareReplay(1),
        tap((res) => {
            console.log(res);
        })
    );


    getUsersDepartment(depId: number): Observable<Users[]> {
        return this._httpClient.get<Users[]>(this.apiUrl + 'api/users/department/' + depId).pipe(
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
        map(([currentBoardUsers, currentDepUsers]) => (
            {
                assigned: [...currentBoardUsers],
                users: currentDepUsers.filter(object1 =>
                    currentBoardUsers.findIndex(x => x.id === object1.id) === -1
                )
            })),
        shareReplay(1),
    );

    taskSelectedDetails$ = combineLatest([
        this.taskSelected$,
        this.getUsersData$
    ]).pipe(
        map(([tasksBoard, users]) => (
            {
                ...tasksBoard,
                users_assigned: tasksBoard.users_assigned.map(u => (
                    users.find(user => u === user.id)
                )),
                checkListcompleted: tasksBoard.checklists.filter(x => x.value === 1).length
            }
        )),
        shareReplay(1),
        tap(res => {
            console.log(res);
        })
    );

    subtaskSelectedDetails$ = combineLatest([
        this.subtaskSelected$,
        this.getUsersData$
    ]).pipe(
        map(([subTasksBoard, users]) =>(
            {
                ...subTasksBoard,
                users_assigned: subTasksBoard.users_assigned?.map(u => (
                    users.find(user => u === user.id)
                )),
                checkListcompleted: subTasksBoard.checklists?.filter(x => x.value === 1).length
            }
        )),
        shareReplay(1),
        tap(res => {
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
        ([tasks, status, priority, userAssignedFilter, createdByMe, titleFilter, dueData]) =>
            tasks.filter(file =>
                (status ? status.some(e => e === file.status) : true) &&
                (priority ? priority.some(e => e === file.priority) : true) &&
                (createdByMe ? createdByMe === file.user.id : true) &&
                (userAssignedFilter ? file.users_assigned.some(r => userAssignedFilter.indexOf(r) >= 0) : true) &&
                (titleFilter ? file.title.includes(titleFilter) : true) &&
                (dueData ? this.dataFilter(file.deadline, dueData) : true)
            )
    ),
        tap(res => console.log(res)
        ));

    //Ko duhet te ndrrohet
    dataFilter(data, type: MatRadioChange): boolean {
        switch (type.value) {
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
        map(([tasksBoard, statuses, priority, users, orderTasks]) => (
            [
                ...tasksBoard.map(res => ({
                    ...res,
                    status: statuses.find(s => +res.status === +s.id),
                    priority: priority.find(p => +res.priority === +p.id),
                    users_assigned: res.users_assigned?.map(u => (
                        users.find(user => u === +user.id)
                    )),
                    checkListInfo: {
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
        map(([tasksBoard, statuses, priority, users]) => (
            [
                ...tasksBoard.map(res => ({
                    ...res,
                    status: statuses.find(s => +res.status === +s.id),
                    priority: priority.find(p => +res.priority === +p.id),
                    users_assigned: res.users_assigned?.map(u => (
                        users.find(user => u === +user.id)
                    )),
                })),
            ])),
        shareReplay(1),
        tap(res => {
            console.log('test i allsubtaks',res);
        })
    );
    allSubTasksDetails$ = combineLatest([
        this.subtasks$,
        this.getStatus$,
        this.getPriorities$,
        this.getUsersData$,
    ]).pipe(
        map(([tasksBoard, statuses, priority, users]) => (
            [
                ...tasksBoard.map(res => ({
                    ...res,
                    status: statuses.find(s => +res.status === +s.id),
                    priority: priority.find(p => +res.priority === +p.id),
                    users_assigned: res.users_assigned?.map(u => (
                        users.find(user => u === +user.id)
                    )),
                })),
            ])),
        shareReplay(1),
        tap(res => {
            console.log('123123',res);
        })
    );
    updateTaskPriority(priorityId: any, taskId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            switchMap(res => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task_priority/' + taskId, { priority: priorityId, board_id: res.id }).pipe(
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data;
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if (checklistIndex > -1) {
                            tasks.splice(checklistIndex, 1, updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    updateTaskStatus(statusId: any, taskId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task_status/' + taskId, { status: statusId, order: board.board_order, board_id: board.id }).pipe(
                    map((updatedTask: any) => {
                        // updatedTask = updatedTask.task;
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.task.id);
                        if (checklistIndex > -1) {
                            tasks.splice(checklistIndex, 1, updatedTask.task);
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

    updateTaskDeadline(deadline: any, taskId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task_deadline/' + taskId, { deadline: deadline, board_id: board.id }).pipe(
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if (checklistIndex > -1) {
                            tasks.splice(checklistIndex, 1, updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    addNewCheckListItem(form: any): Observable<TaskCheckList> {
        return this.currentBoard$.pipe(
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<TaskCheckList>(this.apiUrl + 'api/checklist/store', form).pipe(
                    map((newChecklist: any) => {
                        const taskId = tasks.findIndex(x => x.id === form.task_id);
                        tasks[taskId].checklists = [...tasks[taskId].checklists, newChecklist.data]
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId])
                        return newChecklist.data;
                    })
                ))
            ))
        )
    }

    deletedCheckListItem(id: number, task_id): Observable<TaskCheckList> {
        return this.currentBoard$.pipe(
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.delete<number>(this.apiUrl + 'api/checklist/delete/' + id).pipe(
                    map((deletedTask: any) => {
                        const taskId = tasks.findIndex(x => x.id === task_id);
                        const checkListId = tasks[taskId].checklists.findIndex(y => y.id === id);
                        if (checkListId > -1) {
                            tasks[taskId].checklists.splice(checkListId, 1);
                        }
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId])
                        return deletedTask.data;
                    })
                ))
            ))
        )
    }


    editCheckList(id: number, form): Observable<TaskCheckList> {
        return this.currentBoard$.pipe(
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<TaskCheckList>(this.apiUrl + 'api/checklist/update/' + id, form).pipe(
                    map((updatedChecklist: any) => {
                        updatedChecklist = updatedChecklist.data
                        const taskId = tasks.findIndex(x => x.id === form.task_id);
                        const checkListId = tasks[taskId].checklists.findIndex(y => y.id === updatedChecklist.id);
                        if (checkListId > -1) {
                            tasks[taskId].checklists.splice(checkListId, 1, updatedChecklist);
                        }
                        this._tasks.next(tasks)
                        this._taskSelected.next(tasks[taskId]);
                        return updatedChecklist;
                    })
                ))
            ))
        )
    }


    updateTaskTitle(title: any, taskId: number): Observable<Task> {




        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                first(),

                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task_title/' + taskId, { title: title, board_id: board.id }).pipe(
                    first(),
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.id);
                        if (checklistIndex > -1) {
                            tasks.splice(checklistIndex, 1, updatedTask);
                        }
                        this._tasks.next(tasks)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    storeTask(form: any): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            concatMap(board => this.tasks$.pipe(
                first(),
                concatMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task/store/board', { ...form, board_id: board.id }).pipe(
                    first(),
                    map((newTask: any) => {
                        this._tasks.next([newTask.task, ...tasks])
                        console.log(newTask);
                        this._taskOrder.next(newTask.board_order)
                        return newTask;
                    })
                ))
            ))
        )
    }

    deleteTask(id: number, departments: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                first(),
                switchMap(tasks => this._httpClient.delete<Task>(this.apiUrl + 'api/task/delete/' + id).pipe(
                    first(),
                    map((deletedTask: any) => {
                        const taskindex = tasks.findIndex(x => x.id === id);
                        tasks.splice(taskindex, 1);
                        this._tasks.next([...tasks])
                        return deletedTask;
                    })
                ))
            ))
        )
    }
    shareTask(data: { attach_boards: string, task_id: number, detach_boards: string }) {
        return this._httpClient.post(this.apiUrl + 'api/share/task', data)
    }

    assignUserTask(taskId: number, userId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task/' + taskId + '/' + userId, null).pipe(
                    first(),
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data
                        const taskindex = tasks.findIndex(x => x.id === updatedTask.id);
                        if (taskindex > -1) {
                            tasks.splice(taskindex, 1, updatedTask);
                        }
                        this._tasks.next([...tasks])
                        this._taskSelected.next(updatedTask)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    dowloadFile(url: any) {
        console.warn(url)
        return this._httpClient.get(url);
    }

    //TODO ID NUK PO BAN
    addFileToTask(file, id: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + `api/task_file/${id}`, file).pipe(
                    first(),
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.task
                        const taskindex = tasks.findIndex(x => x.id === updatedTask.id);
                        if (taskindex > -1) {
                            tasks.splice(taskindex, 1, updatedTask);
                        }
                        this._tasks.next([...tasks])
                        this._taskSelected.next(updatedTask)
                        return updatedTask;
                    })
                ))
            ))
        )
    }



    deleteFileFromTask(id: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + `api/delete_file/${id}`, 'delete').pipe(
                    first(),
                    map((deletedFile: any) => {
                        const taskindex = tasks.findIndex(x => x.id === id);
                        if (taskindex > -1) {
                            tasks[taskindex].file = null
                        }
                        this._tasks.next([...tasks])
                        this._taskSelected.next(tasks[taskindex])
                        return deletedFile;
                    })
                ))
            ))
        )
    }

    // deleteFileFromTask(id): any{
    //     console.log('tes')
    //     return this.tasks$.pipe(
    //         take(1),
    //         switchMap(tasks => this._httpClient.post(this.apiUrl+`api/delete_file/${id}`,'delete').pipe(
    //             map((deletedTask: any) => {
    //                 const index  = tasks.findIndex(x=> x.id === id)
    //                 tasks[index].file = null;
    //                 this._taskSelected.next(tasks)
    //                 return deletedTask;
    //             }) 
    //             ))
    //             );
    //         }


    assignUserSubtask(taskId: number, userId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.subtasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/subtask/' + taskId + '/' + userId, null).pipe(
                    first(),
                    map((updatedTask: any) => {
                        updatedTask = updatedTask.data
                        const taskindex = tasks.findIndex(x => x.id === updatedTask.id);
                        if (taskindex > -1) {
                            tasks.splice(taskindex, 1, updatedTask);
                        }
                        this._subtask.next([...tasks])
                        this._subtaskSelected.next(updatedTask)
                        return updatedTask;
                    })
                ))
            ))
        )
    }

    updateTaskStatusOrder(statusId: any, order: string, taskId: number): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._httpClient.post<Task>(this.apiUrl + 'api/task_status/' + taskId, { board_id: board.id, status: statusId, order }).pipe(
                    first(),
                    map((updatedTask: any) => {
                        const checklistIndex = tasks.findIndex(d => d.id === updatedTask.task.id);
                        if (checklistIndex > -1) {
                            tasks.splice(checklistIndex, 1, updatedTask.task);
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



    getTask(id: number): Observable<Task> {
        return this._httpClient.get<Task>(this.apiUrl + 'api/task/' + id).pipe(
            map((data: any): Task => {
                this._taskSelected.next(data.data);
                return data.tasks;
            }),
            shareReplay(1),
        );
    }

    getSubtask(id: number): Observable<Task> {
        return this._httpClient.get<Task>(this.apiUrl + 'api/subtask/' + id).pipe(
            map((data: any): Task => {
                this._subtaskSelected.next(data.data);
                return data.tasks;
            }),
            shareReplay(1),
        );
    }


    assignUserToBoard(boardId: number, userId: number): Observable<Users[]> {
        return this._httpClient.post<Users[]>(this.apiUrl + 'api/board/' + boardId + '/' + userId, null).pipe(
            map((data: any): Users[] => {
                this.getBoard(boardId).subscribe((board: Board) => {
                })
                this._boardUsers.next(data.data);
                return data.data;
            }),
        );
    }

    assignMeToBoard(boardId: number): Observable<Users[]> {

        return this._userService.user$.pipe(
            take(1),
            mergeMap(myUser => this._httpClient.post<Users[]>(this.apiUrl + 'api/board/' + boardId + '/' + myUser.id, null).pipe(
                take(1),
                map((data: any) => {
                    this._boardUsers.next(data.data);
                    this.getBoard(boardId).subscribe((board: Board) => {
                    })
                    return data.data;
                })
            ))
        )
    }

    getSubtasks$ = (id: number) => this._httpClient.get<Task[]>(this.apiUrl + 'api/task/subtasks/' + id).pipe(
        map((data: any): Task[] => {
            this._subtask.next(data.data)
            this._curretnSubtasksOpened.next(id);
            return data.data;
        }),
        shareReplay(1),
    );

    closeSubtasks() {
        this._curretnSubtasksOpened.next(null)
    }

    getSubtasksDetails = (id: number) => this._httpClient.get<Task[]>(this.apiUrl + 'api/task/subtasks/' + id).pipe(
        map((data: any): Task[] => {
            this._subtask.next(data.data)
            this._currentSubtasksDetailsOpened.next(id);
            return data.data;
        }),
        shareReplay(1),
    );

    closeSubtaskss() {
        this._currentSubtasksDetailsOpened.next(null)
    }

    getSelectedTaskLogs$ = (id: number) => this._httpClient.get<Logs[]>(this.apiUrl + 'api/logs/' + id).pipe(
        map((data: any): Logs[] => {
            this._taskSelectedLogs.next(data.data)
            return data.data;
        }),
        shareReplay(1),
    );


    taskSelectedcomments$ = (id: number) => this._httpClient.get<Comments[]>(this.apiUrl + 'api/comments/' + id).pipe(
        map((data: any): Comments[] => {
            this._taskSelectedcomments.next(data.data)
            return data.data;
        }),
        shareReplay(1),
    );




    //add comment
    storeComment(comment: any): Observable<Comments[]> {
        return this.taskSelectedComments$.pipe(
            take(1),
            switchMap(taskComments => this._httpClient.post<Comments[]>(this.apiUrl + 'api/comment/store', comment).pipe(
                map((newComment: any) => {
                    this._taskSelectedcomments.next([newComment.data, ...taskComments])
                    return newComment;
                })
            ))
        );
    }

    //delete comment
    deleteComment(id: number): Observable<any> {
        return this.taskSelectedComments$.pipe(
            take(1),
            switchMap(taskComments => this._httpClient.delete(this.apiUrl + 'api/comment/delete/' + id).pipe(
                map((deleted: any) => {
                    const index = taskComments.findIndex(x => x.id === id);
                    taskComments.splice(index, 1);
                    this._taskSelectedcomments.next(taskComments)
                    return deleted;
                })
            ))
        );
    }




    subtaskUpdateTaskStatus(statusId: any, subtaskId: number): Observable<Task> {
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl + 'api/subtask_status/' + subtaskId, { status: statusId }).pipe(
                map((updatedSubTask: any) => {

                    updatedSubTask = updatedSubTask.data
                    const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    if (index > -1) {
                        subtasks.splice(index, 1, updatedSubTask);
                    }
                    this._subtask.next(subtasks)
                    return updatedSubTask;
                })
            ))
        );
    }

    subtaskUpdateTaskPriority(priorityId: any, subtaskId: number): Observable<Task> {
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl + 'api/subtask_priority/' + subtaskId, { priority: priorityId }).pipe(
                map((updatedSubTask: any) => {
                    updatedSubTask = updatedSubTask.data
                    const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    if (index > -1) {
                        subtasks.splice(index, 1, updatedSubTask);
                    }
                    this._subtask.next(subtasks)
                    return updatedSubTask;
                })
            ))
        );
    }


    updateSubtaskTitle(title: any, subtaskId: number): Observable<Task> {
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl + 'api/subtask_title/' + subtaskId, { title: title }).pipe(
                map((updatedSubTask: any) => {
                    updatedSubTask = updatedSubTask.data
                    const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    if (index > -1) {
                        subtasks.splice(index, 1, updatedSubTask);
                    }
                    this._subtask.next(subtasks)
                    return updatedSubTask;
                })
            ))
        );
    }

    subtaskUpdateTaskDeadline(deadline: any, subtaskId: number): Observable<Task> {
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.post<any>(this.apiUrl + 'api/subtask_deadline/' + subtaskId, { deadline: deadline }).pipe(
                map((updatedSubTask: any) => {
                    updatedSubTask = updatedSubTask.data
                    // const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    // if (index > -1) {
                    //     subtasks.splice(index, 1, updatedSubTask);
                    // }
                    this._subtask.next(updatedSubTask)
                    return updatedSubTask;
                })
            ))
        );
    }


    storeSubtask(data): Observable<Task> {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.subtasks$.pipe(
                take(1),
                switchMap(subtasks => this._httpClient.post<Task>(this.apiUrl + 'api/subtask/store', { ...data, board_id: board.id }).pipe(
                    first(),
                    map((newSubTask: any) => {
                        this._subtask.next([...subtasks, newSubTask.data])
                        return newSubTask;
                    })
                ))
            ))
        )
    }

    deleteSubtask(subtaskId: number): Observable<Task> {
        return this.subtasks$.pipe(
            take(1),
            switchMap(subtasks => this._httpClient.delete<Task>(this.apiUrl + 'api/subtask/delete/' + subtaskId).pipe(
                map((deletedSubtask: any) => {
                    const taskindex = subtasks.findIndex(x => x.id === subtaskId);
                    subtasks.splice(taskindex, 1);
                    this._subtask.next([...subtasks])
                    return deletedSubtask;
                    // updatedSubTask= updatedSubTask.data
                    // const index = subtasks.findIndex(d => d.id === updatedSubTask.id);
                    // if(index > -1){
                    //     subtasks.splice(index,1,updatedSubTask);
                    // }
                    // this._subtask.next(subtasks)
                    // return updatedSubTask;
                })
            ))
        );
    }

    openAssignPopup() {
        const dialogRef = this._dialog.open(JoinTaskDialogComponent, {
            width: '350px',
            height: '300px',
        });
    }




    handlePosherActions(data: { board: number, task_resource: Task, task: number, board_order: string, status: string, current_user: any }) {
        return this.currentBoard$.pipe(
            first(),
            switchMap(board => this.tasks$.pipe(
                take(1),
                switchMap(tasks => this._userService.user$.pipe(
                    first(),
                    map(user => {
                        if (data.current_user !== user.id) {
                            if (+data.board === +board.id) {
                                this.handelStatusRealTime(data.status, tasks, data.board_order, data.task_resource)
                            }
                        }
                        return data.task;
                    })
                ))
                // switchMap((tasks: any) => {
                //     debugger;
                //     if(+data.board === +board.id){
                //         this.handelStatusRealTime(data.status,tasks,data.board_order,data.task_resource)
                //     }
                //     return data.task;
                // })
            ))
        )
    }

    handelStatusRealTime(status: string, tasks: Task[], board_order: string, data?: any) {
        switch (status.toLowerCase()) {
            case "delete":
                const deletedTaskIndex = tasks.findIndex(x => x.id === +data);
                if (deletedTaskIndex > -1) {
                    tasks.splice(deletedTaskIndex, 1);
                    this._tasks.next([...tasks])
                    this._taskOrder.next(board_order)
                }
                break;
            case "update":
                const checklistIndex = tasks.findIndex(d => d.id === data.id);
                if (checklistIndex > -1) {
                    tasks.splice(checklistIndex, 1, data);
                }
                this._tasks.next(tasks)
                this._taskOrder.next(board_order)
                // code block
                break;
            case "add":
                const addedId = tasks.findIndex(x => x.id === data.id);
                if (addedId < 0) {
                    tasks = [...tasks, data]
                    this._tasks.next(tasks);
                    this._taskOrder.next(board_order)
                }
            default:

        }
    }
    //vyn
    handleSingTaskRealtimeFunction(data) {
        this.handleObservables(data).subscribe(res => {

        })
    }
    //vyn
    handleObservables(data) {
        switch (data.status.toLowerCase()) {
            case "checklist":
                return this.tasks$.pipe(
                    first(),
                    switchMap(tasks => this.taskSelected$.pipe(
                        take(1),
                        switchMap(task => this._userService.user$.pipe(
                            take(1),
                            map(user => {
                                if (data.current_user !== user.id) {
                                    if (task.id === +data.task) {
                                        this.handelStatusRealTimeSingleTime(tasks, task, data.action, data.status, data.checklist, data.comments, data.users_assigned, data.current_user)
                                    }
                                }
                                return data.task;
                            })
                        )
                        ))
                    ))
                break;
            case "comment":
                return this.taskSelectedComments$.pipe(
                    switchMap(taskcomments => this.taskSelected$.pipe(
                        take(1),
                        switchMap(task => this._userService.user$.pipe(
                            map(user => {
                                if (data.current_user !== user.id) {
                                    this.handelRealTimeComments(taskcomments, task, data.action, data.status, data.checklist, data.comments, data.users_assigned)
                                }
                                return data.task;
                            })
                        ))
                    ))
                )

                break;
            case "assign_user":
                return this.tasks$.pipe(
                    switchMap(alltasks => this.taskSelected$.pipe(
                        take(1),
                        switchMap(task => this._userService.user$.pipe(
                            map(user => {
                                if (data.current_user !== user.id) {
                                    this.handelRealTimeUserAssign(alltasks, task, data.action, data.status, data.checklist, data.comments, data.users_assigned)
                                }
                                return data.task;

                            })
                        ))
                    ))
                )
                break;

        }
    }


    handleSingTaskRealtime(data: { action: string; status: string, checklist: TaskCheckList, comments: any, task: string, users_assigned: any }) {
        switch (data.status.toLowerCase()) {
            case "checklist":
                return this.tasks$.pipe(
                    switchMap(tasks => this.taskSelected$.pipe(
                        take(1),
                        switchMap((task: any) => {
                            if (task.id === +data.task) {
                                this.handelStatusRealTimeSingleTime(tasks, task, data.action, data.status, data.checklist, data.comments, data.users_assigned)
                            }
                            return data.task;
                        })
                    ))
                )
                break;
            case "comments":
                return this.taskSelectedComments$.pipe(
                    switchMap(taskcomments => this.taskSelected$.pipe(
                        take(1),
                        map((task: any) => {
                            this.handelRealTimeComments(taskcomments, task, data.action, data.status, data.checklist, data.comments, data.users_assigned)
                            return data.task;
                        })
                    ))
                )

                break;
            case "users_assigned":
                return this.tasks$.pipe(
                    switchMap(alltasks => this.taskSelected$.pipe(
                        take(1),
                        map((task: any) => {
                            this.handelRealTimeUserAssign(alltasks, task, data.action, data.status, data.checklist, data.comments, data.users_assigned)
                            return data.task;
                        })
                    ))
                )
                break;

        }





    }
    //vyn
    handelStatusRealTimeSingleTime(alltasks: Task[], task: Task, action: string, status: string, checklist?: any, comments?: any, users_assigned?: any, current_user?: any) {
        switch (action.toLocaleLowerCase()) {
            case "add":
                const newCheckList = task.checklists.findIndex(x => x.id === checklist.id);
                if (newCheckList < 0) {
                    task.checklists = [...task.checklists, checklist]
                    const taskIndex = alltasks.findIndex(x => +x.id === +task.id);
                    alltasks[taskIndex] = task;
                }
                this._taskSelected.next(task)
                this._tasks.next(alltasks)
                break;
            case "update":
                const updatedCheckList = task.checklists.findIndex(x => x.id === checklist.id);
                if (updatedCheckList > -1) {
                    const taskIndex = alltasks.findIndex(x => +x.id === +task.id);
                    task.checklists.splice(updatedCheckList, 1, checklist);
                    alltasks[taskIndex] = task
                }
                this._taskSelected.next(task)
                this._tasks.next(alltasks)
                break;

            case "delete":
                const deleteCheckList = task.checklists.findIndex(x => x.id === checklist.id);
                if (deleteCheckList > -1) {
                    const taskIndex = alltasks.findIndex(x => +x.id === +task.id);
                    task.checklists.splice(deleteCheckList, 1)
                    alltasks[taskIndex] = task
                }
                this._taskSelected.next(task)
                this._tasks.next(alltasks)
                break;
            default:
        }
    }


    //vyn
    handelRealTimeComments(allcomments: Comments[], task: Task, action: string, status: string, checklist?: any, comments?: any, users_assigned?: any) {
        switch (action.toLocaleLowerCase()) {
            case "add":
                const newComment = allcomments.findIndex(x => x.id === comments.id);
                if (newComment < 0) {
                    allcomments = [...allcomments, comments]
                    this._taskSelectedcomments.next(allcomments);
                }
                break;
            case "update":
                const updatedComment = allcomments.findIndex(x => x.id === comments.id);
                if (updatedComment > -1) {
                    allcomments.splice(updatedComment, 1, comments);
                    this._taskSelectedcomments.next(allcomments);
                }
                break;

            case "delete":
                const deleteComment = allcomments.findIndex(x => x.id === comments.id);
                if (deleteComment > -1) {
                    const taskIndex = allcomments.findIndex(x => +x.id === +task.id);
                    allcomments.splice(deleteComment, 1)
                    this._taskSelectedcomments.next(allcomments);
                }
                break;
            default:
        }
    }



    //vyn
    handelRealTimeUserAssign(alltasks: Task[], task: Task, action: string, status: string, checklist?: any, comments?: any, users_assigned?: any) {
        debugger;
        switch (action.toLocaleLowerCase()) {
            case "add":

                break;
            case "update":
                const updatedUserAssign = task.users_assigned.findIndex(x => x === +users_assigned);
                if (updatedUserAssign < 0) {
                    debugger;
                    task.users_assigned = [...task.users_assigned, +users_assigned];
                    const taskIndex = alltasks.findIndex(x => +x.id === +task.id);
                    alltasks[taskIndex] = task
                    this._taskSelected.next(task);
                    this._tasks.next(alltasks);
                } else {
                    const taskIndex = alltasks.findIndex(x => +x.id === +task.id);
                    task.users_assigned = task.users_assigned.splice(updatedUserAssign, 1)
                    alltasks[taskIndex] = task
                    this._taskSelected.next(task);
                    this._tasks.next(alltasks);
                }
                break;

            case "delete":

                break;
            default:
        }
    }



    userAssignedInBoard(data: any) {
        this._boardUsers.next(data.assigned);
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
