/* eslint-disable @typescript-eslint/member-ordering */
import { Roles, Users } from './../model/users';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, take } from 'rxjs';
import { Departments } from '../../departments/departments.types';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.apiUrl;

  private _users: BehaviorSubject<Users[] | null> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  get users$(): Observable<Users[]>
  {
      return this._users.asObservable();
  }

  getUsers(): Observable<Users[]>
  {
      return this.http.get<Users[]>(this.apiUrl+'api/users').pipe(
        map((data: any) => {
          this._users.next(data)
          return data
        }),
      catchError((err) => {
        console.error(err);
        throw err;
      }
    )
    );
  }


  

  storeUsers(form: any): Observable<Users>{
    return this.users$.pipe(
      take(1),
      switchMap(users => this.http.post<Users>(this.apiUrl+'api/user/store', form).pipe(
          map((newUser: Users) => {
              this._users.next([newUser,...users]);
              return newUser;
          })
      ))
    );
}


  deleteUser($id: number): Observable<Users>{

    return this.users$.pipe(
      take(1),
      switchMap(users => this.http.delete<Users>(this.apiUrl+'api/user/delete/' + $id).pipe(
          map((deletedUser: any) => {
            const index = users.findIndex(x=>x.id == $id);
            users.splice(index,1);
            this._users.next(users)
            return deletedUser;
          })
      ))
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
    return this.users$.pipe(
      take(1),
      switchMap(users => this.http.post<Users>(this.apiUrl+'api/user/update/' + $id, data).pipe(
          map((updatedUsers: Users) => {
            const statusIndex = users.findIndex(d => d.id === updatedUsers.id);
            if(statusIndex > -1){
              users.splice(statusIndex,1,updatedUsers);
            }
            this._users.next(users);
            return updatedUsers;
          })
      ))
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
