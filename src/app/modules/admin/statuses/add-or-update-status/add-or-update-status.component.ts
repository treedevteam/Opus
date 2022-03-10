import { Component, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AddOrUpdate } from '../../pages/departaments/model/add-or-update';
import { StatusService } from '../services/status.service';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { Status } from '../model/status';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { parseInt } from 'lodash';

@Component({
  selector: 'app-add-or-update-status',
  templateUrl: './add-or-update-status.component.html',
  styleUrls: ['./add-or-update-status.component.scss']
})
export class AddOrUpdateStatusComponent implements OnInit {

    @ViewChild('storeStatusNgForm') storeStatusNgForm: NgForm;
    @Output() parentFunction: EventEmitter<AddOrUpdate> = new EventEmitter();
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };

    isAddMode: boolean = true;
    storeStatus: FormGroup;
    stautsId: number;
    statusById: Status;
    randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    constructor(
        private _formBuilder: FormBuilder,
        private _statusService: StatusService,
        private _snackBar: MatSnackBar,
        private _route: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        this._route.paramMap.subscribe((params: ParamMap)=> {
            const id = params.get('id');
            this.stautsId = parseInt(id);
            this.isAddMode = !id;
            if (!this.isAddMode) {
                this.getStatusById(id);
            }
        });
        this.storeStatus = this._formBuilder.group({
            name: ['', Validators.required],
            color: [this.randomColor, Validators.required],
        });
    }

    storeStatusFunc(): any{
        this._statusService._addStatus(this.storeStatus.value).subscribe((res: any)=>{
                this._snackBar.open('Added successfuly!', 'close', {
                    duration: 3000,
                });
        },(err: any)=>{
            console.log(err);
        });
    }

    getStatusById($id): void{
        this._statusService._getStatusById($id).subscribe((res: any)=>{
            console.log(res);
            this.storeStatus.patchValue({
                name: res.name,
                color: res.color
                });
        this.stautsId = res.id;
    },(err: any)=>{
        console.log(err);
    });
    }

    editStatusSubmit(): void{
        this._statusService._updateStatus(this.storeStatus.value, this.stautsId ).subscribe((res: any)=>{
            this._snackBar.open('Updated successfuly!', 'close', {
                duration: 3000,
            });
    },(err: any)=>{
        console.log(err);
    });
    }

}
