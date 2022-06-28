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
    // file: File = null;
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
            files: [ '',[Validators.required]]
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

      onFileSelect(event)
      {
        if(event.target.files.length > 0){
            const file = event.target.files[0];

            this.composeForm.patchValue({
                files: file
            });
        }
      }


    /**
     * Show the copy field with the given field name
     *
     * @param name
     */
    showCopyField(name: string): void
    {
        debugger;
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

    /**
     * Send the message
     */
    send(): void
    {
        debugger;
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
        this._mailbox.sendEmail({users:'[' + user +']',subject: this.composeForm.value.subject,content: this.composeForm.value.content,files:this.composeForm.value.files}).subscribe((res)=>{
        console.log(res);
        this.matDialogRef.close();
    });
    }

}
