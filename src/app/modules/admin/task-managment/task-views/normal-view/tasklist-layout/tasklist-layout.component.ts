import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest, map, shareReplay, tap } from 'rxjs';
import { Task } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-tasklist-layout',
  templateUrl: './tasklist-layout.component.html',
  styleUrls: ['./tasklist-layout.component.scss']
})
export class TasklistLayoutComponent implements OnInit {

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _taskServiceService:TaskServiceService

  ) { }


  boardsTasks$ = combineLatest([
    this._taskServiceService.allTasks$,
    this._taskServiceService.orderModified$
  ]).pipe(
    map(([currentBoardTasks, getOrderTasks]) =>(
        [
          ...currentBoardTasks.sort(function(a,b){
            return getOrderTasks.indexOf(a.id) - getOrderTasks.indexOf(b.id);
        })
      ]
    )),
    shareReplay(1),
    tap(res=>console.log(res,'board_tasks_with_order'))
    );


  ngOnInit(): void {
  }

  dropped(event: CdkDragDrop<Task[]>): void
  {
      // Move the item in the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      let order = event.container.data.map(x=>x.id) 
      const currentTask = event.container.data[event.currentIndex];
      const taskuCurrent = event.container.data[event.currentIndex]?.id;
      const previusTask = event.container.data[event.currentIndex - 1]?.id;
      const nextTask = event.container.data[event.currentIndex + 1]?.id;
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
      // Save the new order
      this._taskServiceService.updateTaskStatusOrder(currentTask.status["id"], order.toString(), +currentTask.id).subscribe();
      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

}
