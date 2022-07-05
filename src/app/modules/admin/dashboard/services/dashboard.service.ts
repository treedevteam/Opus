import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, concatMap, map, Observable, switchMap, take, tap, shareReplay } from 'rxjs';
import { Posts } from '../models/dashboard';
import { Departments } from '../../departments/departments.types';
import { Users } from '../../tasks/tasks.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.apiUrl; 

  private _departmentPosts: BehaviorSubject<Posts[] | null> = new BehaviorSubject(null); 
  private _currentDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null); 
  private _currentDepartmentUsers: BehaviorSubject<Users[] | null> = new BehaviorSubject(null); 


  constructor(private _httpClient: HttpClient) { }

  get departmentPosts$(): Observable<Posts[]>{
    return this._departmentPosts.asObservable();
  }

  get currentDepartment$(): Observable<Departments>{
    return this._currentDepartment.asObservable();
  }
  get currentDepartmentUsers$(): Observable<Users[]>{
    return this._currentDepartmentUsers.asObservable();
}


  getPostsDepartment(depId: number): Observable<Posts[]>
  {
      return this._httpClient.get<Posts[]>(this.apiUrl+'api/posts/' + depId).pipe(
          map((data: any): Posts[] => {
              this._departmentPosts.next(data.data);
              return data.data;
          }),
      );
  }

  
  storePost(data:any): Observable<Posts>
  {
    return this.departmentPosts$.pipe(
      take(1),
      switchMap(posts => this._httpClient.post<Posts>(this.apiUrl + 'api/post/store',data).pipe(
          map((newPost: Posts) => {
              this._departmentPosts.next([data.newPost,...posts]);
              return newPost;
          })
      ))
  );
  }

  myDepartment(){
    return this._httpClient.get(this.apiUrl+'api/my_department').pipe(
        map((data: any):any => {
            this._currentDepartment.next(data.data);
            return data.data;
        }),
        shareReplay(1)
    );
  }

  myPosts(){
    return this.myDepartment().pipe(
        concatMap(((val :any) => {
          console.log(val);
            return this.getPostsDepartment(val.id)
        })),
    )
  };

  myUsers(){
    return this.myDepartment().pipe(
        concatMap(((val :any) => {
          console.log(val);
            return this.getUsersDepartment(val.id)
        })),
    )
  };

  getPostsDepartmentWithId$ = this.currentDepartment$.pipe(
    tap(res=>{
      console.log(res);
    }),
    switchMap(x => {
      return this.getPostsDepartment(x.id)
    })
  )

  getUsersDepartmentWithId$ = this.currentDepartment$.pipe(
    switchMap(x => {
      return this.getUsersDepartment(x.id)
    })
  )

  getUsersDepartment(depId: number): Observable<Users[]>
    {
        return this._httpClient.get<Users[]>(this.apiUrl+'api/users/department/' + depId).pipe(
            map((data: any): Users[] => {
              debugger;
                this._currentDepartmentUsers.next(data.data);
                return data.data;
            }),
        );
    }


    storeReply(id:number, data){
      return this._httpClient.post<Posts>(this.apiUrl + `reply/${id}/store`,{text: data}).pipe(
        map((newPost: Posts) => {
            return newPost;
        })
      )
    }

    likeorUnlikePost(id: number){
      return this._httpClient.post<Posts>(this.apiUrl + `/post/${id}/like`,null).pipe(
        map((newPost: Posts) => {
            return newPost;
        })
      )
    }




}
