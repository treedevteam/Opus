import { environment } from 'environments/environment';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { Task, Users } from '../../_models/task';
import { TaskServiceService } from '../../_services/task-service.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { combineLatest, debounceTime, filter, map, shareReplay, Subject, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
  @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
  apiUrl = environment.apiUrl
  taskSeleced:Task|any;
  taskOrSubtask = "";
  taskForm: FormGroup;
  filteredTags: Task[];
  tagsEditMode: boolean = false;
  tags: Task[];
  private _tagsPanelOverlayRef: OverlayRef;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _normalView: NormalViewComponent,
    private _kanbanView: KanbanViewComponent,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedroute :ActivatedRoute,
        private _taskService: TaskServiceService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        
        ) {
        }

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  filteredUsers$ = this._taskService.users$;
  
  taskSelected$ = this._taskService.taskSelectedDetails$


  ngOnInit(): void {
    this.taskForm = this._formBuilder.group({
      checklist:'',
      file:['']
  });
    //dont touch
    this._activatedroute.data.subscribe(res=>{
      this.taskOrSubtask = res.component

      if(res.component === "normal"){
        this._normalView.matDrawer.open();
      }else{
        this._kanbanView.matDrawer.open();
      }
    })

    this._taskService.taskSelectedDetails$.subscribe(res=>{
      this.taskSeleced = res;
    })
    


  }

  ngAfterViewInit(): void
  {
    // this._normal.matDrawer.open();
  }

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
  }


  closeDrawer(): Promise<MatDrawerToggleResult>
    {
      return this.taskOrSubtask === "normal" ? this._normalView.matDrawer.close() : this._kanbanView.matDrawer.close()
  }


  addNewCheckList(){
    this._taskService.addNewCheckListItem(
      {text: this.taskForm.get('checklist').value, task_id: this.taskSeleced.id}
      ).subscribe(()=> this.taskForm.get('checklist').setValue('')
      );
  }

  
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
              this._taskService.deleteTask(this.taskSeleced.id, +this.taskSeleced.departments)
                  .subscribe((res) => {
                      this.closeDrawer().then(() => true);
                      this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                  },(err)=>{
                      console.log(err);

                  });

              // Mark for check
              this._changeDetectorRef.markForCheck();
          }
      });
  }

  closeTaskDetails(){
    this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    this.closeDrawer();
  }

  deleteCheckList(id:number){
    this._taskService.deletedCheckListItem(id,this.taskSeleced.id).subscribe();
  }

  isAllSelected(item) {
    this.taskSeleced.checklists.forEach((val) => {
      if (val.id === item.id) {
        if(item.value){
          this._taskService.editCheckList(item.id, {value: 0, text: item.text, task_id: this.taskSeleced.id}).subscribe();
        }else{
            this._taskService.editCheckList(item.id, {value: 1, text: item.text, task_id: this.taskSeleced.id}).subscribe();
        }
      };
    });
  }
   






























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
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
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

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.taskSeleced.find(id => id.id === tag.id);

        // If the found tag is already applied to the task...
        if ( isTagApplied )
        {
            // Remove the tag from the task
        }
        else
        {
            // Otherwise add the tag to the task
        }
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