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
        
    }

    
    
}
