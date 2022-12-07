import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Card, List } from 'app/modules/admin/tasks/kanban-view/kanban-board/scrumboard.models';
import moment from 'moment';
import { combineLatest, map, shareReplay, tap } from 'rxjs';
import { TaskServiceService } from '../../../_services/task-service.service';
import { ScrumboardService } from '../scrumboard.service';
import { FuseConfirmationService } from '../../../../../../../@fuse/services/confirmation/confirmation.service';
import { TaskOrSub } from 'app/modules/admin/tasks/kanban-view/kanban-board/board/add-card/add-card.component';

@Component({
  selector: 'app-tasklist-kanban-layout',
  templateUrl: './tasklist-kanban-layout.component.html',
  styleUrls: ['./tasklist-kanban-layout.component.scss']
})
export class TasklistKanbanLayoutComponent implements OnInit {
    @ViewChild('shareTaskNgForm') shareTaskNgForm: NgForm;

    formShare: FormGroup;
  allTasks$ = combineLatest([
    this._taskService.allTasks$,
    this._taskService.getStatus$,
    this._taskService.orderModified$
  ]).pipe(
    tap(res=>{
        console.log(res);
    }),
    map(([currentBoardTasks, getStatus, getOrderTasks]) =>(
        getStatus.map(s=>(
            {
                ...s,
                order:getOrderTasks,
                status : s,
                tasks: currentBoardTasks.filter(x=>x.status.id === s.id).sort(function(a,b){
                    return getOrderTasks.indexOf(a.id) - getOrderTasks.indexOf(b.id);
                })
            }
        ))
    )),
    shareReplay(1),
    tap(res=>console.log(res,'board_tasks_with_order'))
    );


