import { Component, Input, OnInit } from '@angular/core';
import { TasksService } from '../tasks.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store-task-row',
  templateUrl: './store-task-row.component.html',
  styleUrls: ['./store-task-row.component.scss']
})
export class StoreTaskRowComponent implements OnInit {
  @Input() taskId: number;
  currentDepartment: number;
  taskForm: FormGroup;
  userInfo: any;
  apiUrl = environment.apiUrl;

  constructor(private _tasksService: TasksService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('user_info') ?? '');
    this.taskForm = this._formBuilder.group({
      id: [''],
      title: [''],
      file:[''],
      board_id: [[]],
      task_id: ['']
    });



    this._tasksService.currentBoard$.subscribe((res)=>{
      this.currentDepartment = res.id;
    });
  }



  changeSubmitEventTask(): void {
    console.log(this.taskForm.value);
    this.taskForm.get('board_id').patchValue(this.currentDepartment);
    this._tasksService.storeTask(this.taskForm.value).subscribe((res)=>{
       this.taskForm.reset();
    },(err)=>{
        console.log(err);
        this._snackBar.open("You are not assigned to this board", 'close', {}).onAction()
        this.taskForm.reset();
    });
  }

  changeSubmitEventSubtask(): void{
    this.taskForm.get('task_id').patchValue(this.taskId);
    this._tasksService.storeSubtask(this.taskForm.value).subscribe((res)=>{
       this.taskForm.reset();
    },(err)=>{
        console.log(err);
        this.taskForm.reset();
    });
  }

}
