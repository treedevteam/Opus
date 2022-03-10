import { Departments } from './../model/departments.model';
import { ActivatedRoute, ParamMap, Route } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import {
    Component,
    OnInit,
    ViewChild,
    Input,
    Output,
    OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DepartamentsService } from '../services/departaments.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
import { AddOrUpdate } from '../model/add-or-update';
import { parseInt } from 'lodash';

@Component({
    selector: 'app-store-department',
    templateUrl: './store-department.component.html',
    styleUrls: ['./store-department.component.scss'],
})
export class StoreDepartmentComponent implements OnChanges, OnInit {
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
    constructor(
        private _formBuilder: FormBuilder,
        private departmentService: DepartamentsService,
        private _snackBar: MatSnackBar,
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._route.paramMap.subscribe((params: ParamMap) => {
            const id = params.get('id');
            this.departmetId = parseInt(id);
            this.isAddMode = !this.departmetId;
            if (!this.isAddMode) {
                this.getDepartamentByid(this.departmetId);
            }
        });
        this.storeDepartment = this._formBuilder.group({
            name: ['', Validators.required],
            image: ['', Validators.required],
        });
    }

    ngOnChanges(): void {
        this._route.paramMap.subscribe((params: ParamMap) => {
            const id = params.get('id');
            this.departmetId = parseInt(id);
            if (this.departmetId) {
                if (!this.isAddMode) {
                    this.getDepartamentByid(this.departmetId);
                }
            }
        });
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
        this.departmentService.storeDepartment(formData).subscribe(
            (res: any) => {
                this._snackBar.open('Added successfuly!', 'close', {
                    duration: 3000,
                });
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    getDepartamentByid(id: number): void {
        console.warn(this.departmetId);
        this.departmentService
            ._getDepartamentByid(id)
            .pipe(first())
            .subscribe(
                (res) => {
                    this.departmentById = res;
                    this.file = res.image;
                    this.storeDepartment.setValue({ name: res.name });
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    editDepartmentFunc(): void {
        const formData2 = new FormData();
        const result = Object.assign({}, this.storeDepartment.value);
        formData2.append('name', this.storeDepartment.get('name').value);
        if (this.file instanceof File) {
            formData2.append('image', this.file);
        }
        this.departmentService
            ._updateDepartment(this.departmetId, formData2)
            .subscribe(
                (res: any) => {
                    this._snackBar.open('Updated successfuly!', 'close', {
                        duration: 3000,
                    });
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }
}
