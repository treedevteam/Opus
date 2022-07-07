import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, mergeMapTo, Observable, throwError, combineLatest } from 'rxjs';
import { DepartmentsService } from '../departments/departments.service';
import { DashboardService } from './services/dashboard.service';
import { Departments } from '../departments/departments.types';

@Injectable({
    providedIn: 'root'
})
export class DashboardResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    // vm$ = combineLatest(this._dashboardService.myDepartment(),)
    constructor(private _dashboardService: DashboardService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any
    {
        this._dashboardService.getUsersDepartment().subscribe(res=>{
            console.log(res);
        });
        return this._dashboardService.getPostsDepartment() 
    }
}
