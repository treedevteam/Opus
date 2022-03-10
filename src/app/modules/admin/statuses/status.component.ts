import { Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddOrUpdate } from '../pages/departaments/model/add-or-update';
import { Status } from './model/status';
import { StatusService } from './services/status.service';
import { combineLatest } from 'rxjs';
const ELEMENT_DATA: Location[] = [
];
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'color','edit', 'delete'];
    dataSource = ELEMENT_DATA;

   
    constructor(
        private _statusService: StatusService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) { }

    getstatuses$ = combineLatest([
        this._statusService.getStatuses$,
        this._statusService.addedStatus$,
        this._statusService.updatedStatus$,
        this._statusService.deletedStatus$
    ],(g,p,u,d) => {
        console.log(g,'g');
        console.log(p,'p');
        console.log(u,'u');
        console.log(d,'d');
         if(p){
             g.unshift(p);
         }else if(u){
             const index = g.findIndex(x => x.id === u.id);
             g.splice(index,1,u);
         }else if(d){
            const index = g.findIndex(x => x.id === d);
            if (index > -1) {
                g.splice(index, 1);
              }
         }
       return g;
     });

    ngOnInit(): void {
       
    }
    
  

    wcHexIsLight(color: any): string {
        const hex = color.replace('#', '');
        const cr = parseInt(hex.substr(0, 2), 16);
        const cg = parseInt(hex.substr(2, 2), 16);
        const cb = parseInt(hex.substr(4, 2), 16);
        const brightness = ((cr * 299) + (cg * 587) + (cb * 114)) / 1000;
        if(brightness < 155){
            return 'text-on-primary';
        }else{
            return 'text-on-dark';
        }
    }


    deleteStatus($id: number, $rowNumber: number): void{
        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this._statusService._deleteStatus($id).subscribe((res: any)=>{
                    this._snackBar.open('Deleted successfuly!', 'close', {
                        duration: 3000,
                    });
                },(err: any)=>{
                    console.log(err);
                });
            }
        });
    }

    navigateTo(id: number): void{
        this._router.navigate([`/statuses/${id}`]);

    }
}
