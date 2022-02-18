import { BehaviorSubject, catchError, map, Observable, shareReplay, tap, combineLatest, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departments } from '../model/departments.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentsService {
    private addDepartmentSource$ = new BehaviorSubject<Departments>(null);
    private updateDepartment$ = new BehaviorSubject<Departments>(null);
    private deletedDepartment$ = new BehaviorSubject<number>(null);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    getDepartmentsData$ = this.http.get<Departments[]>('https://opus.devtaktika.com/api/departments').pipe(
        map((data: any): Departments[] => data.data),
        // shareReplay(1),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
    constructor(private http: HttpClient) { }

    getAddedDepartment(): Observable<Departments>{
        return this.addDepartmentSource$.asObservable();
    }

    getUpdatedDepartment(): Observable<Departments>{
        return this.updateDepartment$.asObservable();
    }
    getDeletedDepartment(): Observable<number>{
        return this.deletedDepartment$.asObservable();
    }
    storeDepartment(form: any): Observable<Departments>{
        return this.http.post<Departments>('https://opus.devtaktika.com/api/department/store', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: Departments) => {
                this.addDepartmentSource$.next(data);
                return data;
            }),
            catchError((err) => {
                console.error(err);
                throw err;
            }
        )
        );
    }





    deleteDepartment($id: number): Observable<number>{
        return this.http.delete<Departments>('https://opus.devtaktika.com/api/department/delete/' + $id).pipe(
            map((dataa: Departments) => {
                this.deletedDepartment$.next($id);
                return $id;
            }),
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

    _updateDepartment( $id: number , data: any): Observable<Departments>{
        return this.http.post<Departments>('https://opus.devtaktika.com/api/department/update/' + $id, data).pipe(
            map((dataa: Departments) => {
                this.updateDepartment$.next(dataa);
                return data;
            }),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }
}
