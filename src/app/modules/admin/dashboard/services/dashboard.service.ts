import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { Posts } from '../models/dashboard';
import { Departments } from '../../departments/departments.types';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.apiUrl; 

  private _departmentPosts: BehaviorSubject<Posts[] | null> = new BehaviorSubject(null); 
  private _currentDepartment: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null); 


  constructor(private _httpClient: HttpClient) { }

  get departmentPosts$(): Observable<Posts[]>{
    return this._departmentPosts.asObservable();
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
              this._departmentPosts.next([newPost,...posts]);
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
    );
  }





}
