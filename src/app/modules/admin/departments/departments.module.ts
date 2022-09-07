import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { DepartmentsComponent } from './departments.component';
import { RouterModule } from '@angular/router';
import { departmentsRoutingModule } from './departments.routing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'app/shared/shared.module';
import {  MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import {MatIconModule} from '@angular/material/icon';
import { DepartmentComponent } from './department/department.component';
import { StoreDepartmentsComponent } from './store-departments/store-departments.component';
import { UpdateDepartmentsComponent } from './update-departments/update-departments.component';
import { BoardsComponent } from './boards/boards.component';
import { StoreBoardsComponent } from './boards/store-boards/store-boards.component';
import { UpdateBoardsComponent } from './boards/update-boards/update-boards.component';
import {MatSelectModule} from '@angular/material/select';
import { Title } from '@angular/platform-browser';

@NgModule({
  declarations: [
    DepartmentsComponent,
    DepartmentComponent,
    StoreDepartmentsComponent,
    UpdateDepartmentsComponent,
    BoardsComponent,
    StoreBoardsComponent,
    UpdateBoardsComponent,
  ],
  imports: [
    RouterModule.forChild(departmentsRoutingModule),
    CommonModule ,
    DragDropModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    SharedModule,
    MatSelectModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers   : [
    {
        provide : MAT_DATE_FORMATS,
        useValue: {
            parse  : {
                dateInput: moment.ISO_8601
            },
            display: {
                dateInput         : 'll',
                monthYearLabel    : 'MMM YYYY',
                dateA11yLabel     : 'LL',
                monthYearA11yLabel: 'MMMM YYYY'
            }
        }
    },
  Title
],

})
export class DepartmentsModule { }
