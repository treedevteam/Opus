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
    getDepartmentsData$ = this.http.get<Departments[]>('http://127.0.0.1:8000/api/departments/all').pipe(
        map((data: any): Departments[] => data),
        shareReplay(1),
       catchError((err) => {
         console.error(err);
         throw err;
       }
     )
    );
    constructor(private http: HttpClient) { }


    //GET
    getAddedDepartment(): Observable<Departments>{
        return this.addDepartmentSource$.asObservable();
    }

    getUpdatedDepartment(): Observable<Departments>{
        return this.updateDepartment$.asObservable();
    }
    getDeletedDepartment(): Observable<number>{
        return this.deletedDepartment$.asObservable();
    }




    // New Department
    storeDepartment(form: any): Observable<Departments>{
        return this.http.post<Departments>('http://127.0.0.1:8000/api/department/store', form).pipe(
            // eslint-disable-next-line arrow-body-style
            map((data: Departments) => {
                this.resetObserv();
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


    //Delete Department
    deleteDepartment($id: number): Observable<number>{
        return this.http.delete<Departments>('http://127.0.0.1:8000/api/department/delete/' + $id).pipe(
            map((dataa: Departments) => {
                this.resetObserv();
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

    // Department by id
    _getDepartamentByid($id: number): Observable<Departments>{
        return this.http.get<Departments>('http://127.0.0.1:8000/api/department/' + $id).pipe(
            map((data: any) => data),
           catchError((err) => {
             console.error(err);
             throw err;
           }
         )
        );
    }


    //Update Departemtn
    _updateDepartment( $id: number , data: any): Observable<Departments>{
        return this.http.post<Departments>('http://127.0.0.1:8000/api/department/update/' + $id, data).pipe(
            map((dataa: Departments) => {
                this.resetObserv();
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

    resetObserv(): any{
        this.deletedDepartment$.next(null);
        this.updateDepartment$.next(null);
        this.addDepartmentSource$.next(null);
    }
}
