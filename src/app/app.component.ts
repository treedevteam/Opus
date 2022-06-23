/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketServiceService } from './modules/web-socket-service.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(private pusherService: WebSocketServiceService, private _snackBar: MatSnackBar)
    {
    }

    ngOnInit(): void {

        if(Notification.permission === "granted"){
        }
        else if (Notification.permission !== "denied"){
            Notification.requestPermission().then(premission =>{
                if(premission === "granted"){
                }
            }); 
        }
    }



}
