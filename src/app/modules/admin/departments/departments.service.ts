import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Departments, Boards } from './departments.types';
import { BehaviorSubject, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { Users } from '../users/model/users';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  apiUrl = environment.apiUrl;

  private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);

  constructor(
    private _httpClient: HttpClient
  ) { }

  get $departments(): Observable<Departments[]>{
    return this._departments.asObservable();
  }

  getDepartments(): Observable<Departments[]>{
    return this._httpClient.get<Departments[]>(this.apiUrl+'api/departments').pipe(
      map((data: any): Departments[] => {
          this._departments.next(data);
          return data;
      }),
       shareReplay(1),
  );
  }

  getUsers(): Observable<Users[]>{
    return this._httpClient.get<Users[]>(this.apiUrl+'api/users').pipe(
      map((data: any): Users[] => data),
       shareReplay(1),
  );
  }
  addDepartment(data: any): Observable<Departments>{
    return this.$departments.pipe(
      take(1),
      switchMap(departments => this._httpClient.post<Departments>(this.apiUrl+'api/department/store', data).pipe(
          map((newDepartment: any) => {
              this._departments.next([newDepartment,...departments]);
              return newDepartment;
          })
      ))
    );
  }
  updateDepartments(form: any, id: number): Observable<Departments>{
    return this.$departments.pipe(
      take(1),
      switchMap(departments => this._httpClient.post<Departments>(this.apiUrl+'api/department/update/' + id, form).pipe(
          map((updatedDepartment: any) => {
            const departmentIndex = departments.findIndex(d => d.id === updatedDepartment.id);
            if(departmentIndex > -1){
              departments.splice(departmentIndex,1,updatedDepartment);
            }
            this._departments.next(departments);
            return updatedDepartment;
          })
      ))
    );
  }

  deleteDepartment(id: number): Observable<number>{
    return this.$departments.pipe(
      take(1),
      switchMap(departments => this._httpClient.delete<Departments>(this.apiUrl+'api/department/delete/'+ id).pipe(
          map((deletedDepartment: any) => {
            const index = departments.findIndex(x=>x.id == id);
            departments.splice(index,1);
            this._departments.next(departments)
            return deletedDepartment;
          })
      ))
    );
  }
  getDepartmentById(id: number): Observable<Departments>{
    return this._httpClient.get<Departments>(this.apiUrl+'api/department/'+ id).pipe(
      map((res: any): Departments =>res)
    );
  }
}
