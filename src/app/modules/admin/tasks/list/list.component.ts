import { TasksService } from '../tasks.service';
import { Tag, Task, Task2, TaskWithDepartment } from '../tasks.types';
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
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Users } from '../../users/model/users';
 
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
})

export class TasksListComponent implements OnInit, OnDestroy
{
    @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
    @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;

    apiUrl = environment.apiUrl;
    statusTask: Task2;
    subtaskTrigger: Task2;
    taskForm: FormGroup;
    userList: any[];
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    expandedSubtasks:number | null = null;
    controls: FormArray;
    subtaskControls: FormArray;

    getDepartments: Departments[];

    DeaprtmentsData$ = this._tasksService.departments$;
    statusData$ = this._tasksService.getStatus$;
    private _usersPanelOverlayRef: OverlayRef;
    filteredUsers: any[];

    drawerMode: 'side' | 'over';
    selectedTask: Task;
    tags: Tag[];
    tasks: Task[];
    myTask: TaskWithDepartment[];
    checklistCount: any = {
        completed : 0,
        total     : 0
    };

    tasksCount: any = {
        completed : 0,
        incomplete: 0,
        total     : 0
    };
    taskss: TaskWithDepartment[];

    


    tasksData$ = combineLatest([
        this._tasksService.currentDepartmentTasks$,
        this._tasksService.newTask$,
        this._tasksService.taskUpdated$,
        this._tasksService.deletedTask$
    ],(g,p,u,d) => {
         if(p){
             p.forEach(element => {
            //  const departments_index =  g.findIndex(g => g.id === +element.departments);
             if(g.id === +element.departments){
                    g.tasks.push(element);
                }
             });
         }
         else if(u){
            if(g.id === +u.departments){
                const updatedTaskId = g.tasks.findIndex(t => t.id === +u.id)
                if(updatedTaskId > -1){
                g.tasks.splice(updatedTaskId,1,u);
                }
            }
         }else if(d){
            if(g.id === +d.departments){
                const deletedTask = g.tasks.findIndex(t => t.id === +d.id)
                if(deletedTask > -1){
                    g.tasks.splice(deletedTask,1);
                }
            }
         }
       return g;
     });





     tasksDataCheckList$= combineLatest([
        this.tasksData$,
        this._tasksService.newCheckList$,
        this._tasksService.udatedCheckList$,
        this._tasksService.deletedCheckList$
    ],(tasksWithDepartment,newCL,updatedCL,deletedCL) => {
            if(newCL){
                tasksWithDepartment.tasks.find(t=>t.id === newCL.task_id)?.checklists.push(newCL);
            }else if(updatedCL){
                const taskIndex = tasksWithDepartment.tasks.findIndex(t=>t.id === updatedCL.task_id);
                if(taskIndex > -1){
                    const checkListIndex = tasksWithDepartment.tasks[taskIndex].checklists.findIndex(c => c.id === updatedCL.id);
                    if(checkListIndex > -1){
                        tasksWithDepartment.tasks[taskIndex].checklists.splice(checkListIndex,1,updatedCL);
                    }
                }
            }else if(deletedCL){
                const taskIndex = tasksWithDepartment.tasks.findIndex(t=>t.id === deletedCL.task_id);
                const checkListIndex = tasksWithDepartment.tasks[taskIndex].checklists.findIndex(c => c.id === deletedCL.id);
                if(checkListIndex > -1){
                    tasksWithDepartment.tasks[taskIndex].checklists.splice(checkListIndex,1);
                }
            }
        return tasksWithDepartment;
    });

    statuses = this._tasksService.getStatus$;
    priority = this._tasksService.getPriorities$;
    


