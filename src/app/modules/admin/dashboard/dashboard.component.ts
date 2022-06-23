/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts/lib/model/apex-types';
import { userCount } from './dashboard.interface';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userCount:userCount[];
  constructor(private _userCount:DashboardService) { }

  ngOnInit(): void {
    this._userCount.getUserCount().subscribe((res:userCount[])=>{
      this.userCount = res;
    });
  }

}
