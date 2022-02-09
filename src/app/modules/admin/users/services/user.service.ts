import { Users } from './../model/users';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  storeUsers(form: any): Observable<Users>{
    return this.http.post<Users>('https://opus.devtaktika.com/api/user/store', form).pipe(
        map((data: any) => data),
    catchError((err) => {
        console.error(err);
        throw err;
    }
    )
    );
}

getUsers(): Observable<Users>{
    return this.http.get<Users>('https://opus.devtaktika.com/api/users').pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

deleteUser($id: number): Observable<Users>{
    return this.http.delete<Users>('https://opus.devtaktika.com/api/user/delete/' + $id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
_getUserByid($id: number): Observable<Users>{
    return this.http.get<Users>('https://opus.devtaktika.com/api/user/' + $id).pipe(
        map((data: any) => data),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}

_updateUser($id: number, data: any): Observable<Users>{
    return this.http.post<Users>('https://opus.devtaktika.com/api/user/update/' + $id, data).pipe(
        map((res: any) => res),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
}
}
