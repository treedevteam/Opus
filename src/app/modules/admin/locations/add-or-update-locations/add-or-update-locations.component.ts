import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AddOrUpdate } from '../../pages/departaments/model/add-or-update';
import { LocationsService } from '../services/locations.service';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { Location } from '../model/location';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { parseInt } from 'lodash';

@Component({
  selector: 'app-add-or-update-locations',
  templateUrl: './add-or-update-locations.component.html',
  styleUrls: ['./add-or-update-locations.component.scss']
})
export class AddOrUpdateLocationsComponent implements OnInit {

    @ViewChild('storeLocationsNgForm') storeLocationsNgForm: NgForm;
    @Output() parentFunction: EventEmitter<AddOrUpdate> = new EventEmitter();
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };

    isAddMode: boolean = true;
    storeLocation: FormGroup;

    locationById: Location;
    randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    constructor(
        private _formBuilder: FormBuilder,
        private _locationsService: LocationsService,
        private _snackBar: MatSnackBar,
        private _route: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        this._route.paramMap.subscribe((params: ParamMap)=> {
            const id = params.get('id');
            this.isAddMode = !id;
            if (!this.isAddMode) {
                this.getLocationById(id);
            }
        });
        this.storeLocation = this._formBuilder.group({
            name: ['', Validators.required],
            color: [this.randomColor, Validators.required],
        });
    }
    storeDepartment(): any{
        this._locationsService._addLocation(this.storeLocation.value).subscribe((res: any)=>{
                const d = new AddOrUpdate();
                d.isUpdate = false;
                d.data = res;
                this.parentFunction.emit(d);
                this._snackBar.open('Added successfuly!', 'close', {
                    duration: 3000,
                });
        },(err: any)=>{
            console.log(err);
        });
    }

    getLocationById($id): void{
        this._locationsService._getLocationById($id).subscribe((res: any)=>{
            this.storeLocation.patchValue({
                name: res.name,
                color: res.color
                });
        this.locationById = res;
    },(err: any)=>{
        console.log(err);
    });
    }

    editLocationSubmit(): void{
        this._locationsService._updateLocations(this.storeLocation.value, this.locationById.id ).subscribe((res: any)=>{
            const d = new AddOrUpdate();
            d.isUpdate = true;
            d.data = res;
            this.parentFunction.emit(d);
            this._snackBar.open('Updated successfuly!', 'close', {
                duration: 3000,
            });
    },(err: any)=>{
        console.log(err);
    });
    }

}
