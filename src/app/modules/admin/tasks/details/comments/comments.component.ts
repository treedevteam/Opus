import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { TasksService } from '../../tasks.service';
import { Task2, TaskComment } from '../../tasks.types';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation/confirmation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  taskId: number;
  commentForm: FormGroup;
  apiUrl = environment.apiUrl;
  taskLogs(){
    this._tasksService.taskById$
    .subscribe((task: Task2) => {
        this.taskId = task.id;
    });
  }
  taskComments$ = combineLatest([
    this._tasksService.taskComments$,
    this._tasksService.taskComment$,
    this._tasksService.getUsersData$,
    this._tasksService.deletedComment$
],(g,p,u,de) => {
    if(p){
      const index = g.findIndex(x => x.id === p.id)
         if (index < 0) {
          g.unshift(p);
        };
      
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
    return d?d : g;
 })

  constructor(private _tasksService: TasksService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder
    ) { }

  

  ngOnInit(): void {
    this.taskLogs();
    this.commentForm = this._formBuilder.group({
        id        : [''],
        newComment: '',
    });
  }


  addCommentTask(){
    this._tasksService.storeComment({text: this.commentForm.get('newComment').value,task_id:this.taskId},).subscribe(res=>{
        this.commentForm.get('newComment').setValue("");
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
}
