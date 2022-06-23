import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('supportNgForm') supportNgForm: NgForm;

  alert: any;
  supportForm: FormGroup;
  url: any;
  file: any;
  uploaded: boolean;
  private : any;

  constructor(private _formBuilder: FormBuilder,
    private _snackBar:MatSnackBar
    ) { }

  ngOnInit(): void {
     // Create the support form
     this.supportForm = this._formBuilder.group({
      message: ['', Validators.required],
      file:['']
  });
  }

  clearForm(): void
  {
      // Reset the form
      this.supportNgForm.resetForm();
  }

  /**
   * Send the form
   */
  sendForm(): void
  {
      // Send your form here using an http request
      console.log('Your message has been sent!');

      // Show a success message (it can also be an error message)
      // and remove it after 5 seconds
      this.alert = {
          type   : 'success',
          message: 'Your request has been delivered! A member of our support staff will respond as soon as possible.'
      };

      setTimeout(() => {
          this.alert = null;
      }, 7000);

      // Clear the form
      this.clearForm();
  }

    onFileChange(pFileList: File): void{

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
                  this.uploaded = true;
                  this.file = pFileList[0];
                  const file = pFileList[0];
                  this.supportForm.patchValue({
                      file: pFileList[0]
                      });
                  this._snackBar.open('Successfully upload!', 'Close', {
                    duration: 2000,
                  });
                  const reader = new FileReader();
                  reader.readAsDataURL(pFileList[0]);
                  reader.onload = (event): any => {
                      this.url = event.target.result;
                  };
              }else{
                  this._snackBar.open('File is too large!', 'Close', {
                      duration: 2000,
                  });
                  this.uploaded = false;
                  this.file = null;
                  this.url = null;
              }
          }else{
              this._snackBar.open('Accepet just jpeg, png and jpg', 'Close', {
                  duration: 2000,
              });
              this.uploaded = false;
              this.file = null;
              this.url = null;
          }
      }
    }

}
