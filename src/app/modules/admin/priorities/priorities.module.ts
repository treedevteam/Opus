import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrioritiesComponent } from './priorities.component';
import { AddOrUpdatePrioritiesComponent } from './add-or-update-priorities/add-or-update-priorities.component';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatListModule} from '@angular/material/list';
export const routes: Route[] = [
    {
        path     : '',
        component: PrioritiesComponent
    },
    {
        path     : ':id',
        component: PrioritiesComponent
    },

];


@NgModule({
  declarations: [
    PrioritiesComponent,
    AddOrUpdatePrioritiesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatSelectModule,
    FuseHighlightModule,
    SharedModule,
    MatTableModule,
    MatSnackBarModule,
    MatListModule,
  ]
})
export class PrioritiesModule { }
