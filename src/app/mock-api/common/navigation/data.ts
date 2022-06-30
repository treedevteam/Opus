/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'dashboard',
        link : '/dashboard',
        admin: false
    },{
        id   : 'departments',
        title: 'Departments',
        type : 'basic',
        icon : 'heroicons_outline:color-swatch',
        link : '/departments',
        admin: true

    },{
        id   : 'users',
        title: 'Users',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/admin/users',
        admin: true
    },
    {
        id   : 'statuses',
        title: 'Statuses',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-check',
        link : '/admin/statuses',
        admin: true
    },
    {
        id   : 'locations',
        title: 'Locations',
        type : 'basic',
        icon : 'heroicons_outline:location-marker',
        link : '/admin/locations',
        admin: true
    },
    {
        id   : 'priorities',
        title: 'Priorities',
        type : 'basic',
        icon : 'heroicons_outline:view-grid-add',
        link : '/admin/priorities',
        admin: true
    },
    {
        id   : 'Boards',
        title: 'Boards',
        type : 'basic',
        icon : 'heroicons_outline:view-grid-add',
        link : '/departments',
        admin: false,
    },
    {
        id  : 'divider-1',
        type: 'divider',
        admin: false,
    },
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
