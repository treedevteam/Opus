import { Route } from '@angular/router';
import { TasksDepartmentsResolver } from '../tasks/tasks.resolvers';
import { TaskLayoutComponent } from './task-layout/task-layout.component';
import { NormalViewComponent } from './normal-view/normal-view.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';
import { TaskManagmentComponent } from './task-managment.component';
import { TaskDetailsComponent } from './task-layout/task-details/task-details.component';
import { SubtaskDetailsComponent } from './task-layout/subtask-details/subtask-details.component';

export const tasksRoutes: Route[] = [
    {
        path     : ':boardId',
        component: TaskManagmentComponent,
        children:[
            {
                path:'view/normal',
                component: NormalViewComponent,
                children:[
                    {
                        path: '',
                        component: TaskLayoutComponent,
                        children:[
                            {
                                path:'task',
                                component: TaskDetailsComponent,
                                data: {component: 'normal'}
                            },
                            {
                                path:'subtask',
                                component: SubtaskDetailsComponent,
                                data: {component: 'normal'}
                            }
                        ]
                    }
                ]
            },
            {
                path:'view/kanban',
                component: KanbanViewComponent,
                children:[
                    {
                        path: '',
                        component: TaskLayoutComponent,
                        children:[
                            {
                                path:'task',
                                component: TaskDetailsComponent,
                                data: {component: 'kanban'}

                            },
                            {
                                path:'subtask',
                                component: SubtaskDetailsComponent,
                                data: {component: 'kanban'}

                            }
                        ]
                    }
                ]
            },
        ]
    }
];
