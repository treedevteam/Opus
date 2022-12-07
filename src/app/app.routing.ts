/* eslint-disable no-trailing-spaces */
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { MailboxComponent } from './modules/admin/mailbox/mailbox.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disabled */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            // {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            // {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            // {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in',loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],




        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    
    },
    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },
    {path: 'dashboard',component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },  canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard], loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)},


    {path: 'pages', component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    }, canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard], children: [
        {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule)},
    ]},

    {path: 'mailbox', component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    }, canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard], children: [
        {path: '', loadChildren: () => import('app/modules/admin/mailbox/mailbox.module').then(m => m.MailboxModule)},    
    ]},

    {path: 'board',component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },  canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard], loadChildren: () => import('app/modules/admin/tasks/tasks.module').then(m => m.TasksModule)},


    {path: 'task-managment',component  : LayoutComponent,
    resolve    : {
        initialData: InitialDataResolver,
    },  canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard], loadChildren: () => import('app/modules/admin/task-managment/task-managment.module').then(m => m.TaskManagmentModule)},

    {
        path       : 'departments',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        canLoad: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        loadChildren: () => import('app/modules/admin/departments/departments.module').then(m => m.DepartmentsModule)
    },
    //User
    {
        path       : 'error',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        canLoad: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [          
                {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
            ,
            {path: '**', redirectTo: '/404'}
        ]
    },

    // Admin routes
    {
        path       : 'admin',
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        canLoad: [AdminGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'users', loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule)},
            {path: 'locations', loadChildren: () => import('app/modules/admin/locations/locations.module').then(m => m.LocationsModule)},
            {path: 'priorities', loadChildren: () => import('app/modules/admin/priorities/priorities.module').then(m => m.PrioritiesModule)},
            {path: 'statuses', loadChildren: () => import('app/modules/admin/statuses/status.module').then(m => m.StatusModule)},
            {path: 'mailbox', loadChildren: () => import('app/modules/admin/mailbox/mailbox.module').then(m => m.MailboxModule)},    
        ]
    }
];
