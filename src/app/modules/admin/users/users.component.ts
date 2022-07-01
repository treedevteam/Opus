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

    displayedColumns: string[] = ['position', 'name', 'email', 'department', 'role', 'image','edit', 'delete'];
    dataSource = ELEMENT_DATA;
    constructor(private _usersService: UserService,
        private fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _router: Router,
        ) { }
        getUsers$ = combineLatest([
            this._usersService.getUsers$,
            this._usersService.getAddedUser$,
            this._usersService.getUpdatedUsers$,
            this._usersService.getDeletedUsers$
        ],(g,p,u,d) => {
                if(p){
                    g.unshift(p);
                }else if(u){
                    const index = g.findIndex(x => x.id === u.id);
                    g.splice(index,1,u);
                }else if(d){
                const index = g.findIndex(x => x.id === d);
                if (index > -1) {
                    g.splice(index, 1);
                    }
                }
            return g;
            });


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

    parentFunction(data: AddOrUpdate): void{
        if(!data.isUpdate){
            this.dataSource.unshift(data.data);
            this.dataSource = [...this.dataSource];
        }else{
            this.getUsers();
        }
    }
    getUsers(): any{
        return this._usersService.getUsers().subscribe((res: any)=>{
            this.dataSource = res;
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
                this.dataSource.splice($rowNumber, 1);
                this.dataSource = [...this.dataSource];
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
