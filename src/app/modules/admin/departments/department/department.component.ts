/* eslint-disable @typescript-eslint/member-ordering */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil, combineLatest, map, shareReplay, tap } from 'rxjs';
import * as moment from 'moment';
import { Departments } from '../departments.types';
import { DepartmentsService } from '../departments.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreDepartmentsComponent } from '../store-departments/store-departments.component';
import { UpdateDepartmentsComponent } from '../update-departments/update-departments.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentComponent implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;


  // Private
  private _unsubscribeAll: Subject<any> = new Subject<any>();


  $departmets = this._deprtmentsService.$departments;


  departmetsWithUsers$ = combineLatest([
    this.$departmets,
    this._deprtmentsService.getUsers()
  ]).pipe(
    map(([departments ,users]) =>
    departments.map(department =>({
        ...department,
        users: users ? users.filter(s => +department.id === +s.department_id): [null],
    }))),
    tap(res=>console.log(res))
  );

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _deprtmentsService: DepartmentsService,
      public dialog: MatDialog,
      private _fuseConfirmationService: FuseConfirmationService,

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


  deleteDepartment(id: number): void{
    const confirmation = this._fuseConfirmationService.open({
        title  : 'Delete Department',
        message: 'Are you sure you want to delete this department? This action cannot be undone!',
        actions: {
            confirm: {
                label: 'Delete'
            }
        }
    });
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if ( result === 'confirmed' )
      {
          // Delete the task
          this._deprtmentsService.deleteDepartment(id).subscribe(
            (res)=>{

          });
        }
      });
  }

  editDepartment(department: Departments): void{
    const dialogRef = this.dialog.open(UpdateDepartmentsComponent, {
      width: '100%',
      maxWidth:'700px',
      data: {dataKey:department}
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  /**
   * Format the given ISO_8601 date as a relative date
   *
   * @param date
   */
  formatDateAsRelative(date: string): string
  {
      return moment(date, moment.ISO_8601).fromNow();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(StoreDepartmentsComponent, {
      width: '100%',
      maxWidth:'700px'
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
