import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
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

  boardsTasks$ = this._taskServiceService.allTasks$.pipe(
    tap(res=>{
      console.log(res);
    })
  )



  ngOnInit(): void {
  }

  dropped(event: CdkDragDrop<Task[]>): void
  {
      // Move the item in the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      // Save the new order

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

}
