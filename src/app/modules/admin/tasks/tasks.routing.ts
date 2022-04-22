import { CanDeactivateTasksDetails } from './tasks.guards';
import { TasksDetailsComponent } from './details/details.component';
import { TasksListComponent } from './list/list.component';
import { TasksComponent } from './tasks.component';
import {  TasksDepartmentsResolver, TasksResolver, TasksTagsResolver, TasksTaskResolver } from './tasks.resolvers';
import { Route } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { KanbanBoardComponent } from './kanban-view/kanban-board/kanban-board.component';






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
                    }
                ]
            },
            
        ]
    }
];
