import { CanDeactivateTasksDetails } from './tasks.guards';
import { TasksDetailsComponent } from './details/details.component';
import { TasksListComponent } from './list/list.component';
import { TasksComponent } from './tasks.component';
import { SubtaskTaskResolver, TasksDepartmentsResolver, TasksResolver, TasksTagsResolver, TasksTaskResolver } from './tasks.resolvers';
import { Route } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { KanbanBoardComponent } from './kanban-view/kanban-board/kanban-board.component';
import { ScrumboardCardComponent } from './kanban-view/kanban-board/card/card.component';






export const tasksRoutes: Route[] = [
    {
        path     : ':boardId/tasks',
        component: TasksComponent,
        resolve  : {
            tags: TasksDepartmentsResolver
        },
        children : [
            {
                path     : '',
                component: TasksComponent,
                resolve  : {
                tags: TasksResolver
                },
                children : [
                    {
                        path     : '',
                        component: TasksListComponent,
                        children : [
                            {
                                path         : ':id',
                                component    : TasksDetailsComponent,
                                resolve      : {
                                    task: TasksTaskResolver
                                },
                                canDeactivate: [CanDeactivateTasksDetails]
                            },
                            {
                                path         : 'add/new',
                                component    : StoreComponent,
                                canDeactivate: [CanDeactivateTasksDetails]
                            }
                        ]
                    },
                    {
                        path: 'kanban/view',
                        component: KanbanBoardComponent,
                        children : [
                            {
                                path     : 'task/:id',
                                component: ScrumboardCardComponent,
                                resolve      : {
                                    task: TasksTaskResolver
                                },
                                data: {some_data: 'Task'}
                                
                            },
                            {
                                path     : 'subtask/:id',
                                component: ScrumboardCardComponent,
                                resolve      : {
                                    task: SubtaskTaskResolver
                                },
                                data: {some_data: 'Subtask'}

                            },
                            {
                                path         : 'details/:id',
                                component    : TasksDetailsComponent,
                                resolve      : {
                                    task: TasksTaskResolver
                                },
                                canDeactivate: [CanDeactivateTasksDetails],
                                data: {type: 'Subtask'}

                            }
                        ]
                    }
                ]
            },
            
        ]
    }
];
