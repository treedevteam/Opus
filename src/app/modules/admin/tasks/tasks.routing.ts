import { CanDeactivateTasksDetails } from './tasks.guards';
import { TasksDetailsComponent } from './details/details.component';
import { TasksListComponent } from './list/list.component';
import { TasksComponent } from './tasks.component';
import {  TasksResolver, TasksTagsResolver, TasksTaskResolver } from './tasks.resolvers';
import { Route } from '@angular/router';

export const tasksRoutes: Route[] = [
    {
        path     : '',
        component: TasksComponent,
        resolve  : {
            tags: TasksTagsResolver
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
                    }
                ]
            }
        ]
    }
];
