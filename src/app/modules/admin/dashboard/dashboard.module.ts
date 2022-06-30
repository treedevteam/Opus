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
import { FormsModule }   from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { PostsListComponent } from './posts-list/posts-list.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardResolver } from './dashboard.resolvers';

export const routes: Route[] = [
    {
        path     : '',
        component: DashboardComponent,
        resolve: {
          dashboard: DashboardResolver
        }
    },
];


@NgModule({
  declarations: [
    DashboardComponent,
    PostsListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FuseAlertModule,
    SharedModule,
    MatMenuModule,
    MatButtonToggleModule,
    NgApexchartsModule,
  ]
})
export class DashboardModule { }
