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
import { combineLatest, forkJoin, map, Observable, shareReplay, tap, switchMap } from 'rxjs';
import { Posts } from '../models/dashboard';
import { environment } from 'environments/environment';
import { Departments } from '../../departments/departments.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
    isShowDivIf = true;

    toggleDisplayDivIf() {
        this.isShowDivIf = !this.isShowDivIf;
    }
    @ViewChild('supportNgForm') supportNgForm: NgForm;
    apiUrl = environment.apiUrl;
    currentDepartment: Departments;
    supportForm: FormGroup;
    url: any;
    file: any;
    uploaded: boolean;
    alert: any;
    // departmentPosts$ = this._dashboardService.departmentPosts$;
    // currentDepartmentUsers$ = this._dashboardService.currentDepartmentUsers$;
    postsWithReplies$ = combineLatest([
        this._dashboardService.departmentPosts$,
        this._dashboardService.currentDepartmentUsers$,
        this._user.user$,
    ]).pipe(
        map(([posts, users, myUser]) =>
            posts.map((post) => ({
                ...post,
                likes: post.likes.length,
                liked: post.likes.findIndex((x) => x === +myUser.id) > -1,
                replies: post.replies.map((rep) => ({
                    ...rep,
                    user: users.find((x) => x.id === rep.user_id),
                    isHis: +myUser.id === rep.user_id,
                })),
            }))
        ),
        tap((res) => {
            ;
            console.log(res);
        }),
        shareReplay(1)
    );

    // departmentPostsWithReplies$ = combineLatest([
    //     this._dashboardService.departmentPosts$,
    //     this._dashboardService.currentDepartmentUsers$
    //   ]).pipe(
    //     tap(res=>{
    //         console.log(res);
    //     }),
    //     switchMap(([posts,users]) =>
    //     posts.map(post =>({
    //         ...post,
    //         replies: post.replies.map(rep=>({
    //             ...rep,
    //             user: users.find(x=> x.id === rep.user_id)
    //         }))
    //     }))),
    //     shareReplay(1),
    //     tap(res=>{
    //         console.log(res);
    //     })
    //   );

    constructor(
        private _dashboardService: DashboardService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _user: UserService
    ) {}

    ngOnInit(): void {
        this._user.user$.subscribe((res) => {
            this.supportForm = this._formBuilder.group({
                description: ['', Validators.required],
                file: [''],
                departments: '[' + res.department.id + ']',
            });
        })
        console.log(this.postsWithReplies$)
        
    }

    onFileChange(pFileList: File): void {
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
                        file: pFileList[0],
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
         this.supportForm.patchValue({
             description: ' ',
             file: "",
         });
        
    }

    sendForm(): void {
        console.log(this.supportForm.value);
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

    LikeButtonClick(postId) {
        this._dashboardService.likeorUnlikePost(postId).subscribe((res) => {
            console.log(res);
        });
    }

    deleteReply(id: number, postId: number) {
        this._dashboardService.deleteReply(id, postId).subscribe((res) => {});
    }

    deleteLatestPost(postId: number) {
        this._dashboardService.deletePost(postId).subscribe((res) => {});
    }
}
