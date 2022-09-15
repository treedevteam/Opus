/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';

import { FuseAlertType } from '@fuse/components/alert';
// import { AddOrUpdate } from '../../pages/departaments/model/add-or-update';
import { UserService } from '../services/user.service';
import { EventEmitter } from '@angular/core';
import { parseInt } from 'lodash';
import { Roles, Users } from '../model/users';
import { Departments } from '../../departments/departments.types';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { observable } from 'rxjs';
export class AddOrUpdate {
    isUpdate?: boolean;
    data: any;
}

@Component({
  selector: 'app-add-or-update-users',
  templateUrl: './add-or-update-users.component.html',
  styleUrls: ['./add-or-update-users.component.scss']
})
export class AddOrUpdateUsersComponent implements OnInit {
    @ViewChild('storeUsersNgForm') storeUsersNgForm: NgForm;
    @Output() parentFunction: EventEmitter<AddOrUpdate> = new EventEmitter();
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    departmentsList: Departments[];
    roles: Roles[];
    userId: number;
    userById: Users;

    isChangeOptionsOn:boolean = false;
    file: any = null;
    url: any = null;
    uploaded = false;
    storeUsers: FormGroup;
    isAddMode: boolean = true;
    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _route: ActivatedRoute,
        private _usersService: UserService,
        private _router: Router,
    ) { }

    ngOnInit(): void {
        this.departments();
        this.getRoles();
        this.getUserdIdFromUrl();
        this.storeUsers = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            department_id: ['', Validators.required],
            role_id: ['', Validators.required],
            file: [''],
        });
    }

    getRoles(): void {
        this._usersService._getRoles().subscribe((res)=>{
            this.roles = res;
            console.log(res);

        });
    }

    onFileChange(pFileList: File): void{
        if (pFileList[0]) {
            if (
                pFileList[0].type === 'image/jpeg' ||
                pFileList[0].type === 'image/png' ||
                pFileList[0].type === 'image/jpg'
            ) {
                if (pFileList[0].size < 200 * 200) {
                    /* Checking height * width*/
                }
                if (pFileList[0].size < 512000) {
                    this.uploaded = true;
                    this.file = pFileList[0];
                    const file = pFileList[0];
                    this.storeUsers.patchValue({
                        file: pFileList[0]
                        });
                    this._snackBar.open('Successfully upload!', 'Close', {
                      duration: 2000,
                    });
                    const reader = new FileReader();
                    reader.readAsDataURL(pFileList[0]);
                    reader.onload = (event): any => {
                        this.url = event.target.result;
                    };
                }else{
                    this._snackBar.open('File is too large!', 'Close', {
                        duration: 2000,
                    });
                    this.uploaded = false;
                    this.file = null;
                    this.url = null;
                }
            }else{
                this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.url = null;
            }
        }
      }

    storeUserSubmit(): void{
        const formData  = new FormData();
        const result = Object.assign({}, this.storeUsers.value);
        formData.append('name', this.storeUsers.get('name').value);
        formData.append('email', this.storeUsers.get('email').value);
        formData.append('password', this.storeUsers.get('password').value);
        formData.append('department_id', this.storeUsers.get('department_id').value);
        formData.append('role_id', this.storeUsers.get('role_id').value);
        formData.append('image', this.storeUsers.get('file').value);
        this._usersService.storeUsers(formData).subscribe((res: any)=>{
            this._snackBar.open('Added successfuly!', 'close', {
                duration: 3000,
            });
        },(err: any)=>{
            console.log(err);
        });
    }

    editUserSubmit(): void{
        const formData2  = new FormData();
        const result = Object.assign({}, this.storeUsers.value);
        formData2.append('name', this.storeUsers.get('name').value);
        formData2.append('email', this.storeUsers.get('email').value);
        formData2.append('password', this.storeUsers.get('password').value);
        formData2.append('department_id', this.storeUsers.get('department_id').value);
        formData2.append('role_id', this.storeUsers.get('role_id').value);
        if(this.file instanceof File){
            formData2.append('image', this.file);
        }else{
        }
        this._usersService._updateUser(this.userId, formData2).subscribe((res: any)=>{
            console.log(res);
            this._snackBar.open('Updated successfuly!', 'close', {
            duration: 3000,
        });
        },(err: any)=>{
            console.log(err);
        });
    }

    deleteFile(): void{
        this.uploaded = false;
        this.file = null;
        this.url = null;
        this.storeUsers.patchValue({
            file: null
        });
        this._snackBar.open('Successfully delete!', 'Close', {
          duration: 2000,
        });
    }


    departments(): any{
        return this._usersService._getDepartments().subscribe((res: any)=>{
            this.departmentsList = res;
        },(err: any)=>{
            console.log(err);
        });
    }

    getUserById($id: number): any{
        return this._usersService._getUserByid($id).subscribe((res: any)=>{
            // this.userById = res;
            this.storeUsers.patchValue({
                name: res.name, email: res.email,department_id:res.department_id,role_id:res.role_id,file:res.image
                });
            this.file = res.image;

        },(err: any)=>{
            console.log(err);

        });
    }


    getUserdIdFromUrl(): void{
        this._route.paramMap.subscribe((params: ParamMap)=> {
            const id = params.get('id');
            this.userId = parseInt(id);
            this.isAddMode = !this.userId;
            if (!this.isAddMode) {
                this.getUserById(this.userId);
            }
        });
    }
    toggle(event: MatCheckboxChange){
        this.isChangeOptionsOn = event.source.checked;
    }
}
