import {  Overlay, OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { KanbanViewComponent } from '../../task-views/kanban-view/kanban-view.component';
import { NormalViewComponent } from '../../task-views/normal-view/normal-view.component';
import { TaskServiceService } from '../../_services/task-service.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Task } from '../../_models/task';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation/confirmation.service';
import { TemplatePortal } from '@angular/cdk/portal';
@Component({
  selector: 'app-subtask-details',
  templateUrl: './subtask-details.component.html',
  styleUrls: ['./subtask-details.component.scss']
})
export class SubtaskDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    private _tagsPanelOverlayRef: OverlayRef;
    boardUsers$= this._taskService.boardUsers$;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    taskOrSubtask = "";
    subtasks:Task



  
    subtaskSelected$ = this._taskService.subtaskSelected$;
    constructor(
        private _normalView: NormalViewComponent,
        private _kanbanView: KanbanViewComponent,
        private _activatedroute: ActivatedRoute,
        private _taskService: TaskServiceService,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private eRef : ElementRef,
        private _activatedRoute : ActivatedRoute

    ) { }
    public text: String;
    @HostListener('document:click', ['$event'])
    clickout(event: { target: any; }) {
      if(!this.eRef.nativeElement.contains(event.target)) {
          this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
          this.closeDrawer();
      }
    }
   
    
    ngOnInit(): void {
       this._taskService.subtaskSelected$.subscribe(res=>{
        this.subtasks = res
      })
        //dont touch
          this._activatedroute.data.subscribe(res=>{
            this.taskOrSubtask = res.component
            if(res.component === "normal"){
              this._normalView.matDrawer.open();
            }else{
              this._kanbanView.matDrawer.open();
            }
          })


    }



    addUsersToTask(userId: number): void{
      this._taskService.assignUserSubtask(this.subtasks.id, userId).subscribe((res)=>{
        
      });
    }

    toggleTaskUser(user: number): void
    {
        this.addUsersToTask(user);
    }
  
    userCheck(user: any): boolean{
      const index = this.subtasks.users_assigned.map(x=>x).findIndex(x=>x === user)
      if(index >= 0){
          return true;
      }else{
          return false;
      }
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
              // this.filteredTags = this.tags;

              // // Toggle the edit mode off
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

    ngAfterViewInit(): void
    {
    }

    ngOnDestroy(): void
    {
        this.closeDrawer();
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    closeTaskDetails(){
      this._router.navigate(['../../'], { relativeTo: this._activatedroute });
      this.closeDrawer();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>
    {
      return this.taskOrSubtask === "normal" ? this._normalView.matDrawer.close() : this._kanbanView.matDrawer.close()
    }

    deleteSubtaskTask(){
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title  : 'Delete subtask',
        message: 'Are you sure you want to delete this subtask? This action cannot be undone!',
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
            this._taskService.deleteSubtask(this.subtasks.id)
                .subscribe((res) => {
                    this.closeDrawer().then(() => true);
                    this._router.navigate(['../../'], { relativeTo: this._activatedroute });
                },(err)=>{
                    console.log(err);

                });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
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
