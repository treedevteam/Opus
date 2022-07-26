import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Card } from 'app/modules/admin/tasks/kanban-view/kanban-board/scrumboard.models';
import { combineLatest, map, shareReplay, tap } from 'rxjs';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-tasklist-kanban-layout',
  templateUrl: './tasklist-kanban-layout.component.html',
  styleUrls: ['./tasklist-kanban-layout.component.scss']
})
export class TasklistKanbanLayoutComponent implements OnInit {


  
  allTasks$ = combineLatest([
    this._taskService.allTasks$,
    this._taskService.getStatus$,
    this._taskService.tasksOrder$
  ]).pipe(
    map(([currentBoardTasks, getStatus, getOrderTasks]) =>(
           getStatus.map(s=>(
               {
                order:getOrderTasks,
                status : s,
                tasks: currentBoardTasks.filter(x=>x.status.id === +s.id).sort(function(a,b){
                    return getOrderTasks.indexOf(a.id) - getOrderTasks.indexOf(b.id);
                })
                .map(_tasks=>({
                    ..._tasks,
                })),
            }
           ))
    )),
    shareReplay(1),
    tap(res=>console.log(res,'board_tasks_with_order')
    )
    );


    // Private
    private readonly _positionStep: number = 65536;
    private readonly _maxListCount: number = 200;
    private readonly _maxPosition: number = this._positionStep * 500;
  constructor(private _taskService: TaskServiceService) { }

  ngOnInit(): void {
  }

  cardDropped(event: CdkDragDrop<Card[]>): void
  {
      let order;
      console.log(event,'currentItem.position = this._positionStepcurrentItem.position = this._positionStep');
      this._taskService.tasksOrder$.subscribe((res)=>{
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
          const currentTaskIndex = order.findIndex(d => d === taskuCurrent);
          if(currentTaskIndex > -1){
              if(previusTask){
                  order.splice(currentTaskIndex,1);
                  const prevTaskIndex = order.findIndex(d => d === previusTask);
                  order.splice(prevTaskIndex+1, 0, taskuCurrent);
              }else if(nextTask){
                  order.splice(currentTaskIndex,1);
                  const nextTaskIndex = order.findIndex(d => d === nextTask);
                  order.splice(nextTaskIndex, 0, taskuCurrent);
              }else{
              }
          }
          console.log(event,'currentItem.position = this._positionStepcurrentItem.position = this._positionStep');
          // this._taskService.updateTaskStatusOrder(event.container.id, order.toString(), +currentTask.id).subscribe();
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
          const currentTaskIndex = order.findIndex(d => d === taskuCurrent);
          if(currentTaskIndex > -1){
              if(previusTask){
                  order.splice(currentTaskIndex,1);
                  const prevTaskIndex = order.findIndex(d => d === previusTask);
                  order.splice(prevTaskIndex+1, 0, taskuCurrent);
              }else if(nextTask){
                  order.splice(currentTaskIndex,1);
                  const nextTaskIndex = order.findIndex(d => d === nextTask);
                  order.splice(nextTaskIndex, 0, taskuCurrent);
              }else{
              }
          }
          // this._taskService.updateTaskStatusOrder(event.container.id, order.toString(), +currentTask.id).subscribe();
      }
      // Calculate the positions
      const updated = this._calculatePositions(event);
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

  trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
