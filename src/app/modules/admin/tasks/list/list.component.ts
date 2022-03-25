import { TasksService } from './../tasks.service';
import { Tag, Task, TaskWithDepartment } from './../tasks.types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { catchError, combineLatest, EMPTY, filter, fromEvent, map, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Departments } from '../../departments/departments.types';
import { TaskCheckList } from '../tasks.types';
import { environment } from 'environments/environment';
 
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
    apiUrl = environment.apiUrl;

    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    expandedSubtasks:number | null = null;

    getDepartments: Departments[];

    DeaprtmentsData$ = this._tasksService.departments$;
    statusData$ = this._tasksService.getStatus$;

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



    //  subtasksData$ = this._tasksService.subtasks$;
     subtasksData$ = combineLatest([
        this._tasksService.subtasks$,
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
        tap(res=>console.log(res)
        )
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
        tap(res=>console.log(res,"taskat me prioritet")
        )
        );
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
        private _fuseNavigationService: FuseNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    htmlgeneration(id: number): void{
        alert(id);
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    isOverdue(data): boolean {
        return moment(data, moment.ISO_8601).isBefore(moment(), 'days');
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
