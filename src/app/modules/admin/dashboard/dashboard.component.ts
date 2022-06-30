import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  alert: any;
  
  private : any;

  constructor(
    private _snackBar:MatSnackBar
    ) { }

  ngOnInit(): void {
    
  }


  /**
   * Send the form
   */
 

   

}
