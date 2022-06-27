import { Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Location } from './model/location';
import { LocationsService } from './services/locations.service';

class AddOrUpdate {
    isUpdate?: boolean;
    data: any;
}
const ELEMENT_DATA: Location[] = [
];
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'color','edit', 'delete'];
    dataSource = ELEMENT_DATA;
    constructor(
        private _locationService: LocationsService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.getLocations();
    }
    parentFunction(data: AddOrUpdate): void{
        if(!data.isUpdate){
            this.dataSource.unshift(data.data);
            this.dataSource = [...this.dataSource];
        }else{
            this.getLocations();
        }
    }
    getLocations(): any{
        this._locationService._getLocations().subscribe((res: any)=>{
            this.dataSource = res;
        },(err: any)=>{
            console.log(err);
        });
    }




    deleteLocation($id: number, $rowNumber: number): void{
        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this._locationService._deleteLocation($id).subscribe((res: any)=>{
                    this.dataSource.splice($rowNumber, 1);
                    this.dataSource = [...this.dataSource];
                    this._snackBar.open('Deleted successfuly!', 'close', {
                        duration: 3000,
                    });
                },(err: any)=>{
                    console.log(err);
                });
            }
        });
    }

    navigateTo(id: number): void{
        this._router.navigate([`/locations/${id}`]);

    }
}