    //  subtasksData$ = this._tasksService.subtasks$;
     subtasksData$ = combineLatest([
        this._tasksService.subtasksList$,
        this._tasksService.getStatus$,
        this._tasksService.getPriorities$,
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
        tap(res=>{
            const test = res.map(entity => {
                return new FormGroup({
                    title:  new FormControl(entity.title, Validators.required),
                    deadline:  new FormControl(entity.deadline, Validators.required),
                  },{updateOn: "blur"});
            })
            this.subtaskControls = new FormArray(test);
        })
      );

     departmentTasksWithStatusPriority$ = combineLatest([
        this.tasksDataCheckList$,
        this._tasksService.getStatus$,
        this._tasksService.getPriorities$,
        this._tasksService.getUsersData$
      ]).pipe(
        map(([tasksDepartment, statuses, priority,users]) =>(
            {
            ...tasksDepartment,
            tasks: [
                ...tasksDepartment.tasks.map(res=>({
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
        tap(res=>{
            const test = res.tasks.map(entity => {
                return new FormGroup({
                    title:  new FormControl(entity.title, Validators.required),
                    deadline:  new FormControl(entity.deadline, Validators.required),
                  },{updateOn: "blur"});
            })
            this.controls = new FormArray(test);
        })
        );


        // $controls = combineLatest([
        //     this.departmentTasksWithStatusPriority$
        // ],(g) => {
        //     return g;
        // });
           
   
    // tasksaks = this._tasksService.tasksWithDepartment$;

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
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _formBuilder: FormBuilder,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,


    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    triggerStatusMenu(task: Task2){
        this.statusTask = task;
    }

    triggerStatusSubtask(task: Task2){
        this.subtaskTrigger = task;
    }

    selectStatus(status: Status){
        this._tasksService.updateTaskStatus(status.id, this.statusTask.id).subscribe(res=>{
        })
    }
    selectPriority(priority: Priorities){
        this._tasksService.updateTaskPriority(priority.id, this.statusTask.id).subscribe(res=>{
        })
    }


    subtaskSelectStatus(status: Status){
        this._tasksService.subtaskUpdateTaskStatus(status.id, this.subtaskTrigger.id).subscribe(res=>{
        })
    }


    subtaskSelectPriority(priority: Priorities){
        console.log(this.subtaskTrigger);
        console.log(priority);
        
        this._tasksService.subtaskUpdateTaskPriority(priority.id, this.subtaskTrigger.id).subscribe(res=>{
        })
    }

    toggleTableRows(id: number) {
        if(this.expandedSubtasks === id){
            this.expandedSubtasks = null;
        }else{
            this._tasksService.getSubtasks(id).subscribe(res=>{
                console.log(res);
                this.expandedSubtasks = id;
            });
        }
    }

    ngOnInit(): void
    {
        this._tasksService.getUsersData$.subscribe(res=>{
            let depId: number;
            this._tasksService.currentDepartmentId$.subscribe(res=>{
                depId = res; 
            });
            this.userList = res.filter(x=>x.department_id === depId)
        })




        this.taskForm = this._formBuilder.group({
            deadline    : [''],
        });

        this._tasksService.taskCheckList$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((checkList: TaskCheckList[])=>{
                this.checklistCount.completed = checkList.filter(x => x.value === 1).length;
                this.checklistCount.total = checkList.length;
            });
            // .subscribe((tasks: Task[]) => {
            //     this.tasks = tasks;

            //     // Update the counts
            //     this.tasksCount.total = this.tasks.filter(task => task.type === 'task').length;
            //     this.tasksCount.completed = this.tasks.filter(task => task.type === 'task' && task.completed).length;
            //     this.tasksCount.incomplete = this.tasksCount.total - this.tasksCount.completed;
        //Get the departments
        // Get the tags
        this._tasksService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                this.tags = tags;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the tasks
        this._tasksService.tasks$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks: Task[]) => {
                this.tasks = tasks;

                // Update the counts
                this.tasksCount.total = this.tasks.filter(task => task.type === 'task').length;
                this.tasksCount.completed = this.tasks.filter(task => task.type === 'task' && task.completed).length;
                this.tasksCount.incomplete = this.tasksCount.total - this.tasksCount.completed;

                // Mark for check
                this._changeDetectorRef.markForCheck();

                // Update the count on the navigation
                setTimeout(() => {

                    // Get the component -> navigation data -> item
                    const mainNavigationComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

                    // If the main navigation component exists...
                    if ( mainNavigationComponent )
                    {
                        const mainNavigation = mainNavigationComponent.navigation;
                        const menuItem = this._fuseNavigationService.getItem('apps.tasks', mainNavigation);

                        // Update the subtitle of the item
                        // menuItem.subtitle = this.tasksCount.incomplete + ' remaining tasks';

                        // Refresh the navigation
                        mainNavigationComponent.refresh();
                    }
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

        // If there is no tag available...
       

        // If there is a tag...
    }

    // userCheck(user: any): boolean{
      
    //     if(this.task2.users_assigned.includes(user)){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    toggleTaskUser(user: number): void
    {
    }

    // addUsersToTask(userId: number): void{
    //     this._tasksService.assignUserTask(this.task2.id, userId).subscribe(res=>{
    //         const usersAssigned = this.taskForm.get('users_assigned').value;
    //         const index = usersAssigned.findIndex(object => +object === +userId);
    //         if (index < 0) {
    //             usersAssigned.push(userId);
    //         }else{
    //             usersAssigned.splice(index,1);
    //         }
    //         this.taskForm.get('users_assigned').patchValue(usersAssigned);
    //         console.log(this.taskForm.get('users_assigned').value);
    //     })

        
        
    // }
    openUsersPanel(): void
    {
        // this.filteredUsers = null;
        
        // this.userList = this.userList.map(user=>({
        //     ...user,
        //     checked: userAssigned.findIndex(x=>x.id === user.id) > -1 ? true: false
        // }));
        
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
        console.log(this.userList);
        
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredUsers = this.userList.filter(tag => tag.name.toLowerCase().includes(value));
        console.log(this.filteredUsers);
        
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
        this._tasksService.updateTask(task.id, task).subscribe();

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
        const convert = time._i.year + "-" + (time._i.month + 1) + "-" + time._i.date + "  00:00"
        return convert;
     }

    updateField(index, field,taskid) {
        const control = this.getControl(index, field);
        switch(field){
            case "title":
                this._tasksService.updateTaskTitle(control.value, taskid).subscribe(res=>{
                        console.log(res);
                })
                break;
            case "deadline":
                this._tasksService.updateTaskDeadline(this.convertDate(control.value), taskid).subscribe(res=>{
                    console.log(res);
                })
                break;
            default:
        }
        // if (control.valid) {
        //     this._tasksService.updateTaskTitle(control.value, taskid).subscribe(res=>{
        //         console.log(res);
        //     })
        // }
    }

    updateSubtaskField(index, field,taskid) {
        const control = this.getSubtaskControl(index, field);
        switch(field){
            case "title":
                this._tasksService.updateSubtaskTitle(control.value, taskid).subscribe(res=>{
                        console.log(res);
                })
                break;
            case "deadline":
                this._tasksService.subtaskUpdateTaskDeadline(this.convertDate(control.value), taskid).subscribe(res=>{
                    console.log(res);
                })
                break;
            default:
        }
        // if (control.valid) {
        //     this._tasksService.updateTaskTitle(control.value, taskid).subscribe(res=>{
        //         console.log(res);
        //     })
        // }
    }
    
    getControl(index, fieldName) {
        const a  = this.controls.at(index).get(fieldName) as FormControl;
        return this.controls.at(index).get(fieldName) as FormControl;
    }

    getSubtaskControl(index, fieldName) {
        const a  = this.subtaskControls.at(index).get(fieldName) as FormControl;
        return this.subtaskControls.at(index).get(fieldName) as FormControl;
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
