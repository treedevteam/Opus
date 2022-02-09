import { Component, OnInit } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Users } from './model/users';
import { UserService } from './services/user.service';
const ELEMENT_DATA: Users[] = [
];
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'email', 'department', 'role', 'image','actions'];
    dataSource = ELEMENT_DATA;
    constructor(private _usersService: UserService,
        private fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.getUsers();
    }


    getUsers(): any{
        return this._usersService.getUsers().subscribe((res: any)=>{
            console.log(res);
            this.dataSource = res.data;
        },(err: any)=>{
            console.log(err);
        });
    }


    deleteUser($userId: number, $rowNumber: number): any{

        const dialogRef = this.fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
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

}
