import { LocationsModule } from './modules/admin/locations/locations.module';
import { UsersComponent } from './modules/admin/users/users.component';
import { DepartamentsModule } from './modules/admin/pages/departaments/departaments.module';
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
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

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule)},


            {path: 'pages', children: [
                {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule)},
                {path: 'departments', loadChildren: () => import('app/modules/admin/pages/departaments/departaments.module').then(m => m.DepartamentsModule)},
            ]},
            {path: 'users', loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule)},
            {path: 'locations', loadChildren: () => import('app/modules/admin/locations/locations.module').then(m => m.LocationsModule)},
            {path: 'priorities', loadChildren: () => import('app/modules/admin/priorities/priorities.module').then(m => m.PrioritiesModule)},
            {path: 'statuses', loadChildren: () => import('app/modules/admin/statuses/status.module').then(m => m.StatusModule)},

             // Error
             {path: 'error', children: [
                {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
            ]},
            // {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: 'error/404'}
        ]
    }
];
