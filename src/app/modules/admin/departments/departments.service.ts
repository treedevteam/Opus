import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Departments, Boards } from './departments.types';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { Users } from '../users/model/users';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  apiUrl = environment.apiUrl;

  private _departments: BehaviorSubject<Departments[] | null> = new BehaviorSubject(null);
  private _department: BehaviorSubject<Departments | null> = new BehaviorSubject(null);
  private _newDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null);
  private _deletedDepartment: BehaviorSubject<number | null> = new BehaviorSubject(null);
  private _updatedDepartment: BehaviorSubject<Departments | null> = new BehaviorSubject(null);





  constructor(
    private _httpClient: HttpClient
  ) { }


  get $departments (): Observable<Departments[]>{
    return this._departments.asObservable();
  }

  get $department (): Observable<Departments>{
    return this._department.asObservable();
  }

  get $newDepartment (): Observable<Departments>{
    return this._newDepartment.asObservable();
  }
  get $deletedDepartment (): Observable<number>{
    return this._deletedDepartment.asObservable();
  }

  get $updatedDep (): Observable<Departments>{
    return this._updatedDepartment.asObservable();
  }





  
  getDepartments(): Observable<Departments[]>{
    return this._httpClient.get<Departments[]>(this.apiUrl+'api/departments').pipe(
      map((data: any): Departments[] => {
          this._departments.next(data);
          console.log(data,"DEPARTMETS");
          return data;
      }),
       shareReplay(1),
  );
  }

  getUsers(): Observable<Users[]>{
    return this._httpClient.get<Users[]>(this.apiUrl+'api/users').pipe(
      map((data: any): Users[] => {
          return data;
      }),
       shareReplay(1),
  );
  }

  addDepartment(data: any): Observable<Departments>{
    return this._httpClient.post<Departments>(this.apiUrl+'api/department/store', data).pipe(
      map((res: any): Departments =>{
        this._newDepartment.next(res);
        this._newDepartment.next(null);
        return res;
      })
    )
  }

  updateDepartments(form: any, id: number): Observable<Departments>{
    return this._httpClient.post<Departments>(this.apiUrl+"api/department/update/"+id, form).pipe(
      map((res: any): Departments=>{
        this._updatedDepartment.next(res);
        this._updatedDepartment.next(null);
        return res;
      })
    )
  }

  deleteDepartment(id: number): Observable<number>{
    return this._httpClient.delete<Number>(this.apiUrl+"api/department/delete/"+ id).pipe(
      map((res: any): number =>{
        this._deletedDepartment.next(id);
        this._deletedDepartment.next(null);
        return res;
      })
    )
  }

  getDepartmentById(id: number): Observable<Departments>{
    return this._httpClient.get<Departments>(this.apiUrl+"api/department/"+ id).pipe(
      map((res: any): Departments =>{
        return res;
      })
    )
  }

  setNullBehaviour(): void{
    this._deletedDepartment.next(null);
    this._newDepartment.next(null);
    this._updatedDepartment.next(null);
  }

  

}
