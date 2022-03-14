import { Roles, Users } from './../model/users';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { Departments } from '../../pages/departaments/model/departments.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private addedUser$ = new BehaviorSubject<Users>(null);
  private updateUser$ = new BehaviorSubject<Users>(null);
  private deletedUser$ = new BehaviorSubject<number>(null);

  constructor(private http: HttpClient) { }
  



  getUsers$ = this.http.get<Users[]>('http://127.0.0.1:8000/api/users').pipe(
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
    return this.http.post<Users>('http://127.0.0.1:8000/api/user/store', form).pipe(
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
    return this.http.get<Users>('http://127.0.0.1:8000/api/users').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

deleteUser($id: number): Observable<Users>{
    return this.http.delete<Users>('http://127.0.0.1:8000/api/user/delete/' + $id).pipe(
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
    return this.http.get<Users>('http://127.0.0.1:8000/api/user/' + $id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

_updateUser($id: number, data: any): Observable<Users>{
    return this.http.post<Users>('http://127.0.0.1:8000/api/user/update/' + $id, data).pipe(
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
        return this.http.get<Departments[]>('http://127.0.0.1:8000/api/departments').pipe(
            map((data: any) => data),
        catchError((err) => {
            console.error(err);
            throw err;
        }
        )
        );
    }

    _getRoles(): Observable<Roles[]>{
      return this.http.get<Roles[]>('http://127.0.0.1:8000/api/roles').pipe(
          map((data: any) => data),
      catchError((err) => {
          console.error(err);
          throw err;
      }
      )
      );
  }
}
