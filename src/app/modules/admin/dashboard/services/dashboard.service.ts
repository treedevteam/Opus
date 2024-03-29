import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, concatMap, map, Observable, switchMap, take, tap, shareReplay } from 'rxjs';
import { Posts, Replies } from '../models/dashboard';
import { Departments } from '../../departments/departments.types';
import { Users } from '../../tasks/tasks.types';
import { UserService } from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    boardInfo: any;
    updateTaskTitle(value: any, id: any) {
        throw new Error('Method not implemented.');
    }
    openAssignPopup() {
        throw new Error('Method not implemented.');
    }
    apiUrl = environment.apiUrl;

    private _departmentPosts: BehaviorSubject<Posts[] | null> = new BehaviorSubject(null);
    private _currentDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null);
    private _currentDepartmentId: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private _currentDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);
    private _likedByMe: BehaviorSubject<boolean | null> = new BehaviorSubject(null);



    private _userUnreadEmails: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _userStatusCount: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _adminStatusCount: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _adminDepartmentCount: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _adminDashboardData: BehaviorSubject<any | null> = new BehaviorSubject(null);


    constructor(private _httpClient: HttpClient) {}

    get departmentPosts$(): Observable<Posts[]> {
        return this._departmentPosts.asObservable();
    }

    get currentDepartment$(): Observable<Departments> {
        return this._currentDepartment.asObservable();
    }
    get currentDepartmentUsers$(): Observable<Users[]> {
        return this._currentDepartmentUsers.asObservable();
    }
    get currentDepartmentId$(): Observable<number> {
        return this._currentDepartmentId.asObservable();
    }

    get likedByMe$(): Observable<boolean> {
        return this._likedByMe.asObservable();
    }



    get userUnreadEmails$(): Observable<any> {
        return this._userUnreadEmails.asObservable();
    }
    get userStatusCount$(): Observable<any> {
        return this._userStatusCount.asObservable();
    }
    get adminStatusCount$(): Observable<any> {
        return this._adminStatusCount.asObservable();
    }
    get adminDepartmentCount$(): Observable<any> {
        return this._adminDepartmentCount.asObservable();
    }
    get adminDashboardData$(): Observable<any> {
        return this._adminDashboardData.asObservable();
    }


    getPostsDepartment(): Observable<Posts[]> {
        return this._httpClient.get<Posts[]>(this.apiUrl + 'api/posts').pipe(
            map((data: any): Posts[] => {
                this._departmentPosts.next(data.data);
                return data.data;
            })
        );
    }

    storePost(data: any): Observable<Posts> {
        return this.departmentPosts$.pipe(
            take(1),
            switchMap((posts) =>
                this._httpClient
                    .post<Posts>(this.apiUrl + 'api/post/store', data)
                    .pipe(
                        map((newPost: any) => {
                            this._departmentPosts.next([
                                newPost.data,
                                ...posts,
                            ]);
                            return newPost;
                        })
                    )
            )
        );
    }

    getUsersDepartment(): Observable<Users[]> {
        return this._httpClient
            .get<Users[]>(this.apiUrl + 'api/users/department')
            .pipe(
                map((data: any): Users[] => {
                    ;
                    this._currentDepartmentUsers.next(data.data);
                    return data.data;
                })
            );
    }

    storeReply(id: number, data) {
        return this.departmentPosts$.pipe(
            take(1),
            switchMap((posts) =>
                this._httpClient
                    .post<Replies>(this.apiUrl + `api/reply/${id}/store`, data)
                    .pipe(
                        map((newPost: Replies) => {
                            ;
                            const postet = posts.map((res) => ({
                                ...res,
                                replies:
                                    res.id === id
                                        ? [...res.replies, newPost]
                                        : res.replies,
                            }));
                            this._departmentPosts.next(postet);
                            return newPost;
                        })
                    )
            )
        );
    }

    likeorUnlikePost(id: number) {
        return this.departmentPosts$.pipe(
            take(1),
            switchMap((posts) =>
                this._httpClient
                    .post(this.apiUrl + `api/post/${id}/like`, null)
                    .pipe(
                        map((postLikes: number[]) => {
                            ;
                            const postIndex = posts.findIndex(
                                (x) => x.id === id
                            );
                            const repliesIndex = posts[
                                postIndex
                            ].replies.findIndex((x) => x.id === id);
                            posts[postIndex].likes = postLikes;
                            this._departmentPosts.next(posts);
                            return postLikes;
                        })
                    )
            )
        );
    }

    deleteReply(id: number, postId: number) {
        return this.departmentPosts$.pipe(
            take(1),
            switchMap((posts) =>
                this._httpClient
                    .delete(this.apiUrl + `api/reply/delete/${id}`)
                    .pipe(
                        map((newPost: any) => {
                            const postIndex = posts.findIndex(
                                (x) => x.id === postId
                            );
                            const repliesIndex = posts[
                                postIndex
                            ].replies.findIndex((x) => x.id === id);
                            posts[postIndex].replies.splice(repliesIndex, 1);
                            this._departmentPosts.next(posts);
                            return newPost;
                        })
                    )
            )
        );
    }

    deletePost(postId: number) {
        return this.departmentPosts$.pipe(
            take(1),
            switchMap((posts) =>
                this._httpClient
                    .delete(this.apiUrl + `api/post/delete/${postId}`)
                    .pipe(
                        map((newPost: any) => {
                            const postIndex = posts.findIndex(
                                (x) => x.id === postId
                            );

                            posts.splice(postIndex, 1);
                            this._departmentPosts.next(posts);
                            return newPost;
                        })
                    )
            )
        );
    }


    //Per user
    getUserUnreadEmails(): Observable<any[]> {
        return this._httpClient
            .get<Users[]>(this.apiUrl + 'api/unread_emails/count')
            .pipe(
                map((data: any): any[] => {
                    this._userUnreadEmails.next(data);
                    return data;
                })
            );
    }
    getUserStatusCount(): Observable<any[]> {
        return this._httpClient
            .get<Users[]>(this.apiUrl + 'api/user_task_status/count')
            .pipe(
                map((data: any): any[] => {
                    this._userStatusCount.next(data);
                    return data;
                })
            );
    }
    getAdminStatusCount(): Observable<any[]> {
        return this._httpClient
            .get<Users[]>(this.apiUrl + 'api/status/count')
            .pipe(
                map((data: any): any[] => {
                    this._adminStatusCount.next(data);
                    return data;
                })
            );
    }
    getAdminDepartmentCount(): Observable<any[]> {
        return this._httpClient
            .get<any[]>(this.apiUrl + 'api/user/department/count')
            .pipe(
                map((data: any): any[] => {
                    console.log(data,"dasdasdasdasdasddddd");
                    
                    this._adminDepartmentCount.next(data);
                    return data;
                })
            );
    }

    getAdminDashboardData(): Observable<any[]> {
        return this._httpClient
            .get<any[]>(this.apiUrl + 'api/data')
            .pipe(
                map((data: any): any[] => {
                    this._adminDashboardData.next(data);
                    return data;
                })
            );
    }
}
