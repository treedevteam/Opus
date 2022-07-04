import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { first } from 'rxjs';
import { DepartmentsService } from '../departments.service';
import { Departments } from '../departments.types';

@Component({
  selector: 'app-store-departments',
  templateUrl: './store-departments.component.html',
  styleUrls: ['./store-departments.component.scss']
})
export class StoreDepartmentsComponent implements OnInit {
  @ViewChild('storeDepartmentNgForm') storeDepartmentNgForm: NgForm;
  @Input() count: number;
  alert: { type: FuseAlertType; message: string } = {
      type: 'success',
      message: '',
  };

  storeDepartment: FormGroup;
  file: any = null;
  isAddMode!: boolean;
  departmetId: number;
  url: any = null;
  uploaded = false;
  departmentById: Departments;

  constructor(public dialogRef: MatDialogRef<StoreDepartmentsComponent>,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
      private departmentService: DepartmentsService,
      private _snackBar: MatSnackBar,
      private _route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
      this.storeDepartment = this._formBuilder.group({
          name: ['', Validators.required],
          image: ['', Validators.required],
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnChanges(): void {
  }

  onFileChange(pFileList: File): void {
      this.uploaded = true;
      this.file = pFileList[0];

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
                  this._snackBar.open('Successfully upload!', 'Close', {
                      duration: 2000,
                  });

                  const reader = new FileReader();
                  reader.readAsDataURL(pFileList[0]);
                  reader.onload = (event): any => {
                      this.url = event.target.result;
                  };
                  this.storeDepartment.get('image').patchValue(this.file);
                  console.warn(this.url, 'url');
                  console.warn(this.file, 'url');
              }else{
                  this._snackBar.open('File is too large!', 'Close', {
                      duration: 2000,
                  });
                  this.uploaded = false;
                  this.file = null;
                  this.storeDepartment.get('image').patchValue(null);
                  this.url = null;
              }
          }else{
              this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                  duration: 2000,
              });
              this.uploaded = false;
              this.file = null;
              this.storeDepartment.get('image').patchValue(null);
              this.url = null;
          }
      }
  }

  deleteFile(): void {
      this.uploaded = false;
      this.file = null;
      this.url = null;
      this.storeDepartment.get('image').patchValue(null);
      this._snackBar.open('Successfully delete!', 'Close', {
          duration: 2000,
      });
  }

  storeDepartmentfunc(): any {
    const formData = new FormData();
    const result = Object.assign({}, this.storeDepartment.value);
    formData.append('name', this.storeDepartment.get('name').value);
    formData.append('image', this.file);
    console.log(this.storeDepartment.get('name').value, 'this.storeDepartment.get(\'name\').value');
    console.log(this.file, 'this.file');

      this.departmentService.addDepartment(formData).subscribe(
        (res)=>{
          console.log(res);
          this.dialogRef.close();
          this._snackBar.open('Added successfuly!', 'close', {
            duration: 3000,
          });
        }
      );
  }
}
