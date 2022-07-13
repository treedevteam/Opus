import { Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Priorities } from './model/priorities';
import { PrioritiesService } from './services/priorities.service';
class AddOrUpdate {
    isUpdate?: boolean;
    data: any;
}
const ELEMENT_DATA: Priorities[] = [
];
@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.scss']
})
export class PrioritiesComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'color','edit', 'delete'];
    dataSource = this._priorityService.priorities$;
    constructor(
        private _priorityService: PrioritiesService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.getPriorities();
    }
    getPriorities(): any{
        this._priorityService._getPriorities().subscribe((res: any)=>{

        },(err: any)=>{
            console.log(err);
        });
    }

    deletePriority($id: number, $rowNumber: number): void{
        const dialogRef = this._fuseConfirmationService.open();
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if(result === 'confirmed'){
                this._priorityService._deletePriority($id).subscribe((res: any)=>{
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
        this._router.navigate([`/priorities/${id}`]);

    }
}
