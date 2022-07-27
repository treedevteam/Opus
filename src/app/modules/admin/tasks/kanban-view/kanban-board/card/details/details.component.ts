/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap, Observable } from 'rxjs';
import * as moment from 'moment';
import { assign } from 'lodash-es';
import { ScrumboardService } from '../../scrumboard.service';
import { Board, Card, Label } from '../../scrumboard.models';
import { Task2, Users } from 'app/modules/admin/tasks/tasks.types';
import { TasksService } from 'app/modules/admin/tasks/tasks.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksListComponent } from 'app/modules/admin/tasks/list/list.component';
import { environment } from 'environments/environment';

@Component({
    selector       : 'scrumboard-card-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:[TasksListComponent]
})
export class ScrumboardCardDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    apiUrl = environment.apiUrl
    board: Board;
    card: Card;
    cardForm: FormGroup;
    fileForm: FormGroup;
    taskById$: Observable<Task2>;
    taskFile$ = this._tasksService.taskById$;
    file: any = null;
    uploaded: boolean;
    url ;
    fileName = '';
    filteredUsers: Users[];
    usersList: Users[];
    priority = this._tasksService.getPriorities$;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<ScrumboardCardDetailsComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _scrumboardService: ScrumboardService,
        private _tasksService: TasksService,
        private _prioritys: TasksListComponent,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any
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
        console.log(this.data,'from dialog');

        // Get the board
        this._scrumboardService.board$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((board) => {

                // Board data
                this.board = board;

                // Get the labels
            });

        // Get the card details
        if(this.data === 'Task'){
            this.taskById$ = this._tasksService.taskById$;
        }else{
            this.taskById$ = this._tasksService.mysubtask$;

        }

        // Prepare the card form
        this.cardForm = this._formBuilder.group({
            id          : [''],
            title       : ['', Validators.required],
            description : [''],
            deadline    : [null],
            priority    : [null],
            raport      : [null],
            restrictions    : [null],
            status    : [null],
            file: [''],

        });


        // Fill the form
        this.taskById$.subscribe((res)=>{
            console.log(res);
            this.cardForm.setValue({
                id          : res.id,
                title       : res.title,
                description : res.description,
                deadline    : res.deadline,
                priority    : res.priority,
                raport      : res.raport,
                restrictions: res.restrictions,
                status      : res.status,
                file: res.file,
            });
        });

      
        // Update card when there is a value change on the card form
        this.cardForm.valueChanges
        .pipe(
            tap((value) => {

                // Update the card object
                    this.card = assign(this.card, value);
                }),
                debounceTime(300),
                takeUntil(this._unsubscribeAll)
                )
                .subscribe((value) => {
                    
                    console.log(value,'value');
                    // Update the card on the server
                    debugger
                    if(this.data === 'Task'){
                         const formData = new FormData();
                        const result  = Object.assign({},this.cardForm.value);
                        formData.append('id',this.cardForm.get('id').value);  
                        formData.append('title',this.cardForm.get('title').value);  
                        formData.append('description',this.cardForm.get('description').value);  
                        formData.append('deadline',this.cardForm.get('deadline').value);  
                        formData.append('priority',this.cardForm.get('priority').value);  
                        formData.append('raport',this.cardForm.get('raport').value);  
                        formData.append('restrictions',this.cardForm.get('restrictions').value);  
                        formData.append('status',this.cardForm.get('status').value);  
                        this._tasksService.updateTaskservice(formData, value.id).subscribe((res)=>{
                    console.log(res,'EEWRWERWERWERw');
                });
                }else{
                    this._tasksService.updateSubtaskById(value, value.id ).subscribe((res)=>{
                        // this.cardForm.setValue({
                        //     id          : res.id,
                        //     title       : res.title,
                        //     description : res.description,
                        //     deadline    : res.deadline,
                        //     priority    : res.priority,
                        //     raport      : res.raport,
                        //     restrictions: res.restrictions,
                        //     status      : res.status
                        // });

                        console.log(res,'EEWRWERWERWERw');
                    });
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return whether the card has the given label
     *
     * @param label
     */
    hasLabel(label: Label): boolean
    {
        return !!this.card.labels.find(cardLabel => cardLabel.id === label.id);
    }




    /**
     * Toggle card label
     *
     * @param label
     * @param change
     */
    toggleProductTag(label: Label, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addLabelToCard(label);
        }
        else
        {
            this.removeLabelFromCard(label);
        }
    }
    
    filterDepartments(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredUsers = this.usersList.filter(tag => tag.name.toLowerCase().includes(value));
    }


    /**
     * Add label to the card
     *
     * @param label
     */
    addLabelToCard(label: Label): void
    {
        // Add the label
        this.card.labels.unshift(label);

        // Update the card form data
        this.cardForm.get('labels').patchValue(this.card.labels);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    selectPriority(status){
       this._prioritys.selectPriority(status);
 }
    /**
     * Remove label from the card
     *
     * @param label
     */
    removeLabelFromCard(label: Label): void
    {
        // Remove the label
        this.card.labels.splice(this.card.labels.findIndex(cardLabel => cardLabel.id === label.id), 1);

        // Update the card form data
        this.cardForm.get('labels').patchValue(this.card.labels);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Check if the given date is overdue
     */
    isOverdue(date: string): boolean
    {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read the given file for demonstration purposes
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any>
    {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }
    // onFileChange(event): void{
    //     debugger
    //     const file: File = event.target.files[0];
    //     console.log(file)
    //     if(file){
    //         this.fileName = file.name;
    //         const formData = new FormData();
    //         const result  = Object.assign({},this.cardForm.value);
    //         formData.append('file', file);
    //         this.file = file
    //         console.log(this.file,'try this ')
    //         


    //     }
       
    //   }



    
  onFileChange(pFileList: File): void {
    debugger;
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
                this.cardForm.get('file').patchValue(this.file);

                this.uploadTaskImage();
                console.warn(this.url, 'url');
                console.warn(this.file, 'url');
            }else{
                this._snackBar.open('File is too large!', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.cardForm.get('file').patchValue(null);
                this.url = null;
            }
        }else{
            this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                duration: 2000,
            });
            this.uploaded = false;
            this.file = null;
            this.cardForm.get('file').patchValue(null);
            this.url = null;
        }
    }
}

uploadTaskImage(){
    const formData = new FormData();
    const result = Object.assign({}, this.cardForm.value);
    formData.append('file', this.cardForm.get('file').value);
    this._tasksService.addfileToTask(formData,this.cardForm.get('id').value).subscribe((res)=>{
        console.log(res,'EEWRWERWERWERw');
    }); 
}
deleteFile(id){
    console.log(id)
    this._tasksService.deleteFileFromTask(id).subscribe((res)=>{
        this._snackBar.open('Successfully deleted!', 'Close', {});
        this.ngOnInit();
    });
}
     
}

