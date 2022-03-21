import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DepartmentsService } from './departments.service';
import { Departments } from './departments.types';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<any> {

  constructor(private _departmentsService: DepartmentsService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Departments[]> {
    return this._departmentsService.getDepartments();
  }
}
