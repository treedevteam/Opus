import { Tag, Task, Task2, TaskWithDepartment } from './tasks.types';
import { TasksService } from './tasks.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, mergeMapTo, Observable, throwError } from 'rxjs';
import { Departments } from '../departments/departments.types';

@Injectable({
    providedIn: 'root'
})
export class TasksTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _tasksService: TasksService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Tag[]>
    {
        return this._tasksService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TasksDepartmentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _tasksService: TasksService,
        private _router: Router,
        )
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
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Departments>
     {
         
         return this._tasksService.getDepartment(+route.paramMap.get('id'))
             .pipe(
                 // Error here means the requested task is not available
                 catchError((error) => {
 
                     // Log the error
                     console.error(error);
 
                     // Get the parent url
                     const parentUrl = state.url.split('/').slice(0, -1).join('/');
 
                     // Navigate to there
                     this._router.navigateByUrl(parentUrl);
 
                     // Throw an error
                     return throwError(error);
                 })
             );
     }
}

@Injectable({
    providedIn: 'root'
})
export class TasksResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _tasksService: TasksService,
        private _router: Router)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaskWithDepartment>
    {
        console.log(route.paramMap.get('id'));
        return this._tasksService.getDepartmentTasks(+route.paramMap.get('id'))
        .pipe(
            // Error here means the requested task is not available
            catchError((error) => {

                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
    }
}

@Injectable({
    providedIn: 'root'
})
export class TasksTaskResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _tasksService: TasksService
    )
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task2>
    {
        
        return this._tasksService.getTaskById2(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested task is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}
