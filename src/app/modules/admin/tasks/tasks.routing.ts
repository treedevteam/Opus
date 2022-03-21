import { CanDeactivateTasksDetails } from './tasks.guards';
import { TasksDetailsComponent } from './details/details.component';
import { TasksListComponent } from './list/list.component';
import { TasksComponent } from './tasks.component';
import {  TasksDepartmentsResolver, TasksResolver, TasksTagsResolver, TasksTaskResolver } from './tasks.resolvers';
import { Route } from '@angular/router';
import { StoreComponent } from './store/store.component';

export const tasksRoutes2: Route[] = [
    {
        path     : ':id/tasks',
        component: TasksComponent,
        resolve  : {
            tags: TasksDepartmentsResolver
        },
        children : [
            {
                path     : '',
                component: TasksListComponent,
                resolve  : {
                    tasks: TasksResolver
                },
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
    }
];




export const tasksRoutes: Route[] = [
    {
        path     : ':id/tasks',
        component: TasksComponent,
        resolve  : {
            tags: TasksDepartmentsResolver
        },
        children : [
            {
                path     : '',
                component: TasksListComponent,
                resolve  : {
                    tasks: TasksResolver
                },
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
    }
];
