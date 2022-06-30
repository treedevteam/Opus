import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  alert: any;
  
  private : any;

  constructor(
    private _snackBar:MatSnackBar,
    private _router:Router
    ) { }

  ngOnInit(): void {
    
  }


  /**
   * Send the form
   */
 

   

}
