import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { first } from 'rxjs';
import { AddOrUpdate } from './model/add-or-update';
import { Departments } from './model/departments.model';
import { DepartamentsService } from './services/departaments.service';




const ELEMENT_DATA: Departments[] = [
];

@Component({
  selector: 'app-departaments',
  templateUrl: './departaments.component.html',
  styleUrls: ['./departaments.component.scss']
})
export class DepartamentsComponent implements OnInit {


    showAlert: boolean = false;
    editAssetId: number;
    displayedColumns: string[] = ['position', 'name', 'image', 'actions'];
    dataSource = ELEMENT_DATA;

    isUpdateMode: boolean = false;
    id: number;
    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private departmentService: DepartamentsService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar
        ) { }

    ngOnInit(): void {
        this.getDepartments();
    }

    parentFunction(data: AddOrUpdate): void{
        console.log(data);
        if(!data.isUpdate){
            this.dataSource.unshift(data.data);
            this.dataSource = [...this.dataSource];
        }else{
            this.getDepartments();
        }
    }
    openSnackBar(message: string): void{
        this._snackBar.open(message, 'Undo');
    }



    getDepartments(): void{
        this.departmentService.getDepartments().subscribe((res: any)=>{
            this.dataSource = res.data;
        },(err: any)=>{
            console.log(err);
        });
    }

    deleteDepartment(id: number, rowIndex: number): void{
        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if(result === 'confirmed'){
                this.departmentService.deleteDepartment(id).subscribe((res: any)=>{
                    this.dataSource.splice(rowIndex, 1);
                    this.dataSource = [...this.dataSource];
                    this.openSnackBar(res.success);
                },(err: any)=>{
                    console.log(err);
                });
            }
        });
    }

    navigateTo(id: number): void{
        this._router.navigate([`/pages/departments/${id}`]);
        this.isUpdateMode = true;
        this.editAssetId = id;
    }


}
