/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable arrow-parens */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslind-disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsignUsersToBoardComponent } from '../../tasks/asign-users-to-board/asign-users-to-board.component';
import { TasksService } from '../../tasks/tasks.service';
import { Users } from '../../users/model/users';
import { MailboxService } from '../mailbox.service';

@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MailboxComposeComponent implements OnInit
{
    board_department: number;
    data: string;
    Userid: number;
    items;
    newEmail;
    allFiles: any;
    url: any;
    uploaded: boolean;
    file = null;
    composeForm: FormGroup;
    allusers: Users[] =[];
    mentionConfig = {
        triggerChar: '@',
    };


    copyFields: { file: boolean} = {
        file : false,
    };
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean']
        ]
    };

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: FormBuilder,
        private _tasksService: TasksService,
        private _mailbox: MailboxService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar
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
        // Create the form
        this.composeForm = this._formBuilder.group({
            // users     : this._formBuilder.array([
            //     this._formBuilder.control('')
            // ]),
            users:['',Validators.required],
            subject: [''],
            content   : ['', [Validators.required]],
            files: ['']
        });

        this._mailbox.getAllUsers().subscribe((res: any)=>{
            this.items =  res;
        });

    }


    getFields(input, field) {   
        const output = [];
        for (let i=0; i < input.length ; ++i)
            {output.push(input[i][field]);}
        return output;
    }
  



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    assignUserPopup(): void {
        this._tasksService.getUsersDepartment(this.board_department).subscribe((res)=>{
            const dialogRef = this.dialog.open(AsignUsersToBoardComponent, {
                width: '100%',
                maxWidth:'700px',
                height:'400px',
                maxHeight:'100%'
              });

              dialogRef.afterClosed().subscribe((result) => {
              });
        });
      }

      /**On file select */

    //   onFileSelect(event)
    //   {
    //     ;
    //     if(event){          
    //         this.allFiles = event;
    //         this.composeForm.patchValue({
    //             files: event
    //             });
    //     }
    //   }


    /**
     * Show the copy field with the given field name
     *
     * @param name
     */
    showCopyField(name: string): void
    {
        ;
        // Return if the name is not one of the available names
        if ( name !== 'file' && name !== 'bcc' )
        {
            return;
        }

        // Show the field
        this.copyFields[name] = true;
    }

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    
  onFileChange(pFileList: File): void{
    console.warn(pFileList);
    if (pFileList[0]) {
        if (
            pFileList[0].type === 'image/png' ||
            pFileList[0].type === 'image/jpg'
        ) {
            if (pFileList[0].size < 200 * 200) {
                /* Checking height * width*/
            }
            if (pFileList[0].size < 512000) {
                this.uploaded = true;
                this.file = pFileList[0];
                const file = pFileList[0];
                this.composeForm.patchValue({
                    files: pFileList[0]
                    });
                    this._snackBar.open('Successfully upload!', 'Close', {
                        duration: 2000,
                    });
                    const reader = new FileReader();
                    reader.readAsDataURL(pFileList[0]);
                    reader.onload = (event): any => {
                        this.url = event.target.result;
                    };
                } else {
                    this._snackBar.open('File is too large!', 'Close', {
                        duration: 2000,
                    });
                    this.uploaded = false;
                    this.file = null;
                    this.url = null;
                }
            } else {
                this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                    duration: 2000,
                });
                this.uploaded = false;
                this.file = null;
                this.url = null;
            }
        }
    }

    /**
     * Send the message
     */
    send(): void
    {
        
        console.warn(this.allFiles,"FAJLLAT");
        const user = this.composeForm.value.users
        .replace(/(\r\n|\n|\r)/gm, '')
        .split('@')
        .filter(
          t => t != '' && this.items.findIndex(u => t.includes(u.name) === true) > -1
        )
        .map(name => this.items.find(s => name.includes(s.name) === true).id);
        console.log(user,'TESTSSSSSST');
        const p = {...this.composeForm.value};
         p.users=user;
    const formData = new FormData();
    const result = Object.assign({}, this.composeForm.value);
    formData.append('users','[' + user +']');
    formData.append('subject',this.composeForm.get('subject').value);
    formData.append('content',this.composeForm.get('content').value);
    formData.append('files',this.composeForm.get('files').value);
    console.log(this.composeForm.get('files').value);
    this._mailbox.sendEmail(formData).subscribe((res)=>{
        console.log(res);
        this.matDialogRef.close();
     });
}

}
