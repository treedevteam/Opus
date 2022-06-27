import { Route } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { DepartmentsComponent } from './departments.component';
import { BoardsResolver, BoardTaskResolve, DepartmentsResolver } from './departments.resolver';
import { StoreDepartmentsComponent } from './store-departments/store-departments.component';
import { BoardsComponent } from './boards/boards.component';
import { TasksComponent } from './boards/tasks/tasks.component';

export const departmentsRoutingModule: Route[] = [
  {
    path     : '',
    component: DepartmentsComponent,
    resolve  : {
        departments: DepartmentsResolver
    },
    children : [
        {
            path     : '',
            component: DepartmentComponent,
            
        },
    ]
},
{
    path     : ':depId',
    component: BoardsComponent,
    resolve  : {
        departments: BoardsResolver
    },
    children : [
        {
            path     : '',
            component: BoardsComponent,
        },
    ]
},
];
