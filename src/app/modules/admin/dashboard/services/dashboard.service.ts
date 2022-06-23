import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Posts } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.apiUrl; 

  private _departmentPosts: BehaviorSubject<Posts | null> = new BehaviorSubject(null); 


  constructor(private _httpClient: HttpClient) { }

  get departmentPosts$(): Observable<Posts>{
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





}
