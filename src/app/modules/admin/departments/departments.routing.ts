import { Route } from '@angular/router';
import { DepartmentComponent } from './department/department.component';
import { DepartmentsComponent } from './departments.component';
import { DepartmentsResolver } from './departments.resolver';
import { StoreDepartmentsComponent } from './store-departments/store-departments.component';

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
}
];
