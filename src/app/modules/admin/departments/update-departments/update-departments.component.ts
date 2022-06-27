import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { DepartmentsService } from '../departments.service';
import { Departments } from '../departments.types';

@Component({
  selector: 'app-update-departments',
  templateUrl: './update-departments.component.html',
  styleUrls: ['./update-departments.component.scss']
})
export class UpdateDepartmentsComponent implements OnInit {
  @ViewChild('storeDepartmentNgForm') storeDepartmentNgForm: NgForm;
  storeDepartment: FormGroup;
  url: any = null;
  file: any = null;
  departmetId: number;
  uploaded = false;
  departmentById: Departments


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
      private departmentService: DepartmentsService,
      public dialogRef: MatDialogRef<UpdateDepartmentsComponent>,
      public dialog:MatDialog,
      private _snackBar: MatSnackBar,
      private _formBuilder: FormBuilder,

  ) {
   }

  ngOnInit(): void {
    this.storeDepartment = this._formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
    this.getDepartmentById(this.data.dataKey.id)

  }

  editDepartmentFunc(): void {
    const formData = new FormData();
    const result = Object.assign({}, this.storeDepartment.value);
    formData.append('name', this.storeDepartment.get('name').value);
    console.log(this.storeDepartment.get('name').value, "this.storeDepartment.get('name').value");
    if (this.file instanceof File) {
      formData.append('image', this.file);
  }
    this.departmentService.updateDepartments(formData, this.data.dataKey.id).subscribe(res=>{
      this.dialogRef.close();
    })
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

  getDepartmentById(id: number): void{
    this.departmentService.getDepartmentById(id).pipe(first())
    .subscribe(
        (res) => {
          console.log(res,"RESSSSSSSSSSSSSSSS");
          this.departmentById = res;
            this.file = res.image;
            this.storeDepartment.setValue({name: res.name, image: res.image});
        },
        (err) => {
            console.log(err);
        }
    );
  }



}
