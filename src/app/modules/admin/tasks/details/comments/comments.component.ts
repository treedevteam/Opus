/* eslint-disable */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { Task2, TaskComment, Users } from '../../tasks.types';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation/confirmation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  items;
  data: string;

  taskId: number;
  commentForm: FormGroup;
  apiUrl = environment.apiUrl;
  boardUsers: Users[] = [];
  mentionConfig1 = {};



  getFields(input, field) {

    const output = [];
    for (let i = 0; i < input.length; ++i) { output.push(input[i][field]); }
    return output;
  }

  taskComments$ = this._tasksService.taskComments$

  constructor(private _tasksService: TasksService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this._tasksService.currentBoardUsers$.subscribe((res) => {
      this.items = res;
    });

    this._tasksService.taskById$
      .subscribe((task: Task2) => {
        this.taskId = task.id;
      });

    this.commentForm = this._formBuilder.group({
      id: [''],
      newComment: '',
    });
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


