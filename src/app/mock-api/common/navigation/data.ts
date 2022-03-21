/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'dashboard',
        link : '/dashboard'
    },{
        id   : 'departments',
        title: 'Departments',
        type : 'basic',
        icon : 'heroicons_outline:color-swatch',
        link : 'departments'
    },{
        id   : 'users',
        title: 'Users',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/users'
    },
    {
        id   : 'statuses',
        title: 'Statuses',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-check',
        link : '/statuses'
    },
    {
        id   : 'locations',
        title: 'Locations',
        type : 'basic',
        icon : 'heroicons_outline:location-marker',
        link : '/locations'
    },
    {
        id   : 'priorities',
        title: 'Priorities',
        type : 'basic',
        icon : 'heroicons_outline:view-grid-add',
        link : '/priorities'
    },{
        id   : 'tasks',
        title: 'Tasks',
        type : 'basic',
        icon : 'heroicons_outline:check-circle',
        link : '/tasks'
    }

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
