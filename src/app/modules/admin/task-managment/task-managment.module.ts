import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagmentComponent } from './task-managment.component';
import { NormalViewComponent } from './normal-view/normal-view.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';
import { TaskLayoutComponent } from './task-layout/task-layout.component';
import { RouterModule } from '@angular/router';
import { tasksRoutes } from './task-managment.routing';
import { TaskDetailsComponent } from './task-layout/task-details/task-details.component';
import { SubtaskDetailsComponent } from './task-layout/subtask-details/subtask-details.component';
import { BoardHeaderComponent } from './board-header/board-header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '../../../../@fuse/pipes/find-by-key/find-by-key.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TaskManagmentComponent,
    NormalViewComponent,
    KanbanViewComponent,
    TaskLayoutComponent,
    TaskDetailsComponent,
    SubtaskDetailsComponent,
    BoardHeaderComponent
  ],
  imports: [
    RouterModule.forChild(tasksRoutes),
    CommonModule,
    FormsModule,
    MatSidenavModule,
    DragDropModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
  ]
})
export class TaskManagmentModule { }
