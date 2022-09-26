/* eslint-disable */


import { style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./account.scss']
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;
    file: any = null;
    photoUrl: any = null;
    uploaded = false;
    userInfo= this._userService.singleUser$
    user
    apiUrl = environment.apiUrl
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userInfo.subscribe((data:any)=>{
            this.user = data
        })
        // this._userService.user$.subscribe(res => {
        //     this.userInfo = res
        // });
        // Create the form
        this.accountForm = this._formBuilder.group({
            id    : [''],
            name: [''],
            email   : [''],
            department: {id:1},
            role : {id:1},
            image : [],
 
        });
        console.log(this.accountForm.get('role').value)
        this.accountForm.controls.name.setValue(this.user.name);
   
    }



    onFileChange(pFileList: File): void{
        console.log(this.photoUrl)
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
                    this.accountForm.patchValue({
                        image: pFileList[0]
                        });
                        const reader = new FileReader();
                        reader.readAsDataURL(pFileList[0]); 
                        reader.onload = (_event)=>{ 
                            this.photoUrl = reader.result; 
                            console.log(this.photoUrl)
                        }   
                        
                    this._snackBar.open('Successfully upload!', 'Close', {
                      duration: 2000,
                    });
          
                }else{
                    this._snackBar.open('File is too large!', 'Close', {
                        duration: 2000,
                    });
                    this.uploaded = false;
                    this.file = null;
                    this.photoUrl = null;
                }
            }else{
                this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.photoUrl = null;
            }
        }
      }
    save(){
        debugger
        console.warn(this.user)
        const formData2  = new FormData();
        const result = Object.assign({}, this.accountForm.value);
        formData2.append('name', this.accountForm.get('name').value);
        formData2.append('image', this.file);
        formData2.append('role.id', this.user.role.id);
        formData2.append('department.id', this.user.department.id);
        formData2.append('email', this.user.email);
        console.warn(formData2)
        this._userService.updatee(this.user.id,formData2).subscribe((res: any)=>{
                console.warn(res);
                this._snackBar.open('Updated successfuly!', 'close', {
                duration: 3000,
            });
        });
        }
        deleteFile(): void{
            this.uploaded = false;
            this.file = null;
            this.photoUrl = null;
            this.accountForm.patchValue({
                image: null
            });
            this._snackBar.open('Successfully delete!', 'Close', {
              duration: 2000,
            });
        }
      }