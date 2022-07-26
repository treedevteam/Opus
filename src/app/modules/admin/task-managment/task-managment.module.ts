import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagmentComponent } from './task-managment.component';
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
import { TaskViewsComponent } from './task-views/task-views.component';
import { KanbanViewComponent } from './task-views/kanban-view/kanban-view.component';
import { TasklistLayoutComponent } from './task-views/normal-view/tasklist-layout/tasklist-layout.component';
import { TaskRowComponent } from './task-views/normal-view/task-row/task-row.component';
import { StoreTaskRowComponent } from './task-views/normal-view/store-task-row/store-task-row.component';
import { NormalViewComponent } from './task-views/normal-view/normal-view.component';
import { MatBadgeModule } from '@angular/material/badge';
import { FocusableDirective } from './focusable.directive';
import { EditableOnEnterDirective } from './editable/edit-on-enter.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { EditableComponent } from './editable/editable.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ViewModeDirective } from './editable/view-mode.directive';
import { TasklistKanbanLayoutComponent } from './task-views/kanban-view/tasklist-kanban-layout/tasklist-kanban-layout.component';
import { KanbanTaskCardComponent } from './task-views/kanban-view/kanban-task-card/kanban-task-card.component';


@NgModule({
  declarations: [
    TaskManagmentComponent,
    NormalViewComponent,
    KanbanViewComponent,
    TaskLayoutComponent,
    TaskDetailsComponent,
    SubtaskDetailsComponent,
    BoardHeaderComponent,
    TasklistLayoutComponent,
    TaskRowComponent,
    StoreTaskRowComponent,
    TaskViewsComponent,
    FocusableDirective,
    EditableOnEnterDirective,
    EditModeDirective,
    EditableComponent,
    ViewModeDirective,
    TasklistKanbanLayoutComponent,
    KanbanTaskCardComponent,
  ],
  imports: [
    RouterModule.forChild(tasksRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatBadgeModule
  ]
})
export class TaskManagmentModule { }
