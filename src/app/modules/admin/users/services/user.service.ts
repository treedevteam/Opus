import { Roles, Users } from './../model/users';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Departments } from '../../departments/departments.types';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl;

  private addedUser$ = new BehaviorSubject<Users>(null);
  private updateUser$ = new BehaviorSubject<Users>(null);
  private deletedUser$ = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) { }
  



  getUsers$ = this.http.get<Users[]>(this.apiUrl+'api/users').pipe(
      map((data: any) :Users[] => data),
    catchError((err) => {
      console.error(err);
      throw err;
    }
  )
  );

  get getAddedUser$(): Observable<Users>
  {
      return this.addedUser$.asObservable();
  }
  
  get getUpdatedUsers$(): Observable<Users>
  {
      return this.updateUser$.asObservable();
  }
  
  get getDeletedUsers$(): Observable<number>
  {
      return this.deletedUser$.asObservable();
  }


  storeUsers(form: any): Observable<Users>{
    return this.http.post<Users>(this.apiUrl+'api/user/store', form).pipe(
        map((data: any) => {
          this.addedUser$.next(data);
          return data;
        }),
    catchError((err) => {
        console.error(err);
        throw err;
    }
    )
    );
}

getUsers(): Observable<Users>{
    return this.http.get<Users>(this.apiUrl+'api/users').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

deleteUser($id: number): Observable<Users>{
    return this.http.delete<Users>(this.apiUrl+'api/user/delete/' + $id).pipe(
        map((data: any) => {
          this.deletedUser$.next($id);
          return data;
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
_getUserByid($id: number): Observable<Users>{
    return this.http.get<Users>(this.apiUrl+'api/user/' + $id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

_updateUser($id: number, data: any): Observable<Users>{
    return this.http.post<Users>(this.apiUrl+'api/user/update/' + $id, data).pipe(
        map((res: any) => {
          this.updateUser$.next(res);
          return res;
        }),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

    _getDepartments(): Observable<Departments[]>{
        return this.http.get<Departments[]>(this.apiUrl+'api/departments').pipe(
            map((data: any) => data),
        catchError((err) => {
            console.error(err);
            throw err;
        }
        )
        );
    }

    _getRoles(): Observable<Roles[]>{
      return this.http.get<Roles[]>(this.apiUrl+'api/roles').pipe(
          map((data: any) => data),
      catchError((err) => {
          console.error(err);
          throw err;
      }
      )
      );
  }
}
