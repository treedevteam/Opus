import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BoardsService } from '../../departments/boards/boards.service';
import { DashboardService } from '../services/dashboard.service';
import { UserService } from '../../../../core/user/user.service';

@Component({
  selector: 'app-dashboard-info',
  templateUrl: './dashboard-info.component.html',
  styleUrls: ['./dashboard-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardInfoComponent implements OnInit {
userCount$= this.boardService.$data;
loading$ = this.boardService.loading$;
objectKeys = Object.keys;

userUnreadEmails$ = this._dashboardService.userUnreadEmails$;
userStatusCount$ = this._dashboardService.userStatusCount$;
adminStatusCount$ = this._dashboardService.adminStatusCount$;
adminDepartmentCount$ = this._dashboardService.adminDepartmentCount$;
adminDashboardData$ = this._dashboardService.adminDashboardData$;

$user = this._user.user$;
    constructor(
    private boardService:BoardsService,
    private _dashboardService: DashboardService,
    private _user: UserService
  ) { }


  ngOnInit(): void {
    this.boardService.getData().subscribe();
    console.warn(this.userCount$)

    this._dashboardService.getUserUnreadEmails().subscribe(res=>{
    })
    this._dashboardService.getUserStatusCount().subscribe(res=>{
    })
    this._dashboardService.getAdminStatusCount().subscribe(res=>{
    })
    this._dashboardService.getAdminDepartmentCount().subscribe(res=>{
    })
    this._dashboardService.getAdminDashboardData().subscribe(res=>{
    })

  }

}
