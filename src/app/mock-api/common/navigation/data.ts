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
        id   : 'department',
        title: 'Department',
        type : 'basic',
        icon : 'heroicons_outline:color-swatch',
        link : 'pages/departments'
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
