import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Board } from './_models/task';
import { TaskServiceService } from './_services/task-service.service';


@Injectable({
  providedIn: 'root'
})
export class BoardResolver implements Resolve<Board> {

  constructor(
    private _router: Router,
    private _taskService:TaskServiceService
  )
  {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
      return this._taskService.getBoard(+route.paramMap.get('boardId'))
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
export class TaskManagmentResolver implements Resolve<Task[]> {

  constructor(
    private _router: Router,
    private _taskService:TaskServiceService
  )
  {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._taskService.getBoardTasks(+route.paramMap.get('boardId'))
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
export class TaskResolver implements Resolve<Task> {

  constructor(
    private _router: Router,
    private _taskService:TaskServiceService
  )
  {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._taskService.getTask(+route.paramMap.get('taskId'))
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
export class SubtaskResolver implements Resolve<Task> {

  constructor(
    private _router: Router,
    private _taskService:TaskServiceService
  )
  {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._taskService.getSubtask(+route.paramMap.get('subtaskId'))
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
