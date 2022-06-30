/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from '../services/dashboard.service';
import { combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { Posts } from '../models/dashboard';
import { environment } from 'environments/environment';
import { Departments } from '../../departments/departments.types';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
    numberOfLikes: number = 0;
    likeButtonClick() {
        this.numberOfLikes++;
    }
    dislikeButtonClick() {
        this.numberOfLikes--;
    }
    isShowDivIf = true;

    toggleDisplayDivIf() {
        this.isShowDivIf = !this.isShowDivIf;
    }
    @ViewChild('supportNgForm') supportNgForm: NgForm;
    apiUrl = environment.apiUrl;
    currentDepartment:Departments
    supportForm: FormGroup;
    url: any;
    file: any;
    uploaded: boolean;
    alert: any;
    departmentPosts$ = this._dashboardService.departmentPosts$;


    departmentPostsWithReplies$ = combineLatest([
        this.departmentPosts$,
        this._dashboardService.currentDepartmentUsers$
      ]).pipe(
        map((posts) =>
        posts.map(post =>({
            ...post,
            
        }))),
        shareReplay(1),
        tap(res=>{
            console.log(res);
        })
      );



      departmentTasksWithStatusPriority$ = combineLatest([
        this.departmentPosts$,
        this._dashboardService.currentDepartmentUsers$,
      ]).pipe(
        map(([currentBoard,tasksBoard]) =>(
            {
            ...currentBoard.map(res=>({
                ...res,
                // status: statuses.find(s => +res.status === +s.id),
                // priority: priority.find(p => +res.priority === +p.id),
                // users_assigned: res.users_assigned.map(u => (
                //     users.find(user => u === +user.id)
                // )),
                // checkListInfo : {
                //     completed: res.checklists.filter(x => x.value === 1).length,
                //     total: res.checklists.length
                // }
            })),
        })),
        shareReplay(1),
        tap((res)=>{
           console.log(res);
        })
        );

    constructor(
        private _dashboardService: DashboardService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this._dashboardService.currentDepartment$.subscribe(res=>{
            this.supportForm = this._formBuilder.group({
                description: ['', Validators.required],
                file: [''],
                departments: '[' + res.id + ']',
            });

            this._dashboardService.getPostsDepartment(res.id).subscribe((res) => {
                console.log(res);
            });

            this._dashboardService.getUsersDepartment(res.id).subscribe();


        })
        // Create the support form
    }



  onFileChange(pFileList: File): void{
    if (pFileList[0]) {
        if (
            pFileList[0].type === 'image/png' ||
            pFileList[0].type === 'image/jpg'
        ) {
            if (pFileList[0].size < 200 * 200) {
                /* Checking height * width*/
            }
            if (pFileList[0].size < 512000) {
                this.uploaded = true;
                this.file = pFileList[0];
                const file = pFileList[0];
                this.supportForm.patchValue({
                    file: pFileList[0]
                    });
                    this._snackBar.open('Successfully upload!', 'Close', {
                        duration: 2000,
                    });
                    const reader = new FileReader();
                    reader.readAsDataURL(pFileList[0]);
                    reader.onload = (event): any => {
                        this.url = event.target.result;
                    };
                } else {
                    this._snackBar.open('File is too large!', 'Close', {
                        duration: 2000,
                    });
                    this.uploaded = false;
                    this.file = null;
                    this.url = null;
                }
            } else {
                this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.url = null;
            }
        }
    }

    clearForm(): void {
        // Reset the form
        this.supportNgForm.resetForm();
    }

    sendForm(): void {
        console.log(this.supportForm.get('file').value);
        const formData = new FormData();
        const result = Object.assign({}, this.supportForm.value);
        formData.append(
            'description',
            this.supportForm.get('description').value
        );
        formData.append('file', this.supportForm.get('file').value);
        formData.append(
            'departments',
            this.supportForm.get('departments').value
        );
        this._dashboardService.storePost(formData).subscribe((res) => {
            this.clearForm();
        });
    }
}
