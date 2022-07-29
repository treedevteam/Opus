/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { Users } from './model/users';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

class AddOrUpdate {
    isUpdate?: boolean;
    data: any;
}

const ELEMENT_DATA: Users[] = [
];
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    apiUrl = environment.apiUrl;
    displayedColumns: string[] = ['name', 'email', 'department', 'image','edit', 'delete'];
    constructor(private _usersService: UserService,
        private fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _router: Router,
        ) { }
    getUsers$ = this._usersService.users$


    usersWithRoleDep$ = combineLatest([
        this.getUsers$,
        this._usersService._getDepartments(),
        this._usersService._getRoles()
        ]).pipe(
        map(([users, departments, roles]) =>
        users.map(user =>({
            ...user,
            department_id: departments.find(s => +user.department_id === +s.id),
            role_id: roles.find(p => +user.role_id === +p.id),
        }))),
        shareReplay(1)
        );


    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): any{
        return this._usersService.getUsers().subscribe((res: any)=>{
        },(err: any)=>{
            console.log(err);
        });
    }

    deleteUser($userId: number, $rowNumber: number): any{
        const dialogRef = this.fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this._usersService.deleteUser($userId).subscribe((res: any)=>{
                this._snackBar.open('Updated successfuly!', 'close', {
                    duration: 3000,
                });
                },(err: any)=>{
                    console.log(err);
                });
            }
        });
    }


    navigateTo(id: number): void{
        this._router.navigate([`admin/users/${id}`]);
    }

}
