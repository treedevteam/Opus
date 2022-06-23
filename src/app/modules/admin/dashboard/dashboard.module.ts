/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Route, RouterModule } from '@angular/router';
import { NgApexchartsModule } from "ng-apexcharts";

export const routes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    },
];


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonToggleModule,
    NgApexchartsModule,
  ]
})
export class DashboardModule { }
