/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { TasksService } from '../tasks.service';
import { Tag, Task, Task2, TaskWithDepartment, Users } from '../tasks.types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, catchError, combineLatest, EMPTY, filter, fromEvent, map, shareReplay, Subject, takeUntil, tap, Subscription } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Departments } from '../../departments/departments.types';
import { TaskCheckList } from '../tasks.types';
import { environment } from 'environments/environment';
import { Status } from '../../statuses/model/status';
import { Priorities } from '../../priorities/model/priorities';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AsignUsersToBoardComponent } from '../asign-users-to-board/asign-users-to-board.component';
import { MatDialog } from '@angular/material/dialog';
import { OpenimageTaskComponent } from '../openimage-task/openimage-task.component';
import { TasksDetailsComponent } from '../details/details.component';
import { BoardsService } from '../../departments/boards/boards.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector       : 'tasks-list',
    templateUrl    : './list.component.html',
    styleUrls      : ['./list.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({ height: '0px', minHeight: '0' })),
          state('expanded', style({ height: '*' })),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    // providers :[TasksDetailsComponent],
})

export class TasksListComponent implements OnInit, OnDestroy
{
    apiUrl = environment.apiUrl;
    private _usersPanelOverlayRef: OverlayRef;
    drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild('shareTaskNgForm') shareTaskNgForm: NgForm;
    @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
    @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
    formShare: FormGroup;

    userId
    controls: FormArray;
    //Users
    usersList$ = this._tasksService.currentBoardUsers$;
    //Statuset
    statuses = this._tasksService.getStatus$;
    //Prioriteti
    priority = this._tasksService.getPriorities$;
    statusTask: Task2;

    //Departmetns
    getDepartments: Departments[];



    board_department: number;
    subtaskTrigger: Task2;
    expandedSubtasks: number | null = null;
    subtaskControls: FormArray;
    order;
    board_id: number;
    boardData$ = this._tasksService.currentBoard$;
    DeaprtmentsData$ = this._tasksService.departments$;
    statusData$ = this._tasksService.getStatus$;
    selectedTask: Task;
    filteredUsers: any[];
    myTask: TaskWithDepartment[];

    orderModified$ = this._tasksService.currentBoardOrderTasks$;

    departmentsWithBoard$ = combineLatest([
        this._tasksService.getDepartmentsData$,
        this._tasksService.getBoardsData$,
      ]).pipe(
        map(([departments,board]) =>
        departments.map(departmet =>({
            ...departmet,
            boards: board.filter(x=> +x.department_id === departmet.id)
            
        }))),
        shareReplay(1),
        tap((res)=>{
            console.log(res);
        })
      );

    tasksData$ = this._tasksService.currentBoardTasks$;
    tasksDataCheckList$= this.tasksData$;

    //Move to task Service
     subtasksData$ = combineLatest([
        this._tasksService.subtasksList$,
        this.statuses,
        this.priority,
        this._tasksService.getUsersData$
      ]).pipe(
        map(([subtasks, statuses, priority,users]) =>
        subtasks.map(subtask =>({
            ...subtask,
            status: statuses.find(s => +subtask.status === +s.id),
            priority: priority.find(p => +subtask.priority === +p.id),
            users_assigned: subtask.users_assigned.map(u => (
                users.find(user => u === +user.id)
            ))
        }))),
        shareReplay(1),
        tap((res)=>{
            const test = res.map(entity => new FormGroup({
                    title:  new FormControl(entity.title, Validators.required),
                    deadline:  new FormControl(entity.deadline, Validators.required),
                  },{updateOn: 'blur'}));
            this.subtaskControls = new FormArray(test);
        })
      );

