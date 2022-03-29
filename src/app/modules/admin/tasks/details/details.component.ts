import { Priorities } from './../../priorities/model/priorities';
import { TasksService } from './../tasks.service';
import { TasksListComponent } from './../list/list.component';
import { Tag, Task, Task2, TaskComment } from './../tasks.types';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { combineLatest, debounceTime, filter, map, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { assign } from 'lodash-es';
import * as moment from 'moment';
import { Status } from '../../statuses/model/status';
import { Location } from '../../locations/model/location';
import { Users } from '../../users/model/users';
import { Departments } from '../../departments/departments.types';
import { TaskCheckList } from '../tasks.types';
import { environment } from 'environments/environment';

@Component({
    selector       : 'tasks-details',
    templateUrl    : './details.component.html',
    styleUrls      : ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDetailsComponent implements OnInit, AfterViewInit, OnDestroy
{
    apiUrl = environment.apiUrl;

    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;
    departments: Departments[];
    priorities: Priorities[];
    statuses: Status[];
    locations: Location[];
    filteredUsers: Users[];
    usersList: Users[];
    usersAssignedSelected: number[];
    isXyzChecked = true; 

    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags2: Departments[];
    filteredTags: Tag[];
    task: Task;
    task2: Task2;
    taskForm: FormGroup;
    tasks: Task[];

    checkListtotal = 0
    checkListcompleted = 0;
    // taskComments$ = this._tasksService.taskComments$;

    checkList: TaskCheckList[];



    taskComments: TaskComment[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _usersPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    taskCheckList$ = this._tasksService.taskCheckListservice$
    
     
    

    






    taskComments$ = combineLatest([
        this._tasksService.taskComments$,
        this._tasksService.taskComment$,
        this._tasksService.getUsersData$,
        this._tasksService.deletedComment$
    ],(g,p,u,de) => {
        if(p){
            g.unshift(p);
        }else if(de){
            const index = g.findIndex(x => x.id === de);
            if (index > -1) g.splice(index, 1);
        }
        let d = null;
        if(g){
            d = g.map(res=>({
                ...res,
                user_id: u.find(user => user.id === res.user_id)
            }))
        }
        console.log(d);
        return d?d : g;
     })
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _tasksListComponent: TasksListComponent,
        private _tasksService: TasksService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private route: ActivatedRoute
    )
    {
       
    }
    
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void
    {

        // Open the drawer
        this._tasksListComponent.matDrawer.open();

        // Create the task form
        this.taskForm = this._formBuilder.group({
            id       : [''],
            title     : [''], //
            deadline    : [''],
            raport    : [''],
            restrictions: [''],
            description  : [''],//
            status : [0],
            priority     : [[]],
            location    : [0],
            user    : [0],
            departments: [],
            has_expired    : [0],
            users_assigned    : [[]],
            newComment: '',
            checklist:''
        });


        
        // Get the departmetns
        this._tasksService.getDepartmentsData$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((departmetns: Departments[]) => {
            console.log(departmetns, "Deaprtments");
            this.departments = departmetns;
            this.filteredTags2 = departmetns;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Get the departmetns
        // this._tasksService.getUsersData$
        // .pipe(takeUntil(this._unsubscribeAll))
        // .subscribe((usersList: Users[]) => {
        //     this.usersList = usersList;
        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
       
       
            // Get the statuses
        this._tasksService.getStatus$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((status: Status[]) => {
            this.statuses = status;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

            // Get the locations
            this._tasksService.getLocation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((location: Location[]) => {
                this.locations = location;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            // Get the priorities
        this._tasksService.priorities$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((priorities: Priorities[]) => {
            this.priorities = priorities;
            // Mark for check
        });

        // Get the tasks
        this._tasksService.tasks$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks: Task[]) => {
                this.tasks = tasks;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the task
        this._tasksService.task$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((task: Task) => {

                // Open the drawer in case it is closed
                this._tasksListComponent.matDrawer.open();

                // Get the task
                this.task = task;

                // Patch values to the form from the task
                this.taskForm.patchValue(task, {emitEvent: false});

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            // Get the task
        this._tasksService.taskById$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((task: Task2) => {


            // Open the drawer in case it is closed
            this._tasksListComponent.matDrawer.open();

            // Get the task
            this.task2 = task;
            console.log(this.task2,'this.task2');

            console.log(this.task2);
            this._tasksService.getUsersDepartment(+this.task2.departments).subscribe(res=>{
                this.usersList = res;
            })

            this._tasksService.getTaskComments(+this.task2.id).subscribe(res=>{
            });

            this._tasksService.getTaskCheckList(+this.task2.id).subscribe(res=>{
                this.checkListtotal = res.length;
                this.checkListcompleted = res.filter(x=> x.value === 1).length;
            });
            
            // Patch values to the form from the task
            this.taskForm.patchValue(task, {emitEvent: false});

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

       



        // Update task when there is a value change on the task form
        this.taskForm.valueChanges
            .pipe(
                tap((value) => {

                    // Update the task object
                    this.task = assign(this.task, value);
                }),
                debounceTime(300),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value) => {

                // Update the task on the server
                // this._tasksService.updateTask(value.id, value).subscribe();

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for NavigationEnd event to focus on the title field
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => {

                // Focus on the title field
                this._titleField.nativeElement.focus();
            });
    }
  

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._tasksListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

                // Focus on the title element
                this._titleField.nativeElement.focus();
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

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }


        if ( this._usersPanelOverlayRef )
        {
            this._usersPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    addComment(): any{

    }
    /**
     * Close the drawer
     */

     isAllSelected(item) {
         this.taskCheckList$.subscribe(res=>{
             this.checkList = res;
              this.checkListtotal = res.length;
                this.checkListcompleted = res.filter(x=> x.value === 1).length;
             console.log(res,"TETETETETETEETETETETETET");
         })
        this.checkList.forEach(val => {
          if (val.id === item.id) {
                if(item.value){
                    this._tasksService.editCheckList({value: 0, text: item.text, task_id: this.taskForm.get('id').value}, item.id).subscribe(res=>{
                        console.log(res);
                    });
                }else{
                    this._tasksService.editCheckList({value: 1, text: item.text, task_id: this.taskForm.get('id').value}, item.id).subscribe(res=>{
                        console.log(res);
                    });
                }
            };

        });
      }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._tasksListComponent.matDrawer.close();
    }

    getAssignedUsers(ids): Users[]{
        return ids.map(res => this.usersList.find(x => x.id === res));
    }

    getNameOfDepartmentbyId(): string{
        const id = this.taskForm.get('departments').value;
        const item = this.departments.find(r => +r.id === +id).name;
       return item;
   }
    /**
     * Toggle the completed status
     */
    toggleCompleted(): void
    {
        // Get the form control for 'completed'
        const completedFormControl = this.taskForm.get('completed');

        // Toggle the completed status
        completedFormControl.setValue(!completedFormControl.value);
    }

    userCheck(user: any): boolean{
      
        if(this.task2.users_assigned.includes(user)){
            return true;
        }else{
            return false;
        }
    }
    /**
     * Open tags panel
     */
    openTagsPanel(): void
    {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
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
        this._tagsPanelOverlayRef.attachments().subscribe(() => {

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {

            // If overlay exists and attached...
            if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }
    addItem(newItem: string) {
        alert('Detalis comp');
      }

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
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
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
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags2 = this.departments.filter(tag => tag.name.toLowerCase().includes(value));
    }

    filterDepartments(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredUsers = this.usersList.filter(tag => tag.name.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.task.tags.find(id => id === tag.id);

        // If the found tag is already applied to the task...
        if ( isTagApplied )
        {
            // Remove the tag from the task
            this.deleteTagFromTask(tag);
        }
        else
        {
            // Otherwise add the tag to the task
            this.addTagToTask(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._tasksService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the task
                this.addTagToTask(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._tasksService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void
    {
        // Delete the tag from the server
        this._tasksService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the task
     *
     * @param tag
     */
    addTagToTask(tag: Tag): void
    {

    }

    /**
     * Delete tag from the task
     *
     * @param tag
     */
    deleteTagFromTask(tag: Tag): void
    {
        // Remove the tag
        this.task2.departments.splice(this.task2.departments.findIndex(item => item === +tag.id), 1);

        // Update the task form
        this.taskForm.get('departments').patchValue(this.task2.departments);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle task tag
     *
     * @param tag
     */

    toggleTaskTag(tag: Tag): void
    {
        this.addTagToTask(tag);
    }

    addUsersToTask(userId: number): void{
        this._tasksService.assignUserTask(this.task2.id, userId).subscribe(res=>{
            console.log(res);
        })

        const usersAssigned = this.taskForm.get('users_assigned').value;
        const index = usersAssigned.findIndex(object => +object === +userId);
        if (index < 0) {
            usersAssigned.push(userId);
        }else{
            usersAssigned.splice(index,1);
        }
        this.taskForm.get('users_assigned').patchValue(usersAssigned);
        console.log(this.taskForm.get('users_assigned').value);
        
    }

    isUserSelected(id: number): boolean{
        const usersAssigned = this.taskForm.get('users_assigned').value;
        const index = usersAssigned.findIndex(object => +object === +id);
        if (index === -1) {
            return false;
        }else{
            return true;
        }
    }

    toggleTaskUser(user: number): void
    {
        this.addUsersToTask(user);
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Set the task priority
     *
     * @param priority
     */
    setTaskPriority(priority): void
    {
        // Set the value
        this.task2.priority = priority;
        this.taskForm.get('priority').setValue(priority);
    }

    setTaskstatus(status): void
    {
        // Set the value
        this.task2.status = status;
        this.taskForm.get('status').setValue(status);
    }

    setTaskLocation(location): void
    {
        // Set the value
        this.task2.location = location;
        this.taskForm.get('location').setValue(location);
    } 

    /**
     * Check if the task is overdue or not
     */
    isOverdue(): boolean
    {
        return moment(this.task2.deadline, moment.ISO_8601).isBefore(moment(), 'days');
    }
    setDeadline(time: any): void
    {
            this.task2.deadline = time;
            const convert = time._i.year + "-" + time._i.month + "-" + time._i.date + "  00:00"
            this.taskForm.get('deadline').setValue(convert);
    }

    /**
     * Delete the task
     */
    deleteTask(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete task',
            message: 'Are you sure you want to delete this task? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });
        // console.log(this.task2);
        
        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Delete the task
                this._tasksService.deleteTask(this.task2.id, +this.task2.departments)
                    .subscribe((res) => {
                        this.closeDrawer().then(() => true);
                        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
                    },err=>{
                        console.log(err);
                        
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    changeSubmitEventTask(): void{
        this.taskForm.get('users_assigned').patchValue("[" + this.taskForm.get('users_assigned').value +"]");
        this._tasksService.updateTaskservice(this.taskForm.value, this.task2.id).subscribe(res=>{
            this.closeDrawer().then(() => true);
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });

        },err=>{
        })
    }

    addCommentTask(){
        this._tasksService.storeComment({text: this.taskForm.get('newComment').value,task_id:this.taskForm.get('id').value},).subscribe(res=>{
            this.taskForm.get('newComment').setValue("");
        })
    }


    deleteCommentclick(id: number): void{

        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this._tasksService.deleteComment(id).subscribe(res=>{
                    console.log(res);
                })
            }
        });
    }

    addNewCheckList(): void{
        this._tasksService.addNewCheckListItem(
            {text: this.taskForm.get('checklist').value, task_id: this.taskForm.get('id').value}
            ).subscribe(()=> this.taskForm.get('checklist').setValue('')
            )
    }

    deleteCheckList(id: number): void{
        this._tasksService.deletedCheckListItem(id,this.taskForm.get('id').value).subscribe(()=>{
        });
    }

    navigateTo(): void{
        this.closeDrawer().then(() => true);
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
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
