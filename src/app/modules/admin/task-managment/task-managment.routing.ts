import { Route } from '@angular/router';
import { TaskLayoutComponent } from './task-layout/task-layout.component';
import { TaskManagmentComponent } from './task-managment.component';
import { TaskDetailsComponent } from './task-layout/task-details/task-details.component';
import { SubtaskDetailsComponent } from './task-layout/subtask-details/subtask-details.component';
import { BoardResolver, TaskManagmentResolver } from './task-managment.resolver';
import { KanbanViewComponent } from './task-views/kanban-view/kanban-view.component';
import { TaskViewsComponent } from './task-views/task-views.component';
import { NormalViewComponent } from './task-views/normal-view/normal-view.component';

export const tasksRoutes: Route[] = [
    {
        path     : ':boardId',
        component: TaskManagmentComponent,
        resolve  : {
            tags: BoardResolver
        },
        children:[
            {
                path:'',
                component: TaskViewsComponent,
                resolve  : {
                    tags: TaskManagmentResolver
                },
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
        ]
    }
];
