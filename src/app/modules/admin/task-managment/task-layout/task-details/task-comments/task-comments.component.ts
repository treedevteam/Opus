import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';
import { Task, Users } from '../../../_models/task';
import { TaskServiceService } from '../../../_services/task-service.service';

@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss']
})
export class TaskCommentsComponent implements OnInit, OnChanges{
  @Input() taskId: any;
  items;
  data: string;

  commentForm: FormGroup;
  apiUrl = environment.apiUrl;
  boardUsers: Users[] = [];
  mentionConfig1 = {};
  constructor(private _tasksService: TaskServiceService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder:FormBuilder) { }



  taskSelectedComments$ = this._tasksService.taskSelectedComments$;

  ngOnInit(): void {
    this._tasksService.boardUsersData().subscribe(res=>{
      console.log(res);
      this.items = res;
    });

    this.commentForm = this._formBuilder.group({
      id: [''],
      newComment: '',
    });


    
  }

  ngOnChanges(): void {
    this._tasksService.taskSelectedcomments$(this.taskId).subscribe();
  }


  
  addCommentTask() {
    const ids = this.data
      .replace(/(\r\n|\n|\r)/gm, '')
      .split('@')
      .filter(
        t => t != '' && this.items.findIndex(u => t.includes(u.name) === true) > -1
      )
      .map(name => this.items.find(s => name.includes(s.name) === true).id);
    console.log(ids);
    this._tasksService.storeComment({ text: this.commentForm.get('newComment').value, task_id: this.taskId, mentions: '[' + ids + ']' }).subscribe((res) => {
      this.commentForm.get('newComment').setValue('');
    });
  }

  deleteCommentclick(id: number): void {
    const dialogRef = this._fuseConfirmationService.open();
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._tasksService.deleteComment(id).subscribe((res) => {
        });
      }
    });
  }



}
