/* eslint-disable @typescript-eslint/naming-convention */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { tasksRoutes } from './tasks.routing';
import { TasksComponent } from './tasks.component';
import { TasksDetailsComponent } from './details/details.component';
import { StoreComponent } from './store/store.component';
import { TasksListComponent } from './list/list.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TasksLogsComponent } from './details/tasks-logs/tasks-logs.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatBadgeModule} from '@angular/material/badge';
import { ChecklistModule } from 'angular-checklist';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { EditableComponent } from './editable/editable.component';
import { ViewModeDirective } from './editable/view-mode.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { FocusableDirective } from './focusable.directive';
import { EditableOnEnterDirective } from './editable/edit-on-enter.directive';
import { StoreTaskRowComponent } from './store-task-row/store-task-row.component';
import { CommentsComponent } from './details/comments/comments.component';
import { AsignUsersToBoardComponent } from './asign-users-to-board/asign-users-to-board.component';
import {MatChipsModule} from '@angular/material/chips';
import { MultiselectAutocompleteComponent } from './multiselect-autocomplete/multiselect-autocomplete.component';
import { MatCardModule } from '@angular/material/card';
import { KanbanBoardComponent } from './kanban-view/kanban-board/kanban-board.component';
import { ScrumboardBoardComponent } from './kanban-view/kanban-board/board/board.component';
import { ScrumboardBoardAddListComponent } from './kanban-view/kanban-board/board/add-list/add-list.component';
import { ScrumboardBoardAddCardComponent } from './kanban-view/kanban-board/board/add-card/add-card.component';
import { ScrumboardCardDetailsComponent } from './kanban-view/kanban-board/card/details/details.component';
import { ScrumboardCardComponent } from './kanban-view/kanban-board/card/card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { MentionModule } from 'angular-mentions';
@NgModule({
    declarations: [
        TasksComponent,
        TasksDetailsComponent,
        TasksListComponent,
        StoreComponent,
        ScrumboardBoardComponent,
        ScrumboardBoardAddListComponent,
        ScrumboardBoardAddCardComponent,
        TasksLogsComponent,
        EditableComponent,
        ViewModeDirective,
        EditModeDirective,
        FocusableDirective,
        EditableOnEnterDirective, StoreTaskRowComponent, CommentsComponent, AsignUsersToBoardComponent,
        MultiselectAutocompleteComponent,
        KanbanBoardComponent,
        ScrumboardCardDetailsComponent,
        ScrumboardCardComponent,
        TaskDetailsComponent,
    ],
    imports     : [
        RouterModule.forChild(tasksRoutes),
        DragDropModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatSnackBarModule,
        MatBadgeModule,
        ChecklistModule,
        MatChipsModule,
        MatCardModule,
        MentionModule
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
    ],
})
export class TasksModule
{
}
