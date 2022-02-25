import { Component, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AddOrUpdate } from '../../pages/departaments/model/add-or-update';
import { PrioritiesService } from '../services/priorities.service';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { Priorities } from '../model/priorities';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { parseInt } from 'lodash';

@Component({
  selector: 'app-add-or-update-priorities',
  templateUrl: './add-or-update-priorities.component.html',
  styleUrls: ['./add-or-update-priorities.component.scss']
})
export class AddOrUpdatePrioritiesComponent implements OnInit {

    @ViewChild('storePriorityNgForm') storePriorityNgForm: NgForm;
    @Output() parentFunction: EventEmitter<AddOrUpdate> = new EventEmitter();
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };

    isAddMode: boolean = true;
    storePriority: FormGroup;
    priorityId: number;
    priorityById: Priorities;
    randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    constructor(
        private _formBuilder: FormBuilder,
        private _priorityService: PrioritiesService,
        private _snackBar: MatSnackBar,
        private _route: ActivatedRoute,

    ) { }

    ngOnInit(): void {
        this._route.paramMap.subscribe((params: ParamMap)=> {
            const id = params.get('id');
            this.isAddMode = !id;
            if (!this.isAddMode) {
                this.getPriorityById(id);
            }
        });
        this.storePriority = this._formBuilder.group({
            name: ['', Validators.required],
            color: [this.randomColor, Validators.required],
        });
    }
    storePriorityFunc(): any{
        this._priorityService._addPriority(this.storePriority.value).subscribe((res: any)=>{
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

    getPriorityById($id): void{
        this._priorityService._getPriorityById($id).subscribe((res: any)=>{
            this.storePriority.patchValue({
                name: res.name,
                color: res.color
                });
                this.priorityId = $id;
        },(err: any)=>{
            console.log(err);
        });
    }

    editPrioritySubmit(): void{
        this._priorityService._updatePriority(this.storePriority.value, this.priorityId ).subscribe((res: any)=>{
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