    // Private
    private readonly _positionStep: number = 65536;
    private readonly _maxListCount: number = 200;
    private readonly _maxPosition: number = this._positionStep * 500;
    expandedSubtasks: number;
  constructor(private _taskService: TaskServiceService,
    private _scrumboardService:ScrumboardService,
    private _formBuilder:FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit(): void {
    this.formShare = this._formBuilder.group({
        boards: ['', Validators.required],
    });
  }


  toggleTableRows(id: number) {
        if(this.expandedSubtasks === id){
            this.expandedSubtasks = null;
        }else{
            // this._taskService.getSubtasks(id).subscribe((res)=>{
            //     console.log(res);
            //     this.expandedSubtasks = id;
            // });
        }
    }
    renameList(listTitleInput: HTMLElement): void
    {
        // Use timeout so it can wait for menu to close
        setTimeout(() => {
            listTitleInput.focus();
        });
    }

    updateListTitle(event: any, list: List): void
    {
        // Get the target element
        const element: HTMLInputElement = event.target;

        // Get the new title
        const newTitle = element.value;

        // If the title is empty...
        if ( !newTitle || newTitle.trim() === '' )
        {
            // Reset to original title and return
            element.value = list.title;
            return;
        }

        // Update the list title and element value
        list.title = element.value = newTitle.trim();

        // Update the list
        this._scrumboardService.updateList(list).subscribe();
    }

    deleteList(id): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete list',
            message: 'Are you sure you want to delete this list and its cards? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Delete the list
                this._scrumboardService.deleteList(id).subscribe();
            }
        });
    }
    addCard(list: any, event: TaskOrSub): void
    {
        if( this._taskService.boardInfo.is_his !== 1){
            this._taskService.openAssignPopup()
        }else{
            console.log(list, event,'console.log(list, title,');
            const newTask = {
                task_id: list.id,
                title: event.title,
                status:list.status.id
            };
            if(event.type === 'task'){
                this._taskService.storeTask(newTask).subscribe(res=>{}
                    ,err=>{
                        console.log(err);
                        console.log(err);
                        // const dialogRef = this.dialog.open(JoinTaskDialogComponent,{
                        //     width: '350px',
                        //     height: '300px',
                        //   data:{userid:this.userId,boardId:this.currentBoardId }
                        // });
                    });
            }else{
               
            }
            console.log(newTask);
            // Save the card
        }
        
    }

    cardDropped(event: CdkDragDrop<Card[]>): void
    {
        if( this._taskService.boardInfo.is_his !== 1){
            this._taskService.openAssignPopup()
        }else{
            let order;
            console.log(event,'currentItem.position = this._positionStepcurrentItem.position = this._positionStep');
            this._taskService.orderModified$.subscribe((res)=>{
                order = res;
            });
    
            // Move or transfer the item
            if ( event.previousContainer === event.container )
            {
                // Move the item
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
                const currentTask = event.container.data[event.currentIndex];
                const currentIndex = event.currentIndex;
                const taskuCurrent = event.container.data[currentIndex]?.id;
                const previusTask = event.container.data[currentIndex - 1]?.id;
                const nextTask = event.container.data[currentIndex + 1]?.id;
                const currentTaskIndex = order.findIndex(d => d === +taskuCurrent);
                if(currentTaskIndex > -1){
                    if(previusTask){
                        order.splice(currentTaskIndex,1);
                        const prevTaskIndex = order.findIndex(d => d === +previusTask);
                        order.splice(prevTaskIndex+1, 0, +taskuCurrent);
                    }else if(nextTask){
                        order.splice(currentTaskIndex,1);
                        const nextTaskIndex = order.findIndex(d => d === +nextTask);
                        order.splice(nextTaskIndex, 0, +taskuCurrent);
                    }else{
                    }
                }
                console.log(event,'currentItem.position = this._positionStepcurrentItem.position = this._positionStep');
                this._taskService.updateTaskStatusOrder(event.container.id, order.toString(), +currentTask.id).subscribe();
            }
            else
            {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
                // Update the card's list it
                event.container.data[event.currentIndex].listId = event.container.id;
                const currentTask = event.container.data[event.currentIndex];
                const currentIndex = event.currentIndex;
                const taskuCurrent = event.container.data[currentIndex]?.id;
                const previusTask = event.container.data[currentIndex - 1]?.id;
                const nextTask = event.container.data[currentIndex + 1]?.id;
                const currentTaskIndex = order.findIndex(d => d === +taskuCurrent);
                if(currentTaskIndex > -1){
                    if(previusTask){
                        order.splice(currentTaskIndex,1);
                        const prevTaskIndex = order.findIndex(d => d === +previusTask);
                        order.splice(prevTaskIndex+1, 0, +taskuCurrent);
                    }else if(nextTask){
                        order.splice(currentTaskIndex,1);
                        const nextTaskIndex = order.findIndex(d => d === +nextTask);
                        order.splice(nextTaskIndex, 0, +taskuCurrent);
                    }else{
                    }
                }
                this._taskService.updateTaskStatusOrder(event.container.id, order.toString(), +currentTask.id).subscribe();
            }
            // Calculate the positions
            const updated = this._calculatePositions(event);
        }
        
    }

  private _calculatePositions(event: CdkDragDrop<any[]>): any[]
  {
      // Get the items
      let items = event.container.data;
      const currentItem = items[event.currentIndex];
      const prevItem = items[event.currentIndex - 1] || null;
      const nextItem = items[event.currentIndex + 1] || null;

      // If the item moved to the top...
      if ( !prevItem )
      {
          // If the item moved to an empty container
          if ( !nextItem )
          {
              currentItem.position = this._positionStep;
          }
          else
          {
              currentItem.position = nextItem.position / 2;
          }
      }
      // If the item moved to the bottom...
      else if ( !nextItem )
      {
          currentItem.position = prevItem.position + this._positionStep;
      }
      // If the item moved in between other items...
      else
      {
          currentItem.position = (prevItem.position + nextItem.position) / 2;
      }

      // Check if all item positions need to be updated
      if ( !Number.isInteger(currentItem.position) || currentItem.position >= this._maxPosition )
      {
          // Re-calculate all orders
          items = items.map((value, index) => {
              value.position = (index + 1) * this._positionStep;
              return value;
          });

          // Return items
          return items;
      }

      // Return currentItem
      return [currentItem];
  }

  listDropped(event: CdkDragDrop<List[]>): void
    {
        // Move the item
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        // Calculate the positions
        const updated = this._calculatePositions(event);

        // Update the lists
        this._scrumboardService.updateLists(updated).subscribe();
    }

    isOverdue(date: string): boolean
    {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

  trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
