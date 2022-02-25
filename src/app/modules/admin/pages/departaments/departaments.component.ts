import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { combineLatest, concatMap, distinctUntilChanged, filter, find, first, from, map, Observable, of, tap, toArray } from 'rxjs';
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

    //getDepartments$ = this.departmentService.getDepartments$;

    showAlert: boolean = false;
    editAssetId: number;
    displayedColumns: string[] = ['position', 'name', 'image', 'actions'];
    dataSource: any;

    isUpdateMode: boolean = false;
    id: number;

    getDepartments$ = combineLatest([
        this.departmentService.getDepartmentsData$,
        this.departmentService.getAddedDepartment(),
        this.departmentService.getUpdatedDepartment(),
        this.departmentService.getDeletedDepartment()
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
    }

    openSnackBar(message: string): void{
        this._snackBar.open(message, 'Undo');
    }



    getDepartments(): void{

        this.getDepartments$.subscribe((res: any)=>{
            this.dataSource = res;
        },(err: any)=>{
            console.log(err);
        });
    }

    deleteDepartment(id: number, rowIndex: number): void{
        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this.departmentService.deleteDepartment(id).subscribe((res: any)=>{
                    this.openSnackBar('Department deleted successfully!');
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