      //   move to task service
     departmentTasksWithStatusPriority$ = combineLatest([
        this._tasksService.currentBoard$,
        this.tasksDataCheckList$,
        this.statuses,
        this.priority,
        this._tasksService.getUsersData$
      ]).pipe(
        map(([currentBoard,tasksBoard, statuses, priority,users]) =>(
            {
            ...currentBoard,
            tasks: [
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
            ]
        })),
        shareReplay(1),
        tap((res)=>{
            this.board_department = +res.department_id;
            const test = res.tasks.map(entity => new FormGroup({
                    title:  new FormControl(entity.title, Validators.required),
                    deadline:  new FormControl(entity.deadline, Validators.required),
                  },{updateOn: 'blur'}));
            this.controls = new FormArray(test);
        })
        );
        
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _tasksService: TasksService,
        private _boardsService: BoardsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private dialog: MatDialog,
        private userService: UserService,


    )
    {
    }

    

    toggleTableRows(id: number) {
        if(this.expandedSubtasks === id){
            this.expandedSubtasks = null;
        }else{
            this._tasksService.getSubtasks(id).subscribe((res)=>{
                console.log(res);
                this.expandedSubtasks = id;
            });
        }
    }


    ngOnInit(): void
    {
        //fORM
        this.formShare = this._formBuilder.group({
            boards: [''],
        });
        //Order i taskave subsribe
        this.orderModified$.subscribe((res)=>{
            this.order = res;
        });

        //Users
        this._tasksService.getUsersData$.subscribe((res)=>{
            let boardId: number;
            this._tasksService.currentBoard$.subscribe((res)=>{
                boardId = res.id;
                this.board_id = res.id;
            });
            this._tasksService.getUsersBoard(boardId).subscribe((res)=>{
            });
        });

        // Get the task
        this._tasksService.task$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((task: Task) => {
                this.selectedTask = task;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/' || event.key === '.') // '/' or '.' key
                )
            )
            .subscribe((event: KeyboardEvent) => {

                // If the '/' pressed
                if ( event.key === '/' )
                {
                    this.createTask('task');
                }

                // If the '.' pressed
                if ( event.key === '.' )
                {
                    this.createTask('section');
                }
            });

            this.userService.user$.subscribe((res)=>{
                this.userId = res.id;
            } )
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        if ( this._usersPanelOverlayRef )
        {
            this._usersPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    isOverdue(data): boolean {
        return moment(data, moment.ISO_8601).isBefore(moment(), 'days');
    }
    
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }
    }

    //Sna duhet permomentin
    openUsersPanel(): void
    {
        // Create the overlay
        this._usersPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._usersPanelOrigin.nativeElement)
                                  .withFlexibleDimensions(true)
                                  .withViewportMargin(64)
                                  .withLockedPosition(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });

        // Subscribe to the attachments observable
        this._usersPanelOverlayRef.attachments().subscribe(() => {

            // Focus to the search input once the overlay has been attached
            this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._usersPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._usersPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._usersPanelOverlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if ( this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._usersPanelOverlayRef.detach();

                // Reset the tag filter
                // this.filteredTags = this.tags;

                // Toggle the edit mode off
                // this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    filterDepartments(event): void
    {
        console.log(this.usersList$);

        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        // this.filteredUsers = this.usersList.filter(tag => tag.name.toLowerCase().includes(value));
        // console.log(this.filteredUsers);

    }
    assignUserToBoard(userId: number){
        debugger;
     this._tasksService.assignUserToBoard(this.board_id , userId).subscribe((res)=>{
        console.warn(res);
     })
      }
    /**
     * Create task
     *
     * @param type
     */
    createTask(type: 'task' | 'section'): void
    {
        // Create the task
        this._tasksService.createTask(type).subscribe((newTask) => {

            // Go to the new task
            this._router.navigate(['./', newTask.id], {relativeTo: this._activatedRoute});

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Toggle the completed status
     * of the given task
     *
     * @param task
     */
    toggleCompleted(task: Task): void
    {
        // Toggle the completed status
        task.completed = !task.completed;

        // Update the task on the server
        // this._tasksService.updateTask(task.id, task).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    // addTask(){
    //     this._router
    // }

    /**
     * Task dropped
     *
     * @param event
     */
    dropped(event: CdkDragDrop<Task[]>): void
    {
        // Move the item in the array
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        // Save the new order
        this._tasksService.updateTasksOrders(event.container.data).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    collapseSubTasks(id: number){
        alert(id);
    }

    onOpenMenu(menu: any): void {
        // menu doesn't have any openMenu() function
        // which is of course not a trigger object but a menu itself.
        console.log(menu);
    }

    convertDate(time: any): string
    {
    const convert = time._i.year + '-' + (time._i.month + 1) + '-' + time._i.date + '  00:00';
    return convert;
    }

    updateField(index, field,taskid) {
        const control = this.getControl(index, field);
        switch(field){
            case "title":
                this._tasksService.updateTaskTitle(control.value, taskid, this.board_id).subscribe(res=>{
                        console.log(res);
                });
                break;
            case "deadline":
                this._tasksService.updateTaskDeadline(this.convertDate(control.value), taskid,this.board_id).subscribe(res=>{
                    console.log(res);
                });
                break;
            default:
        }
    }

    updateSubtaskField(index, field,taskid) {
        const control = this.getSubtaskControl(index, field);
        switch(field){
            case 'title':
                this._tasksService.updateSubtaskTitle(control.value, taskid).subscribe((res)=>{
                        console.log(res);
                });
                break;
            case 'deadline':
                this._tasksService.subtaskUpdateTaskDeadline(this.convertDate(control.value), taskid).subscribe((res)=>{
                    console.log(res);
                });
                break;
            default:
        }
    }

    getControl(index, fieldName) {
        const a  = this.controls.at(index).get(fieldName) as FormControl;
        return this.controls.at(index).get(fieldName) as FormControl;
    }

    getSubtaskControl(index, fieldName) {
        const a  = this.subtaskControls.at(index).get(fieldName) as FormControl;
        return this.subtaskControls.at(index).get(fieldName) as FormControl;
    }

    assignUserPopup(): void {
        this._tasksService.getUsersDepartment(this.board_department).subscribe((res)=>{
            const dialogRef = this.dialog.open(AsignUsersToBoardComponent, {
                width: '100%',
                maxWidth:'700px',
                height:'400px',
                maxHeight:'100%'
              });

              dialogRef.afterClosed().subscribe((result) => {
              });
        });
      }

    sahreTaskPopover(){
    this._tasksService.getDepartmentsData$.subscribe(res=>{
        
    })
    }


    onSubmit(id: number){
        if (this.formShare.valid) {
        console.log(this.formShare.value);
        }
    }
    openImagePopup(file)
    {
    console.log(file);
    this.dialog.open(OpenimageTaskComponent, {
        width: '50vh',
        height:'50vh',
        data:{
            file:file
        }

    })
    }
    menuOpened() {
        console.log('menuOpened @configbug')
    }
    getAssignedUsers(assignedUsers: Users[]): Users[]{
        return assignedUsers.slice(0, 5)
    }




    //Selected Task
    triggerStatusMenu(task: Task2){
        this.statusTask = task;
    }
    //Selected SubTask
    triggerStatusSubtask(task: Task2){
        this.subtaskTrigger = task;
    }
    selectStatus(status: Status){
        this._tasksService.updateTaskStatus(status.id,this.order,this.board_id, this.statusTask.id).subscribe((res)=>{
        });
    }
    selectPriority(priority: Priorities){
        this._tasksService.updateTaskPriority(priority.id, this.statusTask.id, this.board_id).subscribe(res=>{
        });
    }
    subtaskSelectStatus(status: Status){
        this._tasksService.subtaskUpdateTaskStatus(status.id, this.subtaskTrigger.id).subscribe((res)=>{
        });
    }
    subtaskSelectPriority(priority: Priorities){
        this._tasksService.subtaskUpdateTaskPriority(priority.id, this.subtaskTrigger.id).subscribe((res)=>{
        });
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
