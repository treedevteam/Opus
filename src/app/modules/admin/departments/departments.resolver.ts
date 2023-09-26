import {Injectable} from '@angular/core';
import {
    Router, Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import {iif, mergeMap, Observable, of, switchMap, throwError} from 'rxjs';
import {DepartmentsService} from './departments.service';
import {Departments, Boards} from './departments.types';
import {BoardsService} from './boards/boards.service';
import {Task2} from '../tasks/tasks.types';
import {UserService} from 'app/core/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class DepartmentsResolver implements Resolve<any> {
    constructor(private _departmentsService: DepartmentsService, private _userService: UserService, private _router: Router) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Departments[]> {
//Duhet te permisohet
//     this._userService.get().subscribe((res:any)=>{
//       if(res.data.role.name === "User"){
//         const parentUrl = '/departments/'+res.data.department.id
//         this._router.navigateByUrl(parentUrl);
//       }
//     })
//
//     return this._departmentsService.getDepartments();
        return this._userService.get().pipe(
            switchMap((res: any) => {
                if (res.data.role.name === "User") {
                    const parentUrl = 'departments/' + res.data.department.id;

                    this._router.navigateByUrl(parentUrl);
                    return of([]);
                } else {
                    return this._departmentsService.getDepartments();
                }
            })
        );
    }
}


@Injectable({
    providedIn: 'root'
})
export class BoardsResolver implements Resolve<any> {

    constructor(private _boardService: BoardsService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Boards[]> {
        return this._boardService.getBoards(+route.paramMap.get('depId'));
    }
}


@Injectable({
    providedIn: 'root'
})
export class BoardTaskResolve implements Resolve<any> {

    constructor(private _boardService: BoardsService,) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task2[]> {

        return this._boardService.getBoardTasks(+route.paramMap.get('boardId'));
    }
}
