import { catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departments } from '../model/departments.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentsService {

  constructor(private http: HttpClient) { }


    storeDepartment(form: any): Observable<Departments>{
        return this.http.post<Departments>('https://opus.devtaktika.com/api/department/store', form).pipe(
            map((data: any) => data),
        catchError((err) => {
            console.error(err);
            throw err;
        }
        )
        );
    }

    getDepartments(): Observable<Departments>{
        return this.http.get<Departments>('https://opus.devtaktika.com/api/departments').pipe(
            map((data: any) => data),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }

    deleteDepartment($id: number): Observable<Departments>{
        return this.http.delete<Departments>('https://opus.devtaktika.com/api/department/delete/' + $id).pipe(
            map((data: any) => data),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }
    _getDepartamentByid($id: number): Observable<Departments>{
        return this.http.get<Departments>('https://opus.devtaktika.com/api/department/' + $id).pipe(
            map((data: any) => data),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }

    _updateDepartment($id: number, data: any): Observable<Departments>{
        return this.http.post<Departments>('https://opus.devtaktika.com/api/department/update/' + $id, data).pipe(
            map((res: any) => res),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }
}
